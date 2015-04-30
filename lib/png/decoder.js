// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var CRC = require('./crc');
var Chunk = require('./chunk');
var Compressor = require('./compressor');
var Filter = require('./filter');
var Interlace = require('./interlace');
var Data = require('./data');
var BufferedStream = require('./bufferedStream');

var utils = require('./utils');
var path = require('path');

var constants = require('./constants');

/**
 * @class Decoder
 * @module PNG
 * @submodule PNGCore
 * @extends chunkUtils
 * @param {Buffer} data Data to decode
 * @param {int} [offset=0] Offset within data
 * @param {int} [length=data.length-offset] Length of data
 * @constructor
 */
var Decoder = function (data, offset, length) {
	this._stream = new BufferedStream(data, offset, length);

	this._chunks = {};
	this._chunkData = new Data();

	utils.loadModule(path.join(__dirname, 'chunkUtils.js'), this);
};


/**
 * Gets the data supplied by each chunk
 *
 * @method getChunkData
 * @return {Data}
 */
Decoder.prototype.getChunkData = function () {
	return this._chunkData;
};


/**
 * Decodes the supplied data
 *
 * @method decode
 * @param {boolean} strict Should decoding be strict?
 */
Decoder.prototype.decode = function (strict) {

	var i, len, offset, chunk, data, compressor, filter, interlace,
		signature = constants.signature,
		input, outputData;

	this._chunks = {};

	// Check signature
	data = this._stream.readBuffer(constants.signature.length);
	for (i = 0, len = data.length; i < len; i++) {
		if (data[i] !== signature[i]) {
			throw new Error('Invalid signature for a PNG image.');
		}
	}

	// Load all chunks until end is reached
	do {
		chunk = this._decodeChunk(strict)
	} while (chunk.getType() !== 'IEND');

	// Get header chunk
	chunk = this.getHeaderChunk();

	// Combine all data chunks
	data = this._combine(this.getChunksByType('IDAT', true));

	// Free-up some memory by removing all IDAT chunks
	this.clearChunksByType('IDAT');

	// Verify after decoding
	this._postDecode(strict);

	// Decompress
	compressor = new Compressor();
	data = compressor.reverse(data);

	// Run through filters
	filter = new Filter(chunk, data);
	data = filter.reverse();

	// Run through interlace method
	interlace = new Interlace(chunk, data);
	data = interlace.reverse();

	// Make sure it is 8-bit
	if (chunk.getBitDepth() != 8) {
		throw new Error('Only 8-bit is supported for now.');
		//TODO: Also support 16 bit
	}

	// Don't do anything if it has already three colors and alpha channel - nothing to do here
	if (!chunk.isColorTypeTrueColorWithAlpha()) {

		// Create new buffer with complete size
		outputData = new Buffer(chunk.getImageSizeInBytes());

		if (chunk.isColorTypeIndexedColor()) {
			this.getFirstChunk('PLTE', true).convertToImage(data, 0, outputData, 0);

		} else if (chunk.isColorTypeTrueColor()) {
			for (i = 0, offset = 0; i < data.length; i += 3, offset += 4) {
				data.copy(outputData, offset, i, i + 3);
				outputData.writeUInt8(0xff, offset + 3);
			}

		} else {
			//TODO
			throw new Error('Format not supported yet.');
		}

		if (!chunk.hasAlphaChannel() && this.hasChunksOfType('tRNS')) {
			this.getFirstChunk('tRNS', true).processInput(outputData, 0);
		}

		data = outputData;
	}

	// Run through all chunks to gather chunk-data
	this.applyWithSortedChunks(function (chunk) {
		chunk.decodeData(this._chunkData);
	}.bind(this), true);

	return data;
};

/**
 * Reads the next chunk in the data
 *
 * @method decodeChunk
 * @param {object} input
 * @param {boolean} strict Should decoding be strict?
 * @return {Chunk} Chunk read
 * @private
 */
Decoder.prototype._decodeChunk = function (input, strict) {

	var chunkLength,
		chunkTypeId,
		chunkType,
		chunkDataOffset,
		chunkCrc,
		offset = input.offset,
		data = input.data,
		crc,
		chunk;

	// Read chunk-length - length is only for chunkData
	chunkLength = data.readUInt32BE(offset); offset += 4;

	// Load chunk for crc calculation
	crc = new CRC();
	crc.write(data, offset, chunkLength + 4); // Including chunk-type

	// Load chunk-type and remember the offset of the data - no need to copy the data
	chunkTypeId = data.readUInt32BE(offset);
	chunkType = utils.bufferToString(data, offset, 4);
	offset += 4;
	chunkDataOffset = offset;
	offset += chunkLength;

	// Create chunk
	chunk = new Chunk(chunkType, this._chunks);

	// Load crc and compare with calculated one
	chunkCrc = data.readInt32BE(offset); offset += 4;

	// Check CRC
	if ((strict || chunk.isUnsafe()) && (chunkCrc !== crc.getValue())) {
		throw new Error('CRC error.');
	}

	// Parsing
	chunk.decode(data, chunkDataOffset, chunkLength, strict);

	// Add to parsed chunks
	this.addChunk(chunk.getType(), chunk);

	input.offset = offset;

	return chunk;
};


/**
 * Adds a new decoded chunk to the chunk-dictionary
 *
 * @method addChunk
 * @param {string} type Type of chunk
 * @param {Chunk} chunk Decoded chunk
 */
Decoder.prototype.addChunk = function (type, chunk) {

	if (!this._chunks[type]) {
		this._chunks[type] = [];
	}

	this._chunks[type].push(chunk);
};

/**
 * Combines all IDAT chunks into on buffer
 *
 * @method _combine
 * @param {Chunk[]} dataChunks List of IDAT chunks
 * @return {Buffer}
 * @private
 */
Decoder.prototype._combine = function (dataChunks) {
	var totalLength = 0,
		offset = 0,
		combinedData;

	// Determine length
	dataChunks.forEach(function (chunk) {
		totalLength += chunk.getData().length;
	});

	// Combine all the blobs
	combinedData = new Buffer(totalLength);
	dataChunks.forEach(function (chunk) {
		var blob = chunk.getData();
		blob.copy(combinedData, offset, 0, blob.length);
		offset += blob.length;
	});

	return combinedData;
};

/**
 * Verifies the decoded data
 *
 * @method postDecode
 * @param {boolean} strict Should decoding be strict?
 * @private
 */
Decoder.prototype._postDecode = function (strict) {

	var chunks = this._chunks;

	if (!chunks.IHDR || chunks.IHDR.length === 0) {
		throw new Error('The Decoder requires the IHDR chunk.');
	}
};

module.exports = Decoder;

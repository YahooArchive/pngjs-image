// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var CRC = require('./crc');
var Chunk = require('./chunk');
var Compressor = require('./compressor');
var Filter = require('./filter');
var Interlace = require('./interlace');

var utils = require('./utils');
var path = require('path');

var constants = require('./constants');

/**
 * @class Decoder
 * @module PNG
 * @submodule PNGCore
 * @param data
 * @param offset
 * @constructor
 */
var Decoder = function (data, offset) {
	this._data = data;
	this._offset = offset || 0;

	this._chunks = {};

	utils.loadModule(path.join(__dirname, 'chunkUtils.js'), this);
};

/**
 * Decodes the supplied data
 *
 * @method decode
 * @param {boolean} strict Should decoding be strict?
 */
Decoder.prototype.decode = function (strict) {

	var i, offset, chunk, data, compressor, filter, interlace,
		signature = constants.signature,
		input, outputData;

	this._chunks = {};

	input = {
		data: this._data,
		offset: this._offset
	};

	// Check signature
	for (i = 0; i < signature.length; i++) {
		if (input.data[input.offset + i] !== signature[i]) {
			throw new Error('Invalid signature for a PNG image.');
		}
	}
	input.offset += signature.length;

	// Load all chunks until end is reached
	do {
		chunk = this._decodeChunk(input, strict)
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

		if (!chunk.hasAlphaChannel() && this.hasChunksByType('tRNS')) {
			this.getFirstChunk('tRNS', true).processInput(outputData, 0);
		}

		data = outputData;
	}

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
		chunkType,
		chunkDataOffset,
		chunkCrc,
		offset = input.offset,
		data = input.data,
		crc = new CRC(),
		chunk;

	// Read chunk-length - length is only for chunkData
	chunkLength = data.readUInt32BE(offset); offset += 4;

	// Load chunk for crc calculation
	crc.write(data, offset, chunkLength + 4); // Including chunk-type

	// Load chunk-type and remember the offset of the data - no need to copy the data
	chunkType = data.readUInt32BE(offset); offset += 4;
	chunkDataOffset = offset;
	offset += chunkLength;

	// Create chunk
	chunk = new Chunk(chunkType, this._chunks);

	// Load crc and compare with calculated one
	chunkCrc = data.readInt32BE(offset); offset += 4;

	// Check CRC
	if ((chunkCrc !== crc.getValue()) && chunk.isUnsafe()) {
		throw new Error('CRC error.');
	}

	// Parsing
	chunk.preDecode(data, chunkDataOffset, chunkLength, strict);
	chunk.decode(data, chunkDataOffset, chunkLength, strict);
	chunk.postDecode(data, chunkDataOffset, chunkLength, strict);

	// Add to parsed chunks
	this._addChunk(chunk.getType(), chunk);

	input.offset = offset;

	return chunk;
};

/**
 * Add a new decoded chunk to the chunk-list
 *
 * @method _addChunk
 * @param {string} type Type of chunk
 * @param {Chunk} chunk Decoded chunk
 * @private
 */
Decoder.prototype._addChunk = function (type, chunk) {

	if (!this._chunks[type]) {
		this._chunks[type] = [];
	}

	this._chunks[type].push(chunk);
};


Decoder.prototype._combine = function (dataChunks) {
	var totalLength = 0,
		offset = 0,
		combinedData;

	// Determine length
	dataChunks.forEach(function (chunk) {
		totalLength += chunk.getBlob().length;
	});

	// Combine all the blobs
	combinedData = new Buffer(totalLength);
	dataChunks.forEach(function (chunk) {
		var blob = chunk.getBlob();
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

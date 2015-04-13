var CRC = require('./crc');
var Chunk = require('./chunk');
var Compressor = require('./compressor');
var Filter = require('./filter');
var Interlace = require('./interlace');

var utils = require('./utils');

var constants = require('./constants');

var Decoder = function (data, offset) {
	this._data = data;
	this._offset = offset || 0;

	this._chunks = {};

	utils.loadModule('./chunkUtils');
};

/**
 * Decodes the supplied data
 *
 * @method decode
 * @param {boolean} strict Should decoding be strict?
 */
Decoder.prototype.decode = function (strict) {

	var i, chunk, data, compressor, filter, interlace,
		signature = constants.signature;

	// Check signature
	for (i = 0; i < signature.length; i++) {
		if (this._data[this._offset + i] !== signature[i]) {
			throw new Error('Invalid signature for a PNG image.');
		}
	}
	this._offset += signature.length;

	// Load all chunks until end is reached
	do {
		chunk = this.decodeChunk(strict)
	} while (chunk.getType() !== 'IEND');

	// Get header chunk
	chunk = this.getHeaderChunk();

	// Combine all data chunks
	data = this.combine(this.getChunksByType('IDAT', true));

	// Decompress
	compressor = new Compressor();
	data = compressor.inflate(data);

	// Run through filters
	filter = new Filter(chunk.getWidth(), chunk.getHeight(), data, chunk.getBytesPerPixel());
	data = filter.reverse();

	// Run through interlace method
	interlace = new Interlace(chunk.getWidth(), chunk.getHeight(), data, chunk.getBytesPerPixel());
	data = interlace.reverse();

	// Down-scale

	// Verify after decoding
	this.postDecode(strict);
};

/**
 * Reads the next chunk in the data
 *
 * @method decodeChunk
 * @param {boolean} strict Should decoding be strict?
 * @return {Chunk} Chunk read
 */
Decoder.prototype.decodeChunk = function (strict) {

	var chunkLength,
		chunkType,
		chunkDataOffset,
		chunkCrc,
		crc = new CRC(),
		chunk;

	// Read chunk-length - length is only for chunkData
	chunkLength = this._data.readUInt32BE(this._offset); this._offset += 4;

	// Load chunk for crc calculation
	crc.write(this._data, this._offset, chunkLength + 4); // Including chunk-type

	// Load chunk-type and remember the offset of the data - no need to copy the data
	chunkType = this._data.readUInt32BE(this._offset); this._offset += 4;
	chunkDataOffset = this._offset;
	this._offset += chunkLength;

	// Create chunk
	chunk = new Chunk(chunkType, this._chunks);

	// Load crc and compare with calculated one
	chunkCrc = this._data.readUInt32BE(this._offset); this._offset += 4;

	// Check CRC
	if ((chunkCrc !== crc.getValue()) && chunkCrc.isUnsafe()) {
		throw new Error('CRC error.');
	}

	// Parsing
	chunk.preDecode(this._data, chunkDataOffset, chunkLength, strict);
	chunk.decode(this._data, chunkDataOffset, chunkLength, strict);
	chunk.postDecode(this._data, chunkDataOffset, chunkLength, strict);

	// Add to parsed chunks
	this._addChunk(chunkType, chunk);

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


Decoder.prototype.combine = function (dataChunks) {
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
	});

	return combinedData;
};


/**
 * Verifies the decoded data
 *
 * @method postDecode
 * @param {boolean} strict Should decoding be strict?
 */
Decoder.prototype.postDecode = function (strict) {

	var chunks = this._chunks;

	if (!chunks.IHDR || chunks.IHDR.length === 0) {
		throw new Error('The Decoder requires the IHDR chunk.');
	}
};

module.exports = Decoder;
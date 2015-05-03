// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Chunk = require('./chunk');

var CRC = require('./processor/crc');

var BufferedStream = require('./utils/bufferedStream');
var utils = require('./utils/utils');
var constants = require('./utils/constants');

var path = require('path');


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
	this._chunkData = {};

	utils.loadModule(path.join(__dirname, 'chunkUtils.js'), this);
};


/**
 * Gets the data supplied by each chunk
 *
 * @method getChunkData
 * @return {object}
 */
Decoder.prototype.getChunkData = function () {
	return this._chunkData;
};


/**
 * Decodes the supplied data
 *
 * @method decode
 * @param {object} options Decoding options
 */
Decoder.prototype.decode = function (options) {

	var i, len,
		chunk, data, image = null,
		signature = constants.signature,
		strict = options && options.strict;

	this._chunks = {};
	this._chunkData = options || {};

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

	// Run through all chunks before scaling
	this.applyWithSortedChunks(function (chunk) {
		image = chunk.decode(image, strict);
	}, true);

	// Run through all chunks after scaling
	this.applyWithSortedChunks(function (chunk) {
		image = chunk.postDecode(image, strict);
	}, true);

	// Run through all chunks-types (not chunks) to gather chunk-data
	this.applyWithSortedChunks(function (chunkType) {
		Chunk.decodeTypeData(chunkType, this._chunkData, this._chunks, strict);
	}.bind(this), false);

	return image;
};

/**
 * Reads the next chunk in the stream
 *
 * @method _parseChunk
 * @param {boolean} strict Should decoding be strict?
 * @return {Chunk} Chunk read
 * @private
 */
Decoder.prototype._parseChunk = function (strict) {

	var chunkLength,
		chunkType,
		chunkCrc,
		crc,
		chunk;

	// Read chunk-length
	chunkLength = this._stream.readUInt32BE();

	// Load chunk for crc calculation
	crc = new CRC();
	crc.write(this._stream.toBuffer(true), this._stream.readOffset, chunkLength + 4); // Including chunk-type

	// Create chunk that is suggested by the data
	chunkType = this._stream.readString(4, 'ascii');
	chunk = new Chunk(chunkType, this._chunks);

	// Parsing of chunk data
	chunk.parse(this._stream, chunkLength, strict);

	// Load crc and compare with calculated one
	chunkCrc = this._stream.readInt32BE();
	if ((strict || chunk.isUnsafe()) && (chunkCrc !== crc.getValue())) {
		throw new Error('CRC error.');
	}

	// Add to parsed chunks
	this.addChunk(chunk.getType(), chunk);

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

module.exports = Decoder;

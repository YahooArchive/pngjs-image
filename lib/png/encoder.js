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
 * @class Encoder
 * @module PNG
 * @submodule PNGCore
 * @param width
 * @param height
 * @param data
 * @param offset
 * @constructor
 */
var Encoder = function (width, height, data, offset) {
	this._width = width;
	this._height = height;
	this._data = data;
	this._offset = offset || 0;

	this._chunks = {};

	utils.loadModule(path.join(__dirname, 'chunkUtils.js'), this);
};

/**
 * Encodes the supplied data
 *
 * @method encode
 * @param {boolean} strict Should encoding be strict?
 */
Encoder.prototype.encode = function (strict) {

	var i, offset, chunk, data, compressor, filter, interlace,
		signature = constants.signature,
		sizeLeft, currentSize,
		dataOffset,
		outputData, crc, crcOffset;


	// Run through interlace method
	interlace = new Interlace(null, this._data, this._offset);
	data = interlace.interlace();

	// Run through filters
	filter = new Filter(null, data);
	data = filter.filter(this._width, this._height, 4);

	// Decompress
	compressor = new Compressor();
	data = compressor.compress(data);

	outputData = new Buffer(8 + (12 + 13) + (Math.floor(data.length / 8192) * (8192 + 12)) + (data.length % 8192) + 12 + 12);

	// Write signature
	for(i = 0, offset = 0; i < signature.length; i++, offset++) {
		outputData.writeUInt8(signature[i], i);
	}

	// Write header
	outputData.writeUInt32BE(13, offset); offset += 4;
	crcOffset = offset;
	outputData.writeUInt32BE(constants.typeToId['IHDR'], offset); offset += 4;
	outputData.writeUInt32BE(this._width, offset); offset += 4;
	outputData.writeUInt32BE(this._height, offset); offset += 4;
	outputData.writeUInt8(8, offset); offset++;
	outputData.writeUInt8(6, offset); offset++;
	outputData.writeUInt8(0, offset); offset++;
	outputData.writeUInt8(0, offset); offset++;
	outputData.writeUInt8(0, offset); offset++;
	crc = new CRC();
	crc.write(outputData, crcOffset, offset - crcOffset);
	outputData.writeInt32BE(crc.getValue(), offset); offset += 4;

	dataOffset = 0;
	sizeLeft = data.length;
	while(sizeLeft > 0) {
		currentSize = Math.min(8192, data.length - dataOffset);

		outputData.writeUInt32BE(currentSize, offset); offset += 4;
		crcOffset = offset;
		outputData.writeUInt32BE(constants.typeToId['IDAT'], offset); offset += 4;

		data.copy(outputData, offset, dataOffset, dataOffset + currentSize); offset += currentSize;

		crc = new CRC();
		crc.write(outputData, crcOffset, offset - crcOffset);
		outputData.writeInt32BE(crc.getValue(), offset); offset += 4;

		sizeLeft -= 8192;
		dataOffset += 8192;
	}

	// Write end
	outputData.writeUInt32BE(0, offset); offset += 4;
	crcOffset = offset;
	outputData.writeUInt32BE(constants.typeToId['IEND'], offset); offset += 4;
	crc = new CRC();
	crc.write(outputData, crcOffset, offset - crcOffset);
	outputData.writeInt32BE(crc.getValue(), offset); offset += 4;

	return outputData;
};

/**
 * Add a new encoded chunk to the chunk-list
 *
 * @method _addChunk
 * @param {string} type Type of chunk
 * @param {Chunk} chunk Encoded chunk
 * @private
 */
Encoder.prototype._addChunk = function (type, chunk) {

	if (!this._chunks[type]) {
		this._chunks[type] = [];
	}

	this._chunks[type].push(chunk);
};

module.exports = Encoder;

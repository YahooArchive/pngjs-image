// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Chunk = require('./chunk');

var CRC = require('./processor/crc');

var BufferedStream = require('./utils/bufferedStream');
var utils = require('./utils/utils');
var constants = require('./utils/constants');

var path = require('path');


/**
 * @class Encoder
 * @module PNG
 * @submodule PNGCore
 * @extends chunkUtils
 * @constructor
 */
var Encoder = function () {
	this._chunks = {};
	this._chunkData = {};

	utils.loadModule(path.join(__dirname, 'utils', 'chunkUtils.js'), this);
};


/**
 * Gets the data supplied by each chunk
 *
 * @method getChunkData
 * @return {object}
 */
Encoder.prototype.getChunkData = function () {
	return this._chunkData;
};


/**
 * Encodes the supplied data
 *
 * @method encode
 * @param {Buffer} image
 * @param {int} width
 * @param {int} height
 * @param {object} [options]
 */
Encoder.prototype.encode = function (image, width, height, options) {


	var i, len,
		chunks,
		stream,
		buffer = image,
		signature = constants.signature;


	this._chunks = {};
	this._chunkData = options || {};




	// Run through all chunks-types (not chunks) to gather chunks
	// Phase 1
	this.applyWithSortedChunks(function (chunk) {

		// Figure out which chunks we need for the image
		chunks = Chunk.encodeTypeData(chunk.getType(), image, this._chunkData, this._chunks);

		// Add all returned chunks
		chunks.forEach(function (chunk) {
			this.addChunk(chunk);
		}).bind(this);

	}.bind(this), false, true);

	// Run through all chunks before scaling
	// Phase 2
	this.applyWithSortedChunks(function (chunk) {
		buffer = chunk.preEncode(buffer);
	}, true, true);


	// Run through all chunks after scaling
	// Phase 3
	this.applyWithSortedChunks(function (chunk) {
		buffer = chunk.encode(buffer);
	}, true, true);



	stream = new BufferedStream();

	// Write signature
	for(i = 0, len = signature.length; i < len; i++) {
		stream.writeUInt8(signature[i], i);
	}


	// Write all chunks
	// Phase 4
	this.applyWithSortedChunks(function (chunk) {
		// Compose
		chunk.compose(stream);
	}, true, true);


	return image;
};

Encoder.prototype._encodeChunk = function (stream, chunk) {

	var offset, crc, crcStartOffset, lengthOffset, chunkEndOffset, chunkLength;

	lengthOffset = stream.writeOffset;
	stream.writeUInt32BE(0);

	crcStartOffset = stream.writeOffset;
	outputData.writeUInt32BE(chunk.getTypeId());

	stream.writeCounter = 0;
	chunk.compose(stream);
	chunkLength = stream.writeCounter;

	crc = new CRC();
	crc.write(stream.toBuffer(true), crcStartOffset, chunkLength + 4); // Add chunk-type
	stream.writeInt32BE(crc.getValue());

	chunkEndOffset = stream.writeOffset;

};

Encoder.prototype._optimize = function () {
	// Do nothing for now
};

Encoder.prototype._backup = function () {
	var i, offset, data, compressor, filter, interlace,
		signature = constants.signature,
		sizeLeft, currentSize,
		dataOffset,
		outputData, crc, crcOffset,
		encodedChunksLength = 0,
		encodedChunks = [];

	// Run through interlace method
	interlace = new Interlace(null, this._data, this._offset);
	data = interlace.interlace();

	// Run through filters
	filter = new Filter(null, data);
	data = filter.filter(this._width, this._height, 4);

	// Decompress
	compressor = new Compressor();
	data = compressor.compress(data);

	outputData = new Buffer(8 + (12 + 13) + (Math.floor(data.length / 8192) * (8192 + 12)) + (data.length % 8192) + encodedChunksLength + 12 + 12);

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

	// Write other chunks
	encodedChunks.forEach(function (chunk) {

		outputData.writeUInt32BE(chunk.length, offset); offset += 4;
		crcOffset = offset;
		outputData.writeUInt32BE(chunk.getTypeId(), offset); offset += 4;

		chunk.copy(outputData, offset, 0, chunk.length); offset += chunk.length;

		crc = new CRC();
		crc.write(outputData, crcOffset, offset - crcOffset);
		outputData.writeInt32BE(crc.getValue(), offset); offset += 4;
	});

	// Write end
	outputData.writeUInt32BE(0, offset); offset += 4;
	crcOffset = offset;
	outputData.writeUInt32BE(constants.typeToId['IEND'], offset); offset += 4;
	crc = new CRC();
	crc.write(outputData, crcOffset, offset - crcOffset);
	outputData.writeInt32BE(crc.getValue(), offset); offset += 4;

	return outputData;
};

module.exports = Encoder;

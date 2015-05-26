// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Interlace = require('./interlace');
var BufferedStream = require('../utils/bufferedStream');

/**
 * @class Scanline Parser
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @constructor
 */
var Parser = function (headerChunk) {
	this._headerChunk = headerChunk;
};

/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Parser.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Encodes an image
 *
 * @method encoder
 * @param {Buffer} image
 * @return {int[]}
 */
Parser.prototype.encoder = function (image) {
	return image;
	//TODO: Writing is currently only 8-bit
};


/**
 * Determines the scanline-parser factory according to header data
 *
 * @method _determineParserFactory
 * @return {object}
 * @private
 */
Parser.prototype._determineParserFactory = function () {

	var headerChunk = this.getHeaderChunk(),
		bitDepth,

		result = null;

	bitDepth = headerChunk.getBitDepth();

	switch (bitDepth) {
		case 1:
			result = this._parse1bit;
			break;

		case 2:
			result = this._parse2bit;
			break;

		case 4:
			result = this._parse4bit;
			break;

		case 8:
			result = this._parse8bit;
			break;

		case 16:
			result = this._parse16bit;
			break;
	}

	return result;
};

/**
 * Decodes an image
 *
 * @method decoder
 * @param {Buffer} image
 * @return {int[]} Values read
 */
Parser.prototype.decode = function (image) {

	var headerChunk = this.getHeaderChunk(),
		interlace = new Interlace(headerChunk),

		imageStream, scaledStream,

		paddingAt,
		parserFactory,
		values = [];

	imageStream = new BufferedStream(image, false);

	parserFactory = this._determineParserFactory();

	interlace.processPasses(function (width, height, scanLineLength) {

		paddingAt = headerChunk.scanLineWithWidthPaddingAt(width);

		this._passDecode(
			imageStream, scaledStream,
			scanLineLength * height,
			parserFactory(paddingAt),
			values
		);

	}.bind(this));

	return values;
};

/**
 * Parses a 1-bit scanline stream
 *
 * @method _parse1bit
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Parser.prototype._parse1bit = function (paddingAt) {

	var byteCounter = 0;

	return function (value, values) {

		values.push((value >> 7) & 1);
		values.push((value >> 6) & 1);
		values.push((value >> 5) & 1);
		values.push((value >> 4) & 1);
		values.push((value >> 3) & 1);
		values.push((value >> 2) & 1);
		values.push((value >> 1) & 1);
		values.push(value & 1);

		// Make sure that padding is removed
		if (paddingAt) {
			byteCounter += 8;
			if (byteCounter >= paddingAt) {
				if (byteCounter > paddingAt) {
					values.splice(-(byteCounter - paddingAt));
				}
				byteCounter = 0;
			}
		}
	};
};

/**
 * Parses a 2-bit scanline stream
 *
 * @method _parse2bit
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Parser.prototype._parse2bit = function (paddingAt) {

	var byteCounter = 0;

	return function (value, values) {

		values.push((value >> 6) & 3);
		values.push((value >> 4) & 3);
		values.push((value >> 2) & 3);
		values.push(value & 3);

		// Make sure that padding is removed
		if (paddingAt) {
			byteCounter += 4;
			if (byteCounter >= paddingAt) {
				if (byteCounter > paddingAt) {
					values.splice(-(byteCounter - paddingAt));
				}
				byteCounter = 0;
			}
		}

	};
};

/**
 * Parses a 4-bit scanline stream
 *
 * @method _parse4bit
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Parser.prototype._parse4bit = function (paddingAt) {

	var byteCounter = 0;

	return function (value, values) {

		values.push((value >> 4) & 15);
		values.push(value & 15);

		// Make sure that padding is removed
		if (paddingAt) {
			byteCounter += 2;
			if (byteCounter >= paddingAt) {
				if (byteCounter > paddingAt) {
					values.splice(-(byteCounter - paddingAt));
				}
				byteCounter = 0;
			}
		}

	};
};

/**
 * Parses a 8-bit scanline stream
 *
 * @method _parse8bit
 * @return {function}
 * @private
 */
Parser.prototype._parse8bit = function () {
	return function (value, values) {
		values.push(value);
	};
};

/**
 * Parses a 16-bit scanline stream
 *
 * @method _parse16bit
 * @return {function}
 * @private
 */
Parser.prototype._parse16bit = function () {
	return function (value, values) {
		values.push(value);
	};
};


/**
 * Decodes one pass
 *
 * @method _passDecode
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} length Number of values to read
 * @param {function} pixelParser Function that will be called to parse pixel from the stream
 * @param {int[]} values Values read
 */
Parser.prototype._passDecode = function (
	input, output,
	length,
	pixelParser,
	values
) {

	var i,
		value,
		increment = 1,
		headerChunk,
		twoBytes;

	headerChunk = this.getHeaderChunk();
	twoBytes = headerChunk.getBitDepth() === 16;

	if (twoBytes) {
		increment = 2;
	}

	for(i = 0; i < length; i += increment) {

		if (twoBytes) {
			value = input.readUInt16BE();
		} else {
			value = input.readUInt8();
		}

		pixelParser(value, values);
	}
};

module.exports = Parser;

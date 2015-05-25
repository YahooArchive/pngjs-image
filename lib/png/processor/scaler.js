// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class Scaler
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @constructor
 */
var Scaler = function (headerChunk) {
	this._headerChunk = headerChunk;
};


/**
 * Scaler factor for 1-to-8-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_1_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_1_TO_8_BIT = 255;

/**
 * Scaler factor for 8-to-1-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_8_TO_1_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_1_BIT = 1 / 255;

/**
 * Scaler factor for 2-to-8-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_2_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_2_TO_8_BIT = 255 / 3;

/**
 * Scaler factor for 8-to-2-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_8_TO_2_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_2_BIT = 3 / 255;

/**
 * Scaler factor for 4-to-8-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_4_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_4_TO_8_BIT = 255 / 15;

/**
 * Scaler factor for 8-to-4-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_8_TO_4_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_4_BIT = 15 / 255;

/**
 * Scaler factor for 8-to-8-bit value conversion - identity
 *
 * @static
 * @property SCALE_FACTOR_8_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_8_BIT = 1;

/**
 * Scaler factor for 16-to-8-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_16_TO_8_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_16_TO_8_BIT = 255 / 65535;

/**
 * Scaler factor for 8-to-16-bit value conversion
 *
 * @static
 * @property SCALE_FACTOR_8_TO_16_BIT
 * @type {number}
 */
Scaler.SCALE_FACTOR_8_TO_16_BIT = 65535 / 255;


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Scaler.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Encodes color values of an image
 *
 * @method encode
 * @param {Buffer} image
 */
Scaler.prototype.encode = function (image) {
	return image;
	//TODO: Writing is currently only 8-bit
};

/**
 * Determines the writer and converter according to header data
 *
 * @method _determineWriter
 * @return {object}
 * @private
 */
Scaler.prototype._determineWriter = function () {

	var headerChunk = this.getHeaderChunk(),
		isColor, hasAlpha, isIndexed,

		result = null;

	isColor = headerChunk.isColor();
	hasAlpha = headerChunk.hasAlphaChannel();
	isIndexed = headerChunk.isColorTypeIndexedColor();

	if (isIndexed) {
		result = {
			valuesNeeded: 1,
			writer: this._writeInIndexedBytes.bind(this)
		};

	} else {

		if (isColor) {
			if (hasAlpha) {
				result = {
					valuesNeeded: 4,
					writer: this._writeInColorAlphaBytes.bind(this)
				};
			} else {
				result = {
					valuesNeeded: 3,
					writer: this._writeInColorNoAlphaBytes.bind(this)
				};
			}
		} else {
			if (hasAlpha) {
				result = {
					valuesNeeded: 2,
					writer: this._writeInNoColorAlphaBytes.bind(this)
				};
			} else {
				result = {
					valuesNeeded: 1,
					writer: this._writeInNoColorNoAlphaBytes.bind(this)
				};
			}
		}
	}

	return result;
};

/**
 * Determines the scaler according to header data
 *
 * @method _determineScaler
 * @return {object}
 * @private
 */
Scaler.prototype._determineScaler = function () {

	var headerChunk = this.getHeaderChunk(),
		isIndexed, bitDepth,

		result = null;

	isIndexed = headerChunk.isColorTypeIndexedColor();
	bitDepth = headerChunk.getBitDepth();

	switch (bitDepth) {
		case 1:
			result = {
				scaleFactor: isIndexed ? 1 : Scaler.SCALE_FACTOR_1_TO_8_BIT,
				scaler: function (v) {
					return v * result.scaleFactor;
				}
			};
			break;

		case 2:
			result = {
				scaleFactor: isIndexed ? 1 : Scaler.SCALE_FACTOR_2_TO_8_BIT,
				scaler: function (v) {
					return v * result.scaleFactor;
				}
			};
			break;

		case 4:
			result = {
				scaleFactor: isIndexed ? 1 : Scaler.SCALE_FACTOR_4_TO_8_BIT,
				scaler: function (v) {
					return v * result.scaleFactor;
				}
			};
			break;

		case 8:
			result = {
				scaleFactor: isIndexed ? 1 : Scaler.SCALE_FACTOR_8_TO_8_BIT,
				scaler: function (v) {
					return v * result.scaleFactor;
				}
			};
			break;

		case 16:
			result = {
				scaleFactor: isIndexed ? 1 : Scaler.SCALE_FACTOR_16_TO_8_BIT,
				scaler: function (v) {
					return Math.floor((v * result.scaleFactor) + 0.5);
				}
			};
			break;
	}

	return result;
};

/**
 * Decodes color values
 *
 * @method decode
 * @param {int[]} values
 */
Scaler.prototype.decode = function (values) {

	var headerChunk = this.getHeaderChunk(),

		outputStream,

		scalerInfo,
		writerInfo,
		currentValues;

	outputStream = new BufferedStream(null, null, headerChunk.getImageSizeInBytes());

	scalerInfo = this._determineScaler();
	writerInfo = this._determineWriter();

	while (values.length >= writerInfo.valuesNeeded) {

		currentValues = values.splice(0, writerInfo.valuesNeeded);
		currentValues = currentValues.map(scalerInfo.scaler);

		writerInfo.writer(outputStream, currentValues);
	}

	return outputStream.toBuffer(true);
};


/**
 * Write bytes when image is color and has already an alpha-channel
 *
 * @method _writeInColorAlphaBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
Scaler.prototype._writeInColorAlphaBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[1]);
	output.writeUInt8(bytes[2]);
	output.writeUInt8(bytes[3]);
};

/**
 * Write bytes when image is color and has no alpha-channel
 *
 * @method _writeInColorNoAlphaBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
Scaler.prototype._writeInColorNoAlphaBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[1]);
	output.writeUInt8(bytes[2]);
	output.writeUInt8(255);
};

/**
 * Write bytes when image is grayScaler and has already an alpha-channel
 *
 * @method _writeInNoColorAlphaBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
Scaler.prototype._writeInNoColorAlphaBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[1]);
};

/**
 * Write bytes when image is grayScaler and has no alpha-channel
 *
 * @method _writeInNoColorNoAlphaBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
Scaler.prototype._writeInNoColorNoAlphaBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[0]);
	output.writeUInt8(255);
};

/**
 * Write bytes when image is indexed on a palette
 *
 * @method _writeInIndexedBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
Scaler.prototype._writeInIndexedBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(0);
	output.writeUInt8(0);
	output.writeUInt8(255);
};


/**
 * Scales a value according to the header
 *
 * @method decodeValue
 * @param {number} value
 * @return {number}
 */
Scaler.prototype.decodeValue = function (value) {

	var bitDepth = this.getHeaderChunk().getBitDepth(),
		result = null;

	switch(bitDepth) {

		case 1:
			result = value * Scaler.SCALE_FACTOR_1_TO_8_BIT;
			break;

		case 2:
			result = value * Scaler.SCALE_FACTOR_2_TO_8_BIT;
			break;

		case 4:
			result = value * Scaler.SCALE_FACTOR_4_TO_8_BIT;
			break;

		case 8:
			result = value * Scaler.SCALE_FACTOR_8_TO_8_BIT;
			break;

		case 16:
			result = value * Scaler.SCALE_FACTOR_16_TO_8_BIT;
			break;
	}

	result = Math.floor(result);

	return result;
};

/**
 * Scales a value according to the header
 *
 * @method encodeValue
 * @param {number} value
 * @return {number}
 */
Scaler.prototype.encodeValue = function (value) {

	var bitDepth = this.getHeaderChunk().getBitDepth(),
		result = null;

	switch(bitDepth) {

		case 1:
			result = value * Scaler.SCALE_FACTOR_8_TO_1_BIT;
			break;

		case 2:
			result = value * Scaler.SCALE_FACTOR_8_TO_2_BIT;
			break;

		case 4:
			result = value * Scaler.SCALE_FACTOR_8_TO_4_BIT;
			break;

		case 8:
			result = value * Scaler.SCALE_FACTOR_8_TO_8_BIT;
			break;

		case 16:
			result = value * Scaler.SCALE_FACTOR_8_TO_16_BIT;
			break;
	}

	result = Math.ceil(result);

	return result;
};

module.exports = Scaler;

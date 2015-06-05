// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class Normalizer
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @constructor
 */
var Normalizer = function (headerChunk) {
	this._headerChunk = headerChunk;
};


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Normalizer.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Encodes color values of an image
 *
 * @method encode
 * @param {Buffer} image
 */
Normalizer.prototype.encode = function (image) {
	return image;
	//TODO: Writing is currently only 8-bit
};


/**
 * Determines the max number for a bit-depth
 *
 * @method _determineMaxValue
 * @return {int}
 * @private
 */
Normalizer.prototype._determineMaxValue = function () {

	var headerChunk = this.getHeaderChunk(),
		result;

	if (headerChunk.isColorTypeIndexedColor()) {
		result = 255;

	} else {
		switch (headerChunk.getBitDepth()) {

			case 1:
				result = 1;
				break;

			case 2:
				result = 3;
				break;

			case 4:
				result = 15;
				break;

			case 8:
				result = 255;
				break;

			case 16:
				result = 65535;
				break;
		}
	}

	return result;
};

/**
 * Determines the writer according to header data
 *
 * @method _determineWriter
 * @return {object}
 * @private
 */
Normalizer.prototype._determineWriter = function () {

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
 * Decodes color values
 *
 * @method decode
 * @param {int[]} values
 * @return {int[]}
 */
Normalizer.prototype.decode = function (values) {

	var output = [],
		writerInfo,
		maxValue,
		offset = 0;

	writerInfo = this._determineWriter();
	maxValue = this._determineMaxValue();

	while (values.length > offset) {
		writerInfo.writer(values, offset, output, maxValue);
		offset += writerInfo.valuesNeeded;
	}

	return output;
};


/**
 * Write bytes when image is color and has already an alpha-channel
 *
 * @method _writeInColorAlphaBytes
 * @param {int[]} bytes Bytes that should be save to stream
 * @param {int} offset Byte offset
 * @param {int[]} output Output list
 * @private
 */
Normalizer.prototype._writeInColorAlphaBytes = function (bytes, offset, output) {
	output.push(bytes[offset]);
	output.push(bytes[offset + 1]);
	output.push(bytes[offset + 2]);
	output.push(bytes[offset + 3]);
};

/**
 * Write bytes when image is color and has no alpha-channel
 *
 * @method _writeInColorNoAlphaBytes
 * @param {int[]} bytes Bytes that should be save to stream
 * @param {int} offset Byte offset
 * @param {int[]} output Output list
 * @param {int} maxValue Max value for bit-depth
 * @private
 */
Normalizer.prototype._writeInColorNoAlphaBytes = function (bytes, offset, output, maxValue) {
	output.push(bytes[offset]);
	output.push(bytes[offset + 1]);
	output.push(bytes[offset + 2]);
	output.push(maxValue);
};

/**
 * Write bytes when image is grayNormalizer and has already an alpha-channel
 *
 * @method _writeInNoColorAlphaBytes
 * @param {int[]} bytes Bytes that should be save to stream
 * @param {int} offset Byte offset
 * @param {int[]} output Output list
 * @private
 */
Normalizer.prototype._writeInNoColorAlphaBytes = function (bytes, offset, output) {
	output.push(bytes[offset]);
	output.push(bytes[offset]);
	output.push(bytes[offset]);
	output.push(bytes[offset + 1]);
};

/**
 * Write bytes when image is grayNormalizer and has no alpha-channel
 *
 * @method _writeInNoColorNoAlphaBytes
 * @param {int[]} bytes Bytes that should be save to stream
 * @param {int} offset Byte offset
 * @param {int[]} output Output list
 * @param {int} maxValue Max value for bit-depth
 * @private
 */
Normalizer.prototype._writeInNoColorNoAlphaBytes = function (bytes, offset, output, maxValue) {
	output.push(bytes[offset]);
	output.push(bytes[offset]);
	output.push(bytes[offset]);
	output.push(maxValue);
};

/**
 * Write bytes when image is indexed on a palette
 *
 * @method _writeInIndexedBytes
 * @param {int[]} bytes Bytes that should be save to stream
 * @param {int} offset Byte offset
 * @param {int[]} output Output list
 * @param {int} maxValue Max value for bit-depth
 * @private
 */
Normalizer.prototype._writeInIndexedBytes = function (bytes, offset, output, maxValue) {
	output.push(bytes[offset]);
	output.push(bytes[offset]);
	output.push(bytes[offset]);
	output.push(maxValue);
};

module.exports = Normalizer;

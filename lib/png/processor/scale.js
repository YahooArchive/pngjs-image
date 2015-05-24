// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Interlace = require('./interlace');
var BufferedStream = require('../utils/bufferedStream');

/**
 * @class Scale
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @constructor
 */
var Scale = function (headerChunk) {
	this._headerChunk = headerChunk;
};


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Scale.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};


/**
 * Scaling of image when writing
 *
 * @method scaleOut
 * @param {Buffer} image
 * @param {int} [offset=0]
 */
Scale.prototype.scaleOut = function (image, offset) {
	return image;
	//TODO: Writing is currently only 8-bit
};


/**
 * Scaling of image when reading
 *
 * @method scaleIn
 * @param {Buffer} image
 * @param {int} [offset=0]
 */
Scale.prototype.scaleIn = function (image, offset) {

	var headerChunk = this.getHeaderChunk(),
		interlace = new Interlace(headerChunk),

		imageStream, scaledStream,
		isColor, hasAlpha, isIndexed, bitDepth,
		paddingAt,

		pixelScaler,
		pixelScalerMethod,
		pixelScalerMap;

	isColor = headerChunk.isColor();
	hasAlpha = headerChunk.hasAlphaChannel();
	isIndexed = headerChunk.isColorTypeIndexedColor();
	bitDepth = headerChunk.getBitDepth();

	// Do some scaling
	if ((bitDepth === 8) && isColor && hasAlpha) {
		return image;

	} else {

		pixelScalerMap = {
			1: "_scale1to8bit",
			2: "_scale2to8bit",
			4: "_scale4to8bit",
			8: "_scale8to8bit",
			16: "_scale16to8bit"
		};

		pixelScalerMethod = pixelScalerMap[bitDepth];
		if (!pixelScalerMethod) {
			throw new Error('Unknown bit-depth; cannot scale image.');
		}

		imageStream = new BufferedStream(image, false);
		imageStream.readOffset = offset;

		scaledStream = new BufferedStream(null, null, headerChunk.getImageSizeInBytes());

		interlace.processPasses(function (width, height, scanLineLength) {

			paddingAt = headerChunk.scanLineWithWidthPaddingAt(width);
			pixelScaler = this[pixelScalerMethod](isIndexed, paddingAt);

			this._imageScaleIn(
				imageStream, scaledStream,
				scanLineLength * height,
				pixelScaler,
				isColor, hasAlpha, isIndexed,
				bitDepth === 16
			);

		}.bind(this));

		return scaledStream.toBuffer(true);
	}
};


/**
 * Converts a 1-bit stream to 8-bit
 *
 * @method _scale1to8bit
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Scale.prototype._scale1to8bit = function (isIndexedColor, paddingAt) {

	var scaleFactor = isIndexedColor ? 1 : 255, // 255 / 1
		byteCounter = 0;

	return function (value, bytes) {

		bytes.push(((value >> 7) & 1) * scaleFactor);
		bytes.push(((value >> 6) & 1) * scaleFactor);
		bytes.push(((value >> 5) & 1) * scaleFactor);
		bytes.push(((value >> 4) & 1) * scaleFactor);
		bytes.push(((value >> 3) & 1) * scaleFactor);
		bytes.push(((value >> 2) & 1) * scaleFactor);
		bytes.push(((value >> 1) & 1) * scaleFactor);
		bytes.push((value & 1) * scaleFactor);

		// Make sure that padding is removed
		if (paddingAt) {
			byteCounter += 8;
			if (byteCounter >= paddingAt) {
				if (byteCounter > paddingAt) {
					bytes.splice(-(byteCounter - paddingAt));
				}
				byteCounter = 0;
			}
		}
	};
};

/**
 * Converts a 2-bit stream to 8-bit
 *
 * @method _scale2to8bit
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Scale.prototype._scale2to8bit = function (isIndexedColor, paddingAt) {

	var scaleFactor = isIndexedColor ? 1 : 255 / 3,
		byteCounter = 0;

	return function (value, bytes) {

		bytes.push(((value >> 6) & 3) * scaleFactor);
		bytes.push(((value >> 4) & 3) * scaleFactor);
		bytes.push(((value >> 2) & 3) * scaleFactor);
		bytes.push((value & 3) * scaleFactor);

		// Make sure that padding is removed
		if (paddingAt) {
			byteCounter += 4;
			if (byteCounter >= paddingAt) {
				if (byteCounter > paddingAt) {
					bytes.splice(-(byteCounter - paddingAt));
				}
				byteCounter = 0;
			}
		}

	};
};

/**
 * Converts a 4-bit stream to 8-bit
 *
 * @method _scale4to8bit
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 * @param {number} paddingAt Defines the position of padding within each scanline
 * @return {function}
 * @private
 */
Scale.prototype._scale4to8bit = function (isIndexedColor, paddingAt) {

	var scaleFactor = isIndexedColor ? 1 : 255 / 15,
		byteCounter = 0;

	return function (value, bytes) {

		bytes.push(((value >> 4) & 15) * scaleFactor);
		bytes.push((value & 15) * scaleFactor);

		// Make sure that padding is removed
		if (paddingAt) {
			byteCounter += 2;
			if (byteCounter >= paddingAt) {
				if (byteCounter > paddingAt) {
					bytes.splice(-(byteCounter - paddingAt));
				}
				byteCounter = 0;
			}
		}

	};
};

/**
 * Converts a 8-bit stream to 8-bit
 *
 * @method _scale8to8bit
 * @return {function}
 * @private
 */
Scale.prototype._scale8to8bit = function () {
	return function (value, bytes) {
		bytes.push(value);
	};
};

/**
 * Converts a 16-bit stream to 8-bit (lossy)
 *
 * @method _scale16to8bit
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 * @return {function}
 * @private
 */
Scale.prototype._scale16to8bit = function (isIndexedColor) {

	var scaleFactor = isIndexedColor ? 1 : 255 / 65535;

	return function (value, bytes) {
		bytes.push(Math.floor((value * scaleFactor) + 0.5));
	};
};


/**
 * Scales the image data when reading
 *
 * @method _imageScaleIn
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} length Number of bytes to read
 * @param {function} pixelScaler Function that will be called to save the bytes to the stream
 * @param {boolean} isColor Is data in color?
 * @param {boolean} hasAlphaChannel Does  data have an alpha-channel?
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 * @param {boolean} [twoBytes=false] When set, reads 16-bit instead of 8-bit
 */
Scale.prototype._imageScaleIn = function (
	input, output,
	length,
	pixelScaler,
	isColor, hasAlphaChannel, isIndexedColor,
	twoBytes
) {

	var i,
		value,
		bytes = [],
		bytesNeeded,
		method,
		currentBytes,
		increment = 1;

	if (isIndexedColor) {
		bytesNeeded = 1;
		method = '_writeInIndexedBytes';

	} else {

		if (isColor) {
			if (hasAlphaChannel) {
				bytesNeeded = 4;
				method = '_writeInColorAlphaBytes';
			} else {
				bytesNeeded = 3;
				method = '_writeInColorNoAlphaBytes';
			}
		} else {
			if (hasAlphaChannel) {
				bytesNeeded = 2;
				method = '_writeInNoColorAlphaBytes';
			} else {
				bytesNeeded = 1;
				method = '_writeInNoColorNoAlphaBytes';
			}
		}
	}

	if (twoBytes) {
		increment = 2;
	}

	for(i = 0; i < length; i += increment) {

		if (twoBytes) {
			value = input.readUInt16BE();
		} else {
			value = input.readUInt8();
		}

		pixelScaler(value, bytes);

		while (bytes.length >= bytesNeeded) {
			currentBytes = bytes.splice(0, bytesNeeded);
			this[method](output, currentBytes);
		}
	}
};



/**
 * Write bytes when image is color and has already an alpha-channel
 *
 * @method _writeInColorAlphaBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
Scale.prototype._writeInColorAlphaBytes = function (output, bytes) {
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
Scale.prototype._writeInColorNoAlphaBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[1]);
	output.writeUInt8(bytes[2]);
	output.writeUInt8(255);
};

/**
 * Write bytes when image is grayScale and has already an alpha-channel
 *
 * @method _writeInNoColorAlphaBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
Scale.prototype._writeInNoColorAlphaBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[0]);
	output.writeUInt8(bytes[1]);
};

/**
 * Write bytes when image is grayScale and has no alpha-channel
 *
 * @method _writeInNoColorNoAlphaBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
Scale.prototype._writeInNoColorNoAlphaBytes = function (output, bytes) {
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
Scale.prototype._writeInIndexedBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(0);
	output.writeUInt8(0);
	output.writeUInt8(255);
};



module.exports = Scale;

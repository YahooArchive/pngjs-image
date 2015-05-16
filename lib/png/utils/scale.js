// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class scale
 * @module PNG
 * @submodule PNGCore
 * @constructor
 */
var scale = {};

/**
 * Write bytes when image is color and has already an alpha-channel
 *
 * @method _writeInColorAlphaBytes
 * @param {BufferedStream} output Output stream
 * @param {int[]} bytes Bytes that should be save to stream
 * @private
 */
scale._writeInColorAlphaBytes = function (output, bytes) {
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
scale._writeInColorNoAlphaBytes = function (output, bytes) {
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
scale._writeInNoColorAlphaBytes = function (output, bytes) {
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
scale._writeInNoColorNoAlphaBytes = function (output, bytes) {
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
scale._writeInIndexedBytes = function (output, bytes) {
	output.writeUInt8(bytes[0]);
	output.writeUInt8(0);
	output.writeUInt8(0);
	output.writeUInt8(255);
};

/**
 * Scales the image data up
 *
 * @static
 * @method scaleUp
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {function} spreadFn Function that will be called to save the bytes to the stream
 * @param {boolean} isColor Is data in color?
 * @param {boolean} hasAlphaChannel Does  data have an alpha-channel?
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 * @param {boolean} [twoBytes=false] When set, reads 16-bit instead of 8-bit
 */
scale.scaleUp = function (input, output, spreadFn, isColor, hasAlphaChannel, isIndexedColor, twoBytes) {

	var i, len,
		value,
		bytes = [],
		bytesNeeded,
		method,
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

	for(i = 0, len = input.length; i < len; i += increment) {

		if (twoBytes) {
			value = input.readUInt16BE();
		} else {
			value = input.readUInt8();
		}

		spreadFn(value, bytes);

		while (bytes.length > bytesNeeded) {
			this[method](output, bytes.splice(0, bytesNeeded));
		}
	}
};

/**
 * Converts a 1-bit stream to 8-bit
 *
 * @static
 * @method scale1to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {boolean} isColor Is data in color?
 * @param {boolean} hasAlphaChannel Does  data have an alpha-channel?
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 */
scale.scale1to8bit = function (input, output, isColor, hasAlphaChannel, isIndexedColor) {

	var scaleFactor = isIndexedColor ? 1 : 255; // 255 / 1

	this.scaleUp(input, output, function (value, bytes) {
		bytes.push(((value >> 7) & 1) * scaleFactor);
		bytes.push(((value >> 6) & 1) * scaleFactor);
		bytes.push(((value >> 5) & 1) * scaleFactor);
		bytes.push(((value >> 4) & 1) * scaleFactor);
		bytes.push(((value >> 3) & 1) * scaleFactor);
		bytes.push(((value >> 2) & 1) * scaleFactor);
		bytes.push(((value >> 1) & 1) * scaleFactor);
		bytes.push((value & 1) * scaleFactor);
	}, isColor, hasAlphaChannel, isIndexedColor);
};

/**
 * Converts a 2-bit stream to 8-bit
 *
 * @static
 * @method scale2to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {boolean} isColor Is data in color?
 * @param {boolean} hasAlphaChannel Does  data have an alpha-channel?
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 */
scale.scale2to8bit = function (input, output, isColor, hasAlphaChannel, isIndexedColor) {

	var scaleFactor = isIndexedColor ? 1 : 255 / 3;

	this.scaleUp(input, output, function (value, bytes) {
		bytes.push(((value >> 6) & 3) * scaleFactor);
		bytes.push(((value >> 4) & 3) * scaleFactor);
		bytes.push(((value >> 2) & 3) * scaleFactor);
		bytes.push((value & 3) * scaleFactor);
	}, isColor, hasAlphaChannel, isIndexedColor);
};

/**
 * Converts a 4-bit stream to 8-bit
 *
 * @static
 * @method scale4to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {boolean} isColor Is data in color?
 * @param {boolean} hasAlphaChannel Does  data have an alpha-channel?
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 */
scale.scale4to8bit = function (input, output, isColor, hasAlphaChannel, isIndexedColor) {

	var scaleFactor = isIndexedColor ? 1 : 255 / 15;

	this.scaleUp(input, output, function (value, bytes) {
		bytes.push(((value >> 4) & 15) * scaleFactor);
		bytes.push((value & 15) * scaleFactor);
	}, isColor, hasAlphaChannel, isIndexedColor);
};

/**
 * Converts a 8-bit stream to 8-bit
 *
 * @static
 * @method scale8to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {boolean} isColor Is data in color?
 * @param {boolean} hasAlphaChannel Does  data have an alpha-channel?
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 */
scale.scale8to8bit = function (input, output, isColor, hasAlphaChannel, isIndexedColor) {

	this.scaleUp(input, output, function (value, bytes) {
		bytes.push(value);
	}, isColor, hasAlphaChannel, isIndexedColor);
};

/**
 * Converts a 16-bit stream to 8-bit (lossy)
 *
 * @static
 * @method scale16to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {boolean} isColor Is data in color?
 * @param {boolean} hasAlphaChannel Does  data have an alpha-channel?
 * @param {boolean} isIndexedColor Is image indexed on a palette?
 */
scale.scale16to8bit = function (input, output, isColor, hasAlphaChannel, isIndexedColor) {

	var scaleFactor = isIndexedColor ? 1 : 255 / 65535;

	this.scaleUp(input, output, function (value, bytes) {
		bytes.push(Math.floor((value * scaleFactor) + 0.5));
	}, isColor, hasAlphaChannel, isIndexedColor, true);
};


/**
 * Converts a 8-bit stream to 1-bit
 *
 * @static
 * @method scale8to1bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 */
scale.scale8to1bit = function (input, output) {

	var scaleFactor = 1 / 255;

	for(var i = 0, len = input.length; i < len; i += 8) {
		output.writeUInt8(
			Math.floor((((input.readUInt8() & 1) << 7) * scaleFactor) + 0.5),
			Math.floor((((input.readUInt8() & 1) << 6) * scaleFactor) + 0.5),
			Math.floor((((input.readUInt8() & 1) << 5) * scaleFactor) + 0.5),
			Math.floor((((input.readUInt8() & 1) << 4) * scaleFactor) + 0.5),
			Math.floor((((input.readUInt8() & 1) << 3) * scaleFactor) + 0.5),
			Math.floor((((input.readUInt8() & 1) << 2) * scaleFactor) + 0.5),
			Math.floor((((input.readUInt8() & 1) << 1) * scaleFactor) + 0.5),
			Math.floor(((input.readUInt8() & 1) * scaleFactor) + 0.5)
		);
	}
};

/**
 * Converts a 8-bit stream to 2-bit
 *
 * @static
 * @method scale8to2bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 */
scale.scale8to2bit = function (input, output) {

	var scaleFactor = 3 / 255;

	for(var i = 0, len = input.length; i < len; i += 4) {
		output.writeUInt8(
			Math.floor((((input.readUInt8() & 3) << 6) * scaleFactor) + 0.5),
			Math.floor((((input.readUInt8() & 3) << 4) * scaleFactor) + 0.5),
			Math.floor((((input.readUInt8() & 3) << 2) * scaleFactor) + 0.5),
			Math.floor(((input.readUInt8() & 3) * scaleFactor) + 0.5)
		);
	}
};

/**
 * Converts a 8-bit stream to 4-bit
 *
 * @static
 * @method scale8to4bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 */
scale.scale8to4bit = function (input, output) {

	var scaleFactor = 15 / 255;

	for(var i = 0, len = input.length; i < len; i += 2) {
		output.writeUInt8(
			Math.floor((((input.readUInt8() & 15) << 4) * scaleFactor) + 0.5),
			Math.floor(((input.readUInt8() & 15) * scaleFactor) + 0.5)
		);
	}
};

/**
 * Converts a 8-bit stream to 16-bit
 *
 * @static
 * @method scale8to16bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 */
scale.scale8to16bit = function (input, output) {

	var i, len,
		value,
		scaleFactor = 65535 / 255;

	for(i = 0, len = input.length; i < len; i++) {
		value = input.readUInt8();
		output.writeUInt16BE(value * scaleFactor);
	}
};


/**
 * Duplicates bytes in a stream
 *
 * @static
 * @method duplicate
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} duplication Number of times the bytes should be duplicated
 */
scale.duplicate = function (input, output, duplication) {

	var i, j, len,
		value;

	for(i = 0, len = input.length; i < len; i++) {

		value = input.readUInt8();

		for(j = 0; j < duplication; j++) {
			output.writeUInt8(value);
		}
	}
};

/**
 * Reduces bytes in a stream by calculating its average
 *
 * @static
 * @method reduce
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} reduction Number of bytes the average should be calculated from
 */
scale.reduce = function (input, output, reduction) {

	var i, j, len,
		sum;

	for(i = 0, len = input.length; i < len; i++) {

		sum = 0;
		for(j = 0; j < reduction; j++) {
			sum += input.readUInt8();
		}

		output.writeUInt8(Math.floor((sum / reduction) + 0.5));
	}
};


/**
 * Injects every x number of bytes a value
 *
 * @static
 * @method inject
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} every Number of bytes to ignore before injection
 * @param {int} value Value to inject
 */
scale.inject = function (input, output, every, value) {

	var i, j, len;

	for(i = 0, len = input.length; i < len; i += every) {

		for(j = 0; j < every; j++) {
			output.writeUInt8(input.readUInt8());
		}

		output.writeUInt8(value);
	}
};

/**
 * Withdraws every x number of bytes one byte
 *
 * @static
 * @method withdraw
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 * @param {int} every Number of bytes to ignore for withdrawal
 */
scale.withdraw = function (input, output, every) {

	var i, j, len;

	for(i = 0, len = input.length; i < len; i += every - 1) {

		for(j = 0; j < every - 1; j++) {
			output.writeUInt8(input.readUInt8());
		}

		input.readUInt8(); // Ignore
	}
};

module.exports = scale;

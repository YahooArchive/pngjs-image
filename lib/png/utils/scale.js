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

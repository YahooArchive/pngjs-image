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
 * Converts a 1-bit stream to 8-bit
 *
 * @static
 * @method scale1to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 */
scale.scale1to8bit = function (input, output) {

	var i, len,
		value;

	for(i = 0, len = input.length; i < len; i++) {

		value = input.readUInt8();

		output.writeUInt8(value & 1);
		output.writeUInt8((value >> 1) & 1);
		output.writeUInt8((value >> 2) & 1);
		output.writeUInt8((value >> 3) & 1);
		output.writeUInt8((value >> 4) & 1);
		output.writeUInt8((value >> 5) & 1);
		output.writeUInt8((value >> 6) & 1);
		output.writeUInt8((value >> 7) & 1);
	}
};

/**
 * Converts a 2-bit stream to 8-bit
 *
 * @static
 * @method scale2to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 */
scale.scale2to8bit = function (input, output) {

	var i, len,
		value;

	for(i = 0, len = input.length; i < len; i++) {

		value = input.readUInt8();

		output.writeUInt8(value & 3);
		output.writeUInt8((value >> 2) & 3);
		output.writeUInt8((value >> 4) & 3);
		output.writeUInt8((value >> 6) & 3);
	}
};

/**
 * Converts a 4-bit stream to 8-bit
 *
 * @static
 * @method scale4to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 */
scale.scale4to8bit = function (input, output) {

	var i, len,
		value;

	for(i = 0, len = input.length; i < len; i++) {

		value = input.readUInt8();

		output.writeUInt8(value & 15);
		output.writeUInt8((value >> 4) & 15);
	}
};

/**
 * Converts a 16-bit stream to 8-bit (lossy)
 *
 * @static
 * @method scale16to8bit
 * @param {BufferedStream} input Input stream
 * @param {BufferedStream} output Output stream
 */
scale.scale16to8bit = function (input, output) {

	var i, len,
		value;

	for(i = 0, len = input.length; i < len; i += 2) {
		value = input.readUInt16BE();
		output.writeUInt8(Math.floor((value * 0.5) + 0.5));
	}
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

	for(var i = 0, len = input.length; i < len; i += 8) {
		output.writeUInt8(
			input.readUInt8() & 1,
			(input.readUInt8() & 1) << 1,
			(input.readUInt8() & 1) << 2,
			(input.readUInt8() & 1) << 3,
			(input.readUInt8() & 1) << 4,
			(input.readUInt8() & 1) << 5,
			(input.readUInt8() & 1) << 6,
			(input.readUInt8() & 1) << 7
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

	for(var i = 0, len = input.length; i < len; i += 4) {
		output.writeUInt8(
			input.readUInt8() & 3,
			(input.readUInt8() & 3) << 2,
			(input.readUInt8() & 3) << 4,
			(input.readUInt8() & 3) << 6
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

	for(var i = 0, len = input.length; i < len; i += 2) {
		output.writeUInt8(
			input.readUInt8() & 15,
			(input.readUInt8() & 15) << 4
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
		value;

	for(i = 0, len = input.length; i < len; i++) {
		value = input.readUInt8();
		output.writeUInt16BE(Math.floor((value * 2) + 0.5));
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

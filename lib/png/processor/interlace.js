// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var interlace = require('../utils/constants').interlace;

/**
 * @class Interlace
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @param {Buffer} data Image data
 * @param {int} [offset=0] Offset within the image data
 * @constructor
 */
var Interlace = function (headerChunk, data, offset) {
	this._headerChunk = headerChunk;
	this._data = data;
	this._offset = offset || 0;
};


/**
 * Gets the header chunk
 *
 * @method getHeaderChunk
 * @return {Chunk}
 */
Interlace.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};

/**
 * Gets the image data
 *
 * @method getData
 * @return {Buffer}
 */
Interlace.prototype.getData = function () {
	return this._data;
};

/**
 * Gets the data offset
 *
 * @method getOffset
 * @return {int}
 */
Interlace.prototype.getOffset = function () {
	return this._offset;
};


/**
 * Applies the interlace encoding
 *
 * @method interlace
 * @return {Buffer} Interlaces image data
 */
Interlace.prototype.interlace = function () {

	var data = this.getData(),
		offset = this.getOffset(),
		headerChunk = this.getHeaderChunk(),
		output;

	if (headerChunk.getInterlaceMethod() === interlace.ADAM7) {
		output = this._adam7(this.getData(), this.getOffset(), headerChunk.getWidth(), headerChunk.getHeight(), false);
	} else {
		output = new Buffer(data.length - offset);
		data.copy(output, 0, offset, offset + output.length);
	}

	return output;
};

/**
 * Reverses the interlace encoding
 *
 * @method reverse
 * @return {Buffer} Plain image data
 */
Interlace.prototype.reverse = function () {

	var data = this.getData(),
		offset = this.getOffset(),
		headerChunk = this.getHeaderChunk(),
		output;

	if (headerChunk.getInterlaceMethod() === interlace.ADAM7) {
		output = this._adam7(this.getData(), this.getOffset(), headerChunk.getWidth(), headerChunk.getHeight(), true);
	} else {
		output = new Buffer(data.length - offset);
		data.copy(output, 0, offset, offset + output.length);
	}

	return output;
};


/**
 * Applies the adam-7 algorithm to the supplied data
 *
 * @method _adam7
 * @param {Buffer} data Input data
 * @param {int} offset Offset in input data
 * @param {int} width Width of image
 * @param {int} height Height of image
 * @param {boolean} [revert=false] Should adam-7 be reverted? Otherwise applies it.
 * @return {Buffer}
 * @private
 */
Interlace.prototype._adam7 = function (data, offset, width, height, revert) {

	// Suggested implementation from the spec:
	// http://www.libpng.org/pub/png/spec/1.1/PNG-Decoders.html

	var startingRow  = [0, 0, 4, 0, 2, 0, 1],
		startingCol  = [0, 4, 0, 2, 0, 1, 0],
		rowIncrement = [8, 8, 8, 4, 4, 2, 2],
		colIncrement = [8, 8, 4, 4, 2, 2, 1],
		pass, row, col,
		position = 0,
		output,
		sequential, jump;

	output = new Buffer(data.length - offset);
	for (pass = 0; pass < 7; pass++) {
		for (row = startingRow[pass]; row < height; row += rowIncrement[pass]) {
			for (col = startingCol[pass]; col < width; col += colIncrement[pass]) {

				sequential = position;
				jump = ((row * width) + col) * 4;

				if (revert) {
					output.writeUInt32BE(data.readUInt32BE(offset + sequential, true), jump, true);
				} else {
					output.writeUInt32BE(data.readUInt32BE(offset + jump, true), sequential, true);
				}

				position += 4;
			}
		}
	}

	return output;
};

module.exports = Interlace;

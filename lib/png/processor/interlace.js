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
		output;

	output = new Buffer(data.length - offset);
	data.copy(output, 0, offset, offset + output.length);

	//TODO: Adam-7 interlace

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
		output = this.adam7Reverse(headerChunk.getWidth(), headerChunk.getHeight());
	} else {
		output = new Buffer(data.length - offset);
		data.copy(output, 0, offset, offset + output.length);
	}

	return output;
};


Interlace.prototype.adam7 = function () {

	var startingRow  = [ 0, 0, 4, 0, 2, 0, 1 ],
		startingCol  = [ 0, 4, 0, 2, 0, 1, 0 ],
		rowIncrement = [ 8, 8, 8, 4, 4, 2, 2 ],
		colIncrement = [ 8, 8, 4, 4, 2, 2, 1],
		pass, row, col,
		data = this.getData(),
		offset = this.getOffset(),
		position = 0,
		output;

	output = new Buffer(data.length - offset);
	for (pass = 0; pass < 7; pass++) {
		for (row = startingRow[pass]; row < height; row += rowIncrement[pass]) {
			for (col = startingCol[pass]; col < width; col += colIncrement[pass]) {
				output.writeUInt32BE(data.readUInt32BE(offset + (((row * width) + col) * 4)), position);
				position += 4;
			}
		}
	}

	return output;
};

Interlace.prototype.adam7Reverse = function (width, height) {

	var startingRow  = [ 0, 0, 4, 0, 2, 0, 1 ],
		startingCol  = [ 0, 4, 0, 2, 0, 1, 0 ],
		rowIncrement = [ 8, 8, 8, 4, 4, 2, 2 ],
		colIncrement = [ 8, 8, 4, 4, 2, 2, 1],
		pass, row, col,
		data = this.getData(),
		offset = this.getOffset(),
		position = 0,
		output;

	output = new Buffer(data.length - offset);
	for (pass = 0; pass < 7; pass++) {
		for (row = startingRow[pass]; row < height; row += rowIncrement[pass]) {
			for (col = startingCol[pass]; col < width; col += colIncrement[pass]) {
				output.writeUInt32BE(data.readUInt32BE(offset + position), ((row * width) + col) * 4);
				position += 4;
			}
		}
	}

	return output;
};

module.exports = Interlace;

// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

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
		output;

	output = new Buffer(data.length - offset);
	data.copy(output, 0, offset, offset + output.length);

	//TODO: Adam-7 interlace

	return output;
};

module.exports = Interlace;

// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var pako = require("pako");

/**
 * @class Compressor
 * @module PNG
 * @submodule PNGCore
 * @param {object} options Options for the compressor
 * @constructor
 */
var Compressor = function (options) {
	this._options = options;
};

/**
 * Gets the options
 *
 * @method getOptions
 * @return {object}
 */
Compressor.prototype.getOptions = function () {
	return this._options;
};


/**
 * Compresses data
 *
 * @method compress
 * @param {Buffer} data
 * @return {Buffer}
 */
Compressor.prototype.compress = function (data) {
	return new Buffer(pako.deflate(data, this.getOptions()));
};

/**
 * Decompresses data
 *
 * @method decompress
 * @param {Buffer} data
 * @return {Buffer}
 */
Compressor.prototype.decompress = function (data) {
	return new Buffer(pako.inflate(data, this.getOptions()));
};

module.exports = Compressor;

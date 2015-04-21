// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var zlib = require('zlib');

/**
 * @class Compressor
 * @module PNG
 * @submodule PNGCore
 * @param options
 * @constructor
 */
var Compressor = function (options) {
	this._options = options;
};

Compressor.prototype.getOptions = function () {
	return this._options;
};

Compressor.prototype.reverse = function (data, fn) {
	if (!zlib.inflateSync) {
		return new Buffer(require("pako").inflate(data, this.getOptions()));
	} else {
		return zlib.inflateSync(data, this.getOptions());
	}
};

Compressor.prototype.compress = function (data) {
	if (!zlib.deflateSync) {
		return new Buffer(require("pako").deflate(data, this.getOptions()));
	} else {
		return zlib.deflateSync(data, this.getOptions());
	}
};

module.exports = Compressor;

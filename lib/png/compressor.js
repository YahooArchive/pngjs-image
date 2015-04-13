var zlib = require('zlib');

var Compressor = function (options) {
	this._options = options;
};

Compressor.prototype.getOptions = function () {
	return this._options;
};

Compressor.prototype.inflate = function (data) {
	return zlib.inflateSync(data, this.getOptions());
};

Compressor.prototype.deflate = function (data) {
	return zlib.deflateSync(data, this.getOptions());
};

module.exports = Compressor;

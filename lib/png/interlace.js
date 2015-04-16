var Interlace = function (headerChunk, data, offset) {
	this._headerChunk = headerChunk;
	this._data = data;
	this._offset = offset || 0;
};


Interlace.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};

Interlace.prototype.getData = function () {
	return this._data;
};

Interlace.prototype.getOffset = function () {
	return this._offset;
};


Interlace.prototype.interlace = function () {
	var data = this.getData(),
		offset = this.getOffset(),
		output;

	output = new Buffer(data.length - offset);
	data.copy(output, 0, offset, offset + output.length);

	return output;
};

Interlace.prototype.reverse = function () {
	var data = this.getData(),
		offset = this.getOffset(),
		output;

	output = new Buffer(data.length - offset);
	data.copy(output, 0, offset, offset + output.length);

	return output;
};

module.exports = Interlace;

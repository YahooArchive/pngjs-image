var Filter = function (width, height, data, scanLineLength) {
	this._width = width;
	this._height = height;
	this._data = data;
	this._scanLineLength = scanLineLength;
};

Filter.prototype.getWidth = function () {
	return this._width;
};

Filter.prototype.getHeight = function () {
	return this._height;
};

Filter.prototype.getData = function () {
	return this._data;
};

Filter.prototype.getScanLineLength = function () {
	return this._scanLineLength;
};



Filter.prototype.filter = function () {

};

Filter.prototype._filterNone = function () {

};

Filter.prototype._filterSub = function () {

};

Filter.prototype._filterUp = function () {

};

Filter.prototype._filterAverage = function () {

};

Filter.prototype._filterPaeth = function () {

};


Filter.prototype.reverse = function () {
	var scanLineLength = this.getScanLineLength(),
		height = this.getHeight(),
		data = this.getData(),
		offset = 0,
		y,
		filterType;

	for (y = 0; y < height; y++) {
		filterType = data.readUInt8(offset); offset++;

		this._reverseNone(data, offset, scanLineLength, y);
		offset += scanLineLength;
	}
};

Filter.prototype._reverseNone = function (data, offset, scanLineLength, y) {
	// Do Nothing
};

Filter.prototype._reverseSub = function (data, offset, scanLineLength, y) {
	var x, filtX, reconA;

	for (x = 0; x < scanLineLength; x++) {
		filtX = data.readUInt8(offset + x);
		reconA = data.readUInt8((x === 0) ? 0 : offset + x - 1);
		data.writeUInt8(Math.abs(filtX - reconA), offset + x);
	}
};

Filter.prototype._reverseUp = function (data, offset, scanLineLength, y) {

};

Filter.prototype._reverseAverage = function (data, offset, scanLineLength, y) {

};

Filter.prototype._reversePaeth = function (data, offset, scanLineLength, y) {

};

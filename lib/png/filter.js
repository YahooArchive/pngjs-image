var Filter = function (width, height, data, bpp) {
	this._width = width;
	this._height = height;
	this._data = data;
	this._bpp = bpp;
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

Filter.prototype.getBytesPerPixel = function () {
	return this._bpp;
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

};

Filter.prototype._reverseNone = function () {

};

Filter.prototype._reverseSub = function () {

};

Filter.prototype._reverseUp = function () {

};

Filter.prototype._reverseAverage = function () {

};

Filter.prototype._reversePaeth = function () {

};

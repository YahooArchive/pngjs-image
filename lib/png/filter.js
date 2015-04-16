var Filter = function (headerChunk, data, offset) {
	this._headerChunk = headerChunk;
	this._data = data;
	this._offset = offset || 0;
};

Filter.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};

Filter.prototype.getData = function () {
	return this._data;
};

Filter.prototype.getOffset = function () {
	return this._offset;
};


Filter.prototype.filter = function (width, height, bytesPerPixel) {
	var input,
		output;

	input = {
		data: this.getData(),
		offset: this.getOffset(),
		previousLineOffset: null,
		width: width,
		height: height,
		bytesPerPixel: bytesPerPixel,
		scanLineLength: width * bytesPerPixel
	};
	output = {
		data: new Buffer((width * height * input.bytesPerPixel) + height), // Add height-times filter-type byte
		offset: 0
	};

	for (var y = 0; y < height; y++) {
		this._filterNone(input, output);
		input.previousLineOffset = input.offset;
		input.offset += input.scanLineLength;
		output.offset += input.scanLineLength + 1;
	}

	return output.data;
};

Filter.prototype._filterNone = function (input, output) {
	output.data[output.offset] = 0;
	input.data.copy(output.data, output.offset + 1, input.offset, input.offset + input.scanLineLength);
};

Filter.prototype._filterSub = function (input, output) {
	output.data[output.offset] = 1;
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			Math.abs(this._getPixel(input, x) - this._getLeftPixel(input, x)),
			output.offset + x + 1
		);
	}
};

Filter.prototype._filterUp = function (input, output) {
	output.data[output.offset] = 2;
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			Math.abs(this._getPixel(input, x) - this._getTopPixel(input, x)),
			output.offset + x + 1
		);
	}
};

Filter.prototype._filterAverage = function (input, output) {
	output.data[output.offset] = 3;
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			Math.abs(this._getPixel(input, x) - Math.floor((this._getLeftPixel(input, x) + this._getTopPixel(input, x)) / 2)),
			output.offset + x + 1
		);
	}
};

Filter.prototype._filterPaeth = function (input, output) {
	output.data[output.offset] = 4;
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			Math.abs(
				this._getPixel(input, x) - this._pathPredictor(
					this._getLeftPixel(input, x),
					this._getTopPixel(input, x),
					this._getTopLeftPixel(input, x)
				)
			),
			output.offset + x + 1
		);
	}
};


Filter.prototype.reverse = function () {
	var headerChunk = this.getHeaderChunk(),
		width = headerChunk.getWidth(),
		height = headerChunk.getHeight(),
		filterType,
		input,
		output,
		filterMapping;

	input = {
		data: this.getData(),
		offset: this.getOffset(),
		previousLineOffset: null,
		width: width,
		height: height,
		bytesPerPixel: headerChunk.getBytesPerPixel(),
		scanLineLength: headerChunk.getScanLineLength()
	};
	output = {
		data: new Buffer(width * height * input.bytesPerPixel),
		offset: 0
	};

	filterMapping = {
		0: this._reverseNone,
		1: this._reverseSub,
		2: this._reverseUp,
		3: this._reverseAverage,
		4: this._reversePaeth
	};

	for (var y = 0; y < height; y++) {

		filterType = input.data.readUInt8(input.offset); input.offset++;
		if ((filterType < 0) || (filterType > 4)) {
			throw new Error('Filter: Unknown filter-type ' + filterType);
		}

		filterMapping[filterType].call(this, input, output);
		output.previousLineOffset = output.offset;
		input.offset += input.scanLineLength;
		output.offset += input.scanLineLength;
	}

	return output.data;
};


Filter.prototype._reverseNone = function (input, output) {
	input.data.copy(output.data, output.offset, input.offset, input.offset + input.scanLineLength);
};

Filter.prototype._reverseSub = function (input, output) {
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			(this._getPixel(input, output, x) + this._getLeftPixel(input, output, x)) & 0xff,
			output.offset + x
		);
	}
};

Filter.prototype._reverseUp = function (input, output) {
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			(this._getPixel(input, output, x) + this._getTopPixel(input, output, x)) & 0xff,
			output.offset + x
		);
	}
};

Filter.prototype._reverseAverage = function (input, output) {
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			(this._getPixel(input, output, x) + Math.floor((this._getLeftPixel(input, output, x) + this._getTopPixel(input, output, x)) / 2)) & 0xff,
			output.offset + x
		);
	}
};

Filter.prototype._reversePaeth = function (input, output) {
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			this._getPixel(input, output, x) + this._pathPredictor(
				this._getLeftPixel(input, output, x),
				this._getTopPixel(input, output, x),
				this._getTopLeftPixel(input, output, x)
			) & 0xff,
			output.offset + x
		);
	}
};


Filter.prototype._pathPredictor = function (left, top, topLeft) {

	var p = left + top - topLeft,
		pLeft = Math.abs(p - left),
		pTop = Math.abs(p - top),
		pTopLeft = Math.abs(p - topLeft);

	if ((pLeft <= pTop) && (pLeft <= pTopLeft)) {
		return left;

	} else if (pTop <= pTopLeft) {
		return top;

	} else {
		return topLeft;
	}
};


Filter.prototype._getPixel = function (input, output, x) {
	return input.data.readUInt8(input.offset + x);
};

Filter.prototype._getLeftPixel = function (input, output, x) {
	if (x < input.bytesPerPixel) {
		return 0;
	} else {
		return output.data.readUInt8(output.offset + x - input.bytesPerPixel);
	}
};

Filter.prototype._getTopPixel = function (input, output, x) {
	if (output.previousLineOffset === null) {
		return 0;
	} else {
		return output.data.readUInt8(output.previousLineOffset + x);
	}
};

Filter.prototype._getTopLeftPixel = function (input, output, x) {
	if ((output.previousLineOffset === null) || (x < input.bytesPerPixel)) {
		return 0;
	} else {
		return output.data.readUInt8(output.previousLineOffset + x - input.bytesPerPixel);
	}
};

module.exports = Filter;

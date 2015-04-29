// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class Filter
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @param {Buffer} data Image data
 * @param {int} [offset=0] Offset within the image data
 * @constructor
 */
var Filter = function (headerChunk, data, offset) {
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
Filter.prototype.getHeaderChunk = function () {
	return this._headerChunk;
};

/**
 * Gets the image data
 *
 * @method getData
 * @return {Buffer}
 */
Filter.prototype.getData = function () {
	return this._data;
};

/**
 * Gets the data offset
 *
 * @method getOffset
 * @return {int}
 */
Filter.prototype.getOffset = function () {
	return this._offset;
};



/**
 * Applies filters to the data
 *
 * @method filter
 * @param {int} width Width of image data
 * @param {int} height Height of image data
 * @param {int} bytesPerPixel Number of bytes per pixel
 */
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
		previousLineOffset: null,
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

/**
 * Applies no filter at all - this is just a pass-through
 *
 * @method _filterNone
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
Filter.prototype._filterNone = function (input, output) {
	output.data[output.offset] = 0;
	input.data.copy(output.data, output.offset + 1, input.offset, input.offset + input.scanLineLength);
};

/**
 * Applies the Sub filter
 *
 * @method _filterSub
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
Filter.prototype._filterSub = function (input, output) {
	output.data[output.offset] = 1;
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			Math.abs(this._getPixel(input, x) - this._getLeftPixel(input, x)),
			output.offset + x + 1
		);
	}
};

/**
 * Applies the Up filter
 *
 * @method _filterUp
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
Filter.prototype._filterUp = function (input, output) {
	output.data[output.offset] = 2;
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			Math.abs(this._getPixel(input, x) - this._getTopPixel(input, x)),
			output.offset + x + 1
		);
	}
};

/**
 * Applies the Average filter
 *
 * @method _filterAverage
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
Filter.prototype._filterAverage = function (input, output) {
	output.data[output.offset] = 3;
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			Math.abs(this._getPixel(input, x) - Math.floor((this._getLeftPixel(input, x) + this._getTopPixel(input, x)) / 2)),
			output.offset + x + 1
		);
	}
};

/**
 * Applies the Paeth filter
 *
 * @method _filterPaeth
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
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


/**
 * Reverses all filters
 *
 * @method reverse
 * @return {Buffer} Reversed data
 */
Filter.prototype.reverse = function () {

	var headerChunk = this.getHeaderChunk(),
		width = headerChunk.getWidth(),
		height = headerChunk.getHeight(),
		filterType,
		input,
		output,
		filterMapping;

	// Prepare input and output data
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
		previousLineOffset: null,
		data: new Buffer(width * height * input.bytesPerPixel),
		offset: 0
	};

	// Reverse mapping for filter-types
	filterMapping = {
		0: this._reverseNone,
		1: this._reverseSub,
		2: this._reverseUp,
		3: this._reverseAverage,
		4: this._reversePaeth
	};

	// Run through all scanlines
	for (var y = 0; y < height; y++) {

		// Determine filter-type
		filterType = input.data.readUInt8(input.offset); input.offset++;
		if ((filterType < 0) || (filterType > 4)) {
			throw new Error('Filter: Unknown filter-type ' + filterType);
		}

		// Reverse per filter-type
		filterMapping[filterType].call(this, input, output);
		output.previousLineOffset = output.offset;
		input.offset += input.scanLineLength;
		output.offset += input.scanLineLength;
	}

	return output.data;
};


/**
 * Reverses nothing at all - this is just a pass-through
 *
 * @method _reverseNone
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
Filter.prototype._reverseNone = function (input, output) {
	input.data.copy(output.data, output.offset, input.offset, input.offset + input.scanLineLength);
};

/**
 * Reverses the Sub filter
 *
 * @method _reverseSub
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
Filter.prototype._reverseSub = function (input, output) {
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			(this._getPixel(input, output, x) + this._getLeftPixel(input, output, x)) & 0xff,
			output.offset + x
		);
	}
};

/**
 * Reverses the Up filter
 *
 * @method _reverseUp
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
Filter.prototype._reverseUp = function (input, output) {
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			(this._getPixel(input, output, x) + this._getTopPixel(input, output, x)) & 0xff,
			output.offset + x
		);
	}
};

/**
 * Reverses the Average filter
 *
 * @method _reverseAverage
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
Filter.prototype._reverseAverage = function (input, output) {
	for (var x = 0; x < input.scanLineLength; x++) {
		output.data.writeUInt8(
			(this._getPixel(input, output, x) + Math.floor((this._getLeftPixel(input, output, x) + this._getTopPixel(input, output, x)) / 2)) & 0xff,
			output.offset + x
		);
	}
};

/**
 * Reverses the Paeth filter
 *
 * @method _reversePaeth
 * @param {object} input Input data
 * @param {object} output Output data
 * @private
 */
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


/**
 * Path-predictor algorithm
 *
 * @method _pathPredictor
 * @param {int} left Left pixel
 * @param {int} top Top pixel
 * @param {int} topLeft Top-left pixel
 * @return {int} Result of algorithm
 * @private
 */
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


/**
 * Gets the current pixel
 *
 * @method _getPixel
 * @param {object} input Input data
 * @param {object} output Output data
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getPixel = function (input, output, x) {
	return input.data.readUInt8(input.offset + x);
};

/**
 * Gets the pixel at the left from the current pixel
 *
 * @method _getLeftPixel
 * @param {object} input Input data
 * @param {object} output Output data
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getLeftPixel = function (input, output, x) {
	if (x < input.bytesPerPixel) {
		return 0;
	} else {
		return output.data.readUInt8(output.offset + x - input.bytesPerPixel);
	}
};

/**
 * Gets the pixel at the top from the current pixel
 *
 * @method _getTopPixel
 * @param {object} input Input data
 * @param {object} output Output data
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getTopPixel = function (input, output, x) {
	if (output.previousLineOffset === null) {
		return 0;
	} else {
		return output.data.readUInt8(output.previousLineOffset + x);
	}
};

/**
 * Gets the pixel at the top-left from the current pixel
 *
 * @method _getTopLeftPixel
 * @param {object} input Input data
 * @param {object} output Output data
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getTopLeftPixel = function (input, output, x) {
	if ((output.previousLineOffset === null) || (x < input.bytesPerPixel)) {
		return 0;
	} else {
		return output.data.readUInt8(output.previousLineOffset + x - input.bytesPerPixel);
	}
};

module.exports = Filter;

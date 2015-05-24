// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Interlace = require('./interlace');

/**
 * @class Filter
 * @module PNG
 * @submodule PNGCore
 * @param {Chunk} headerChunk Header chunk of data stream
 * @constructor
 */
var Filter = function (headerChunk) {
	this._headerChunk = headerChunk;
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
 * Applies filters to the data
 *
 * @method filter
 * @param {Buffer} image
 * @param {int} [offset=0]
 * @return {Buffer}
 */
Filter.prototype.filter = function (image, offset) {
	return this._filter(image, offset);
};

/**
 * Applies filters to the data
 *
 * @method _filter
 * @param {Buffer} image
 * @param {int} [offset=0]
 * @return {Buffer}
 * @private
 */
Filter.prototype._filter = function (image, offset) {

	var input,
		output,
		headerChunk = this.getHeaderChunk(),
		width = headerChunk.getWidth(),
		height = headerChunk.getHeight(),
		bytesPerPixel = headerChunk.getImageBytesPerPixel();

	input = {
		data: image,
		offset: offset || 0,
		previousLineOffset: null,
		width: width,
		height: height,
		bytesPerPixel: bytesPerPixel,
		bytesPerPosition: Math.max(1, bytesPerPixel),
		scanLineLength: width * bytesPerPixel // TODO: Is this right?
	};
	output = {
		previousLineOffset: null,
		data: new Buffer((width * height * input.bytesPerPixel) + height), // Add height-times filter-type byte
		//TODO: Resolution is not right anymore - see decoder
		offset: 0
	};

	for (var y = 0; y < height; y++) {
		//TODO: Find a better way than just use the simplest
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
		output.data[output.offset + x + 1] = Math.abs(this._getPixel(input, x) - this._getLeftPixel(input, x));
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
		output.data[output.offset + x + 1] = Math.abs(this._getPixel(input, x) - this._getTopPixel(input, x));
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
		output.data[output.offset + x + 1] = Math.abs(this._getPixel(input, x) - Math.floor((this._getLeftPixel(input, x) + this._getTopPixel(input, x)) / 2));
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
		output.data[output.offset + x + 1] = Math.abs(
			this._getPixel(input, x) - this._paethPredictor(
				this._getLeftPixel(input, x),
				this._getTopPixel(input, x),
				this._getTopLeftPixel(input, x)
			)
		);
	}
};


/**
 * Reverses all filters
 *
 * @method reverse
 * @param {Buffer} image
 * @param {int} [offset=0]
 * @return {Buffer} Reversed data
 */
Filter.prototype.reverse = function (image, offset) {

	var headerChunk = this.getHeaderChunk(),
		interlace = new Interlace(headerChunk),

		bytesPerPixel = headerChunk.getBytesPerPixel(),
		bytesPerPosition = Math.max(1, bytesPerPixel),

		outputData,
		length = 0,
		info = {};

	// Determine required size of buffer
	interlace.processPasses(function (width, height, scanLineLength) {
		length += scanLineLength * height;
	});

	outputData = new Buffer(length);

	// Process each interlace pass (or only one for non-interlaced images)
	interlace.processPasses(function (width, height, scanLineLength) {

		info = {
			inputData: image,
			inputOffset: info.inputOffset || offset || 0,

			outputData: outputData,
			outputOffset: info.outputOffset || 0,

			bytesPerPosition: bytesPerPosition,

			scanLineLength: scanLineLength,
			scanLines: height,

			previousLineOffset: null
		};

		this._reverse(info);

	}.bind(this));

	return outputData;
};

/**
 * Reverses all filters
 *
 * @method _reverse
 * @param {object} info
 * @private
 */
Filter.prototype._reverse = function (info) {

	var filterType,
		filterMapping;

	// Reverse mapping for filter-types
	filterMapping = {
		0: this._reverseNone,
		1: this._reverseSub,
		2: this._reverseUp,
		3: this._reverseAverage,
		4: this._reversePaeth
	};

	// Run through all scanlines
	for (var y = 0; y < info.scanLines; y++) {

		// Determine filter-type
		filterType = info.inputData[info.inputOffset]; info.inputOffset++;
		if ((filterType < 0) || (filterType > 4)) {
			throw new Error('Filter: Unknown filter-type ' + filterType);
		}

		// Reverse per filter-type
		filterMapping[filterType].call(this, info);

		info.previousLineOffset = info.outputOffset;
		info.inputOffset += info.scanLineLength;
		info.outputOffset += info.scanLineLength;
	}
};


/**
 * Reverses nothing at all - this is just a pass-through
 *
 * @method _reverseNone
 * @param {object} info
 * @private
 */
Filter.prototype._reverseNone = function (info) {
	info.inputData.copy(info.outputData, info.outputOffset, info.inputOffset, info.inputOffset + info.scanLineLength);
};

/**
 * Reverses the Sub filter
 *
 * @method _reverseSub
 * @param {object} info
 * @private
 */
Filter.prototype._reverseSub = function (info) {
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x] = (this._getPixel(info, x) + this._getLeftPixel(info, x)) & 0xff;
	}
};

/**
 * Reverses the Up filter
 *
 * @method _reverseUp
 * @param {object} info
 * @private
 */
Filter.prototype._reverseUp = function (info) {
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x] = (this._getPixel(info, x) + this._getTopPixel(info, x)) & 0xff;
	}
};

/**
 * Reverses the Average filter
 *
 * @method _reverseAverage
 * @param {object} info
 * @private
 */
Filter.prototype._reverseAverage = function (info) {
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x] = (this._getPixel(info, x) + Math.floor((this._getLeftPixel(info, x) + this._getTopPixel(info, x)) / 2)) & 0xff;
	}
};

/**
 * Reverses the Paeth filter
 *
 * @method _reversePaeth
 * @param {object} info
 * @private
 */
Filter.prototype._reversePaeth = function (info) {
	for (var x = 0; x < info.scanLineLength; x++) {
		info.outputData[info.outputOffset + x] =
			this._getPixel(info, x) + this._paethPredictor(
				this._getLeftPixel(info, x),
				this._getTopPixel(info, x),
				this._getTopLeftPixel(info, x)
			) & 0xff;
	}
};


/**
 * Paeth-predictor algorithm
 *
 * @method _paethPredictor
 * @param {int} left Left pixel
 * @param {int} top Top pixel
 * @param {int} topLeft Top-left pixel
 * @return {int} Result of algorithm
 * @private
 */
Filter.prototype._paethPredictor = function (left, top, topLeft) {

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
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getPixel = function (info, x) {
	return info.inputData[info.inputOffset + x];
};

/**
 * Gets the pixel at the left from the current pixel
 *
 * @method _getLeftPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getLeftPixel = function (info, x) {
	return (x < info.bytesPerPosition) ? 0 : info.outputData[info.outputOffset + x - info.bytesPerPosition];
};

/**
 * Gets the pixel at the top from the current pixel
 *
 * @method _getTopPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getTopPixel = function (info, x) {
	return (info.previousLineOffset === null) ? 0: info.outputData[info.previousLineOffset + x];
};

/**
 * Gets the pixel at the top-left from the current pixel
 *
 * @method _getTopLeftPixel
 * @param {object} info
 * @param {int} x X-coordinate in current scanline
 * @return {int}
 * @private
 */
Filter.prototype._getTopLeftPixel = function (info, x) {
	return ((info.previousLineOffset === null) || (x < info.bytesPerPosition)) ? 0 : info.outputData[info.previousLineOffset + x - info.bytesPerPosition];
};

module.exports = Filter;

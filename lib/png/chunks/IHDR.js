// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// IHDR - Image header

var colorTypes = require('../constants').colorTypes;

/**
 * @class IHDR
 * @module PNG
 * @submodule PNGChunks
 */
module.exports = {

	/**
	 * Gets the chunk-type as string
	 *
	 * @method getType
	 * @return {string}
	 */
	getType: function () {
		return 'IHDR';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x49484452;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 0;
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {
		stream.writeUInt32BE(this.getWidth());
		stream.writeUInt32BE(this.getHeight());
		stream.writeUInt8(this.getBitDepth());
		stream.writeUInt8(this.getColorType());
		stream.writeUInt8(this.getCompressionMethod());
		stream.writeUInt8(this.getFilterMethod);
		stream.writeUInt8(this.getInterlaceMethod());
	},

	/**
	 * Decoding of chunk data
	 *
	 * @method decode
	 * @param {BufferedStream} stream Data stream
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should parsing be strict?
	 */
	decode: function (stream, length, strict) {

		// Validation
		if (length !== 13) {
			throw new Error('Invalid length of header. Length: ' + length);
		}

		if (this.getFirstChunk(this.getType(), false) !== null) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		// Read and set values (+ validation)
		this.setWidth(stream.readUInt32BE());
		this.setHeight(stream.readUInt32BE());
		this.setBitDepth(stream.readUInt8());
		this.setColorType(stream.readUInt8());
		this.setCompressionMethod(stream.readUInt8());
		this.setFilterMethod(stream.readUInt8());
		this.setInterlaceMethod(stream.readUInt8());

		// Check bit-depth and color-types combination
		if ((this._colorType === colorTypes.GREY_SCALE) && ([1, 2, 4, 8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for GrayScale images.');
		}
		if ((this._colorType === colorTypes.TRUE_COLOR) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for TrueColor images.');
		}
		if ((this._colorType === colorTypes.INDEXED_COLOR) && ([1, 2, 4, 8].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for Indexed-color images.');
		}
		if ((this._colorType === colorTypes.GREY_SCALE_ALPHA) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for GrayScale with alpha-channel images.');
		}
		if ((this._colorType === colorTypes.TRUE_COLOR_ALPHA) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for TrueColor with alpha-channel images.');
		}
	},


	/**
	 * Gets the width of the image
	 *
	 * @method getWidth
	 * @return {int}
	 */
	getWidth: function () {
		return this._width;
	},

	/**
	 * Sets the width of the image
	 *
	 * @method setWidth
	 * @param {int} width
	 */
	setWidth: function (width) {
		if (width > 0) {
			throw new Error('Width has to be greater than zero.');
		}
		this._width = width;
	},


	/**
	 * Gets the height of the image
	 *
	 * @method getHeight
	 * @return {int}
	 */
	getHeight: function () {
		return this._height;
	},

	/**
	 * Sets the height of the image
	 *
	 * @method setHeight
	 * @param {int} height
	 */
	setHeight: function (height) {
		if (height > 0) {
			throw new Error('Height has to be greater than zero.');
		}
		this._height = height;
	},


	/**
	 * Gets the bit-depth of the image data
	 *
	 * @method getBitDepth
	 * @return {int}
	 */
	getBitDepth: function () {
		return this._bitDepth;
	},

	/**
	 * Sets the bit-depth of the image data
	 *
	 * @method setBitDepth
	 * @param {int} bitDepth
	 */
	setBitDepth: function (bitDepth) {
		if ([1, 2, 4, 8, 16].indexOf(bitDepth) === -1) {
			throw new Error('Unknown bit-depth of ' + bitDepth + '.');
		}
		this._bitDepth = bitDepth;
	},


	/**
	 * Gets the color-type of the image data
	 *
	 * @method getColorType
	 * @return {int}
	 */
	getColorType: function () {
		return this._colorType;
	},

	/**
	 * Sets the color-type of the image data
	 *
	 * @method setColorType
	 * @param {int} colorType
	 */
	setColorType: function (colorType) {
		if ([colorTypes.GREY_SCALE, colorTypes.TRUE_COLOR, colorTypes.INDEXED_COLOR,
				colorTypes.GREY_SCALE_ALPHA, colorTypes.TRUE_COLOR_ALPHA].indexOf(colorType) === -1) {
			throw new Error('Unknown color-type ' + colorType + '.');
		}
		this._colorType = colorType;
	},


	/**
	 * Gets the compression method of the image data
	 *
	 * @method getCompressionMethod
	 * @return {int}
	 */
	getCompressionMethod: function () {
		return this._compressionMethod;
	},

	/**
	 * Sets the compression method of the image data
	 *
	 * @method setCompressionMethod
	 * @param {int} method
	 */
	setCompressionMethod: function (method) {
		if (method !== 0) {
			throw new Error('Unsupported compression method with identifier ' +  method + '.');
		}
		this._compressionMethod = method;
	},


	/**
	 * Gets the filter method of the image data
	 *
	 * @method getFilterMethod
	 * @return {int}
	 */
	getFilterMethod: function () {
		return this._filterMethod;
	},

	/**
	 * Sets the filter method of the image data
	 *
	 * @method setFilterMethod
	 * @param {int} method
	 */
	setFilterMethod: function (method) {
		if (method !== 0) {
			throw new Error('Unsupported filter method with identifier ' +  method + '.');
		}
		this._filterMethod = method;
	},


	/**
	 * Gets the interlace method of the image data
	 *
	 * @method getInterlaceMethod
	 * @return {int}
	 */
	getInterlaceMethod: function () {
		return this._interlaceMethod;
	},

	/**
	 * Sets the interlace method of the image data
	 *
	 * @method setInterlaceMethod
	 * @param {int} method
	 */
	setInterlaceMethod: function (method) {
		if ([0, 1].indexOf(method) === -1) {
			throw new Error('Unsupported interlace method with identifier ' +  method + '.');
		}
		this._interlaceMethod = method;
	},


	/**
	 * Does image have a color palette?
	 *
	 * @method hasPalette
	 * @return {boolean}
	 */
	hasPalette: function () {
		return ((this._colorType & 1) === 1);
	},

	/**
	 * Is image in color?
	 *
	 * @method isColor
	 * @return {boolean}
	 */
	isColor: function () {
		return ((this._colorType & 2) === 2);
	},

	/**
	 * Does image have an alpha-chanel?
	 *
	 * @method hasAlphaChannel
	 * @return {boolean}
	 */
	hasAlphaChannel: function () {
		return ((this._colorType & 4) === 4);
	},


	/**
	 * Determines bytes per pixel
	 *
	 * @method getBytesPerPixel
	 * @return {int}
	 */
	getBytesPerPixel: function () {
		var bitDepth = Math.max(8, this.getBitDepth()); // Lower than 8 will be rounded up
		return (bitDepth / 8) * this.getSamples();
	},

	/**
	 * Gets the number of samples for the color-type
	 *
	 * @method getSamples
	 * @return {int}
	 */
	getSamples: function () {
		return this.hasPalette() ? 1 : (this.isColor() ? 3 : 1) + (this.hasAlphaChannel() ? 1 : 0);
	},

	/**
	 * Gets the sample-depth for the color-type
	 *
	 * @method getSampleDepth
	 * @return {int}
	 */
	getSampleDepth: function () {
		return this.hasPalette() ? 8 : this.getBitDepth();
	},

	/**
	 * Determines the scan-line length
	 *
	 * @method getScanLineLength
	 * @return {int}
	 */
	getScanLineLength: function () {
		return this.getBytesPerPixel() * this.getWidth();
	},

	/**
	 * Gets the size of the image in bytes during edit-mode
	 *
	 * @method getImageSizeInBytes
	 * @return {int}
	 */
	getImageSizeInBytes: function () {
		return this.getWidth() * this.getHeight() * this.getImageBytesPerPixel();
	},

	/**
	 * Gets the number of bytes in a pixel for images in edit-mode
	 *
	 * @method getImageBytesPerPixel
	 * @return {int}
	 */
	getImageBytesPerPixel: function () {
		return 4;
	},


	/**
	 * Is the image of color-type "Grayscale"?
	 *
	 * @method isColorTypeGreyScale
	 * @return {boolean}
	 */
	isColorTypeGreyScale: function () {
		return this.getColorType() === colorTypes.GREY_SCALE;
	},

	/**
	 * Is the image of color-type "True-color"?
	 *
	 * @method isColorTypeTrueColor
	 * @return {boolean}
	 */
	isColorTypeTrueColor: function () {
		return this.getColorType() === colorTypes.TRUE_COLOR;
	},

	/**
	 * Is the image of color-type "Indexed-color"?
	 *
	 * @method isColorTypeIndexedColor
	 * @return {boolean}
	 */
	isColorTypeIndexedColor: function () {
		return this.getColorType() === colorTypes.INDEXED_COLOR;
	},

	/**
	 * Is the image of color-type "Grayscale with alpha channel"?
	 *
	 * @method isColorTypeGreyScaleWithAlpha
	 * @return {boolean}
	 */
	isColorTypeGreyScaleWithAlpha: function () {
		return this.getColorType() === colorTypes.GREY_SCALE_ALPHA;
	},

	/**
	 * Is the image of color-type "True-color with alpha channel"?
	 *
	 * @method isColorTypeTrueColorWithAlpha
	 * @return {boolean}
	 */
	isColorTypeTrueColorWithAlpha: function () {
		return this.getColorType() === colorTypes.TRUE_COLOR_ALPHA;
	}
};

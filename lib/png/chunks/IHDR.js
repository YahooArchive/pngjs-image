// IHDR - Image header

module.exports = {

	/**
	 * Makes sure that all required information is available before decoding
	 *
	 * @method preDecode
	 * @param {Buffer} data Chunk data
	 * @param {int} offset Offset in chunk data
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should decoding be strict?
	 */
	preDecode: function (data, offset, length, strict) {

		if (length !== 13) {
			throw new Error('Invalid length of header. Length: ' + length);
		}

		if (this.getFirstChunk(this.getType(), false) !== null) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}
	},

	/**
	 * Decoding of chunk data
	 *
	 * @method decode
	 * @param {Buffer} data Chunk data
	 * @param {int} offset Offset in chunk data
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should decoding be strict?
	 */
	decode: function (data, offset, length, strict) {
		var position = offset;

		this._width = data.readUInt32BE(position); position += 4;
		this._height = data.readUInt32BE(position); position += 4;
		this._bitDepth = data[position]; position++; // 8
		this._colorType = data[position]; position++; // 6
		this._compressionMethod = data[position]; position++; // 0
		this._filterMethod = data[position]; position++; // 0
		this._interlaceMethod = data[position]; // 0
	},

	/**
	 * Validates all decoded data
	 *
	 * @method postDecode
	 * @param {Buffer} data Chunk data
	 * @param {int} offset Offset in chunk data
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should decoding be strict?
	 */
	postDecode: function (data, offset, length, strict) {

		// Check valid width and height
		if (this._width === 0) {
			throw new Error('Header error: Width cannot be zero.');
		}
		if (this._height === 0) {
			throw new Error('Header error: Height cannot be zero.');
		}

		// Check valid bit-depths
		if ([1, 2, 4, 8, 16].indexOf(this._bitDepth) === -1) {
			throw new Error('Header error: Unknown bit-depth of ' + this._bitDepth + '.');
		}

		// Check valid color-types
		if ([0, 2, 3, 4, 6].indexOf(this._colorType) === -1) {
			throw new Error('Header error: Unknown color-type ' + this._colorType + '.');
		}

		// Check bit-depth and color-types
		if ((this._colorType === 0) && ([1, 2, 4, 8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for GrayScale images.');
		}
		if ((this._colorType === 2) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for TrueColor images.');
		}
		if ((this._colorType === 3) && ([1, 2, 4, 8].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for Indexed-color images.');
		}
		if ((this._colorType === 4) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for GrayScale with alpha-channel images.');
		}
		if ((this._colorType === 6) && ([8, 16].indexOf(this._bitDepth) === -1)) {
			throw new Error('Header error: Unsupported bit-depth for TrueColor with alpha-channel images.');
		}

		// Check valid compression method
		if (this._compressionMethod !== 0) {
			throw new Error('Header error: Unsupported compression method with identifier ' +  this._compressionMethod + '.');
		}

		// Check valid filter method
		if (this._filterMethod !== 0) {
			throw new Error('Header error: Unsupported filter method with identifier ' +  this._filterMethod + '.');
		}

		// Check valid interlace method
		if ([0, 1].indexOf(this._interlaceMethod) === -1) {
			throw new Error('Header error: Unsupported interlace method with identifier ' +  this._interlaceMethod + '.');
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
	 * Gets the height of the image
	 *
	 * @method getHeight
	 * @return {int}
	 */
	getHeight: function () {
		return this._height;
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
	 * Gets the color-type of the image data
	 *
	 * @method getColorType
	 * @return {int}
	 */
	getColorType: function () {
		return this._colorType;
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
	 * Gets the filter method of the image data
	 *
	 * @method getFilterMethod
	 * @return {int}
	 */
	getFilterMethod: function () {
		return this._filterMethod;
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
		var bitDepth = Math.max(8, this._bitDepth), // Lower than 8 will be rounded up
			result;

		switch (this._colorType) {
			case 0:
				result = bitDepth;
				break;

			case 2:
				result = bitDepth * 3;
				break;

			case 3:
				result = bitDepth;
				break;

			case 4:
				result = bitDepth * 2;
				break;

			case 6:
				result = bitDepth * 4;
				break;
		}

		return result;
	},

	/**
	 * Determines the scan-line length
	 */
	getScanLineLength: function () {

	}
};

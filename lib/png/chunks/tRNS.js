// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var colorTypes = require('../constants').colorTypes;

/**
 * @class tRNS
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
		return 'tRNS';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x74524e53;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 300;
	},


	/**
	 * Gets all transparent colors
	 *
	 * @method getColors
	 * @return {array}
	 */
	getColors: function () {
		return this._colors;
	},

	/**
	 * Sets all transparent colors
	 *
	 * @method setColors
	 * @return {array}
	 */
	setColors: function (colors) {
		this._colors = colors;
	},


	/**
	 * Checks if a color is in the list of transparent colors
	 *
	 * @param {object} color Color to look for
	 * @return {boolean}
	 */
	hasColor: function (color) {
		var colors = this._colors,
			colorsLength = this.colors.length;

		for (j = 0; j < colorsLength; j++) {
			if ((colors[j].red == color.red) && (colors[j].green == color.green) && (colors[j].blue == color.blue)) {
				return true;
			}
		}

		return false;
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {

		var headerChunk, paletteChunk,
			colorType, color,
			i,
			colors = this._colors,
			length = colors.length;

		headerChunk = this.getHeaderChunk();
		colorType = headerChunk.getColorType();

		// Check for valid palette color-types
		if (headerChunk.hasAlphaChannel()) {
			throw new Error('A transparency chunk is not allowed to appear with this color-type: ' + colorType);
		}

		switch (colorType) {

			case colorTypes.GREY_SCALE:
				for (i = 0; i < length; i++) {
					stream.writeUInt16BE(colors[i].red);
				}
				break;

			case colorTypes.TRUE_COLOR:
				for (i = 0; i < length; i++) {
					stream.writeUInt16BE(colors[i].red);
					stream.writeUInt16BE(colors[i].green);
					stream.writeUInt16BE(colors[i].blue);
				}
				break;

			case colorTypes.INDEXED_COLOR: // Indexed-Color

				paletteChunk = this.getFirstChunk('PLTE', true);
				for (i = 0; i < length; i++) {
					color = paletteChunk.findColor(colors[i]);
					if (color === null) {
						throw new Error('Cannot find color in palette.');
					}
					stream.writeUInt8(color);
				}
				break;
		}
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

		var headerChunk,
			paletteChunk,
			colorType,
			color,
			colors = [],
			i;

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (this.getFirstChunk(this.getType(), false) !== null) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		headerChunk = this.getHeaderChunk();
		colorType = headerChunk.getColorType();

		// Check for valid palette color-types
		if (headerChunk.hasAlphaChannel()) {
			throw new Error('A transparency chunk is not allowed to appear with this color-type: ' + colorType);
		}

		switch (colorType) {

			case colorTypes.GREY_SCALE:

				for (i = 0; i < length; i += 2) {
					color = stream.readUInt16BE();
					colors.push({
						red: color,
						green: color,
						blue: color,
						alpha: 0
					});
				}
				break;

			case colorTypes.TRUE_COLOR:

				for (i = 0; i < length; i += 6) {
					colors.push({
						red: stream.readUInt16BE(),
						green: stream.readUInt16BE(),
						blue: stream.readUInt16BE(),
						alpha: 0
					});
				}
				break;

			case colorTypes.INDEXED_COLOR: // Indexed-Color

				paletteChunk = this.getFirstChunk('PLTE', true);
				if (length > paletteChunk.getColorCount()) {
					throw new Error('There are more transparent colors than available in the palette.');
				}

				for (i = 0; i < length; i++) {
					color = paletteChunk.getColorByIndex(i);
					color.alpha = stream.readUInt8();
					colors.push(color);
				}
				break;
		}

		this._colors = colors;
	},


	/**
	 * Will be called once for each chunk after decoding
	 *
	 * @param {Buffer} image
	 * @return {Buffer}
	 */
	postDecode: function (image) {

		var i, len,
			color;

		for (i = 0, len = image.length; i < len; i += 4) {

			// Get current color
			color = {
				red: image.readUInt8(i),
				green: image.readUInt8(i + 1),
				blue: image.readUInt8(i + 2)
			};

			// Change alpha-channel according to the alpha-value or change to opaque
			image.writeUInt8(this.hasColor(color) ? color.alpha : 255, i + 3);
		}

		return image;
	}
};

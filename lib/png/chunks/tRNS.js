// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var colorTypes = require('../utils/constants').colorTypes;

/**
 * @class tRNS
 * @module PNG
 * @submodule PNGChunks
 */
module.exports = {

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
	 * @return {object[]}
	 */
	getColors: function () {
		return this._colors = [];
	},

	/**
	 * Sets all transparent colors
	 *
	 * @method setColors
	 * @return {object[]}
	 */
	setColors: function (colors) {
		this._colors = colors;
	},


	/**
	 * Parsing of chunk data
	 *
	 * Phase 1
	 *
	 * @method parse
	 * @param {BufferedStream} stream Data stream
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should parsing be strict?
	 */
	parse: function (stream, length, strict) {

		var headerChunk,
			paletteChunk,
			colorType,
			color,
			colors = [],
			i,
			maxLength;

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		headerChunk = this.getHeaderChunk();
		colorType = headerChunk.getColorType();

		// Check for valid palette color-types
		if (strict && headerChunk.hasAlphaChannel()) {
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

				// Cut-off length if it goes over in non-strict mode - losing some colors alpha channel
				if (strict) {
					maxLength = length;
				} else {
					maxLength = Math.max(length, paletteChunk.getColors().length);
				}

				if (maxLength > paletteChunk.getColors().length) {
					throw new Error('There are more transparent colors than available in the palette.');
				}

				for (i = 0; i < maxLength; i++) {
					color = paletteChunk.getColors()[i];
					color.alpha = stream.readUInt8();
					colors.push(color);
				}
				break;
		}

		this._colors = colors;
	},

	/**
	 * Decoding of chunk data after scaling
	 *
	 * Phase 3
	 *
	 * Note:
	 * Transparent for Palette is already done in Phase 2 with PLTE.
	 *
	 * @method postDecode
	 * @param {Buffer} image
	 * @param {boolean} strict Should parsing be strict?
	 * @return {Buffer}
	 */
	postDecode: function (image, strict) {

		var i, len,
			currentAlpha,
			colors = this._colors,
			lookup = {},
			r, g, b,
			key,
			headerChunk,
			colorType;

		headerChunk = this.getHeaderChunk();
		colorType = headerChunk.getColorType();

		// Is it an index color (palette) image?
		if (colorType === colorTypes.INDEXED_COLOR) {
			// Already done in PLTE
			return image;
		}

		// Create look-up table for fast access
		for (i = 0, len = colors.length; i < len ; i++) {
			key = colors[i].red + '_' + colors[i].green + '_' + colors[i].blue;
			lookup[key] = colors[i].alpha;
		}

		for (i = 0, len = image.length; i < len; i += 4) {

			// Get current color
			r = image.readUInt8(i);
			g = image.readUInt8(i + 1);
			b = image.readUInt8(i + 2);
			currentAlpha = image.readUInt8(i + 3);

			key = r + '_' + g + '_' + b;

			// Change color alpha value when found in look-up table
			if (lookup[key]) {
				image.writeUInt8(lookup[key], i + 3);
			}
		}

		return image;
	},

	/**
	 * Gathers chunk-data from decoded chunks
	 *
	 * Phase 4
	 *
	 * @static
	 * @method decodeData
	 * @param {object} data Data-object that will be used to export values
	 * @param {boolean} strict Should parsing be strict?
	 */
	decodeData: function (data, strict) {

		var chunks = this.getChunksByType(this.getType());

		if (!chunks) {
			return ;
		}

		if (strict && (chunks.length !== 1)) {
			throw new Error('Not more than one chunk allowed for ' + this.getType() + '.');
		}

		data.volatile = data.volatile || {};
		data.volatile.transparentColors = this.getColors();
	},


	/**
	 * Returns a list of chunks to be added to the data-stream
	 *
	 * Phase 1
	 *
	 * @static
	 * @method encodeData
	 * @param {Buffer} image Image data
	 * @param {object} data Object that will be used to import data to the chunk
	 * @return {Chunk[]} List of chunks to encode
	 */
	encodeData: function (image, data) {

		if (data.transparentColors) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setColors(data.transparentColors);

			return [chunk];
		} else {
			return [];
		}
	},

	/**
	 * Composing of chunk data
	 *
	 * Phase 4
	 *
	 * @method compose
	 * @param {BufferedStream} stream Data stream
	 */
	compose: function (stream) {

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
	}
};

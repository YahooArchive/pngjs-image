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
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {
		//TODO
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
						blue: color
					});
				}
				break;

			case colorTypes.TRUE_COLOR:

				for (i = 0; i < length; i += 6) {
					colors.push({
						red: stream.readUInt16BE(),
						green: stream.readUInt16BE(),
						blue: stream.readUInt16BE()
					});
				}
				break;

			case colorTypes.INDEXED_COLOR: // Indexed-Color

				paletteChunk = this.getFirstChunk('PLTE', true);
				for (i = 0; i < length; i++) {
					color = stream.readUInt8();
					colors.push(paletteChunk.getColorByIndex(color));
				}
				break;
		}

		this._colors = colors;
	},




	/**
	 * Processes image data after reading
	 *
	 * @method processInput
	 * @param {Buffer} image Image data
	 * @param {int} imageOffset Offset in image data
	 */
	processInput: function (image, imageOffset) {

		var headerChunk,
			colorType,
			i, j,
			r, g, b, c,
			colors = this._colors,
			colorsLength = colors.length,
			paletteChunk;

		headerChunk = this.getHeaderChunk();
		colorType = headerChunk.getColorType();
		switch (colorType) {

			case colorTypes.GREY_SCALE:

				for (i = 0; i < length; i += 4) {

					c = image.readUInt8(imageOffset + i);

					for (j = 0; j < colorsLength; j++) {
						if (colors[j] == c) {
							image.writeUInt8(0, imageOffset + i + 3);
						}
					}
				}
				break;

			case colorTypes.TRUE_COLOR:

				for (i = 0; i < length; i += 4) {

					r = image.readUInt8(imageOffset + i);
					g = image.readUInt8(imageOffset + i + 1);
					b = image.readUInt8(imageOffset + i + 2);

					for (j = 0; j < colorsLength; j++) {
						if ((colors[j].r == r) && (colors[j].g == g) && (colors[j].b == b)) {
							image.writeUInt8(0, imageOffset + i + 3);
						}
					}

					colors.push({
						r: data.readUInt16BE(offset + i),
						g: data.readUInt16BE(offset + i + 1),
						b: data.readUInt16BE(offset + i + 2)
					});
				}
				break;

			case colorTypes.INDEXED_COLOR: // Indexed-Color

				paletteChunk = this.getChunksByType('PLTE', true);

				throw new Error('Not supported yet.');
				//TODO

				for (i = 0; i < length; i += 4) {

				}
				break;
		}
	}
};

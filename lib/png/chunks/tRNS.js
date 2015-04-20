

var colorTypes = require('../constants').colorTypes;

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

		var headerChunk;

		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (this.getFirstChunk(this.getType(), false) !== null) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		headerChunk = this.getHeaderChunk();

		// Check for valid palette color-types
		if (headerChunk.hasAlphaChannel()) {
			throw new Error('A transparency chunk is not allowed to appear with this color-type: ' + headerChunk.getColorType());
		}
	},

	/**
	 * Decoding of chunk data
	 *
	 * @method decode
	 * @param {Buffer} data Chunk data
	 * @param {int} offset Offset in chunk data
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should parsing be strict?
	 */
	decode: function (data, offset, length, strict) {
		var colorType = this.getHeaderChunk().getColorType(),
			colors = [],
			i;

		switch (colorType) {

			case colorTypes.GREY_SCALE:
				for (i = 0; i < length; i += 2) {
					colors.push(data.readUInt16BE(offset + i));
				}
				break;

			case colorTypes.TRUE_COLOR:
				for (i = 0; i < length; i += 6) {
					colors.push({
						r: data.readUInt16BE(offset + i),
						g: data.readUInt16BE(offset + i + 1),
						b: data.readUInt16BE(offset + i + 2)
					});
				}
				break;

			case colorTypes.INDEX_COLOR: // Indexed-Color
				// Alpha for each palette index
				for (i = 0; i < length; i++) {
					colors.push(data.readUInt8(offset + i));
				}
				break;
		}

		this._colors = colors;
	},

	/**
	 * Get all colors
	 * @returns {Array|*}
	 */
	getColors: function () {
		return this._colors;
	},


	/**
	 * Processes image data after reading
	 *
	 * @method processInput
	 * @param {Buffer} image Image data
	 * @param {int} imageOffset Offset in image data
	 */
	processInput: function (image, imageOffset) {

		var colorType = this.getHeaderChunk().getColorType(),
			i, j,
			r, g, b, c,
			colors = this._colors,
			colorsLength = colors.length,
			paletteChunk;

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

			case colorTypes.INDEX_COLOR: // Indexed-Color

				paletteChunk = this.getChunksByType('PLTE', true);

				throw new Error('Not supported yet.');
				//TODO

				for (i = 0; i < length; i += 4) {

				}
				break;
		}


	}
};

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
		if ([4, 6].indexOf(headerChunk.getColorType())) {
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

			case 0: // Gray-Scale
				for (i = 0; i < length; i += 2) {
					colors.push(data.readUInt16BE(offset + i));
				}
				break;

			case 2: // True-Color
				for (i = 0; i < length; i += 6) {
					colors.push({
						r: data.readUInt16BE(offset + i),
						g: data.readUInt16BE(offset + i + 1),
						b: data.readUInt16BE(offset + i + 2)
					});
				}
				break;

			case 3: // Indexed-Color
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
	}
};

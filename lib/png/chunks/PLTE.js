// PLTE - Palette

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

		// Palette length should be divisible by three (each of r, g, b has one byte)
		if ((length % 3) !== 0) {
			throw new Error('Palette length should be a multiple of 3. Length: ' + length);
		}

		headerChunk = this.getHeaderChunk();

		// Check for valid palette color-types
		if ([0, 4].indexOf(headerChunk.getColorType())) {
			throw new Error('Palette is not allowed to appear with this color-type: ' + headerChunk.getColorType());
		}

		// Make sure palette is big enough
		if (Math.pow(2, headerChunk.getBitDepth()) > (length / 3)) {
			throw new Error('Bit-depth greater than the size of the palette.');
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
		this._palette = new Buffer(length);
		data.copy(this._palette, 0, offset, length);
	},


	/**
	 * Gets the color at
	 * @param index
	 * @returns {{r: *, g: *, b: *}}
	 */
	getColor: function (index) {
		var internalIndex = index * 3,
			data = this._palette;

		if (internalIndex + 3 > this._palette.length) {
			throw new Error('Palette index of ' + index + ' is out of bounds.');
		}

		return {
			r: data.readUInt8(internalIndex),
			g: data.readUInt8(internalIndex + 1),
			b: data.readUInt8(internalIndex + 2)
		}
	}
};

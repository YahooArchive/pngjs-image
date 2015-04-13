// IDAT - Image data

module.exports = {

	/**
	 * Makes sure that all required information is available before parsing
	 *
	 * @method preDecode
	 * @param {Buffer} data Chunk data
	 * @param {int} offset Offset in chunk data
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should decoding be strict?
	 */
	preDecode: function (data, offset, length, strict) {

		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
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
		this._blob = new Buffer(length);
		data.copy(this._blob, 0, offset, length);
	},

	getBlob: function () {
		return this._blob;
	}
};

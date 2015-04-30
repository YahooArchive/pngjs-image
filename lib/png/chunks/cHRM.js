// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class cHRM
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
		return 'cHRM';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x6348524d;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 200;
	},


	/**
	 * Gets the white-point x value
	 *
	 * @method getWhitePointX
	 * @return {float}
	 */
	getWhitePointX: function () {
		return this._whitePointX || 1;
	},

	/**
	 * Sets the white-point x value
	 *
	 * @method setWhitePointX
	 * @param {float} value
	 */
	setWhitePointX: function (value) {
		this._whitePointX = value;
	},


	/**
	 * Gets the white-point y value
	 *
	 * @method getWhitePointY
	 * @return {float}
	 */
	getWhitePointY: function () {
		return this._whitePointY || 1;
	},

	/**
	 * Sets the white-point y value
	 *
	 * @method setWhitePointY
	 * @param {float} value
	 */
	setWhitePointY: function (value) {
		this._whitePointY = value;
	},


	/**
	 * Gets the red x value
	 *
	 * @method getRedX
	 * @return {float}
	 */
	getRedX: function () {
		return this._redX || 1;
	},

	/**
	 * Sets the red x value
	 *
	 * @method setRedX
	 * @param {float} value
	 */
	setRedX: function (value) {
		this._redX = value;
	},


	/**
	 * Gets the red y value
	 *
	 * @method getRedY
	 * @return {float}
	 */
	getRedY: function () {
		return this._redY || 1;
	},

	/**
	 * Sets the red y value
	 *
	 * @method setRedY
	 * @param {float} value
	 */
	setRedY: function (value) {
		this._redY = value;
	},


	/**
	 * Gets the green x value
	 *
	 * @method getGreenX
	 * @return {float}
	 */
	getGreenX: function () {
		return this._greenX || 1;
	},

	/**
	 * Sets the green x value
	 *
	 * @method setGreenX
	 * @param {float} value
	 */
	setGreenX: function (value) {
		this._greenX = value;
	},


	/**
	 * Gets the green y value
	 *
	 * @method getGreenY
	 * @return {float}
	 */
	getGreenY: function () {
		return this._greenY || 1;
	},

	/**
	 * Sets the green y value
	 *
	 * @method setGreenY
	 * @param {float} value
	 */
	setGreenY: function (value) {
		this._greenY = value;
	},


	/**
	 * Gets the blue x value
	 *
	 * @method getBlueX
	 * @return {float}
	 */
	getBlueX: function () {
		return this._blueX || 1;
	},

	/**
	 * Sets the blue x value
	 *
	 * @method setBlueX
	 * @param {float} value
	 */
	setBlueX: function (value) {
		this._blueX = value;
	},


	/**
	 * Gets the blue y value
	 *
	 * @method getBlueY
	 * @return {float}
	 */
	getBlueY: function () {
		return this._blueY || 1;
	},

	/**
	 * Sets the blue y value
	 *
	 * @method setBlueY
	 * @param {float} value
	 */
	setBlueY: function (value) {
		this._blueY = value;
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {
		stream.writeUInt32BE(this.getWhitePointX() * 100000);
		stream.writeUInt32BE(this.getWhitePointY() * 100000);
		stream.writeUInt32BE(this.getRedX() * 100000);
		stream.writeUInt32BE(this.getRedY() * 100000);
		stream.writeUInt32BE(this.getGreenX() * 100000);
		stream.writeUInt32BE(this.getGreenY() * 100000);
		stream.writeUInt32BE(this.getBlueX() * 100000);
		stream.writeUInt32BE(this.getBlueY() * 100000);
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
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (this.getFirstChunk(this.getType(), false) !== null) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		if (length != 32) {
			throw new Error('The ' + this.getType() + ' chunk requires a length of 32 but got ' + length + '.');
		}

		this.setWhitePointX(stream.readUInt32BE() / 100000);
		this.setWhitePointY(stream.readUInt32BE() / 100000);
		this.setRedX(stream.readUInt32BE() / 100000);
		this.setRedY(stream.readUInt32BE() / 100000);
		this.setGreenX(stream.readUInt32BE() / 100000);
		this.setGreenY(stream.readUInt32BE() / 100000);
		this.setBlueX(stream.readUInt32BE() / 100000);
		this.setBlueY(stream.readUInt32BE() / 100000);
	}
};

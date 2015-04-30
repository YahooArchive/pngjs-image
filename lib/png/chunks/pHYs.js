// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var constants = require('../constants');

/**
 * @class pHYs
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
		return 'pHYs';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x70485973;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 140;
	},


	/**
	 * Gets the horizontal number of pixel per unit
	 *
	 * @method getXPixelPerUnit
	 * @return {int}
	 */
	getXPixelPerUnit: function () {
		return this._xPPU || 1;
	},

	/**
	 * Sets the horizontal number of pixel per unit
	 *
	 * @method setXPixelPerUnit
	 * @param {int} ppu Pixel per unit
	 */
	setXPixelPerUnit: function (ppu) {
		this._xPPU = ppu;
	},


	/**
	 * Gets the vertical number of pixel per unit
	 *
	 * @method getYPixelPerUnit
	 * @return {int}
	 */
	getYPixelPerUnit: function () {
		return this._yPPU || 1;
	},

	/**
	 * Sets the vertical number of pixel per unit
	 *
	 * @method setYPixelPerUnit
	 * @param {int} ppu Pixel per unit
	 */
	setYPixelPerUnit: function (ppu) {
		this._yPPU = ppu;
	},


	/**
	 * Gets the unit identifier
	 *
	 * @method getUnit
	 * @return {int}
	 */
	getUnit: function () {
		return this._unit || 0;
	},

	/**
	 * Sets the unit identifier
	 *
	 * @method setUnit
	 * @param {int} unit Unit identifier
	 */
	setUnit: function (unit) {
		if ([constants.units.UNKNOWN, constants.units.METER].indexOf(unit) === -1) {
			throw new Error('Unit identifier ' + unit + ' is not valid.');
		}
		this._unit = unit;
	},


	/**
	 * Is unit unknown?
	 *
	 * @method isUnitUnknown
	 * @return {boolean}
	 */
	isUnitUnknown: function () {
		return (this._unit === constants.units.UNKNOWN);
	},

	/**
	 * Is unit in meter?
	 *
	 * @method isUnitInMeter
	 * @return {boolean}
	 */
	isUnitInMeter: function () {
		return (this._unit === constants.units.METER);
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {
		stream.writeUInt32BE(this.getXPixelPerUnit());
		stream.writeUInt32BE(this.getYPixelPerUnit());
		stream.writeUInt8(this.getUnit());
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

		this.setXPixelPerUnit(stream.readUInt32BE());
		this.setYPixelPerUnit(stream.readUInt32BE());
		this.setUnit(stream.readUInt8());
	}
};

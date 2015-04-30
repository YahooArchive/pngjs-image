// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var constants = require('../constants');

/**
 * @class sRGB
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
		return 'sRGB';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x73524742;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 170;
	},


	/**
	 * Gets the rendering intent identifier
	 *
	 * @method getRenderingIntent
	 * @return {int}
	 */
	getRenderingIntent: function () {
		return this._intent || constants.intents.PERCEPTUAL;
	},

	/**
	 * Sets the rendering intent identifier
	 *
	 * @method setRenderingIntent
	 * @param {int} intent
	 */
	setRenderingIntent: function (intent) {
		var intents = constants.intents;

		if ([intents.PERCEPTUAL, intents.RELATIVE_COLORIMETRIC, intents.SATURATION, intents.ABSOLUTE_COLORIMETRIC].indexOf(intent) === -1) {
			throw new Error('Unsupported rendering intent with identifier ' + intent + '.');
		}

		this._intent = intent;
	},


	/**
	 * Is the rendering intent perceptual?
	 *
	 * @method isPerceptual
	 * @return {boolean}
	 */
	isPerceptual: function () {
		return (this.getRenderingIntent() === constants.intents.PERCEPTUAL);
	},

	/**
	 * Is the rendering intent relative colorimetric?
	 *
	 * @method isRelativeColorimetric
	 * @return {boolean}
	 */
	isRelativeColorimetric: function () {
		return (this.getRenderingIntent() === constants.intents.RELATIVE_COLORIMETRIC);
	},

	/**
	 * Is the rendering intent saturation?
	 *
	 * @method isSaturation
	 * @return {boolean}
	 */
	isSaturation: function () {
		return (this.getRenderingIntent() === constants.intents.SATURATION);
	},

	/**
	 * Is the rendering intent absolute colorimetric?
	 *
	 * @method isAbsoluteColorimetric
	 * @return {boolean}
	 */
	isAbsoluteColorimetric: function () {
		return (this.getRenderingIntent() === constants.intents.ABSOLUTE_COLORIMETRIC);
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {
		stream.writeUInt8(this.getRenderingIntent());
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

		this.setRenderingIntent(stream.readUInt8());
	}
};

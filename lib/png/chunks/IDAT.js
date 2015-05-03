// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// IDAT - Image data

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class IDAT
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
		return 'IDAT';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x49444154;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 500;
	},


	/**
	 * Gets the data stream
	 *
	 * @method getStream
	 * @return {BufferedStream}
	 */
	getStream: function () {
		if (!this._stream) {
			this._stream = new BufferedStream();
		}
		return this._stream;
	},

	/**
	 * Sets a buffer for the data
	 *
	 * @method setBuffer
	 * @param {Buffer} buffer
	 */
	setBuffer: function (buffer) {
		this._stream = new BufferedStream(buffer, false);
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream
	 */
	encode: function (stream) {
		stream.writeBufferedStream(this.getStream());
	},

	/**
	 * Parsing of chunk data
	 *
	 * @method parse
	 * @param {BufferedStream} stream Data stream
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should parsing be strict?
	 */
	parse: function (stream, length, strict) {

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		// Copy data to local
		this._stream = stream.slice(0, length);
	}
};

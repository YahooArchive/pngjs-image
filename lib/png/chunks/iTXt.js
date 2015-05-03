// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class iTXt
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
		return 'iTXt';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x69545874;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 130;
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {
		throw new Error('Not implemented!');
		//TODO
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

		// TODO
		throw new Error('Not implemented!');
	},


	/**
	 * Returns a list of chunks to be added to the data-stream
	 *
	 * @method encodeData
	 * @param {Buffer} image Image data
	 * @param {object} data Object that will be used to import data to the chunk
	 * @return {Chunk[]} List of chunks to encode
	 */
	encodeData: function (image, data) {
		//TODO
		return [];
	},

	/**
	 * Gathers chunk-data from decoded chunks
	 *
	 * @method decodeData
	 * @param {object} data Data-object that will be used to export values
	 * @param {boolean} strict Should parsing be strict?
	 */
	decodeData: function (data, strict) {
		//TODO
	}
};

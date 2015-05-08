// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// zzZz - Default chunk - When unknown

var BufferedStream = require('../utils/bufferedStream');

/**
 * @class zzZz
 * @module PNG
 * @submodule PNGChunks
 */
module.exports = {

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 900;
	},


	/**
	 * Gets the data stream
	 *
	 * @method getStream
	 * @return {BufferedStream}
	 */
	getStream: function () {
		if (!this._stream) {
			this._stream = new BufferedStream(null, null, 0);
		}
		return this._stream;
	},


	/**
	 * Parsing of chunk data
	 *
	 * Phase 1
	 *
	 * @method parse
	 * @param {BufferedStream} stream Data stream
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should parsing be strict?
	 */
	parse: function (stream, length, strict) {
		// Simply copy the data to a local stream - may be someone else need it
		this._stream = stream.slice(0, length);
	},

	/**
	 * Gathers chunk-data from decoded chunks
	 *
	 * Phase 4
	 *
	 * @static
	 * @method decodeData
	 * @param {object} data Data-object that will be used to export values
	 * @param {boolean} strict Should parsing be strict?
	 */
	decodeData: function (data, strict) {

		var chunks = this.getChunksByType(this.getType()),
			unknown = [], volatile = [];

		if (!chunks) {
			return ;
		}

		chunks.forEach(function (chunk) {

			// Is safe to copy?
			if (chunk.isSafe()) {
				// Then remember them for the save
				unknown.push(chunk);

			} else { // Unsafe?
				// Then keep them around, but in the volatile bucket
				volatile.push(chunk);
			}
		});

		data.unknownChunks = unknown;
		data.volatile = data.volatile || {};
		data.volatile.unknownChunks = volatile;
	},


	/**
	 * Returns a list of chunks to be added to the data-stream
	 *
	 * Phase 1
	 *
	 * @static
	 * @method encodeData
	 * @param {Buffer} image Image data
	 * @param {object} data Object that will be used to import data to the chunk
	 * @return {Chunk[]} List of chunks to encode
	 */
	encodeData: function (image, data) {
		return data.unknownChunks || [];
	},

	/**
	 * Composing of chunk data
	 *
	 * Phase 4
	 *
	 * @method compose
	 * @param {BufferedStream} stream Data stream
	 */
	compose: function (stream) {
		stream.writeBufferedStream(this.getStream());
	}
};

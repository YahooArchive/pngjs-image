// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class chunkUtils
 * @module PNG
 * @submodule PNGCore
 */
module.exports = {

	getChunks: function () {
		return this._chunks;
	},

	clearChunksByType: function (type) {
		if (this.hasChunksByType(type)) {
			this.getChunks()[type] = [];
		}
	},

	getChunksByType: function (type, required) {
		var chunks = this.getChunks();

		if (chunks[type] && chunks[type].length > 0) {
			return chunks[type];
		} else if (required) {
			throw new Error('Could not retrieve header chunk.');
		} else {
			return null;
		}
	},

	hasChunksByType: function (type) {
		return (this.getChunksByType(type, false) !== null);
	},

	getFirstChunk: function (type, required) {
		var chunks = this.getChunksByType(type, required);

		if (!required && chunks == null) {
			return null;
		} else {
			return chunks[0];
		}
	},

	getHeaderChunk: function () {
		return this.getFirstChunk('IHDR', true);
	}
};

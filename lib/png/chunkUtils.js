module.exports = {

	getChunks: function () {
		return this._chunks;
	},

	getChunksByType: function (type, required) {
		var chunks = this.getChunks();

		if (chunks[type]) {
			return chunks[type];
		} else if (required) {
			throw new Error('Could not retrieve header chunk.');
		} else {
			return null;
		}
	},

	getFirstChunk: function (type, required) {
		var chunks = this.getChunksByType(type, required);

		if (chunks && chunks.length > 0) {
			return chunks[0];
		} else if (required) {
			throw new Error('Could not retrieve header chunk.');
		} else {
			return null;
		}
	},

	getHeaderChunk: function () {
		return this.getFirstChunk('IHDR', true);
	}
};

// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class tIME
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
		return 'tIME';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x74494d45;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 100;
	},


	/**
	 * Gets the date
	 *
	 * @method getDate
	 * @return {Date}
	 */
	getDate: function () {
		return this._date || new Date();
	},

	/**
	 * Sets the date
	 *
	 * @method setDate
	 * @param {Date} date
	 */
	setDate: function (date) {
		this._date = date;
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {

		var date = this.getDate();

		stream.writeUInt16BE(date.getUTCFullYear());
		stream.writeUInt8(date.getUTCMonth() + 1);
		stream.writeUInt8(date.getUTCDate());
		stream.writeUInt8(date.getUTCHours());
		stream.writeUInt8(date.getUTCMinutes());
		stream.writeUInt8(date.getUTCSeconds());
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

		var year, month, day, hour, minute, second;

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (this.getFirstChunk(this.getType(), false) !== null) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		if (length != 7) {
			throw new Error('The length of the ' + this.getType() + ' chunk should be 7 but is ' + length +'.');
		}

		year = stream.readUInt16BE();
		month = stream.readUInt8();
		day = stream.readUInt8();
		hour = stream.readUInt8();
		minute = stream.readUInt8();
		second = stream.readUInt8();

		this.setDate(Date.UTC(year, month - 1, day, hour, minute, second === 60 ? 59 : second));
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

		if (data.modificationDate) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setDate(data.modificationDate);

			return [chunk];
		} else {
			return [];
		}
	},

	/**
	 * Gathers chunk-data from decoded chunks
	 *
	 * @method decodeData
	 * @param {object} data Data-object that will be used to export values
	 * @param {boolean} strict Should parsing be strict?
	 */
	decodeData: function (data, strict) {

		var chunks = this.getChunksByType(this.getType());

		if (!chunks) {
			return ;
		}

		if (chunks.length !== 1) {
			throw new Error('Not more than one chunk allowed for ' + this.getType() + '.');
		}

		data.modificationDate = chunks[0].getDate();
	}
};

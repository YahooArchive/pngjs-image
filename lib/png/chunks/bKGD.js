// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class bKGD
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
		return 400;
	},


	/**
	 * Gets the background color
	 *
	 * @method getColor
	 * @return {object}
	 */
	getColor: function () {
		return this._color || {
				red: 0,
				green: 0,
				blue: 0
			};
	},

	/**
	 * Sets the background color
	 *
	 * @method setColor
	 * @param {object} color
	 */
	setColor: function (color) {
		if (typeof color !== 'object') {
			throw new Error('The color should be an object with properties red, green, blue.');
		}
		this._color = color;
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

		var headerChunk,
			paletteChunk,
			color;

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (strict && (this.getFirstChunk(this.getType(), false) !== null)) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		headerChunk = this.getHeaderChunk();

		if (!headerChunk.isColor()) {

			if ((strict && (length !== 2)) || (length < 2)) {
				throw new Error('The ' + this.getType() + ' chunk requires 2 bytes for grayscale images. Got ' + length + '.');
			}

			color = stream.readUInt16BE();
			this.setColor({
				red: color,
				green: color,
				blue: color
			});

		} else if (headerChunk.hasIndexedColor()) {

			if ((strict && (length !== 1)) || (length < 1)) {
				throw new Error('The ' + this.getType() + ' chunk requires 1 byte for color images with a palette. Got ' + length + '.');
			}

			paletteChunk = this.getFirstChunk('PLTE', true);
			color = stream.readUInt8();
			this.setColor(paletteChunk.getColors()[color]);

		} else {

			if ((strict && (length !== 6)) || (length < 6)) {
				throw new Error('The ' + this.getType() + ' chunk requires 6 bytes for color images. Got ' + length + '.');
			}

			this.setColor({
				red: stream.readUInt16BE(),
				green: stream.readUInt16BE(),
				blue: stream.readUInt16BE()
			});
		}
	},

	/**
	 * Gathers chunk-data from decoded chunks
	 *
	 * Phase 4
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

		if (strict && (chunks.length !== 1)) {
			throw new Error('Not more than one chunk allowed for ' + this.getType() + '.');
		}

		data.backgroundColor = chunks[0].getColor();
	},


	/**
	 * Returns a list of chunks to be added to the data-stream
	 *
	 * Phase 1
	 *
	 * @method encodeData
	 * @param {Buffer} image Image data
	 * @param {object} data Object that will be used to import data to the chunk
	 * @return {Chunk[]} List of chunks to encode
	 */
	encodeData: function (image, data) {

		if (data.backgroundColor) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setColor(data.backgroundColor);

			return [chunk];
		} else {
			return [];
		}
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

		var headerChunk = this.getHeaderChunk(),
			paletteChunk,
			color;

		if (!headerChunk.isColor()) {

			// Use all colors to get the average. All colors should be the same anyways.
			color = this.getColor();
			stream.writeUInt16BE(Math.floor((color.red + color.green + color.blue) / 3));

		} else if (headerChunk.hasIndexedColor()) {

			paletteChunk = this.getFirstChunk('PLTE', true);
			color = paletteChunk.findColor(this.getColor());
			stream.writeUInt8(color & 0xff);

		} else {

			color = this.getColor();
			stream.writeUInt16BE(color.red);
			stream.writeUInt16BE(color.green);
			stream.writeUInt16BE(color.blue);
		}
	}
};

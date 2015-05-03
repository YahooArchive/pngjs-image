// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Compressor = require('../processor/compressor');

/**
 * @class iCCP
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
		return 'iCCP';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x69434350;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 160;
	},


	/**
	 * Gets the profile-name
	 *
	 * @method getName
	 * @return {string}
	 */
	getName: function () {
		return this._name || '';
	},

	/**
	 * Sets the profile-name
	 *
	 * @method setName
	 * @param {string} name
	 */
	setName: function (name) {

		name = name.trim();

		if (name.length > 79) {
			throw new Error('Profile-name cannot be longer than 79 characters.');
		}
		if (name.length === 0) {
			throw new Error('Profile-name needs to have a least one character.');
		}

		this._name = name;
	},


	/**
	 * Gets the profile
	 *
	 * @method getProfile
	 * @return {Buffer}
	 */
	getProfile: function () {
		return this._profile || new Buffer();
	},

	/**
	 * Sets the profile
	 *
	 * @method setProfile
	 * @param {Buffer} data
	 */
	setProfile: function (data) {
		this._profile = text;
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {

		var string, buffer, compressor;

		// Write profile-name to stream
		string = this.getName();
		string = string.replace(new RegExp(os.EOL, 'g'), "\n");
		buffer = iconv.encode(string, 'latin1');
		stream.writeBuffer(buffer);

		// Write null-character and compression method (0)
		stream.writeUInt8(0);
		stream.writeUInt8(0);

		// Convert profile
		buffer = this.getProfile();

		// Compress
		compressor = new Compressor();
		buffer = compressor.compress(buffer);

		// Write compressed data to stream
		stream.writeBuffer(buffer);
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

		var i, len,
			foundIndex = null,
			buffer, string,
			compressor;

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		// See where the null-character is
		buffer = stream.peekBuffer(length);
		for(i = 0, len = buffer.length; i < len; i++) {
			if (buffer.readUInt8(i) === 0) {
				foundIndex = i;
				break;
			}
		}

		// Found a null-character?
		if (foundIndex === null) {
			throw new Error('Cannot find separator in ' + this.getType() + ' chunk.');
		}

		// Convert profile-name from latin1
		buffer = stream.readBuffer(foundIndex);
		string = iconv.decode(buffer, 'latin1');
		this.setName(string.replace(/\n/g, os.EOL));

		// Load profile
		buffer = stream.readBuffer(length - foundIndex - 1);

		// Decompress
		compressor = new Compressor();
		buffer = compressor.decompress(buffer);

		// Set profile
		this.setProfile(buffer);
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

		if (data.ICC) {

			var chunk = this.createChunk(this.getType(), this.getChunks());

			chunk.setWhitePointX(data.ICC.name);
			chunk.setWhitePointY(data.ICC.profile);

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

		data.ICC = {
			name: chunks[0].getName(),
			profile: chunks[0].getProfile()
		};
	}
};

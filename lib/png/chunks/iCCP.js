// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Compressor = require('../compressor');

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
	 * @method getProfileName
	 * @return {string}
	 */
	getProfileName: function () {
		return this._profileName || '';
	},

	/**
	 * Sets the profile-name
	 *
	 * @method setProfileName
	 * @param {string} name
	 */
	setProfileName: function (name) {

		name = name.trim();

		if (name.length > 79) {
			throw new Error('Profile-name cannot be longer than 79 characters.');
		}
		if (name.length === 0) {
			throw new Error('Profile-name needs to have a least one character.');
		}

		this._profileName = name;
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
		string = this.getProfileName();
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
	 * Decoding of chunk data
	 *
	 * @method decode
	 * @param {BufferedStream} stream Data stream
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should parsing be strict?
	 */
	decode: function (stream, length, strict) {

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
		this.setProfileName(string.replace(/\n/g, os.EOL));

		// Load profile
		buffer = stream.readBuffer(length - foundIndex - 1);

		// Decompress
		compressor = new Compressor();
		buffer = compressor.decompress(buffer);

		// Set profile
		this.setProfile(buffer);
	}
};

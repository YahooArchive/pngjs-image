// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

// stRT - Structured Data

var Compressor = require('../compressor');

/**
 * @class stRT
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
		return 'stRT';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x73745254;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 600;
	},


	/**
	 * Gets the type of the structural data
	 *
	 * @method getDataType
	 * @return {string}
	 */
	getDataType: function () {
		return this._dataType;
	},

	/**
	 * Sets the type of the structural data
	 *
	 * @method setDataType
	 * @param {string} type
	 */
	setDataType: function (type) {
		if (type.length !== 4) {
			throw new Error('The type has to have four characters.');
		}
		this._dataType = type;
	},


	/**
	 * Gets the major version
	 *
	 * @method getMajor
	 * @return {int}
	 */
	getMajor: function () {
		return this._dataMajor;
	},

	/**
	 * Sets the major version
	 *
	 * @method setMajor
	 * @param {int} major
	 */
	setMajor: function (major) {
		if (major > 255) {
			throw new Error('Major version cannot be greater than 255');
		}
		this._dataMajor = major;
	},


	/**
	 * Gets the minor version
	 *
	 * @method getMinor
	 * @return {int}
	 */
	getMinor: function () {
		return this._dataMinor;
	},

	/**
	 * Sets the minor version
	 *
	 * @method setMinor
	 * @param {int} minor
	 */
	setMinor: function (minor) {
		if (minor > 255) {
			throw new Error('Minor version cannot be greater than 255');
		}
		this._dataMinor = minor;
	},


	/**
	 * Gets the uncompressed data
	 *
	 * @method getData
	 * @return {Buffer}
	 */
	getData: function () {
		return this._data;
	},

	/**
	 * Sets the uncompressed data
	 *
	 * @method setData
	 * @param {Buffer} data
	 */
	setData: function (data) {
		this._data = data;
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @return {Buffer}
	 */
	encode: function () {

		var compressor,
			data, output, i;

		// Compress the data
		compressor = new Compressor();
		data = compressor.compress(this._data);

		// Size oputput
		output = new Buffer(data.length + 6);

		// Write the data-type
		for(i = 0; i < 4; i++) {
			output.writeUInt8(this._dataType.charCodeAt(i) & 0xff, i);
		}

		// Write the version
		output.writeUInt8(this._dataMajor & 0xff, 4);
		output.writeUInt8(this._dataMinor & 0xff, 5);

		// Write the rest of the data
		data.copy(output, 6, 0, data.length);
	},

	/**
	 * Decoding of chunk data
	 *
	 * @method decode
	 * @param {Buffer} data Chunk data
	 * @param {int} offset Offset in chunk data
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should parsing be strict?
	 */
	decode: function (data, offset, length, strict) {

		var compressor, blob,
			position = offset,
			type = '';

		// Validation
		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (this.getFirstChunk(this.getType(), false) !== null) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}

		// Read the type
		type += String.fromCharCode(data.readUInt8(offset));
		type += String.fromCharCode(data.readUInt8(offset + 1));
		type += String.fromCharCode(data.readUInt8(offset + 2));
		type += String.fromCharCode(data.readUInt8(offset + 3));
		position += 4;
		this._dataType = type;

		// Read the version
		this._dataMajor = data.readUInt8(position); position += 1;
		this._dataMinor = data.readUInt8(position); position += 1;

		// Read the data
		blob = new Buffer(length - 6);
		data.copy(blob, 0, position, position + length - 6);

		// Decompress
		compressor = new Compressor();
		this._data = compressor.reverse(blob);
	}
};

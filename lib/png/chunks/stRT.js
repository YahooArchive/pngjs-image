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
	 * Makes sure that all required information is available before parsing
	 *
	 * @method preDecode
	 * @param {Buffer} data Chunk data
	 * @param {int} offset Offset in chunk data
	 * @param {int} length Length of chunk data
	 * @param {boolean} strict Should decoding be strict?
	 */
	preDecode: function (data, offset, length, strict) {

		if (!this.getFirstChunk('IHDR', false) === null) {
			throw new Error('Chunk ' + this.getType() + ' requires the IHDR chunk.');
		}

		if (this.getFirstChunk(this.getType(), false) !== null) {
			throw new Error('Only one ' + this.getType() + ' is allowed in the data.');
		}
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

		type += String.fromCharCode(data.readUInt8(offset));
		type += String.fromCharCode(data.readUInt8(offset + 1));
		type += String.fromCharCode(data.readUInt8(offset + 2));
		type += String.fromCharCode(data.readUInt8(offset + 3));
		position += 4;
		this._dataType = type;

		this._dataMajor = data.readUInt8(position); position += 1;
		this._dataMinor = data.readUInt8(position); position += 1;

		blob = new Buffer(length - 6);
		data.copy(blob, 0, position, position + length - 6);

		compressor = new Compressor();
		this._blob = compressor.reverse(blob);
	},

	/**
	 * Gets the type of the structural data
	 *
	 * @return {string}
	 */
	getDataType: function () {
		return this._dataType;
	},

	/**
	 * Sets the type of the structural data
	 *
	 * @param {string} type
	 */
	setDataType: function (type) {
		if (type.length !== 4) {
			throw new Error('The type has to have four characters.');
		}
		this._dataType = type;
	},

	getVersionMajor: function () {
		return this._dataMajor;
	},

	setVersionMajor: function (major) {
		if (major > 255) {
			throw new Error('Major version cannot be greater than 255');
		}
		this._dataMajor = major;
	},

	getVersionMinor: function () {
		return this._dataMinor;
	},

	setVersionMinor: function (minor) {
		if (minor > 255) {
			throw new Error('Minor version cannot be greater than 255');
		}
		this._dataMinor = minor;
	},

	/**
	 * Gets the uncompressed data
	 *
	 * @return {Buffer}
	 */
	getBlob: function () {
		return this._blob;
	},

	/**
	 * Sets the uncompressed data
	 *
	 * @param {Buffer} blob
	 */
	setBlob: function (blob) {
		this._blob = blob;
	},

	/**
	 * Compresses the data
	 *
	 * @return {Buffer}
	 */
	encode: function () {
		var compressor = new Compressor(),
			data, output, i;

		data = compressor.compress(this._blob);
		output = new Buffer(data.length + 6 + 12);

		for(i = 0; i < 4; i++) {
			output.writeUInt8(this._dataType.charCodeAt(i) & 0xff, i + 8);
		}

		output.writeUInt8(this._dataMajor & 0xff, 4 + 8);
		output.writeUInt8(this._dataMinor & 0xff, 5 + 8);

		data.copy(output, 6 + 8, 0, data.length);
	}
};

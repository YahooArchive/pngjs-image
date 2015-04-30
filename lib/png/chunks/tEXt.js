// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var iconv = require('iconv-lite');
var os = require('os');

/**
 * @class tEXt
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
		return 'tEXt';
	},

	/**
	 * Gets the chunk-type as id
	 *
	 * @method getTypeId
	 * @return {int}
	 */
	getTypeId: function () {
		return 0x74455874;
	},

	/**
	 * Gets the sequence
	 *
	 * @method getSequence
	 * @return {int}
	 */
	getSequence: function () {
		return 120;
	},


	/**
	 * Gets the keyword
	 *
	 * @method getKeyword
	 * @return {string}
	 */
	getKeyword: function () {
		return this._keyword || 'Title';
	},

	/**
	 * Sets the keyword
	 *
	 * @method setKeyword
	 * @param {string} text
	 */
	setKeyword: function (text) {

		text = text.trim();

		if (text.length > 79) {
			throw new Error('Keyword cannot be longer than 79 characters.');
		}
		if (text.length === 0) {
			throw new Error('Keyword needs to have a least one character.');
		}

		this._keyword = text;
	},


	/**
	 * Gets the text
	 *
	 * @method getText
	 * @return {string}
	 */
	getText: function () {
		return this._text || '';
	},

	/**
	 * Sets the text
	 *
	 * @method setText
	 * @param {string} text
	 */
	setText: function (text) {
		this._text = text;
	},


	/**
	 * Encoding of chunk data
	 *
	 * @method encode
	 * @param {BufferedStream} stream Data stream
	 */
	encode: function (stream) {

		var string, buffer;

		// Write title to stream
		string = this.getKeyword();
		string = string.replace(new RegExp(os.EOL, 'g'), "\n");
		buffer = iconv.encode(string, 'latin1');
		stream.writeBuffer(buffer);

		// Write null-character
		stream.writeUInt8(0);

		// Write text content to stream
		string = this.getText();
		string = string.replace(new RegExp(os.EOL, 'g'), "\n");
		buffer = iconv.encode(string, 'latin1');
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
			buffer, string;

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

		// Convert keyword from latin1
		buffer = stream.readBuffer(foundIndex);
		string = iconv.decode(buffer, 'latin1');
		this.setKeyword(string.replace(/\n/g, os.EOL));

		// Convert text content from latin1
		buffer = stream.readBuffer(length - foundIndex - 1);
		string = iconv.decode(buffer, 'latin1');
		this.setText(string.replace(/\n/g, os.EOL));
	}
};

// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

function createCRCTable () {
	var crcTable = [],
		n, k, c;

	for (n = 0; n < 256; n++) {
		c = n;
		for (k = 0; k < 8; k++) {
			c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		crcTable[n] = c;
	}

	return crcTable;
}

/**
 * @class CRC
 * @module PNG
 * @submodule PNGCore
 * @constructor
 */
var CRC = function () {
	this._value = -1;
};

CRC.table = createCRCTable();

CRC.prototype.write = function (data, offset, length) {
	var n,
		max = offset + length,
		table = CRC.table,
		c = this._value;

	for (n = offset; n < max; n++) {
		c = table[(c ^ data[n]) & 0xff] ^ (c >>> 8);
	}

	this._value = c;
};

CRC.prototype.getValue = function () {
	return this._value ^ -1;
};

module.exports = CRC;



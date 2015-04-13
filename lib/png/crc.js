


function createCRCTable () {
	var crcTable = [],
		i, j, c;

	for (i = 0; i < 256; i++) {
		c = i;
		for (j = 0; j < 8; j++) {
			c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		crcTable[i] = c;
	}

	return crcTable;
}


var CRC = function () {
	this._value = -1;
};

CRC.table = createCRCTable();

CRC.prototype.write = function (data, offset, length) {
	var i = offset,
		max = offset + length,
		table = CRC.table,
		value = this._value;

	for (; i < max; i++) {
		value = table[(value ^ data[i]) & 0xff] ^ (value >>> 8);
	}

	this._value = value;
};

CRC.prototype.getValue = function () {
	return this._value ^ -1;
};

module.exports = CRC;



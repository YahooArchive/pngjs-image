var PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

var CRC = require('./crc');
var Chunk = require('./chunk');

var Parser = function (data, offset) {
	this._offset = offset || 0;
	this._data = data;
	this._chunks = {};
};

Parser.prototype._readChunkLength = function () {
	var result = this._data.readUInt32BE(this._offset);
	this._offset += this._chunkLengthSize;
	return result;
};
Parser.prototype._chunkLengthSize = 4;

Parser.prototype._readChunkType = function () {
	var result = this._data.readUInt32BE(this._offset);
	this._offset += this._chunkTypeSize;
	return result;
};
Parser.prototype._chunkTypeSize = 4;

Parser.prototype._readChunkCrc = function () {
	var result = this._data.readUInt32BE(this._offset);
	this._offset += this._chunkCrcSize;
	return result;
};
Parser.prototype._chunkCrcSize = 4;

Parser.prototype.parseChunk = function () {
	var chunkLength,
		chunkType,
		chunkDataOffset,
		chunkCrc,
		crc = new CRC(),
		chunk;

	// Read chunk-length - length is only for chunkData
	chunkLength = this._readChunkLength();

	// Load chunk for crc calculation
	crc.write(this._data, this._offset, chunkLength + this._chunkTypeSize); // Including chunk-type

	// Load chunk-type and remember the offset of the data - no need to copy the data
	chunkType = this._readChunkType();
	chunkDataOffset = this._offset;
	this._offset += chunkLength;

		// Create chunk
	chunk = new Chunk(chunkType, this._data, chunkDataOffset);

	// Load crc and compare with calculated one
	chunkCrc = this._readChunkCrc();

	if ((chunkCrc !== crc.getValue()) && chunkCrc.isUnsafe()) {
		throw new Error('CRC error.');
	}
};

module.exports = Parser;

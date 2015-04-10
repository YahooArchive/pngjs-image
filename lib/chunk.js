
var typeToId = {
	'bKGD': 0x0,
	'cHRM': 0x0,
	'gAMA': 0x0,
	'hIST': 0x0,
	'iCCP': 0x0,
	'IDAT': 0x0,
	'IDHR': 0x0,
	'IEND': 0x0,
	'iTXt': 0x0,
	'pHYs': 0x0,
	'PLTE': 0x0,
	'sBIT': 0x0,
	'sPLT': 0x0,
	'sRGB': 0x0,
	'tEXt': 0x0,
	'tIME': 0x0,
	'tRNS': 0x0,
	'zTXt': 0x0
};


var Chunk = function (type, data, offset) {
	this._type = type;
	this._data = data;
	this._offset = offset;

	this._loadChunkMethods(type);
};

Chunk.prototype.loadChunkMethods = function () {
	var methodName,
		methods = require('./' + this._type);

	for(methodName in methods) {
		this[methodName] = methods[methodName];
	}
};


Chunk.prototype.getType = function () {
	return this._type;
};

Chunk.prototype.getData = function () {
	return this._data;
};

Chunk.prototype.getOffset = function () {
	return this._offset;
};


Chunk.prototype._isUpperCase = function (value) {
	return !(value & 0x20); // 0x20 = 32 dec -> Lowercase has bit 32 set
};


// Critical chunks are necessary for successful display of the contents of the datastream, for example the image header chunk (IHDR). A decoder trying to extract the image, upon encountering an unknown chunk type in which the ancillary bit is 0, shall indicate to the user that the image contains information it cannot safely interpret.
// Ancillary chunks are not strictly necessary in order to meaningfully display the contents of the datastream, for example the time chunk (tIME). A decoder encountering an unknown chunk type in which the ancillary bit is 1 can safely ignore the chunk and proceed to display the image.
Chunk.prototype.isCritical = function () {
	return this._isUpperCase(this._type[0]);
};

Chunk.prototype.isAncillary = function () {
	return !this.isCritical();
};


// A public chunk is one that is defined in this International Standard or is registered in the list of PNG special-purpose public chunk types maintained by the Registration Authority (see 4.9 Extension and registration). Applications can also define private (unregistered) chunk types for their own purposes. The names of private chunks have a lowercase second letter, while public chunks will always be assigned names with uppercase second letters. Decoders do not need to test the private-chunk property bit, since it has no functional significance; it is simply an administrative convenience to ensure that public and private chunk names will not conflict. See clause 14: Editors and extensions and 12.10.2: Use of private chunks.
Chunk.prototype.isPublic = function () {
	return this._isUpperCase(this._type[1]);
};

Chunk.prototype.isPrivate = function () {
	return !this.isPublic();
};


// This property bit is not of interest to pure decoders, but it is needed by PNG editors. This bit defines the proper handling of unrecognized chunks in a datastream that is being modified. Rules for PNG editors are discussed further in 14.2: Behaviour of PNG editors.
Chunk.prototype.isSafe = function () {
	return !this.isUnsafe();
};

Chunk.prototype.isUnsafe = function () {
	return this._isUpperCase(this._type[3]);
};


Chunk.prototype.preParse = function () {

};

Chunk.prototype.parse = function () {

};

Chunk.prototype.postParse = function () {

};

module.exports = Chunk;

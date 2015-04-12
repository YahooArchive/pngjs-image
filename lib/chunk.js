var Chunk = function (type, chunks) {
	this._type = type;
	this._chunks = chunks;

	this.loadChunkMethods(type);

	if (!this.allowMultiple() && chunks[type] && (chunks[type].length > 0)) {
		throw new Error('Multiple chunks of ' + type + ' are not allowed.');
	}
};

Chunk.prototype.loadChunkMethods = function () {
	var methodName,
		methods = require('./chunks/' + this.getType());

	for(methodName in methods) {
		this[methodName] = methods[methodName];
	}
};

Chunk.prototype.getType = function () {
	return this._type;
};

Chunk.prototype.getChunks = function () {
	return this._chunks;
};


Chunk.prototype.getFirstChunk = function (type, required) {
	var chunks = this.getChunks();

	if (chunks[type] && (chunks[type].length > 0)) {
		return chunks[type][0];
	} else if (required) {
		throw new Error('Could not retrieve header chunk.');
	} else {
		return null;
	}
};

Chunk.prototype.getHeaderChunk = function () {
	return this.getFirstChunk('IHDR', true);
};


Chunk.prototype._isUpperCase = function (value) {
	return !(value & 0x20); // 0x20 = 32 dec -> Lowercase has bit 32 set
};


// Critical chunks are necessary for successful display of the contents of the datastream, for example the image header chunk (IHDR). A decoder trying to extract the image, upon encountering an unknown chunk type in which the ancillary bit is 0, shall indicate to the user that the image contains information it cannot safely interpret.
// Ancillary chunks are not strictly necessary in order to meaningfully display the contents of the datastream, for example the time chunk (tIME). A decoder encountering an unknown chunk type in which the ancillary bit is 1 can safely ignore the chunk and proceed to display the image.
Chunk.prototype.isCritical = function () {
	return this._isUpperCase(this.getType()[0]);
};

Chunk.prototype.isAncillary = function () {
	return !this.isCritical();
};


// A public chunk is one that is defined in this International Standard or is registered in the list of PNG special-purpose public chunk types maintained by the Registration Authority (see 4.9 Extension and registration). Applications can also define private (unregistered) chunk types for their own purposes. The names of private chunks have a lowercase second letter, while public chunks will always be assigned names with uppercase second letters. Decoders do not need to test the private-chunk property bit, since it has no functional significance; it is simply an administrative convenience to ensure that public and private chunk names will not conflict. See clause 14: Editors and extensions and 12.10.2: Use of private chunks.
Chunk.prototype.isPublic = function () {
	return this._isUpperCase(this.getType()[1]);
};

Chunk.prototype.isPrivate = function () {
	return !this.isPublic();
};


// This property bit is not of interest to pure decoders, but it is needed by PNG editors. This bit defines the proper handling of unrecognized chunks in a datastream that is being modified. Rules for PNG editors are discussed further in 14.2: Behaviour of PNG editors.
Chunk.prototype.isSafe = function () {
	return !this.isUnsafe();
};

Chunk.prototype.isUnsafe = function () {
	return this._isUpperCase(this.getType()[3]);
};


/**
 * Makes sure that all required information is available before decoding
 *
 * @method preParse
 * @param {Buffer} data Chunk data
 * @param {int} offset Offset in chunk data
 * @param {int} length Length of chunk data
 * @param {boolean} strict Should decoding be strict?
 */
Chunk.prototype.preDecode = function (data, offset, length, strict) {

};

/**
 * Decoding of chunk data
 *
 * @method parse
 * @param {Buffer} data Chunk data
 * @param {int} offset Offset in chunk data
 * @param {int} length Length of chunk data
 * @param {boolean} strict Should decoding be strict?
 */
Chunk.prototype.decode = function (data, offset, length, strict) {

};

/**
 * Validates all decoded data
 *
 * @method postParse
 * @param {Buffer} data Chunk data
 * @param {int} offset Offset in chunk data
 * @param {int} length Length of chunk data
 * @param {boolean} strict Should decoding be strict?
 */
Chunk.prototype.postDecode = function (data, offset, length, strict) {

};

module.exports = Chunk;

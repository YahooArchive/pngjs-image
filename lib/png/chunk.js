// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var utils = require('./utils/utils');
var path = require('path');

/**
 * @class Chunk
 * @module PNG
 * @submodule PNGCore
 * @extends chunkUtils
 * @param {string} type Chunk-type for loading the right chunk
 * @param {object} chunks Dictionary of available chunks
 * @constructor
 */
var Chunk = function (type, chunks) {
	this._chunks = chunks;

	// Import chunk
	Chunk.applyChunkType(type, this);
};


/**
 * Gets the chunk-type as string
 *
 * Note:
 * Identifier for chunk that is the string of the chunk-type.
 *
 * @method getType
 * @return {string|null}
 */
Chunk.prototype.getType = function () {
	return null;
};

/**
 * Gets the chunk-type as id
 *
 * Note:
 * This is the numeric version of `getType`.
 *
 * @method getTypeId
 * @return {int}
 */
Chunk.prototype.getTypeId = function () {
	return 0;
};

/**
 * Gets the sequence
 *
 * Note:
 * This defines the sequence the chunk will have when all chunks are written to the blob.
 * Lowest sequence numbers will be written first.
 *
 * Range:
 * * 0 - Header
 * * 500 - Data
 * * 1000 - End
 *
 * @method getSequence
 * @return {int}
 */
Chunk.prototype.getSequence = function () {
	return 750;
};


/**
 * Is value an upper-case ASCII character?
 *
 * @method _isUpperCase
 * @param {int} value
 * @return {boolean}
 * @private
 */
Chunk.prototype._isUpperCase = function (value) {
	return !(value & 0x20); // 0x20 = 32 dec -> Lowercase has bit 32 set
};


// Critical chunks are necessary for successful display of the contents of the datastream, for example the image header
// chunk (IHDR). A decoder trying to extract the image, upon encountering an unknown chunk type in which the ancillary
// bit is 0, shall indicate to the user that the image contains information it cannot safely interpret.
// Ancillary chunks are not strictly necessary in order to meaningfully display the contents of the datastream, for
// example the time chunk (tIME). A decoder encountering an unknown chunk type in which the ancillary bit is 1 can
// safely ignore the chunk and proceed to display the image.

/**
 * Is the chunk a critical chunk that cannot be ignored?
 *
 * @method isCritical
 * @return {boolean}
 */
Chunk.prototype.isCritical = function () {
	return this._isUpperCase(this.getType()[0]);
};

/**
 * Is the chunk an ancillary chunk that can be ignored when unknown?
 *
 * @method isAncillary
 * @return {boolean}
 */
Chunk.prototype.isAncillary = function () {
	return !this.isCritical();
};


// A public chunk is one that is defined in this International Standard or is registered in the list of PNG
// special-purpose public chunk types maintained by the Registration Authority (see 4.9 Extension and registration).
// Applications can also define private (unregistered) chunk types for their own purposes. The names of private chunks
// have a lowercase second letter, while public chunks will always be assigned names with uppercase second letters.
// Decoders do not need to test the private-chunk property bit, since it has no functional significance; it is simply
// an administrative convenience to ensure that public and private chunk names will not conflict. See clause 14:
// Editors and extensions and 12.10.2: Use of private chunks.

/**
 * Is the chunk a public chunk?
 *
 * @method isPublic
 * @return {boolean}
 */
Chunk.prototype.isPublic = function () {
	return this._isUpperCase(this.getType()[1]);
};

/**
 * Is the chunk a private chunk?
 *
 * @method isPrivate
 * @return {boolean}
 */
Chunk.prototype.isPrivate = function () {
	return !this.isPublic();
};


// This property bit is not of interest to pure decoders, but it is needed by PNG editors. This bit defines the proper
// handling of unrecognized chunks in a datastream that is being modified. Rules for PNG editors are discussed further
// in 14.2: Behaviour of PNG editors.

/**
 * Is the data safe to copy?
 *
 * @method isSafe
 * @return {boolean}
 */
Chunk.prototype.isSafe = function () {
	return !this.isUnsafe();
};

/**
 * Is the data safe to copy?
 *
 * @method isUnsafe
 * @return {boolean}
 */
Chunk.prototype.isUnsafe = function () {
	return this._isUpperCase(this.getType()[3]);
};


/**
 * Parsing of chunk data
 *
 * Phase 1
 *
 * Note:
 * Use this methods to parse data for each chunk.
 *
 * @method parse
 * @param {BufferedStream} stream Data stream
 * @param {int} length Length of chunk data
 * @param {boolean} strict Should parsing be strict?
 */
Chunk.prototype.parse = function (stream, length, strict) {
	throw new Error('Unimplemented method "parse".');
};

/**
 * Decoding of chunk data before scaling
 *
 * Phase 2
 *
 * Note:
 * Use this method when you have to do some preliminary
 * modifications to the image like decompression,
 * applying of changes before the image is scaled.
 *
 * @method decode
 * @param {Buffer} image
 * @param {boolean} strict Should parsing be strict?
 * @return {Buffer}
 */
Chunk.prototype.decode = function (image, strict) {
	// Do nothing by default
	return image;
};

/**
 * Re-working of image after scaling
 *
 * Phase 3
 *
 * Note:
 * Use this method to add modifications to the scaled image.
 *
 * @method postDecode
 * @param {Buffer} image
 * @param {boolean} strict Should parsing be strict?
 * @return {Buffer}
 */
Chunk.prototype.postDecode = function (image, strict) {
	// Do nothing by default
	return image;
};

/**
 * Decodes chunk-data to an external data-object
 *
 * Phase 4
 *
 * Note:
 * Use this method to export data to the data-object.
 *
 * @static
 * @method decodeData
 * @param {object} data Data-object that will be used to export values
 * @param {boolean} strict Should parsing be strict?
 */
Chunk.prototype.decodeData = function (data, strict) {
	// Do nothing by default
};


/**
 * Encodes chunk-data from an external data-object
 *
 * Phase 1
 *
 * Note:
 * Use this method to import data from the data-object.
 *
 * @static
 * @method encodeData
 * @param {object} data Object that will be used to import data to the chunk
 * @return {Chunk[]} List of chunks to encode
 */
Chunk.prototype.encodeData = function (data) {
	// Do nothing by default
	return [];
};

/**
 * Before encoding of chunk data
 *
 * Phase 2
 *
 * Note:
 * Use this method to gather image-data before scaling.
 *
 * @method preEncode
 * @param {Buffer} image
 * @return {Buffer}
 */
Chunk.prototype.preEncode = function (image) {
	// Do nothing by default
	return image;
};

/**
 * Encoding of chunk data
 *
 * Phase 3
 *
 * Note:
 * Use this method to add data to the image after scaling.
 *
 * @method encode
 * @param {Buffer} image
 * @return {Buffer}
 */
Chunk.prototype.encode = function (image) {
	// Do nothing by default
	return image;
};

/**
 * Composing of image data
 *
 * Phase 4
 *
 * Note:
 * Use this method to compose each chunks data.
 *
 * @method compose
 * @param {BufferedStream} stream Data stream
 */
Chunk.prototype.compose = function (stream) {
	throw new Error('Unimplemented method "compose".');
};


/**
 * Registry
 *
 * @static
 * @type {object}
 * @private
 */
Chunk._registry = {};

/**
 * Modifies the data-object with the contents of the decoded chunks
 *
 * @static
 * @method decodeTypeData
 * @param {string} type Chunk-type
 * @param {object} data Object that will holds all the data from the decoded chunks
 * @param {object} chunks Dictionary of already decoded chunks
 * @param {boolean} strict Should parsing be strict?
 */
Chunk.decodeTypeData = function (type, data, chunks, strict) {
	var methods = this.getChunkType(type);

	if (!methods) {
		throw new Error('Unknown chunk-type ' + type);
	}

	if (methods.decodeData) {
		methods._staticChunks = chunks;
		methods.decodeData(data, strict);
	}
};

/**
 * Determines a list of chunks to encode of the same type from the data-object
 *
 * @static
 * @method encodeTypeData
 * @param {string} type Chunk-type
 * @param {Buffer} image Image data
 * @param {object} data Object that holds all the data that should be encoded
 * @param {object} chunks Dictionary of already determined chunks
 * @return {Chunk[]} List of chunks to encode
 */
Chunk.encodeTypeData = function (type, image, data, chunks) {
	var methods = this.getChunkType(type);

	if (!methods) {
		throw new Error('Unknown chunk-type ' + type);
	}

	if (methods.encodeData) {
		methods._staticChunks = chunks;
		return methods.encodeData(image, data);
	} else {
		return [];
	}
};

/**
 * Adds a new chunk-type to the registry
 *
 * @static
 * @method addChunkType
 * @param {string} type Name of the chunk
 * @param {object} module List of methods specific for the chunk-type
 */
Chunk.addChunkType = function (type, module) {

	// Add utils
	utils.loadModule(path.join(__dirname, 'utils', 'chunkUtils.js'), module);

	// This is needed for static access!!!
	module.getType = function () {
		return type;
	};

	this._registry[type] = module;
};

/**
 * Gets a specific chunk-type module, listing all chunk-type specific methods
 *
 * @static
 * @method getChunkType
 * @param {string} type Name of the chunk
 * @return {object} Chunk module
 */
Chunk.getChunkType = function (type) {
	return this._registry[type];
};

/**
 * Applies the chunk-module on an object
 *
 * @static
 * @method applyChunkType
 * @param {string} type Name of the chunk
 * @param {object} obj Object the module to apply to
 */
Chunk.applyChunkType = function (type, obj) {
	var methods = this.getChunkType(type);

	// Use default chunk for unknown types
	if (!methods) {
		methods = this.getChunkType('zzZz');
	}

	if (methods) {
		utils.copyModule(methods, obj);

		// This is needed for dynamic access, specifically for the default chunk!!!
		obj.getType = function () {
			return type;
		};

	} else {
		throw new Error('Unknown chunk-type ' + type);
	}
};

/**
 * Initializes all official chunk types
 *
 * @static
 * @method initDefaultChunkTypes
 */
Chunk.initDefaultChunkTypes = function () {
	var chunks = [
			'bKGD', 'cHRM', 'gAMA', 'hIST', 'iCCP', 'IDAT', 'IEND', 'IHDR', 'iTXt',
			'pHYs', 'PLTE', 'sBIT', 'sPLT', 'sRGB', 'tEXt', 'tIME', 'tRNS', 'zTXt'
		],
		module;

	chunks.forEach(function (chunkType) {
		module = require(path.join(__dirname, 'chunks', chunkType));
		this.addChunkType(chunkType, module);
	}.bind(this));
};

/**
 * Initializes all known custom chunk types
 *
 * @static
 * @method initCustomChunkTypes
 */
Chunk.initCustomChunkTypes = function () {
	var chunks = ['stRT', 'zzZz'],
		module;

	chunks.forEach(function (chunkType) {
		module = require(path.join(__dirname, 'custom', chunkType));
		this.addChunkType(chunkType, module);
	}.bind(this));
};

// Initialize
Chunk.initDefaultChunkTypes();
Chunk.initCustomChunkTypes();

module.exports = Chunk;

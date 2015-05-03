// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class BufferedStream
 * @module PNG
 * @submodule PNGCore
 * @param {Buffer} [data] Data buffer
 * @param {int|boolean} [offset=0] Offset within the data (With offset = false, they data will be taken as-is)
 * @param {int} [length=data.length-offset] Length of the data
 * @constructor
 */
var BufferedStream = function (data, offset, length) {

	this._readOffset = 0;
	this._writeOffset = 0;

	this.readCounter = 0;
	this.writeCounter = 0;

	if (data) {
		if (offset === false) {
			this._data = data;
		} else {
			this._data = new Buffer((length || (data.length - (offset || 0))) * 2);
			this.writeBuffer(data, offset, length);
		}
	} else {
		this._data = new Buffer(length || 1024 * 500);
	}
};

Object.defineProperty(BufferedStream.prototype, 'length', {
	enumerable: false,
	configurable: false,
	get: function () {
		return this._writeOffset - this._readOffset;
	},
	set: function (length) {
		if (this._readOffset + length > this._writeOffset) {
			throw new Error('Length beyond the write pointer is not allowed.');
		}
		this._writeOffset = this._readOffset + length;
	}
});


/**
 * Checks if a read goes beyond the write pointer, reaching out of bounds
 *
 * @method _readCheck
 * @param {int} size Size of the data that is pending to be read from the stream
 * @private
 */
BufferedStream.prototype._readCheck = function (size) {
	if (this._readOffset + size > this._writeOffset) {
		throw new Error('Reading out of bounds.');
	}
};

/**
 * @method readUInt8
 * @param {boolean} [noAssert=false]
 * @return {int}
 */
/**
 * @method peekUInt8
 * @param {boolean} [noAssert=false]
 * @return {int}
 */
[
	['UInt8', 1],
	['UInt16LE', 2],
	['UInt16BE', 2],
	['UInt32LE', 4],
	['UInt32BE', 4],
	['Int8', 1],
	['Int16LE', 2],
	['Int16BE', 2],
	['Int32LE', 4],
	['Int32BE', 4],
	['FloatLE', 4],
	['FloatBE', 4],
	['DoubleLE', 8],
	['DoubleBE', 8]
].forEach(function (fnInfo) {

	['read', 'peek'].forEach(function (prefix) {
		var relayedMethodName = 'read' + fnInfo[0],
			methodName = prefix + fnInfo[0],
			peeking = (prefix === 'peek'),
			size = fnInfo[1];

		BufferedStream.prototype[methodName] = function (noAssert) {
			var value;

			this._readCheck();

			value = this._data[relayedMethodName](this._readOffset, noAssert);
			if (!peeking) {
				this._readOffset += size;
				this.readCounter += size;
			}

			return value;
		}
	});
});


/**
 * Reads a string from the stream without moving the read pointer
 *
 * @method peekString
 * @param {int} size Number of bytes to read from stream
 * @param {string} [encoding='utf8'] Encoding of string
 * @return {string}
 */
BufferedStream.prototype.peekString = function (size, encoding) {
	this._readCheck();
	return this._data.toString(encoding || 'utf8', this._readOffset, this._readOffset + size);
};

/**
 * Reads a string from the stream
 *
 * @method readString
 * @param {int} size Number of bytes to read from stream
 * @param {string} [encoding='utf8'] Encoding of string
 * @return {string}
 */
BufferedStream.prototype.readString = function (size, encoding) {
	var result = this.peekString(size, encoding);
	this._readOffset += size;
	this.readCounter += size;
	return result;
};


/**
 * Reads data from the stream into a buffer without moving the read pointer
 *
 * @method peekBuffer
 * @param {int} size Number of bytes that should be read from the stream
 * @returns {Buffer}
 */
BufferedStream.prototype.peekBuffer = function (size) {
	var buffer;

	this._readCheck();

	buffer = new Buffer(size);
	this._data.copy(buffer, 0, this._readOffset, this._readOffset + size);

	return buffer;
};

/**
 * Reads data from the stream into a buffer
 *
 * @method readBuffer
 * @param {int} size Number of bytes that should be read from the stream
 * @return {Buffer}
 */
BufferedStream.prototype.readBuffer = function (size) {
	var buffer = this.peekBuffer(size);
	this._readOffset += size;
	this.readCounter += size;
	return buffer;
};


/**
 * Reads data from the stream into a buffer
 *
 * @method peekBufferedStream
 * @param {BufferedStream} stream Stream to write to
 * @param {int} size Number of bytes that should be read
 */
BufferedStream.prototype.peekBufferedStream = function (stream, size) {
	stream.writeBufferedStream(this, size);
};

/**
 * Reads data from the stream into a buffer
 *
 * @method readBufferedStream
 * @param {BufferedStream} stream Stream to write to
 * @param {int} size Number of bytes that should be read
 */
BufferedStream.prototype.readBufferedStream = function (stream, size) {
	this.peekBufferedStream(stream, size);
	this._readOffset += size;
	this.readCounter += size;
};


/**
 * Checks if a write needs a re-size
 *
 * @method _writeCheck
 * @param {int} size Size that is pending to be written to the stream
 * @private
 */
BufferedStream.prototype._writeCheck = function (size) {
	if (this._data.length < this._writeOffset + size) {
		this._resize();
	}
};

/**
 * Re-sizes the internal buffer, copying all existing data into it
 *
 * @method _resize
 * @private
 */
BufferedStream.prototype._resize = function () {
	var buffer = new Buffer(this._data.length * 2);
	this._data.copy(buffer, 0, 0, this._writeOffset);
	this._data = buffer;
};

/**
 * @method writeUInt8
 * @param {boolean} [noAssert=false]
 */
[
	['writeUInt8', 1],
	['writeUInt16LE', 2],
	['writeUInt16BE', 2],
	['writeUInt32LE', 4],
	['writeUInt32BE', 4],
	['writeInt8', 1],
	['writeInt16LE', 2],
	['writeInt16BE', 2],
	['writeInt32LE', 4],
	['writeInt32BE', 4],
	['writeFloatLE', 4],
	['writeFloatBE', 4],
	['writeDoubleLE', 8],
	['writeDoubleBE', 8]
].forEach(function (fnInfo) {
	BufferedStream.prototype[fnInfo[0]] = function (value, noAssert) {
		this._writeCheck(fnInfo[1]);
		this._data[fnInfo[0]](value, this._writeOffset, noAssert);
		this._writeOffset += fnInfo[1];
		this.writeCounter += fnInfo[1];
	}
});

/**
 * Writes a string to the stream
 *
 * @method writeASCIIString
 * @param {string} text Text to write to the stream
 */
BufferedStream.prototype.writeASCIIString = function (text) {

	this._writeCheck(text.length);

	for(var i = 0, len = text.length; i < len; i++) {
		this._data.writeUInt8(text.charCodeAt(i) & 0xff, this._writeOffset + i);
	}
	this._writeOffset += text.length;
	this.writeCounter += text.length;
};

/**
 * Writes a string to the stream
 *
 * @method writeString
 * @param {string} text Text to write to the stream
 * @param {string} [encoding='utf8'] Encoding of string
 */
BufferedStream.prototype.writeString = function (text, encoding) {
	this.writeBuffer(new Buffer(text, encoding || 'utf8'));
};

/**
 * Writes a buffer to the stream
 *
 * @method writeBuffer
 * @param {Buffer} buffer Data buffer
 * @param {int} [offset=0] Offset within buffer
 * @param {int} [length=buffer.length-offset] length Length of buffer
 */
BufferedStream.prototype.writeBuffer = function (buffer, offset, length) {
	var localOffset = offset || 0,
		localLength = length || (buffer.length - localOffset);

	this._writeCheck(localLength);

	buffer.copy(this._data, this._writeOffset, localOffset, localOffset + localLength);
	this._writeOffset += localLength;
	this.writeCounter += localLength;
};

/**
 * Writes a buffered stream into the stream
 *
 * @param {BufferedStream} stream
 * @param {int} [length=stream.length] Length of buffered data
 */
BufferedStream.prototype.writeBufferedStream = function (stream, length) {
	var len = (length || stream.length);
	stream._data.copy(this._data, this._writeOffset, stream._readOffset, stream._readOffset + len);
	this._writeOffset += len;
	this.writeCounter += len;
};


/**
 * Clones the stream with the current internal state
 *
 * @method clone
 * @return {BufferedStream} Cloned stream
 */
BufferedStream.prototype.clone = function () {
	return this.slice();
};

/**
 * Slices the stream
 *
 * @method slice
 * @param {int} [start=0] Start of stream
 * @param {int} [end=this.length] End of stream
 * @return {BufferedStream} Sliced stream
 */
BufferedStream.prototype.slice = function (start, end) {

	var stream,
		localStart = start || 0,
		localEnd = end || this._data.length;

	if (localStart > localEnd) {
		throw new Error('End cannot be smaller than start.');
	}

	stream = new BufferedStream(this._data, false);

	stream._writeOffset = this._readOffset + localEnd;
	stream._readOffset = this._readOffset + localStart;

	stream.readCounter = this.readCounter;
	stream.writeCounter = this.writeCounter;
};

/**
 * Converts contents to a buffer without moving the read pointer
 *
 * @method toBuffer
 * @param {boolean} [noCopy=false]
 * @return {Buffer}
 */
BufferedStream.prototype.toBuffer = function (noCopy) {
	if (noCopy) {
		return this._data;
	} else {
		return this.peekBuffer(this.length);
	}
};


module.exports = BufferedStream;

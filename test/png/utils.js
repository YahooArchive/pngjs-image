// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var fs = require('fs');
var path = require('path');

var Decoder = require('../../index').Decoder;
var Encoder = require('../../index').Encoder;

before(function () {

	this.resource = function (groups, file) {

		groups = [].concat(groups);

		var completePath = path.join(__dirname, 'PngSuite');

		groups.forEach(function (group) {
			completePath = path.join(completePath, group);
		});

		completePath = path.join(completePath, file);

		return completePath;
	};

	this.decode = function (path, options) {

		options = options || {};
		options.strict = true;

		this.blob = fs.readFileSync(path);

		this.decoder = new Decoder();

		this.image = this.decoder.decode(this.blob, options);
		this.data = this.decoder.getChunkData();
		this.chunks = this.decoder.getChunks();
	};

	this.encode = function (path, buffer, width, height) {

		this.encoder = new Encoder();

		this.encodedBlob = this.encoder.encode(buffer, width, height);

		fs.writeFileSync(path, this.encodedBlob);
	};

	this.compareToFile = function (buffer, path) {

		var compareToBuffer = fs.readFileSync(path);

		if (compareToBuffer.length != buffer.length) {
			throw new Error('Buffer have different sizes.');
		}

		for(var i = 0; i < buffer.length; i++) {
			if (buffer[i] != compareToBuffer[i]) {
				throw new Error('Buffers are different.');
			}
		}
	}
});

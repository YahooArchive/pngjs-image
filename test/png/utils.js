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

	this.encode = function (path, buffer, width, height, options) {

		this.encoder = new Encoder();

		this.encodedBlob = this.encoder.encode(buffer, width, height, options);

		fs.writeFileSync(path, this.encodedBlob);
	};

	this.compareToFile = function (buffer, path) {

		var compareToBuffer = fs.readFileSync(path);

		this.compareBuffer(buffer, compareToBuffer);
	};

	this.compareBuffer = function (buffer1, buffer2) {

		if (buffer1.length != buffer2.length) {
			throw new Error('Buffer have different sizes.');
		}

		for(var i = 0; i < buffer2.length; i++) {
			if (buffer2[i] != buffer1[i]) {
				throw new Error('Buffers are different.');
			}
		}
	}
});

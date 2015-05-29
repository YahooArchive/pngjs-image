// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('zzZz', function () {

	describe('Safe to Copy', function () {

		describe('Single', function () {

			testGen.addDecodeTests({
				resourceGroup: ['custom', 'unknown'],
				resourceFile: 'zzZz_safe_single',
				imageCheck: true,

				chunkTypes: ['zzZz'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 6,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have structured data', function () {
				expect(this.data.unknownChunks).to.be.not.undefined;
				expect(this.data.unknownChunks.length).to.be.not.equal(0);
			});

			it('should have one entry data', function () {
				expect(this.data.unknownChunks.length).to.be.equal(1);
			});

			it('should have the original chunk-type', function () {
				expect(this.data.unknownChunks[0].type).to.be.equal('teST');
			});

			it('should have the data', function () {
				this.compareBuffer(this.data.unknownChunks[0].data, new Buffer('this is a test', 'utf8'));
			});
		});
	});
});

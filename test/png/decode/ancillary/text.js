// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Text', function () {

	describe('No Textual Data', function () {

		testGen.addTests({
			resourceGroup: ['ancillary', 'text'],
			resourceFile: 'ct0n0g04',
			imageCheck: true,

			chunkTypes: ['gAMA'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 4,
			colorType: 0,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have no plain text', function () {
			expect(this.data.volatile && this.data.volatile.texts).to.be.undefined;
		});

		it('should have no compressed text', function () {
			expect(this.data.volatile && this.data.volatile.compressedTexts).to.be.undefined;
		});
	});

	describe('With Textual Data', function () {

		testGen.addTests({
			resourceGroup: ['ancillary', 'text'],
			resourceFile: 'ct1n0g04',
			imageCheck: true,

			chunkTypes: ['gAMA', 'tEXt'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 4,
			colorType: 0,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have plain text', function () {
			expect(this.data.volatile && this.data.volatile.texts).to.be.deep.equal([
				{
					"content": "PngSuite",
					"keyword": "Title"
				},
				{
					"content": "Willem A.J. van Schaik\n(willem@schaik.com)",
					"keyword": "Author"
				},
				{
					"content": "Copyright Willem van Schaik, Singapore 1995-96",
					"keyword": "Copyright"
				},
				{
					"content": "A compilation of a set of images created to test the\nvarious color-types of the PNG format. Included are\nblack&white, color, paletted, with alpha channel, with\ntransparency formats. All bit-depths allowed according\nto the spec are present.",
					"keyword": "Description"
				},
				{
					"content": "Created on a NeXTstation color using \"pnmtopng\".",
					"keyword": "Software"
				},
				{
					"content": "Freeware.",
					"keyword": "Disclaimer"
				}
			]);
		});

		it('should have no compressed text', function () {
			expect(this.data.volatile && this.data.volatile.compressedTexts).to.be.undefined;
		});
	});

	describe('With Compressed Textual Data', function () {

		testGen.addTests({
			resourceGroup: ['ancillary', 'text'],
			resourceFile: 'ctzn0g04',
			imageCheck: true,

			chunkTypes: ['gAMA', 'zTXt', 'tEXt'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 4,
			colorType: 0,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have plain text', function () {
			expect(this.data.volatile && this.data.volatile.texts).to.be.deep.equal([
				{
					"content": "PngSuite",
					"keyword": "Title"
				},
				{
					"content": "Willem A.J. van Schaik\n(willem@schaik.com)",
					"keyword": "Author"
				}
			]);
		});

		it('should have compressed text', function () {
			expect(this.data.volatile && this.data.volatile.compressedTexts).to.be.deep.equal([
				{
					"content": "Copyright Willem van Schaik, Singapore 1995-96",
					"keyword": "Copyright"
				},
				{
					"content": "A compilation of a set of images created to test the\nvarious color-types of the PNG format. Included are\nblack&white, color, paletted, with alpha channel, with\ntransparency formats. All bit-depths allowed according\nto the spec are present.",
					"keyword": "Description"
				},
				{
					"content": "Created on a NeXTstation color using \"pnmtopng\".",
					"keyword": "Software"
				},
				{
					"content": "Freeware.",
					"keyword": "Disclaimer"
				}
			]);
		});
	});
});

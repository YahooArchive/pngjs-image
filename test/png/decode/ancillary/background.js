// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Background', function () {

	describe('No Background', function () {

		describe('GrayScale with Alpha - Interlaced', function () {

			describe('8-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'background'],
					resourceFile: 'bgai4a08',
					imageCheck: true,

					chunkTypes: ['gAMA'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 4,
					filter: 0,
					compression: 0,
					interlace: 1
				});

				it('should have no background color', function () {
					expect(this.data.backgroundColor).to.be.undefined;
				});
			});

			describe('16-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'background'],
					resourceFile: 'bgai4a16',
					imageCheck: true,

					chunkTypes: ['gAMA'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 16,
					colorType: 4,
					filter: 0,
					compression: 0,
					interlace: 1
				});

				it('should have no background color', function () {
					expect(this.data.backgroundColor).to.be.undefined;
				});
			});
		});

		describe('True-Color with Alpha - Non-Interlaced', function () {

			describe('8-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'background'],
					resourceFile: 'bgan6a08',
					imageCheck: true,

					chunkTypes: ['gAMA'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 6,
					filter: 0,
					compression: 0,
					interlace: 0
				});

				it('should have no background color', function () {
					expect(this.data.backgroundColor).to.be.undefined;
				});
			});

			describe('16-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'background'],
					resourceFile: 'bgan6a16',
					imageCheck: true,

					chunkTypes: ['gAMA'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 16,
					colorType: 6,
					filter: 0,
					compression: 0,
					interlace: 0
				});

				it('should have no background color', function () {
					expect(this.data.backgroundColor).to.be.undefined;
				});
			});
		});
	});

	describe('With Background', function () {

		describe('GrayScale with Alpha', function () {

			describe('8-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'background'],
					resourceFile: 'bgbn4a08', // black background
					imageCheck: true,
					decodeOptions: { background: true },

					chunkTypes: ['gAMA', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 4,
					filter: 0,
					compression: 0,
					interlace: 0
				});

				it('should have no background color', function () {
					expect(this.data.backgroundColor).to.be.not.undefined;
				});

				it('should have black as a background color', function () {
					expect(this.data.backgroundColor.red).to.be.equal(0);
					expect(this.data.backgroundColor.green).to.be.equal(0);
					expect(this.data.backgroundColor.blue).to.be.equal(0);
				});
			});

			describe('16-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'background'],
					resourceFile: 'bggn4a16', // gray background
					imageCheck: true,

					chunkTypes: ['gAMA', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 16,
					colorType: 4,
					filter: 0,
					compression: 0,
					interlace: 0
				});

				it('should have no background color', function () {
					expect(this.data.backgroundColor).to.be.not.undefined;
				});

				it('should have black as a background color', function () {
					expect(this.data.backgroundColor.red).to.be.equal(170);
					expect(this.data.backgroundColor.green).to.be.equal(170);
					expect(this.data.backgroundColor.blue).to.be.equal(170);
				});
			});
		});

		describe('True-Color with Alpha', function () {

			describe('8-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'background'],
					resourceFile: 'bgwn6a08', // white background
					imageCheck: true,

					chunkTypes: ['gAMA', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 6,
					filter: 0,
					compression: 0,
					interlace: 0
				});

				it('should have no background color', function () {
					expect(this.data.backgroundColor).to.be.not.undefined;
				});

				it('should have black as a background color', function () {
					expect(this.data.backgroundColor.red).to.be.equal(255);
					expect(this.data.backgroundColor.green).to.be.equal(255);
					expect(this.data.backgroundColor.blue).to.be.equal(255);
				});
			});

			describe('16-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'background'],
					resourceFile: 'bgyn6a16', // yellow background
					imageCheck: true,
					decodeOptions: { background: true },

					chunkTypes: ['gAMA', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 16,
					colorType: 6,
					filter: 0,
					compression: 0,
					interlace: 0
				});

				it('should have no background color', function () {
					expect(this.data.backgroundColor).to.be.not.undefined;
				});

				it('should have black as a background color', function () {
					expect(this.data.backgroundColor.red).to.be.equal(255);
					expect(this.data.backgroundColor.green).to.be.equal(255);
					expect(this.data.backgroundColor.blue).to.be.equal(0);
				});
			});
		});
	});
});

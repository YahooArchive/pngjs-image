// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Gamma', function () {

	describe('0.35', function () {

		before(function () {
			this.gamma = 0.35;
		});

		describe('GrayScale with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g03n0g16',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});
			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('True-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g03n2c08',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});
			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('Indexed-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g03n3p04',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});
	});

	describe('0.45', function () {

		before(function () {
			this.gamma = 0.45;
		});

		describe('GrayScale with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g04n0g16',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('True-Color', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g04n2c08',
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('Indexed-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g04n3p04',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});
	});

	describe('0.55', function () {

		before(function () {
			this.gamma = 0.55;
		});

		describe('GrayScale with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g05n0g16',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('True-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g05n2c08',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('Indexed-Color', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g05n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});
	});

	describe('0.70', function () {

		before(function () {
			this.gamma = 0.70;
		});

		describe('GrayScale', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g07n0g16',
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('True-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g07n2c08',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('Indexed-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g07n3p04',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});
	});

	describe('1.00', function () {

		before(function () {
			this.gamma = 1.00;
		});

		describe('GrayScale', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g10n0g16',
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('True-Color', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g10n2c08',
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('Indexed-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g10n3p04',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});
	});

	describe('2.50', function () {

		before(function () {
			this.gamma = 2.50;
		});

		describe('GrayScale with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g25n0g16',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('True-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g25n2c08',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});

		describe('Indexed-Color with Gamma', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'gamma'],
				resourceFile: 'g25n3p04',
				imageCheck: true,
				decodeOptions: { gamma: true },

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 0
			});

			it('should have volatile data', function () {
				expect(this.data.volatile).to.be.not.undefined;
			});

			it('should have gamma', function () {
				expect(this.data.volatile.gamma).to.be.equal(this.gamma);
			});
		});
	});
});

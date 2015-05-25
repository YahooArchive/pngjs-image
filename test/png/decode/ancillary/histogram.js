// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Histogram', function () {

	describe('15 colors', function () {

		testGen.addTests({
			resourceGroup: ['ancillary', 'histogram'],
			resourceFile: 'ch1n3p04',
			imageCheck: true,

			chunkTypes: ['gAMA', 'hIST', 'PLTE'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 4,
			colorType: 3,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have a histogram', function () {
			expect(this.data.histogram).to.be.not.undefined;
		});

		it('should have a length of 15 histogram values', function () {
			expect(this.data.histogram).to.be.an('array');
			expect(this.data.histogram.length).to.be.equal(15);
		});

		it('should have histogram values', function () {
			expect(this.data.histogram).to.be.deep.equal([
				64, 112, 48, 96, 96, 32, 32, 80, 16, 128, 64, 16, 48, 80, 112
			]);
		});

		it('should have the same length as the PLTE chunk', function () {
			expect(this.data.histogram.length).to.be.equal(this.data.volatile.paletteColors.length);
		});
	});

	describe('256 colors', function () {

		testGen.addTests({
			resourceGroup: ['ancillary', 'histogram'],
			resourceFile: 'ch2n3p08',
			imageCheck: true,

			chunkTypes: ['gAMA', 'hIST', 'PLTE'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 8,
			colorType: 3,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have a histogram', function () {
			expect(this.data.histogram).to.be.not.undefined;
		});

		it('should have a length of 256 histogram values', function () {
			expect(this.data.histogram).to.be.an('array');
			expect(this.data.histogram.length).to.be.equal(256);
		});

		it('should have the same length as the PLTE chunk', function () {
			expect(this.data.histogram.length).to.be.equal(this.data.volatile.paletteColors.length);
		});
	});
});

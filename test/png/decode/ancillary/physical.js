// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Physical Dimensions', function () {

	describe('8x32 flat pixels', function () {

		testGen.addDecodeTests({
			resourceGroup: ['ancillary', 'physical'],
			resourceFile: 'cdfn2c08',
			imageCheck: true,

			chunkTypes: ['gAMA', 'pHYs', 'zzZz'],

			headerCheck: true,
			width: 8,
			height: 32,
			bitDepth: 8,
			colorType: 2,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have physical data', function () {
			expect(this.data.physicalSize).to.be.not.undefined;
		});

		it('should have unit', function () {
			expect(this.data.physicalSize.unit).to.be.equal(0);
		});

		it('should have extend', function () {
			expect(this.data.physicalSize.xPixelPerUnit).to.be.equal(1);
			expect(this.data.physicalSize.yPixelPerUnit).to.be.equal(4);
		});
	});

	describe('32x8 high pixels', function () {

		testGen.addDecodeTests({
			resourceGroup: ['ancillary', 'physical'],
			resourceFile: 'cdhn2c08',
			imageCheck: true,

			chunkTypes: ['gAMA', 'pHYs', 'zzZz'],

			headerCheck: true,
			width: 32,
			height: 8,
			bitDepth: 8,
			colorType: 2,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have physical data', function () {
			expect(this.data.physicalSize).to.be.not.undefined;
		});

		it('should have unit', function () {
			expect(this.data.physicalSize.unit).to.be.equal(0);
		});

		it('should have extend', function () {
			expect(this.data.physicalSize.xPixelPerUnit).to.be.equal(4);
			expect(this.data.physicalSize.yPixelPerUnit).to.be.equal(1);
		});
	});

	describe('8x8 square pixels', function () {

		testGen.addDecodeTests({
			resourceGroup: ['ancillary', 'physical'],
			resourceFile: 'cdsn2c08',
			imageCheck: true,

			chunkTypes: ['gAMA', 'pHYs', 'zzZz'],

			headerCheck: true,
			width: 8,
			height: 8,
			bitDepth: 8,
			colorType: 2,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have physical data', function () {
			expect(this.data.physicalSize).to.be.not.undefined;
		});

		it('should have unit', function () {
			expect(this.data.physicalSize.unit).to.be.equal(0);
		});

		it('should have extend', function () {
			expect(this.data.physicalSize.xPixelPerUnit).to.be.equal(1);
			expect(this.data.physicalSize.yPixelPerUnit).to.be.equal(1);
		});
	});

	describe('1000 pixels per meter', function () {

		testGen.addDecodeTests({
			resourceGroup: ['ancillary', 'physical'],
			resourceFile: 'cdun2c08',
			imageCheck: true,

			chunkTypes: ['gAMA', 'pHYs', 'zzZz'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 8,
			colorType: 2,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have physical data', function () {
			expect(this.data.physicalSize).to.be.not.undefined;
		});

		it('should have unit', function () {
			expect(this.data.physicalSize.unit).to.be.equal(1);
		});

		it('should have extend', function () {
			expect(this.data.physicalSize.xPixelPerUnit).to.be.equal(1000);
			expect(this.data.physicalSize.yPixelPerUnit).to.be.equal(1000);
		});
	});
});

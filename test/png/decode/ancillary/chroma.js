// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Chroma', function () {

	describe('True-Color', function () {

		testGen.addDecodeTests({
			resourceGroup: ['ancillary', 'chroma'],
			resourceFile: 'ccwn2c08',
			imageCheck: true,

			chunkTypes: ['gAMA', 'cHRM'],

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

		it('should have white-point', function () {
			expect(this.data.volatile.chromaticities.whitePointX).to.be.equal(0.3127);
			expect(this.data.volatile.chromaticities.whitePointY).to.be.equal(0.3290);
		});

		it('should have red', function () {
			expect(this.data.volatile.chromaticities.redX).to.be.equal(0.64);
			expect(this.data.volatile.chromaticities.redY).to.be.equal(0.33);
		});

		it('should have green', function () {
			expect(this.data.volatile.chromaticities.greenX).to.be.equal(0.30);
			expect(this.data.volatile.chromaticities.greenY).to.be.equal(0.60);
		});

		it('should have blue', function () {
			expect(this.data.volatile.chromaticities.blueX).to.be.equal(0.15);
			expect(this.data.volatile.chromaticities.blueY).to.be.equal(0.06);
		});
	});

	describe('Indexed-Color', function () {

		testGen.addDecodeTests({
			resourceGroup: ['ancillary', 'chroma'],
			resourceFile: 'ccwn3p08',
			imageCheck: true,

			chunkTypes: ['gAMA', 'cHRM'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 8,
			colorType: 3,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have volatile data', function () {
			expect(this.data.volatile).to.be.not.undefined;
		});

		it('should have white-point', function () {
			expect(this.data.volatile.chromaticities.whitePointX).to.be.equal(0.3127);
			expect(this.data.volatile.chromaticities.whitePointY).to.be.equal(0.3290);
		});

		it('should have red', function () {
			expect(this.data.volatile.chromaticities.redX).to.be.equal(0.64);
			expect(this.data.volatile.chromaticities.redY).to.be.equal(0.33);
		});

		it('should have green', function () {
			expect(this.data.volatile.chromaticities.greenX).to.be.equal(0.30);
			expect(this.data.volatile.chromaticities.greenY).to.be.equal(0.60);
		});

		it('should have blue', function () {
			expect(this.data.volatile.chromaticities.blueX).to.be.equal(0.15);
			expect(this.data.volatile.chromaticities.blueY).to.be.equal(0.06);
		});
	});
});

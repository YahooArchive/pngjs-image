// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Intent', function () {

	describe('Single', function () {

		testGen.addDecodeTests({
			resourceGroup: ['ancillary', 'intent'],
			resourceFile: 'sRGB_single',
			imageCheck: true,

			chunkTypes: ['sRGB'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 8,
			colorType: 6,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have volatile data', function () {
			expect(this.data.volatile).to.be.not.undefined;
		});

		it('should have the intent', function () {
			expect(this.data.volatile.renderingIntent).to.be.equal(1);
		});
	});
});

// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('jsOn', function () {

	describe('Single', function () {

		testGen.addDecodeTests({
			resourceGroup: ['custom', 'json'],
			resourceFile: 'jsOn_single',
			imageCheck: true,

			chunkTypes: ['jsOn'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 8,
			colorType: 6,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have JSON data', function () {
			expect(this.data.JSON).to.be.not.undefined;
			expect(this.data.JSON.length).to.be.not.equal(0);
		});

		describe('JSON Data', function () {

			it('should have one entry data', function () {
				expect(this.data.JSON.length).to.be.equal(1);
			});

			it('should have keyword', function () {
				expect(this.data.JSON[0].keyword).to.be.equal("very important data");
			});

			it('should have content', function () {
				expect(this.data.JSON[0].content).to.be.deep.equal({
					answer: 42,
					definition: "the answer to life the universe and everything"
				});
			});
		});
	});
});

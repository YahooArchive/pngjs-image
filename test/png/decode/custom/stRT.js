// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('stRT', function () {

	describe('Single', function () {

		testGen.addDecodeTests({
			resourceGroup: ['custom', 'structure'],
			resourceFile: 'stRT_single',
			imageCheck: true,

			chunkTypes: ['stRT'],

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
			expect(this.data.volatile).to.be.not.undefined;
			expect(this.data.volatile.structures).to.be.not.undefined;
			expect(this.data.volatile.structures.length).to.be.not.equal(0);
		});

		describe('Structured Data', function () {

			it('should have one entry data', function () {
				expect(this.data.volatile.structures.length).to.be.equal(1);
			});

			it('should have type', function () {
				expect(this.data.volatile.structures[0].type).to.be.equal("test");
			});

			it('should have major', function () {
				expect(this.data.volatile.structures[0].major).to.be.equal(3);
			});

			it('should have minor', function () {
				expect(this.data.volatile.structures[0].minor).to.be.equal(7);
			});

			it('should have content', function () {
				expect(this.data.volatile.structures[0].content).to.be.deep.equal({
					answer: 42
				});
			});
		});
	});
});

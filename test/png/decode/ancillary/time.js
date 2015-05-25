// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Modification Time', function () {

	describe('01-Jan-2000 12:34:56', function () {

		testGen.addTests({
			resourceGroup: ['ancillary', 'time'],
			resourceFile: 'cm0n0g04',
			imageCheck: true,

			chunkTypes: ['gAMA', 'tIME'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 4,
			colorType: 0,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have a date', function () {
			expect(this.data.volatile && this.data.volatile.modificationDate).to.be.not.undefined;
		});

		it('should have the UTC date', function () {
			var dateStr = this.data.volatile && this.data.volatile.modificationDate.toUTCString();
			expect(dateStr).to.be.equal("Sat, 01 Jan 2000 12:34:56 GMT");
		});
	});

	describe('01-jan-1970 00:00:00', function () {

		testGen.addTests({
			resourceGroup: ['ancillary', 'time'],
			resourceFile: 'cm7n0g04',
			imageCheck: true,

			chunkTypes: ['gAMA', 'tIME'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 4,
			colorType: 0,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have a date', function () {
			expect(this.data.volatile && this.data.volatile.modificationDate).to.be.not.undefined;
		});

		it('should have the UTC date', function () {
			var dateStr = this.data.volatile && this.data.volatile.modificationDate.toUTCString();
			expect(dateStr).to.be.equal("Thu, 01 Jan 1970 00:00:00 GMT");
		});
	});

	describe('31-dec-1999 23:59:59', function () {

		testGen.addTests({
			resourceGroup: ['ancillary', 'time'],
			resourceFile: 'cm9n0g04',
			imageCheck: true,

			chunkTypes: ['gAMA', 'tIME'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 4,
			colorType: 0,
			filter: 0,
			compression: 0,
			interlace: 0
		});

		it('should have a date', function () {
			expect(this.data.volatile && this.data.volatile.modificationDate).to.be.not.undefined;
		});

		it('should have the UTC date', function () {
			var dateStr = this.data.volatile && this.data.volatile.modificationDate.toUTCString();
			expect(dateStr).to.be.equal("Fri, 31 Dec 1999 23:59:59 GMT");
		});
	});
});

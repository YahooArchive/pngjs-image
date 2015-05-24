// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../testGen');

describe('Ordering', function () {

	describe('1 IDAT chunk', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'ordering',
				resourceFile: 'oi1n0g16', // grayscale
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				colorType: 0,
				bitDepth: 16
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'ordering',
				resourceFile: 'oi1n2c16', // color
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				colorType: 2,
				bitDepth: 16
			});
		});
	});

	describe('2 IDAT chunks', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'ordering',
				resourceFile: 'oi2n0g16', // grayscale
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				colorType: 0,
				bitDepth: 16
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'ordering',
				resourceFile: 'oi2n2c16', // color
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				colorType: 2,
				bitDepth: 16
			});
		});
	});

	describe('4 unequal sized IDAT chunks', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'ordering',
				resourceFile: 'oi4n0g16', // grayscale
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				colorType: 0,
				bitDepth: 16
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'ordering',
				resourceFile: 'oi4n2c16', // color
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				colorType: 2,
				bitDepth: 16
			});
		});
	});

	describe('IDAT chunks with length one', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'ordering',
				resourceFile: 'oi9n0g16', // grayscale
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				colorType: 0,
				bitDepth: 16
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'ordering',
				resourceFile: 'oi9n2c16', // color
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				colorType: 2,
				bitDepth: 16
			});
		});
	});
});

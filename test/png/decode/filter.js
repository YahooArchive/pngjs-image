// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../testGen');

describe('Filter', function () {

	describe('No Filter', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f00n0g08', // grayscale, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 0,
				bitDepth: 8
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f00n2c08', // color, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 2,
				bitDepth: 8
			});
		});
	});

	describe('Sub Filter', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f01n0g08', // grayscale, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 0,
				bitDepth: 8
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f01n2c08', // color, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 2,
				bitDepth: 8
			});
		});
	});

	describe('Up Filter', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f02n0g08', // grayscale, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 0,
				bitDepth: 8
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f02n2c08', // color, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 2,
				bitDepth: 8
			});
		});
	});

	describe('Average Filter', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f03n0g08', // grayscale, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 0,
				bitDepth: 8
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f03n2c08', // color, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 2,
				bitDepth: 8
			});
		});
	});

	describe('Paeth Filter', function () {

		describe('GrayScale', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f04n0g08', // grayscale, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 0,
				bitDepth: 8
			});
		});

		describe('Color', function () {

			testGen.addTests({
				resourceGroup: 'filter',
				resourceFile: 'f04n2c08', // color, no interlacing
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				filter: 0,
				colorType: 2,
				bitDepth: 8
			});
		});
	});

	describe('All Filters', function () {

		testGen.addTests({
			resourceGroup: 'filter',
			resourceFile: 'f99n0g04', // bit-depth 4, filter changing per scanline
			imageCheck: true,

			headerCheck: true,
			width: 32,
			height: 32,
			filter: 0,
			colorType: 0,
			bitDepth: 4
		});
	});
});

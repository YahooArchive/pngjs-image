// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

//basi3p01 - 1 bit (2 color) paletted
//basi3p02 - 2 bit (4 color) paletted
//basi3p04 - 4 bit (16 color) paletted
//basi3p08 - 8 bit (256 color) paletted
var testGen = require('../testGen');

describe('Interlace', function () {

	describe('GrayScale', function () {

		describe('1-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi0g01', // black & white
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 1,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('2-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi0g02', // 2 bit (4 level) grayscale
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 2,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('4-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi0g04', // 4 bit (16 level) grayscale
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('8-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi0g08', // 8 bit (256 level) grayscale
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('16-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi0g16', // 16 bit (64k level) grayscale
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});
	});

	describe('GrayScale with Alpha', function () {

		describe('8-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi4a08', // 8 bit grayscale + 8 bit alpha-channel
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 4,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('16-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi4a16', // 16 bit grayscale + 16 bit alpha-channel
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 4,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});
	});

	describe('TrueColor', function () {

		describe('8-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi2c08', // 3x8 bits rgb color
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('16-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi2c16', // 3x16 bits rgb color
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});
	});

	describe('TrueColor with Alpha', function () {

		describe('8-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi6a08', // 3x8 bits rgb color + 8 bit alpha-channel
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 6,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('16-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi6a16', // 3x16 bits rgb color + 16 bit alpha-channel
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 16,
				colorType: 6,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});
	});

	describe('Indexed-Color', function () {

		describe('1-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi3p01', // 1 bit (2 color) paletted
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 1,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('2-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi3p02', // 2 bit (4 color) paletted
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 2,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('4-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi3p04', // 4 bit (16 color) paletted
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});

		describe('8-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: 'interlace',
				resourceFile: 'basi3p08', // 8 bit (256 color) paletted
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 1
			});
		});
	});
});

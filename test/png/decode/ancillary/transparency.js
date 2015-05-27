// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

describe('Transparency', function () {

	describe('Not Transparent', function () {

		describe('GrayScale', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'transparency'],
				resourceFile: 'tp0n0g08',
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 0,
				filter: 0,
				compression: 0,
				interlace: 0
			});
		});

		describe('True-Color', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'transparency'],
				resourceFile: 'tp0n2c08',
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 2,
				filter: 0,
				compression: 0,
				interlace: 0
			});
		});

		describe('Indexed-Color', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'transparency'],
				resourceFile: 'tp0n3p08',
				imageCheck: true,

				chunkTypes: ['gAMA'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 8,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 0
			});
		});
	});

	describe('Transparent', function () {

		describe('GrayScale', function () {

			describe('4-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbbn0g04',
					imageCheck: true,

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 4,
					colorType: 0,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});

			describe('16-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbwn0g16',
					imageCheck: true,

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 16,
					colorType: 0,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});
		});

		describe('True-Color', function () {

			describe('8-bit', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbrn2c08',
					imageCheck: true,

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 2,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});

			describe('16-bit - Use no background', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbbn2c16',
					imageCheck: true,

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 16,
					colorType: 2,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});

			describe('16-bit - Use background', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbgn2c16',
					imageCheck: true,
					decodeOptions: { background: true},

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 16,
					colorType: 2,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});
		});

		describe('Indexed-Color', function () {

			describe('8-bit - Use no background', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbbn3p08',
					imageCheck: true,

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 3,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});

			describe('8-bit - Use background - Gray', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbgn3p08',
					imageCheck: true,
					decodeOptions: { background: true, transparent: true },

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 3,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});

			describe('8-bit - Use background - White', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbwn3p08',
					imageCheck: true,
					decodeOptions: { background: true },

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 3,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});

			describe('8-bit - Use background - No Transparency', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tbyn3p08',
					imageCheck: true,
					decodeOptions: { background: true, transparent: false },

					chunkTypes: ['gAMA', 'tRNS', 'bKGD'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 3,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});

			describe('8-bit - No background', function () {

				testGen.addDecodeTests({
					resourceGroup: ['ancillary', 'transparency'],
					resourceFile: 'tp1n3p08',
					imageCheck: true,

					chunkTypes: ['gAMA', 'tRNS'],

					headerCheck: true,
					width: 32,
					height: 32,
					bitDepth: 8,
					colorType: 3,
					filter: 0,
					compression: 0,
					interlace: 0
				});
			});
		});
	});

	describe('Multi-Level Transparency', function () {

		describe('2-bit', function () {

			testGen.addDecodeTests({
				resourceGroup: ['ancillary', 'transparency'],
				resourceFile: 'tm3n3p02',
				imageCheck: true,

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 2,
				colorType: 3,
				filter: 0,
				compression: 0,
				interlace: 0
			});
		});
	});
});

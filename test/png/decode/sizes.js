// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../testGen');

describe('Sizes', function () {

	describe('1x1', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's01i3p01',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 1,
				height: 1,
				bitDepth: 1,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's01n3p01',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 1,
				height: 1,
				bitDepth: 1,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('2x2', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's02i3p01',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 2,
				height: 2,
				bitDepth: 1,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's02n3p01',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 2,
				height: 2,
				bitDepth: 1,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('3x3', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's03i3p01',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 3,
				height: 3,
				bitDepth: 1,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's03n3p01',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 3,
				height: 3,
				bitDepth: 1,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('4x4', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's04i3p01',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 4,
				height: 4,
				bitDepth: 1,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's04n3p01',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 4,
				height: 4,
				bitDepth: 1,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('5x5', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's05i3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 5,
				height: 5,
				bitDepth: 2,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's05n3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 5,
				height: 5,
				bitDepth: 2,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('6x6', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's06i3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 6,
				height: 6,
				bitDepth: 2,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's06n3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 6,
				height: 6,
				bitDepth: 2,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('7x7', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's07i3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 7,
				height: 7,
				bitDepth: 2,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's07n3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 7,
				height: 7,
				bitDepth: 2,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('8x8', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's08i3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 8,
				height: 8,
				bitDepth: 2,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's08n3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 8,
				height: 8,
				bitDepth: 2,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('9x9', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's09i3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 9,
				height: 9,
				bitDepth: 2,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's09n3p02',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 9,
				height: 9,
				bitDepth: 2,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('32x32', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's32i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's32n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 32,
				height: 32,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('33x33', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's33i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 33,
				height: 33,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's33n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 33,
				height: 33,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('34x34', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's34i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 34,
				height: 34,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's34n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 34,
				height: 34,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('35x35', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's35i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 35,
				height: 35,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's35n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 35,
				height: 35,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('36x36', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's36i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 36,
				height: 36,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's36n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 36,
				height: 36,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('37x37', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's37i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 37,
				height: 37,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's37n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 37,
				height: 37,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('38x38', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's38i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 38,
				height: 38,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's38n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 38,
				height: 38,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('39x39', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's39i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 39,
				height: 39,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's39n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 39,
				height: 39,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});

	describe('40x40', function () {

		describe('Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's40i3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 40,
				height: 40,
				bitDepth: 4,
				colorType: 3,
				interlace: 1
			});
		});

		describe('Not Interlaced', function () {

			testGen.addDecodeTests({
				resourceGroup: 'sizes',
				resourceFile: 's40n3p04',
				imageCheck: true,

				chunkTypes: ['gAMA', 'PLTE', 'sBIT'],

				headerCheck: true,
				width: 40,
				height: 40,
				bitDepth: 4,
				colorType: 3,
				interlace: 0
			});
		});
	});
});

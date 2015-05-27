// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../testGen');

// The following images have additional palettes available that can be used instead of the true-color data.
// PNGjs-Image doesn't use them right now, but collects the data in a PLTE chunk - the client can use this data
// to do some magic. Here, we just want to make sure that it reads the PLTE chunk if available.
describe('Palette', function () {

	describe('True-Color', function () {

		testGen.addDecodeTests({
			resourceGroup: 'palette',
			resourceFile: 'pp0n2c16', // six-cube palette-chunk in true-color image
			imageCheck: true,

			chunkTypes: ['gAMA', 'PLTE'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 16,
			colorType: 2
		});
	});

	describe('True-Color with Alpha', function () {

		testGen.addDecodeTests({
			resourceGroup: 'palette',
			resourceFile: 'pp0n6a08', // six-cube palette-chunk in true-color+alpha image
			imageCheck: true,

			chunkTypes: ['gAMA', 'PLTE'],

			headerCheck: true,
			width: 32,
			height: 32,
			bitDepth: 8,
			colorType: 6
		});
	});
});

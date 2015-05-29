// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');

describe('sRGB', function () {

	describe('Single', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'intent'],
			outputFile: 'sRGB_single',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				renderingIntent: 1 // Relative colorimetric
			}
		});
	});
});

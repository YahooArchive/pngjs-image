// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../testGen');

describe('Interlace', function () {

	describe('No Interlace', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: 'interlace',
			outputFile: 'no_interlace',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				filter: 0,
				interlace: 0
			}
		});
	});

	describe('With Interlace', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: 'interlace',
			outputFile: 'with_interlace',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				filter: 0,
				interlace: 1
			}
		});
	});
});

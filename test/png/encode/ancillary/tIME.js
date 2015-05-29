// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');

describe('tIME', function () {

	describe('Single', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'time'],
			outputFile: 'tIME_single',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				modificationDate: new Date('Fri, 29 May 2015 06:32:11 GMT')
			}
		});
	});
});

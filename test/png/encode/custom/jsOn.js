// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');

describe('jsOn', function () {

	describe('Single', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['custom', 'json'],
			outputFile: 'jsOn_single',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				JSON: [
					{
						keyword: "very important data",
						content: {
							answer: 42,
							definition: "the answer to life the universe and everything"
						}
					}
				]
			}
		});
	});
});

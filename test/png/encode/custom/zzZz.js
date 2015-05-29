// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');

describe('zzZz', function () {

	describe('Safe to Copy', function () {

		describe('Single', function () {

			testGen.addEncodeTests({
				resourceGroup: [],
				resourceFile: 'base',
				outputGroup: ['custom', 'unknown'],
				outputFile: 'zzZz_safe_single',

				imageCheck: true,
				width: 32,
				height: 32,

				encodeOptions: {
					unknownChunks: [
						{
							type: "teST",
							data: new Buffer('this is a test', 'utf8')
						}
					]
				}
			});
		});
	});
});

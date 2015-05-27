// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../testGen');

describe('Encode', function () {

	describe('Basic Encoding', function () {

		testGen.addEncodeTests({
			resourceGroup: 'basic',
			resourceFile: 'basn0g01',
			imageCheck: true,
			width: 32,
			height: 32
		});
	});
});

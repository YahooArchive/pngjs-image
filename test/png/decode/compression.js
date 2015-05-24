// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../testGen');

describe('Compression', function () {

	describe('Level 0 - none', function () {

		testGen.addTests({
			resourceGroup: 'compression',
			resourceFile: 'z00n2c08', // color, no interlacing, compression level 0 (none)
			imageCheck: true,
			width: 32,
			height: 32
		});
	});

	describe('Level 3', function () {

		testGen.addTests({
			resourceGroup: 'compression',
			resourceFile: 'z03n2c08', // color, no interlacing, compression level 3
			imageCheck: true,
			width: 32,
			height: 32
		});
	});

	describe('Level 6 - default', function () {

		testGen.addTests({
			resourceGroup: 'compression',
			resourceFile: 'z06n2c08', // color, no interlacing, compression level 6 (default)
			imageCheck: true,
			width: 32,
			height: 32
		});
	});

	describe('Level 9 - maximum', function () {

		testGen.addTests({
			resourceGroup: 'compression',
			resourceFile: 'z09n2c08', // color, no interlacing, compression level 9 (maximum)
			imageCheck: true,
			width: 32,
			height: 32
		});
	});
});

// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

//xhdn0g08 - incorrect IHDR checksum
//xcsn0g01 - incorrect IDAT checksum
var testGen = require('../testGen');

describe('Corrupted files', function () {

	describe('Signature', function () {

		describe('Signature byte 1 MSBit reset to zero', function () {
			testGen.addDecodeTests({
				resourceGroup: 'corrupt',
				resourceFile: 'xs2n0g01',
				expectFailure: true,
				expectMessage: 'Invalid signature for a PNG image.'
			});
		});

		describe('Signature byte 2 is a "Q"', function () {
			testGen.addDecodeTests({
				resourceGroup: 'corrupt',
				resourceFile: 'xs1n0g01',
				expectFailure: true,
				expectMessage: 'Invalid signature for a PNG image.'
			});
		});

		describe('Signature byte 4 lowercase', function () {
			testGen.addDecodeTests({
				resourceGroup: 'corrupt',
				resourceFile: 'xs4n0g01',
				expectFailure: true,
				expectMessage: 'Invalid signature for a PNG image.'
			});
		});

		describe('7th byte a space instead of control-Z', function () {
			testGen.addDecodeTests({
				resourceGroup: 'corrupt',
				resourceFile: 'xs7n0g01',
				expectFailure: true,
				expectMessage: 'Invalid signature for a PNG image.'
			});
		});

		describe('added cr bytes', function () {
			testGen.addDecodeTests({
				resourceGroup: 'corrupt',
				resourceFile: 'xcrn0g04',
				expectFailure: true,
				expectMessage: 'Invalid signature for a PNG image.'
			});
		});

		describe('added lf bytes', function () {
			testGen.addDecodeTests({
				resourceGroup: 'corrupt',
				resourceFile: 'xlfn0g04',
				expectFailure: true,
				expectMessage: 'Invalid signature for a PNG image.'
			});
		});
	});

	describe('Header', function () {

		describe('Color-Type', function () {

			describe('1', function () {
				testGen.addDecodeTests({
					resourceGroup: 'corrupt',
					resourceFile: 'xc1n0g08',
					expectFailure: true,
					expectMessage: 'Unknown color-type 1.'
				});
			});

			describe('9', function () {
				testGen.addDecodeTests({
					resourceGroup: 'corrupt',
					resourceFile: 'xc9n2c08',
					expectFailure: true,
					expectMessage: 'Unknown color-type 9.'
				});
			});
		});

		describe('Bit-Depth', function () {

			describe('0', function () {
				testGen.addDecodeTests({
					resourceGroup: 'corrupt',
					resourceFile: 'xd0n2c08',
					expectFailure: true,
					expectMessage: 'Unknown bit-depth of 0.'
				});
			});

			describe('3', function () {
				testGen.addDecodeTests({
					resourceGroup: 'corrupt',
					resourceFile: 'xd3n2c08',
					expectFailure: true,
					expectMessage: 'Unknown bit-depth of 3.'
				});
			});

			describe('99', function () {
				testGen.addDecodeTests({
					resourceGroup: 'corrupt',
					resourceFile: 'xd9n2c08',
					expectFailure: true,
					expectMessage: 'Unknown bit-depth of 99.'
				});
			});
		});
	});

	describe('Data', function () {

		describe('Missing IDAT', function () {
			testGen.addDecodeTests({
				resourceGroup: 'corrupt',
				resourceFile: 'xdtn0g01',
				expectFailure: true,
				expectMessage: 'Could not retrieve chunk type IDAT.'
			});
		});
	});
});

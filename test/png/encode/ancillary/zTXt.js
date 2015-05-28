// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var os = require('os');
var testGen = require('../../testGen');

describe('zTXt', function () {

	describe('Single', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_single',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: [
					{
						keyword: "test",
						content: "hello world"
					}
				]
			}
		});
	});

	describe('Multiple', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_multiple',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: [
					{
						keyword: "test1",
						content: "hello world1"
					},
					{
						keyword: "test2",
						content: "hello world2"
					},
					{
						keyword: "test3",
						content: "hello world3"
					}
				]
			}
		});
	});

	describe('Empty', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_empty',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: []
			}
		});
	});

	describe('Special Characters', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_special_chars',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: [
					{
						keyword: "test",
						content: "hello © world"
					}
				]
			}
		});
	});

	describe('Long Keyword', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_long_keyword',

			expectFailure: true,
			expectMessage: 'Keyword cannot be longer than 79 characters.',

			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: [
					{
						keyword: "12345678901234567890123456789012345678901234567890123456789012345678901234567890", // 80
						content: "hello world"
					}
				]
			}
		});
	});

	describe('Empty Keyword', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_empty_keyword',

			expectFailure: true,
			expectMessage: 'Keyword needs to have a least one character.',

			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: [
					{
						keyword: "",
						content: "hello world"
					}
				]
			}
		});
	});

	describe('Default Keyword', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_default_keyword',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: [
					{ // Keyword: "Title"
						content: "hello world"
					}
				]
			}
		});
	});

	describe('No Content Keyword', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_no_content',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: [
					{
						keyword: "test"
					}
				]
			}
		});
	});

	describe('New linew', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['ancillary', 'text'],
			outputFile: 'zTXt_new_line',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				compressedTexts: [
					{
						keyword: "test",
						content: "hello" + os.EOL + "world"
					}
				]
			}
		});
	});
});

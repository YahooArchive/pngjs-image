// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');

describe('stRT', function () {

	describe('Single', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: ['custom', 'structure'],
			outputFile: 'stRT_single',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
				structures: [
					{
						type: "test",
						major: 3,
						minor: 7,
						content: {
							answer: 42
						}
					}
				]
			}
		});
	});

	//describe('Multiple', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: ['custom', 'structure'],
	//		outputFile: 'stRT_multiple',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//			structures: [
	//				{
	//					keyword: "test1",
	//					content: "hello world1"
	//				},
	//				{
	//					keyword: "test2",
	//					content: "hello world2"
	//				},
	//				{
	//					keyword: "test3",
	//					content: "hello world3"
	//				}
	//			]
	//		}
	//	});
	//});
  //
	//describe('Empty', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: ['custom', 'structure'],
	//		outputFile: 'stRT_empty',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//			structures: []
	//		}
	//	});
	//});
  //
	//describe('Special Characters', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: ['custom', 'structure'],
	//		outputFile: 'stRT_special_chars',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//			structures: [
	//				{
	//					keyword: "test",
	//					content: "hello © world"
	//				}
	//			]
	//		}
	//	});
	//});
  //
	//describe('Long Keyword', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: ['custom', 'structure'],
	//		outputFile: 'stRT_long_keyword',
  //
	//		expectFailure: true,
	//		expectMessage: 'Keyword cannot be longer than 79 characters.',
  //
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//			structures: [
	//				{
	//					keyword: "12345678901234567890123456789012345678901234567890123456789012345678901234567890", // 80
	//					content: "hello world"
	//				}
	//			]
	//		}
	//	});
	//});
  //
	//describe('Empty Keyword', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: ['custom', 'structure'],
	//		outputFile: 'stRT_empty_keyword',
  //
	//		expectFailure: true,
	//		expectMessage: 'Keyword needs to have a least one character.',
  //
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//			structures: [
	//				{
	//					keyword: "",
	//					content: "hello world"
	//				}
	//			]
	//		}
	//	});
	//});
  //
	//describe('Default Keyword', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: ['custom', 'structure'],
	//		outputFile: 'stRT_default_keyword',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//			structures: [
	//				{ // Keyword: "Title"
	//					content: "hello world"
	//				}
	//			]
	//		}
	//	});
	//});
  //
	//describe('No Content Keyword', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: ['custom', 'structure'],
	//		outputFile: 'stRT_no_content',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//			structures: [
	//				{
	//					keyword: "test"
	//				}
	//			]
	//		}
	//	});
	//});
  //
	//describe('New linew', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: ['custom', 'structure'],
	//		outputFile: 'stRT_new_line',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//			structures: [
	//				{
	//					keyword: "test",
	//					content: "hello" + os.EOL + "world"
	//				}
	//			]
	//		}
	//	});
	//});
});

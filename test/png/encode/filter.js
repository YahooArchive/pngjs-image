// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../testGen');

describe('Filter', function () {

	describe('Default Filter', function () {

		testGen.addEncodeTests({
			resourceGroup: [],
			resourceFile: 'base',
			outputGroup: 'filter',
			outputFile: 'default_filter',

			imageCheck: true,
			width: 32,
			height: 32,

			encodeOptions: {
			}
		});
	});

	//describe('No Filter', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: 'filter',
	//		outputFile: 'no_filter',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//		}
	//	});
	//});
  //
	//describe('Sub Filter', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: 'filter',
	//		outputFile: 'sub_filter',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//		}
	//	});
	//});
  //
	//describe('Up Filter', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: 'filter',
	//		outputFile: 'up_filter',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//		}
	//	});
	//});
  //
	//describe('Average Filter', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: 'filter',
	//		outputFile: 'average_filter',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//		}
	//	});
	//});
  //
	//describe('Paeth Filter', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: 'filter',
	//		outputFile: 'paeth_filter',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//		}
	//	});
	//});
  //
	//describe('Auto Filters', function () {
  //
	//	testGen.addEncodeTests({
	//		resourceGroup: [],
	//		resourceFile: 'base',
	//		outputGroup: 'filter',
	//		outputFile: 'auto_filter',
  //
	//		imageCheck: true,
	//		width: 32,
	//		height: 32,
  //
	//		encodeOptions: {
	//		}
	//	});
	//});
});

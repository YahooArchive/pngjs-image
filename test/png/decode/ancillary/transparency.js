// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var testGen = require('../../testGen');
var expect = require('chai').expect;

//tbbn2c16 - transparent, blue background chunk
//tbbn3p08 - transparent, black background chunk
//tbgn2c16 - transparent, green background chunk
//tbgn3p08 - transparent, light-gray background chunk
//tbrn2c08 - transparent, red background chunk
//tbwn3p08 - transparent, white background chunk
//tbyn3p08 - transparent, yellow background chunk
//tp1n3p08 - transparent, but no background chunk
//tm3n3p02 - multiple levels of transparency, 3 entries
describe('Transparency', function () {

	//describe('Not Transparent', function () {
  //
	//	describe('GrayScale', function () {
  //
	//		testGen.addTests({
	//			resourceGroup: ['ancillary', 'transparency'],
	//			resourceFile: 'tp0n0g08',
	//			imageCheck: true,
  //
	//			chunkTypes: ['gAMA'],
  //
	//			headerCheck: true,
	//			width: 32,
	//			height: 32,
	//			bitDepth: 8,
	//			colorType: 0,
	//			filter: 0,
	//			compression: 0,
	//			interlace: 0
	//		});
	//	});
  //
	//	describe('True-Color', function () {
  //
	//		testGen.addTests({
	//			resourceGroup: ['ancillary', 'transparency'],
	//			resourceFile: 'tp0n2c08',
	//			imageCheck: true,
  //
	//			chunkTypes: ['gAMA'],
  //
	//			headerCheck: true,
	//			width: 32,
	//			height: 32,
	//			bitDepth: 8,
	//			colorType: 2,
	//			filter: 0,
	//			compression: 0,
	//			interlace: 0
	//		});
	//	});
  //
	//	describe('Indexed-Color', function () {
  //
	//		testGen.addTests({
	//			resourceGroup: ['ancillary', 'transparency'],
	//			resourceFile: 'tp0n3p08',
	//			imageCheck: true,
  //
	//			chunkTypes: ['gAMA'],
  //
	//			headerCheck: true,
	//			width: 32,
	//			height: 32,
	//			bitDepth: 8,
	//			colorType: 3,
	//			filter: 0,
	//			compression: 0,
	//			interlace: 0
	//		});
	//	});
	//});
  //
	//describe('Transparent', function () {
  //
	//	describe('GrayScale', function () {
  //
	//		describe('4-bit', function () {
  //
	//			testGen.addTests({
	//				resourceGroup: ['ancillary', 'transparency'],
	//				resourceFile: 'tbbn0g04',
	//				imageCheck: true,
  //
	//				chunkTypes: ['gAMA', 'tRNS', 'bKGD'],
  //
	//				headerCheck: true,
	//				width: 32,
	//				height: 32,
	//				bitDepth: 4,
	//				colorType: 0,
	//				filter: 0,
	//				compression: 0,
	//				interlace: 0
	//			});
	//		});
  //
	//		describe('16-bit', function () {
  //
	//			testGen.addTests({
	//				resourceGroup: ['ancillary', 'transparency'],
	//				resourceFile: 'tbwn0g16',
	//				imageCheck: true,
  //
	//				chunkTypes: ['gAMA', 'tRNS', 'bKGD'],
  //
	//				headerCheck: true,
	//				width: 32,
	//				height: 32,
	//				bitDepth: 16,
	//				colorType: 0,
	//				filter: 0,
	//				compression: 0,
	//				interlace: 0
	//			});
	//		});
	//	});
	//});
});

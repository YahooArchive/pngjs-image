// Copyright 2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var PNGImage = require('../index');
var fs = require('fs');

//var image = PNGImage.readImageSync(__dirname + '/firefox  37.0 Windows 8.1 1.png');
process.stdin.on('data', function (data) {
	console.log('started');
	console.time('image');
	var image = PNGImage.readImageSync(__dirname + '/firefox  37.0 Windows 8.1 1.png');
	console.timeEnd('image');
	console.log('Done');
});

// Copyright 2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var PNGImage = require('../index');

PNGImage.readImage(__dirname + '/squirrel.png', function (err, image) {

	if (err) {
		throw err;
	}

	image = image.rotateCCW();
	//image = image.rotateCW();

	image.writeImage(__dirname + '/rotatedSquirrel.png', function (err) {
		if (err) throw err;

		console.log('Done');
	});
});

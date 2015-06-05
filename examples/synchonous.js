// Copyright 2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var PNGImage = require('../index');

var image = PNGImage.readImageSync(__dirname + '/eye.png');

// Black-out an area
image.fillRect(17, 10, 15, 20, {
	red: 0, green: 0, blue: 0, alpha: 255
});

console.log('Modified!');

image.writeImageSync(__dirname + '/eye_output.png');

console.log('Done');

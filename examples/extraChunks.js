// Copyright 2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var PNGImage = require('../index');

var image = PNGImage.readImageSync(__dirname + '/eye.png');

//TODO

image.writeImageSync(__dirname + '/eye_ouput.png');

console.log('Done');

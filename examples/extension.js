
// Instrument the environment to support PNG in require
require('..').instrument();

// Load image file with require
var image = require('./squirrel.png');

// As an example, write it to a file
image.writeImageSync('./exp_squirrel.png');


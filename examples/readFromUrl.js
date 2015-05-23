// Copyright 2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var PNGImage = require('../index');

PNGImage.readImage('https://s.yimg.com/rz/l/yahoo_en-US_f_p_142x37_2x.png', function (err, image) {
	if (err) throw err;

	image.writeImage(__dirname + '/url_image.png', function (err) {
		if (err) throw err;

		console.log('done');
	});
});

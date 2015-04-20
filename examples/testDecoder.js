var Decoder = require('../lib/png/decoder');
var Encoder = require('../lib/png/encoder');
//	//var decoder = new Decoder(content, 0);
//	//var result = decoder.decode();
//
//	//console.log(result);
//
//	//result.copy(image._image.data, 0, 0, image._image.data.length);
//	console.log('done');
//
//	//image._image.data = result;
//	image.writeImage(__dirname + '/test_out.png', function (err) {
//		if (err) throw err;
//		console.log('Done!')
//	});
//});
//


// Copyright 2014-2015, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var PNGImage = require('../index'),
	fs = require('fs');

var blob = fs.readFileSync(__dirname + '/a1.png');

// Load the image from a blob
var image = PNGImage.loadImage(blob, function (err, image) {

	var newImage;

	if (err) {
		throw err;
	}

	//var decoder = new Decoder(blob, 0);
	//var result = decoder.decode();
	image = PNGImage.loadImageSync(blob);

	////result.copy(image._image.data, 0, 0, result.length);
	//for(var i = 0; i < image._image.data.length; i++) {
	//	if (image._image.data[i] != result[i]) {
	//		console.log('different');
	//	}
	//}


	// Export it
	image.writeImage(__dirname + '/export2.png', function (err) {
		if (err) throw err;

		image.writeImageSync(__dirname + '/a3.png');
		//var encoder = new Encoder(image.getWidth(), image.getHeight(), image._image.data, 0);
        //
		//fs.writeFileSync(__dirname + '/a2.png', encoder.encode());

		console.log('Done');
	});
});

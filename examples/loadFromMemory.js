// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var PNGImage = require('../index'),
    fs = require('fs');

var blob = fs.readFileSync(__dirname + '/squirrel.png');

// Load the image from a blob
var image = PNGImage.loadImage(blob, function (err, image) {

    var newImage;

    if (err) {
        throw err;
    }

    // Make some areas transparent
    image.fillRect(150, 140, 200, 200, {
        alpha: 100
    });

    // Black-out an area
    image.fillRect(215, 235, 80, 20, {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 255
    });

    console.log('modified!');

    // Export it
    image.writeImage(__dirname + '/export.png', function (err) {
        if (err) throw err;

        console.log('apply gray-scale filter...');
        newImage = image.applyFilters("grayScale", true);
        newImage.writeImage(__dirname + '/export_grayScale.png', function (err) {
            if (err) throw err;

            console.log('apply lightness filter...');
            newImage = image.applyFilters("lightness", true);
            newImage.writeImage(__dirname + '/export_lightness.png', function (err) {
                if (err) throw err;

                console.log('apply luma filter...');
                newImage = image.applyFilters("luma", true);
                newImage.writeImage(__dirname + '/export_luma.png', function (err) {
                    if (err) throw err;

                    console.log('apply sepia filter...');
                    newImage = image.applyFilters("sepia", true);
                    newImage.writeImage(__dirname + '/export_sepia.png', function (err) {
                        if (err) throw err;

                        console.log('apply blur filter...');
                        newImage = image.applyFilters("blur", true);
                        newImage.writeImage(__dirname + '/export_blur.png', function (err) {
                            if (err) throw err;

                            console.log('apply luminosity filter...');
                            newImage = image.applyFilters("luminosity", true);
                            newImage.writeImage(__dirname + '/export_luminosity.png', function (err) {
                                if (err) throw err;

                                console.log('done');
                            });
                        });
                    });
                });
            });
        });
    });
});

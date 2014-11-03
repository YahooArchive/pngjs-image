// Copyright 2014 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var PNG = require('pngjs').PNG;
var PNGImage = require('../index');
var expect = require('chai').expect;
var fs = require('fs');

/**
 * Generates an image
 *
 * @param {Buffer} blob
 * @returns {PNGImage}
 */
function generateImage (blob) {

    var png = new PNG({
        width: 2,
        height: 3
    });

    png.data = blob;

    return new PNGImage(png);
}

/**
 * Generates a blob
 *
 * @returns {Buffer}
 */
function generateBlob () {

    var buffer = new Buffer(2 * 3 * 4);

    buffer[0] = 18; // Red
    buffer[1] = 22; // Green
    buffer[2] = 37; // Blue
    buffer[3] = 42; // Alpha

    buffer[4] = 57; // Red
    buffer[5] = 65; // Green
    buffer[6] = 79; // Blue
    buffer[7] = 81; // Alpha

    buffer[8] = 97; // Red
    buffer[9] = 130; // Green
    buffer[10] = 118; // Blue
    buffer[11] = 124; // Alpha

    buffer[12] = 131; // Red
    buffer[13] = 147; // Green
    buffer[14] = 153; // Blue
    buffer[15] = 169; // Alpha

    buffer[16] = 92; // Red
    buffer[17] = 90; // Green
    buffer[18] = 13; // Blue
    buffer[19] = 184; // Alpha

    buffer[20] = 111; // Red
    buffer[21] = 14; // Green
    buffer[22] = 13; // Blue
    buffer[23] = 69; // Alpha

    return buffer;
}

/**
 * Compares the buffer contents of two buffers
 *
 * @param {Buffer} bufferActual
 * @param {Buffer} bufferExpected
 * @param {int} actualOffset
 * @param {int} expectedOffset
 * @param {int} length
 */
function compareBuffers (bufferActual, bufferExpected, actualOffset, expectedOffset, length) {
    for(var i = 0; i < length; i++) {
        expect(bufferActual[actualOffset + i]).to.be.equal(bufferExpected[expectedOffset + i]);
    }
}

describe('Filter', function () {

    it('should have the blur filter', function () {
        expect(PNGImage.filters).to.contain.key("blur");
    });

    it('should have the grayScale filter', function () {
        expect(PNGImage.filters).to.contain.key("grayScale");
    });

    it('should have the lightness filter', function () {
        expect(PNGImage.filters).to.contain.key("lightness");
    });

    it('should have the luma filter', function () {
        expect(PNGImage.filters).to.contain.key("luma");
    });

    it('should have the luminosity filter', function () {
        expect(PNGImage.filters).to.contain.key("luminosity");
    });

    it('should have the sepia filter', function () {
        expect(PNGImage.filters).to.contain.key("sepia");
    });

    it('should add a new filter', function () {
        PNGImage.setFilter('test', function () {});
        expect(PNGImage.filters).to.contain.key("test");
    });

    it('should remove a filter', function () {
        PNGImage.setFilter('test');
        expect(PNGImage.filters).to.not.contain.key("test");
    });
});

describe('Instance', function () {

    beforeEach(function () {
        this.blobCopy = generateBlob();
        this.blob = generateBlob();
        this.instance = generateImage(this.blob);
    });

    describe('Default methods', function () {

        it('should return the initial image', function () {
            expect(this.instance.getImage()).to.be.instanceof(PNG);
            expect(this.instance.getImage().data).to.be.equal(this.blob);
        });

        it('should return the initial blob', function () {
            expect(this.instance.getBlob()).to.be.equal(this.blob);
        });

        it('should return the width', function () {
            expect(this.instance.getWidth()).to.be.equal(2);
        });

        it('should return the height', function () {
            expect(this.instance.getHeight()).to.be.equal(3);
        });

        describe('getIndex', function () {

            it('should get the first index from zero coordinates', function () {
                expect(this.instance.getIndex(0, 0)).to.be.equal(0);
            });

            it('should get the index of second column', function () {
                expect(this.instance.getIndex(1, 0)).to.be.equal(1);
            });

            it('should get the index of second row', function () {
                expect(this.instance.getIndex(0, 1)).to.be.equal(2);
            });

            it('should get the last index from 1/2 coordinates', function () {
                expect(this.instance.getIndex(1, 2)).to.be.equal(5);
            });
        });

        describe('clip', function () {

            it('should not clip same size images', function () {

                this.instance.clip(0, 0, 2, 3);

                expect(this.instance.getBlob().length, this.blobCopy.length);
                compareBuffers(this.instance.getBlob(), this.blobCopy, 0, 0, this.blobCopy.length);
            });

            describe('zero offset', function () {

                it('should clip image', function () {

                    this.instance.clip(0, 0, 2, 2);

                    expect(this.instance.getBlob().length, 2 * 2 * 4);
                });

                it('should copy image when clipping', function () {

                    this.instance.clip(0, 0, 2, 2);

                    compareBuffers(this.instance.getBlob(), this.blobCopy, 0, 0, this.instance.getBlob().length);
                });
            });

            describe('with offset', function () {

                it('should clip image', function () {

                    this.instance.clip(0, 1, 2, 2);

                    expect(this.instance.getBlob().length, 2 * 2 * 4);
                });

                it('should copy image when clipping', function () {

                    this.instance.clip(0, 1, 2, 2);

                    compareBuffers(this.instance.getBlob(), this.blobCopy, 0, 8, this.instance.getBlob().length);
                });
            });
        });

        describe('fillRect', function () {

            it('should fill same size images', function () {
                var blob;

                this.instance.fillRect(0, 0, 2, 3, { red:1, green:2, blue:3, alpha:4 });

                blob = this.instance.getBlob();
                for(var i = 0; i < 2 * 3 * 4; i += 4) {
                    expect(blob[i]).to.be.equal(1);
                    expect(blob[i + 1]).to.be.equal(2);
                    expect(blob[i + 2]).to.be.equal(3);
                    expect(blob[i + 3]).to.be.equal(4);
                }
            });

            it('should fill upper image', function () {
                var blob;

                this.instance.fillRect(0, 0, 2, 2, { red:1, green:2, blue:3, alpha:4 });

                blob = this.instance.getBlob();
                for(var i = 0; i < 2 * 2 * 4; i += 4) {
                    expect(blob[i]).to.be.equal(1);
                    expect(blob[i + 1]).to.be.equal(2);
                    expect(blob[i + 2]).to.be.equal(3);
                    expect(blob[i + 3]).to.be.equal(4);
                }

                // Make sure that the last row is still the old image
                compareBuffers(this.instance.getBlob(), this.blobCopy, 16, 16, 8);
            });

            it('should fill lower image', function () {
                var blob;

                this.instance.fillRect(0, 1, 2, 2, { red:1, green:2, blue:3, alpha:4 });

                blob = this.instance.getBlob();
                for(var i = 8; i < 2 * 2 * 4; i += 4) {
                    expect(blob[i]).to.be.equal(1);
                    expect(blob[i + 1]).to.be.equal(2);
                    expect(blob[i + 2]).to.be.equal(3);
                    expect(blob[i + 3]).to.be.equal(4);
                }

                // Make sure that the first row is still the old image
                compareBuffers(this.instance.getBlob(), this.blobCopy, 0, 0, 8);
            });
        });

        it('should write to a file', function (done) {

            var path = __dirname + '/tmp.png';

            this.instance.writeImage(path, function (err) {

                var contentsActual,
                    contentsExpected;

                if (err) {
                    done(err);
                } else {

                    try {
                        if (fs.existsSync(path)) {
                            contentsActual = fs.readFileSync(path);
                            contentsExpected = fs.readFileSync(__dirname + '/test.png');
                            expect(JSON.stringify(contentsActual)).to.be.equal(JSON.stringify(contentsExpected));
                        }

                        done();
                    } catch (err) {
                        done(err);
                    }
                }
            });
        });

        it('should get blob', function (done) {

            this.instance.toBlob(function (err, contentsActual) {

                var contentsExpected;

                if (err) {
                    done(err);
                } else {

                    try {
                        contentsExpected = fs.readFileSync(__dirname + '/test.png');
                        expect(JSON.stringify(contentsActual)).to.be.equal(JSON.stringify(contentsExpected));

                        done();
                    } catch (err) {
                        done(err);
                    }
                }
            });
        });
    });

    describe('Statics', function () {

        it('should copy the image', function () {
            var copy = PNGImage.copyImage(this.instance);
            expect(this.instance.getBlob().length, copy.getBlob().length);
            compareBuffers(this.instance.getBlob(), copy.getBlob(), 0, 0, copy.getBlob().length);
        });

        it('should read an image', function (done) {

            PNGImage.readImage(__dirname + '/test.png', function (err, image) {

                if (err) {
                    done(err);
                } else {

                    try {
                        expect(image.getBlob().length, this.instance.getBlob().length);
                        compareBuffers(image.getBlob(), this.instance.getBlob(), 0, 0, image.getBlob().length);

                        done();
                    } catch (err) {
                        done(err);
                    }
                }

            }.bind(this));
        });

        it('should load an image', function (done) {

            var contents = fs.readFileSync(__dirname + '/test.png');

            PNGImage.loadImage(contents, function (err, image) {

                if (err) {
                    done(err);
                } else {

                    try {
                        expect(image.getBlob().length, this.instance.getBlob().length);
                        compareBuffers(image.getBlob(), this.instance.getBlob(), 0, 0, image.getBlob().length);

                        done();
                    } catch (err) {
                        done(err);
                    }
                }

            }.bind(this));
        });
    });

    describe('Pixel manipulation', function () {

        describe('color-value', function () {

            it('should return value from first index', function () {
                expect(this.instance._getValue(0, 1)).to.be.equal(this.blob[1]);
            });

            it('should return value from second index', function () {
                expect(this.instance._getValue(3, 0)).to.be.equal(this.blob[3]);
            });

            it('should set the value of first index', function () {
                this.instance._setValue(0, 1, 23);
                expect(this.blob[1]).to.be.equal(23);
            });

            it('should set the value of second index', function () {
                this.instance._setValue(4, 2, 47);
                expect(this.blob[6]).to.be.equal(47);
            });

            it('should set the value with opacity', function () {
                this.instance._setValue(0, 1, 47, 0.5);
                expect(this.blob[1]).to.be.equal(Math.floor(this.blobCopy[1] * 0.5 + 47 * 0.5));
            });
        });

        describe('red', function () {

            beforeEach(function () {
                this.offset = 2 * 4 + 0;
            });

            it('should get the value', function () {
                expect(this.instance.getRed(2)).to.be.equal(this.blob[this.offset]);
            });

            it('should set the value', function () {
                this.instance.setRed(2, 23);
                expect(this.blob[this.offset]).to.be.equal(23);
            });

            it('should set the value with opacity', function () {
                this.instance.setRed(2, 23, 0.5);
                expect(this.blob[this.offset]).to.be.equal(Math.floor(this.blobCopy[this.offset] * 0.5 + 23 * 0.5));
            });
        });

        describe('green', function () {

            beforeEach(function () {
                this.offset = 2 * 4 + 1;
            });

            it('should get the value', function () {
                expect(this.instance.getGreen(2)).to.be.equal(this.blob[this.offset]);
            });

            it('should set the value', function () {
                this.instance.setGreen(2, 23);
                expect(this.blob[this.offset]).to.be.equal(23);
            });

            it('should set the value with opacity', function () {
                this.instance.setGreen(2, 23, 0.5);
                expect(this.blob[this.offset]).to.be.equal(Math.floor(this.blobCopy[this.offset] * 0.5 + 23 * 0.5));
            });
        });

        describe('blue', function () {

            beforeEach(function () {
                this.offset = 2 * 4 + 2;
            });

            it('should get the value', function () {
                expect(this.instance.getBlue(2)).to.be.equal(this.blob[this.offset]);
            });

            it('should set the value', function () {
                this.instance.setBlue(2, 23);
                expect(this.blob[this.offset]).to.be.equal(23);
            });

            it('should set the value with opacity', function () {
                this.instance.setBlue(2, 23, 0.5);
                expect(this.blob[this.offset]).to.be.equal(Math.floor(this.blobCopy[this.offset] * 0.5 + 23 * 0.5));
            });
        });

        describe('alpha', function () {

            beforeEach(function () {
                this.offset = 2 * 4 + 3;
            });

            it('should get the value', function () {
                expect(this.instance.getAlpha(2)).to.be.equal(this.blob[this.offset]);
            });

            it('should set the value', function () {
                this.instance.setAlpha(2, 23);
                expect(this.blob[this.offset]).to.be.equal(23);
            });

            it('should set the value with opacity', function () {
                this.instance.setAlpha(2, 23, 0.5);
                expect(this.blob[this.offset]).to.be.equal(Math.floor(this.blobCopy[this.offset] * 0.5 + 23 * 0.5));
            });
        });

        describe('setAtIndex', function () {

            it('should set red color', function () {
                this.instance.setAtIndex(0, { red:1 });
                expect(this.blob[0]).to.be.equal(1);
            });

            it('should set red color with opacity', function () {
                this.instance.setAtIndex(0, { red:1, opacity:0.5 });
                expect(this.blob[0]).to.be.equal(9);
            });

            it('should set green color', function () {
                this.instance.setAtIndex(1, { green:2 });
                expect(this.blob[5]).to.be.equal(2);
            });

            it('should set green color with opacity', function () {
                this.instance.setAtIndex(1, { green:2, opacity:0.5 });
                expect(this.blob[5]).to.be.equal(33);
            });

            it('should set blue color', function () {
                this.instance.setAtIndex(0, { blue:3 });
                expect(this.blob[2]).to.be.equal(3);
            });

            it('should set blue color with opacity', function () {
                this.instance.setAtIndex(0, { blue:3, opacity:0.5 });
                expect(this.blob[2]).to.be.equal(20);
            });

            it('should set alpha value', function () {
                this.instance.setAtIndex(0, { alpha:4 });
                expect(this.blob[3]).to.be.equal(4);
            });

            it('should set alpha value with opacity', function () {
                this.instance.setAtIndex(0, { alpha:4, opacity:0.5 });
                expect(this.blob[3]).to.be.equal(23);
            });

            it('should ignore colors if none given', function () {
                this.instance.setAtIndex(0, { });
                expect(this.blob[0]).to.be.equal(this.blobCopy[0]);
                expect(this.blob[1]).to.be.equal(this.blobCopy[1]);
                expect(this.blob[2]).to.be.equal(this.blobCopy[2]);
                expect(this.blob[3]).to.be.equal(this.blobCopy[3]);
            });
        });

        describe('set color', function () {

            it('should set value with setAt', function () {
                this.instance.setAt(0, 1, { red:1, green:2, blue:3, alpha:4 });
                expect(this.blob[8]).to.be.equal(1);
                expect(this.blob[9]).to.be.equal(2);
                expect(this.blob[10]).to.be.equal(3);
                expect(this.blob[11]).to.be.equal(4);
            });

            it('should set value with setPixel', function () {
                this.instance.setPixel(0, 1, { red:1, green:2, blue:3, alpha:4 });
                expect(this.blob[8]).to.be.equal(1);
                expect(this.blob[9]).to.be.equal(2);
                expect(this.blob[10]).to.be.equal(3);
                expect(this.blob[11]).to.be.equal(4);
            });
        });

        describe('get color', function () {

            it('should get the color with getColorAtIndex', function () {
                expect(this.instance.getColorAtIndex(1)).to.be.equal(5194041);
            });

            it('should get the color with getColor', function () {
                expect(this.instance.getColor(0, 1)).to.be.equal(7766625);
            });

            it('should get the color with getAtIndex', function () {
                expect(this.instance.getAtIndex(1)).to.be.equal(1364148537);
            });

            it('should get the color with getAt', function () {
                expect(this.instance.getAt(0, 1)).to.be.equal(2088141409);
            });

            it('should get the color with getPixel', function () {
                expect(this.instance.getPixel(0, 1)).to.be.equal(2088141409);
            });
        });

        describe('_calculateColorValue', function () {

            it('should use paint-color when no opacity given', function () {
                expect(this.instance._calculateColorValue(1, 2)).to.be.equal(2);
            });

            it('should apply full color with full opacity', function () {
                expect(this.instance._calculateColorValue(100, 200, 1)).to.be.equal(200);
            });

            it('should apply non of the color with zero opacity', function () {
                expect(this.instance._calculateColorValue(100, 200, 0)).to.be.equal(100);
            });

            it('should apply the color with half opacity', function () {
                expect(this.instance._calculateColorValue(100, 200, 0.5)).to.be.equal(150);
            });

            it('should apply the color with 80% opacity', function () {
                expect(this.instance._calculateColorValue(100, 200, 0.8)).to.be.equal(180);
            });

            it('should apply the color with fraction opacity', function () {
                expect(this.instance._calculateColorValue(100, 200, 1/3)).to.be.equal(133);
            });
        });
    });

    describe('conversion', function () {

        describe('blur', function () {

            it('should give the value of a coordinate with default grayscale function', function () {
                expect(this.instance.getBlurPixel(0, 1)).to.be.equal(78);
            });

            it('should give the value of a coordinate with luminosity', function () {
                expect(this.instance.getBlurPixel(1, 0, 'getLuminosityAtIndex')).to.be.equal(88);
            });

            it('should give the value of a coordinate with luma', function () {
                expect(this.instance.getBlurPixel(1, 2, 'getLuminosityAtIndex')).to.be.equal(96);
            });

            it('should give the value of an index', function () {
                expect(this.instance.getBlurPixelAtIndex(1)).to.be.equal(88);
            });
        });

        describe('YIQ', function () {

            it('should give the value of a coordinate', function () {
                expect(this.instance.getYIQ(0, 1)).to.be.deep.equal({ y:118, i:0, q:0 });
            });

            it('should give the value of an index', function () {
                expect(this.instance.getYIQAtIndex(1)).to.be.deep.equal({ y:64, i:0, q:2 });
            });
        });

        describe('luma', function () {

            it('should give the value of a coordinate', function () {
                expect(this.instance.getLuma(0, 1)).to.be.equal(118);
            });

            it('should give the value of an index', function () {
                expect(this.instance.getLumaAtIndex(1)).to.be.equal(64);
            });
        });

        describe('sepia', function () {

            it('should give the value of a coordinate', function () {
                expect(this.instance.getSepia(0, 1)).to.be.deep.equal({ red: 160, green: 164, blue: 146 });
            });

            it('should give the value of an index', function () {
                expect(this.instance.getSepiaAtIndex(1)).to.be.deep.equal({ red: 87, green: 88, blue: 81 });
            });
        });

        describe('luminosity', function () {

            it('should give the value of a coordinate', function () {
                expect(this.instance.getLuminosity(0, 1)).to.be.equal(122);
            });

            it('should give the value of an index', function () {
                expect(this.instance.getLuminosityAtIndex(1)).to.be.equal(64);
            });
        });

        describe('lightness', function () {

            it('should give the value of a coordinate', function () {
                expect(this.instance.getLightness(0, 1)).to.be.equal(113);
            });

            it('should give the value of an index', function () {
                expect(this.instance.getLightnessAtIndex(1)).to.be.equal(68);
            });
        });

        describe('grayScale', function () {

            it('should give the value of a coordinate', function () {
                expect(this.instance.getGrayScale(0, 1)).to.be.equal(115);
            });

            it('should give the value of an index', function () {
                expect(this.instance.getGrayScaleAtIndex(1)).to.be.equal(67);
            });
        });
    });

    describe('filter', function () {

        it('should apply blur filter', function () {
            this.instance.applyFilters("blur");
            expect(this.instance.getRed(0)).to.be.equal(88);
        });

        it('should apply grayScale filter', function () {
            this.instance.applyFilters("grayScale");
            expect(this.instance.getRed(0)).to.be.equal(25);
        });

        it('should apply lightness filter', function () {
            this.instance.applyFilters("lightness");
            expect(this.instance.getRed(0)).to.be.equal(27);
        });

        it('should apply luma filter', function () {
            this.instance.applyFilters("luma");
            expect(this.instance.getRed(0)).to.be.equal(22);
        });

        it('should apply luminosity filter', function () {
            this.instance.applyFilters("luminosity");
            expect(this.instance.getRed(0)).to.be.equal(22);
        });

        it('should apply sepia filter', function () {
            this.instance.applyFilters("sepia");
            expect(this.instance.getRed(0)).to.be.equal(30);
        });

        it('should apply object filter', function () {
            this.instance.applyFilters({ key:"blur", options: { funcName:"getGrayScaleAtIndex" } });
            expect(this.instance.getRed(0)).to.be.equal(87);
        });

        it('should apply multiple filters', function () {
            this.instance.applyFilters(["luminosity", "sepia"]);
            expect(this.instance.getRed(0)).to.be.equal(29);
        });

        it('should apply multiple filters with different values', function () {
            this.instance.applyFilters(["luminosity", { key:"blur", options: { funcName:"getGrayScaleAtIndex" } }]);
            expect(this.instance.getRed(0)).to.be.equal(88);
        });

        it('should apply multiple filters and ignore unknown', function () {
            this.instance.applyFilters(["luminosity", undefined]);
            expect(this.instance.getRed(0)).to.be.equal(22);
        });

        it('should apply blur filter without modifying image', function () {
            var newImage = this.instance.applyFilters("blur", true);
            expect(this.instance.getRed(0)).to.be.equal(18);
            expect(newImage.getRed(0)).to.be.equal(88);
        });
    });
});


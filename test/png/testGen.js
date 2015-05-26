var expect = require('chai').expect;

var fs = require('fs');

module.exports = {

	/**
	 * @class tests
	 * @method addTests
	 * @param {object} options
	 * @param {string} options.resourceGroup
	 * @param {string} options.resourceFile
	 * @param {object} [options.decodeOptions]
	 * @param {string[]} [options.chunkTypes]
	 * @param {boolean} [options.imageCheck=false]
	 * @param {boolean} [options.headerCheck=false]
	 * @param {int} [options.width=32]
	 * @param {int} [options.height=32]
	 * @param {int} [options.bitDepth=8]
	 * @param {int} [options.colorType=0]
	 * @param {int} [options.filter=0]
	 * @param {int} [options.compression=0]
	 * @param {int} [options.interlace=0]
	 */
	addTests: function (options) {

		before(function () {
			this.file = this.resource(options.resourceGroup, options.resourceFile + '.png');
		});

		it('should decode', function () {
			this.decode(this.file, options.decodeOptions);
		});

		it('should have mandatory chunks', function () {
			expect(this.chunks).to.contain.keys('IDAT', 'IHDR', 'IEND');
		});

		if (options.chunkTypes) {
			it('should have chunks', function () {
				expect(this.chunks).to.contain.keys(options.chunkTypes);
			});
		}

		if (options.imageCheck) {
			it('should load the image buffer', function () {

				var pathRaw = this.resource(options.resourceGroup, options.resourceFile + '.raw'),
					pathPng = this.resource(options.resourceGroup, options.resourceFile + '_trueColor.png');

				if (!fs.existsSync(pathRaw)) {

					fs.writeFileSync(pathRaw, this.image);
					this.encode(pathPng, this.image, options.width, options.height);

					throw new Error('Compare-to image did not exist. Please check manually the image and check it in.');
				}

				this.compareToFile(this.image, pathRaw);
			});
		}

		describe('Data', function () {

			it('should have volatile data', function () {
				if (options.headerCheck) {
					expect(this.data).to.contain.key('volatile');
				}
			});

			if (options.headerCheck) {

				describe('Header', function () {

					before(function () {
						expect(this.data.volatile.header).to.be.not.undefined;
						this.header = this.data.volatile.header;
					});

					it('should have the right resolution', function () {
						expect(this.header.width).to.be.equal(options.width || 32);
						expect(this.header.height).to.be.equal(options.height || 32);
					});

					if (options.bitDepth !== undefined) {
						it('should have the correct bit-depth', function () {
							expect(this.header.bitDepth).to.be.equal(options.bitDepth);
						});
					}

					if (options.colorType !== undefined) {
						it('should have the correct color-type', function () {
							expect(this.header.colorType).to.be.equal(options.colorType);
						});
					}

					if (options.filter !== undefined) {
						it('should have the correct filter method', function () {
							expect(this.header.filter).to.be.equal(options.filter);
						});
					}

					if (options.compression !== undefined) {
						it('should have the correct compression method', function () {
							expect(this.header.compression).to.be.equal(options.compression);
						});
					}

					if (options.interlace !== undefined) {
						it('should have the correct interlace method', function () {
							expect(this.header.interlace).to.be.equal(options.interlace);
						});
					}
				});
			}
		});
	}
};

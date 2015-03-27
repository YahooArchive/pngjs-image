// Copyright 2014, Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var fs            = require('fs'), _ = require('underscore'),

	PNG           = require('pngjs').PNG,

	pixel         = require('./lib/pixel'), conversion = require('./lib/conversion'), filters = require('./lib/filters'),

	streamBuffers = require("stream-buffers");

/**
 * PNGjs-image class
 *
 * @class PNGImage
 * @param {PNG} image png-js object
 * @constructor
 */
function PNGImage (image) {
	image.on('error', function (err) {
		this.log(err.message);
	}.bind(this));
	this._image = image;
}

/**
 * Project version
 *
 * @property version
 * @static
 * @type {string}
 */
PNGImage.version = require('./package.json').version;


/**
 * Filter dictionary
 *
 * @property filters
 * @static
 * @type {object}
 */
PNGImage.filters = {};

/**
 * Sets a filter to the filter list
 *
 * @method setFilter
 * @param {string} key
 * @param {function} [fn]
 */
PNGImage.setFilter = function (key, fn) {
	if (fn) {
		this.filters[key] = fn;
	} else {
		delete this.filters[key];
	}
};


/**
 * Creates an image by dimensions
 *
 * @static
 * @method createImage
 * @param {int} width
 * @param {int} height
 * @return {PNGImage}
 */
PNGImage.createImage = function (width, height) {
	var image = new PNG({
		width: width, height: height
	});
	return new PNGImage(image);
};

/**
 * Copies an already existing image
 *
 * @static
 * @method copyImage
 * @param {PNGImage} image
 * @return {PNGImage}
 */
PNGImage.copyImage = function (image) {
	var newImage = this.createImage(image.getWidth(), image.getHeight());
	image.getImage().bitblt(newImage.getImage(), 0, 0, image.getWidth(), image.getHeight(), 0, 0);
	return newImage;
};

/**
 * Reads an image from the filesystem
 *
 * @static
 * @method readImage
 * @param {string} filename
 * @param {function} fn
 * @return {PNGImage}
 */
PNGImage.readImage = function (filename, fn) {
	var image = new PNG(), resultImage = new PNGImage(image);

	fn = fn || function () {
	};

	fs.createReadStream(filename).once('error', function(err) {
		fn(err, undefined);
	}).pipe(image).once('parsed', function () {
		image.removeListener('error', fn);
		fn(undefined, resultImage);
	}).once('error', function (err) {
		image.removeListener('parsed', fn);
		fn(err, resultImage);
	}).pipe(image);

	return resultImage;
};

/**
 * Loads an image from a blob
 *
 * @static
 * @method loadImage
 * @param {Buffer} blob
 * @param {function} fn
 * @return {PNGImage}
 */
PNGImage.loadImage = function (blob, fn) {
	var image = new PNG(), resultImage = new PNGImage(image);

	fn = fn || function () {
	};

	image.once('error', function (err) {
		fn(err, resultImage);
	});
	image.parse(blob, function () {
		image.removeListener('error', fn);
		fn(undefined, resultImage);
	});

	return resultImage;
};

PNGImage.prototype = {
	/**
 	* Log method that can be overwritten to modify the logging behavior
 	*
 	* @static
 	* @method log
 	* @param {string} text
 	*/
	log: function(){
		return console.log	
	},

	/**
	 * Gets the original png-js object
	 *
	 * @method getImage
	 * @return {PNG}
	 */
	getImage: function () {
		return this._image;
	},

	/**
	 * Gets the image as a blob
	 *
	 * @method getBlob
	 * @return {Buffer}
	 */
	getBlob: function () {
		return this._image.data;
	},


	/**
	 * Gets the width of the image
	 *
	 * @method getWidth
	 * @return {int}
	 */
	getWidth: function () {
		return this._image.width;
	},

	/**
	 * Gets the height of the image
	 *
	 * @method getHeight
	 * @return {int}
	 */
	getHeight: function () {
		return this._image.height;
	},


	/**
	 * Clips the current image by modifying it in-place
	 *
	 * @method clip
	 * @param {int} x Starting x-coordinate
	 * @param {int} y Starting y-coordinate
	 * @param {int} width Width of area relative to starting coordinate
	 * @param {int} height Height of area relative to starting coordinate
	 */
	clip: function (x, y, width, height) {

		var image;

		width = Math.min(width, this.getWidth() - x);
		height = Math.min(height, this.getHeight() - y);

		if ((width < 0) || (height < 0)) {
			throw new Error('Width and height cannot be negative.');
		}

		image = new PNG({
			width: width, height: height
		});

		this._image.bitblt(image, x, y, width, height, 0, 0);
		this._image = image;
	},

	/**
	 * Fills an area with the specified color
	 *
	 * @method fillRect
	 * @param {int} x Starting x-coordinate
	 * @param {int} y Starting y-coordinate
	 * @param {int} width Width of area relative to starting coordinate
	 * @param {int} height Height of area relative to starting coordinate
	 * @param {object} color
	 * @param {int} [color.red] Red channel of color to set
	 * @param {int} [color.green] Green channel of color to set
	 * @param {int} [color.blue] Blue channel of color to set
	 * @param {int} [color.alpha] Alpha channel for color to set
	 * @param {float} [color.opacity] Opacity of color
	 */
	fillRect: function (x, y, width, height, color) {
		var i, iLen = x + width, j, jLen = y + height, index;

		for (i = x; i < iLen; i++) {
			for (j = y; j < jLen; j++) {
				index = this.getIndex(i, j);
				this.setAtIndex(index, color);
			}
		}
	},


	/**
	 * Applies a list of filters to the image
	 *
	 * @method applyFilters
	 * @param {string|object|object[]} filters Names of filters in sequence `{key:<string>, options:<object>}`
	 * @param {boolean} [returnResult=false]
	 * @return {PNGImage}
	 */
	applyFilters: function (filters, returnResult) {

		var image, newFilters;

		// Convert to array
		if (_.isString(filters)) {
			filters = [filters];
		} else if (!_.isArray(filters) && _.isObject(filters)) {
			filters = [filters];
		}

		// Format array as needed by the function
		newFilters = [];
		_.each(filters, function (filter) {

			if (_.isString(filter)) {
				newFilters.push({key: filter, options: {}});

			} else if (_.isObject(filter)) {
				newFilters.push(filter);
			}
		});
		filters = newFilters;

		// Process filters
		image = this;
		_.each(filters, function (filter) {

			var currentFilter = PNGImage.filters[filter.key];

			if (!currentFilter) {
				throw new Error('Unknown filter ' + filter.key);
			}

			filter.options = filter.options || {};
			filter.options.needsCopy = !!returnResult;

			image = currentFilter(this, filter.options);

		}, this);

		// Overwrite current image, or just returning it
		if (!returnResult) {
			this._image = image.getImage();
		}

		return image;
	},


	/**
	 * Gets index of a specific coordinate
	 *
	 * @method getIndex
	 * @param {int} x X-coordinate of pixel
	 * @param {int} y Y-coordinate of pixel
	 * @return {int} Index of pixel
	 */
	getIndex: function (x, y) {
		return (this.getWidth() * y) + x;
	},


	/**
	 * Writes the image to the filesystem
	 *
	 * @method writeImage
	 * @param {string} filename Path to file
	 * @param {function} fn Callback
	 */
	writeImage: function (filename, fn) {

		fn = fn || function () {
		};

		this._image.pack().pipe(fs.createWriteStream(filename)).once('close', function () {
			this._image.removeListener('error', fn);
			fn(undefined, this);
		}.bind(this)).once('error', function (err) {
			this._image.removeListener('close', fn);
			fn(err, this);
		}.bind(this));
	},

	/**
	 * Writes the image to a buffer
	 *
	 * @method toBlob
	 * @param {function} fn Callback
	 */
	toBlob: function (fn) {

		var writeBuffer = new streamBuffers.WritableStreamBuffer({
			initialSize: (100 * 1024), incrementAmount: (10 * 1024)
		});

		fn = fn || function () {
		};

		this._image.pack().pipe(writeBuffer).once('close', function () {
			this._image.removeListener('error', fn);
			fn(undefined, writeBuffer.getContents());
		}.bind(this)).once('error', function (err) {
			this._image.removeListener('close', fn);
			fn(err);
		}.bind(this));
	}
};
PNGImage.prototype.constructor = PNGImage;


// Add standard methods to the prototype
_.extend(PNGImage.prototype, pixel);
_.extend(PNGImage.prototype, conversion);


// Adds all standard filters
_.each(_.keys(filters), function (key) {
	PNGImage.setFilter(key, filters[key]);
});

module.exports = PNGImage;

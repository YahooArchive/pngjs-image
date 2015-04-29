// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var fs = require('fs');

/**
 * @class utils
 * @module PNG
 * @submodule PNGCore
 */
module.exports = {

	/**
	 * Loads a specific module, if it exists, otherwise it will just ignore it
	 *
	 * @method loadModule
	 * @param {string} path Path to the module
	 * @param {object} obj Object the module should apply to
	 */
	loadModule: function (path, obj) {
		if (fs.existsSync(path)) {
			this.copyModule(require(path), obj);
		}
	},

	/**
	 * Copies the methods of a module to an object
	 *
	 * @method copyModule
	 * @param {object} methods Dictionary of module methods
	 * @param {object} obj Object the module methods should apply to
	 */
	copyModule: function (methods, obj) {
		for(var methodName in methods) {
			if (methods.hasOwnProperty(methodName)) {
				obj[methodName] = methods[methodName];
			}
		}
	},

	/**
	 * Gets the chunk-type from the chunk-id
	 *
	 * @method getCHunkTypeFormId
	 * @param {int} id Numeric chunk-type
	 * @returns {string} Decoded chunk-type
	 */
	getChunkTypeFromId: function (id) {
		var result = '';

		result += String.fromCharCode((id >> 24) & 0xff);
		result += String.fromCharCode((id >> 16) & 0xff);
		result += String.fromCharCode((id >> 8) & 0xff);
		result += String.fromCharCode(id & 0xff);

		return result;
	}
};

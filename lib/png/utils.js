// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var fs = require('fs');

/**
 * @class utils
 * @module PNG
 * @submodule PNGCore
 */
module.exports = {

	loadModule: function (path, obj) {
		if (fs.existsSync(path)) {
			this.copyModule(require(path), obj);
		}
	},

	copyModule: function (methods, obj) {
		for(var methodName in methods) {
			if (methods.hasOwnProperty(methodName)) {
				obj[methodName] = methods[methodName];
			}
		}
	},

	getChunkTypeById: function (id) {
		var result = '';

		result += String.fromCharCode((id >> 24) & 0xff);
		result += String.fromCharCode((id >> 16) & 0xff);
		result += String.fromCharCode((id >> 8) & 0xff);
		result += String.fromCharCode(id & 0xff);

		return result;
	}
};

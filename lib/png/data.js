// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class Data
 * @module PNG
 * @submodule PNGCore
 * @constructor
 */
var Data = function () {
	this._volatile = {};
	this._persistent = {};
};

/**
 * Gets the volatile data
 *
 * @method getVolatile
 * @return {object}
 */
Data.prototype.getVolatile = function () {
	return this._volatile;
};

/**
 * Gets the persistent data
 *
 * @method getPersistent
 * @return {object}
 */
Data.prototype.getPersistent = function () {
	return this._persistent;
};

module.exports = Data;



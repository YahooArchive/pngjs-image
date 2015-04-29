// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

/**
 * @class constants
 * @module PNG
 * @submodule PNGCore
 */

/**
 * Complete PNG signature
 *
 * @type {int[]}
 */
var signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];


/**
 * List of available color types
 *
 * @static
 * @type {object}
 */
var colorTypes = {
	GREY_SCALE: 0,
	TRUE_COLOR: 2,
	INDEXED_COLOR: 3,
	GREY_SCALE_ALPHA: 4,
	TRUE_COLOR_ALPHA:6
};

module.exports = {
	signature: signature,
	colorTypes: colorTypes
};

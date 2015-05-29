// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

describe('Ancillary Chunks', function () {

	// Transparency chunk
	require('./transparency');

	// Text
	require('./text');

	// International text
	require('./international');

	// Modification time
	require('./time');

	// Background chunk
	require('./background');

	// Chroma settings
	require('./chroma');

	// Gamma info
	require('./gamma');

	// Histogram
	require('./histogram');

	// Physical dimensions
	require('./physical');

	// Significant bits in IDAT chunks
	require('./significantBits');

	// Suggested Palette
	require('./suggestedPalette');

	// Intent
	require('./intent');
});

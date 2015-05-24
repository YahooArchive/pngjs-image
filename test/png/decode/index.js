// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

describe('Decode', function () {

	// Basic decoding
	require('./basic');

	// Filters
	require('./filter');

	// Interlace
	require('./interlace');

	// Sizes
	require('./sizes');

	// Chunk ordering
	require('./ordering');

	// Compression
	require('./compression');

	// Palette
	require('./palette');

	// Ancillary chunks
	require('./ancillary');

	// Corrupted files
	require('./corrupt');
});

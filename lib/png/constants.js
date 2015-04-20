var signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

var typeToId = {
	'bKGD': 0x624b4744,
	'cHRM': 0x6348524d,
	'gAMA': 0x67414d41,
	'hIST': 0x68495354,
	'iCCP': 0x69434350,
	'IDAT': 0x49444154,
	'IEND': 0x49454e44,
	'IHDR': 0x49484452,
	'iTXt': 0x69545874,
	'pHYs': 0x70485973,
	'PLTE': 0x504c5445,
	'sBIT': 0x73424954,
	'sPLT': 0x73504c54,
	'sRGB': 0x73524742,
	'tEXt': 0x74455874,
	'tIME': 0x74494d45,
	'tRNS': 0x74524e53,
	'zTXt': 0x7a545874
};

var colorTypes = {
	GREY_SCALE: 0,
	TRUE_COLOR: 2,
	INDEXED_COLOR: 3,
	GREY_SCALE_ALPHA: 4,
	TRUE_COLOR_ALPHA:6
};

module.exports = {
	signature: signature,
	typeToId: typeToId,
	colorTypes: colorTypes
};

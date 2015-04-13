module.exports = {

	loadModule: function (path) {
		var methodName,
			methods = require(path);

		for(methodName in methods) {
			if (methods.hasOwnProperty(methodName)) {
				this[methodName] = methods[methodName];
			}
		}
	}
};

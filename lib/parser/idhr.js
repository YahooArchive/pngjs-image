module.exports = {

	validate: function () {

	},

	getWidth: function () {
		return this._data.readUInt32BE(this._offset);
	},

	getHeight: function () {

	}
};

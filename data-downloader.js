/*
	Data Downloader
*/

var datenow = Date.now();

var data = exports.data = [
	{
		url: "https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/config/formats.js",
		file: "formats.js"
	},
	{
		url: "https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/formats-data.js",
		file: "formats-data.js"
	},
	{
		url: "https://play.pokemonshowdown.com/data/pokedex.js?" + datenow,
		file: "pokedex.js"
	},
	{
		url: "https://play.pokemonshowdown.com/data/moves.js?" + datenow,
		file: "moves.js"
	},
	{
		url: "https://play.pokemonshowdown.com/data/abilities.js?" + datenow,
		file: "abilities.js"
	},
	{
		url: "https://play.pokemonshowdown.com/data/items.js?" + datenow,
		file: "items.js"
	},
	{
		url: "https://play.pokemonshowdown.com/data/learnsets-g6.js?" + datenow,
		file: "learnsets-g6.js"
	},
	{
		url: "https://play.pokemonshowdown.com/data/aliases.js?" + datenow,
		file: "aliases.js"
	}
];

var httpsGet = function (url, callback) {
	if (typeof callback !== "function") return;
	var https = require("https");
	https.get(url, function (res) {
		var data = '';
		res.on('data', function (part) {
			data += part;
		});
		res.on('end', function () {
			callback(data);
		});
		res.on('error', function (e) {
			callback(null, e);
		});
	}).on('error', function (e) {
		callback(null, e);
	});
};

var downloadFile = exports.downloadFile = function (url, file, callback) {
	httpsGet(url, function (data, err) {
		if (err) {
			if (typeof callback === "function") callback(false, err);
			return;
		}
		fs.writeFile('./data/' + file, data, function (err2) {
			if (err2) {
				if (typeof callback === "function") callback(false, err2);
				return;
			}
			try {
				Tools.uncacheTree('./data/' + file);
			} catch (e) {}
			debug('Downloaded data file: ' + './data/' + file);
			if (typeof callback === "function") callback(true);
		});
	});
};

var download = exports.download = function () {
	for (var i = 0; i < data.length; i++) {
		downloadFile(data[i].url, data[i].file, function (s, err) {
			if (s) return;
			error("Data download failed: " + data[i].file + "\n" + err.message);
			errlog(err.stack);
		});
	}
};

exports.getPokedex = function () {
	return require("./data/pokedex.js").BattlePokedex;
};

exports.getMovedex = function () {
	return require("./data/moves.js").BattleMovedex;
};

exports.getAbilities = function () {
	return require("./data/abilities.js").BattleAbilities;
};

exports.getItems = function () {
	return require("./data/items.js").BattleItems;
};

exports.getAliases = function () {
	return require("./data/aliases.js").BattleAliases;
};

exports.getFormats = function () {
	return require("./data/formats.js").Formats;
};

exports.getFormatsData = function () {
	return require("./data/formats-data.js").BattleFormatsData;
};

exports.getLearnsets = function () {
	return require("./data/learnsets-g6.js").BattleLearnsets;
};

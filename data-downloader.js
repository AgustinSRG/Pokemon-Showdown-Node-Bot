var https = require('https');

var download = exports.download = function () {
	var datenow = Date.now();
	if (!Config.disableDownload) {
		var formats = fs.createWriteStream("data/formats.js");
		https.get("https://play.pokemonshowdown.com/data/formats.js?" + datenow, function (res) {
			res.pipe(formats);
		});
		var formatsdata = fs.createWriteStream("data/formats-data.js");
		https.get("https://play.pokemonshowdown.com/data/formats-data.js?" + datenow, function (res) {
			res.pipe(formatsdata);
		});
		var pokedex = fs.createWriteStream("data/pokedex.js");
		https.get("https://play.pokemonshowdown.com/data/pokedex.js?" + datenow, function (res) {
			res.pipe(pokedex);
		});
		var moves = fs.createWriteStream("data/moves.js");
		https.get("https://play.pokemonshowdown.com/data/moves.js?" + datenow, function (res) {
			res.pipe(moves);
		});
		var abilities = fs.createWriteStream("data/abilities.js");
		https.get("https://play.pokemonshowdown.com/data/abilities.js?" + datenow, function (res) {
			res.pipe(abilities);
		});
		var items = fs.createWriteStream("data/items.js");
		https.get("https://play.pokemonshowdown.com/data/items.js?" + datenow, function (res) {
			res.pipe(items);
		});
		var learnsets = fs.createWriteStream("data/learnsets-g6.js");
		https.get("https://play.pokemonshowdown.com/data/learnsets-g6.js?" + datenow, function (res) {
			res.pipe(learnsets);
		});
		var aliases = fs.createWriteStream("data/aliases.js");
		https.get("https://play.pokemonshowdown.com/data/aliases.js?" + datenow, function (res) {
			res.pipe(aliases);
		});
	}
};

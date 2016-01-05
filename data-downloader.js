var https = require('https');

var download = exports.download = function () {
	var datenow = Date.now();
	debug('Downloading Pokemon Showdown data');
	var formats = fs.createWriteStream("data/formats.js");
	https.get("https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/config/formats.js", function (res) {
		res.pipe(formats);
		res.on('end', function () {
			debug('formats.js downloaded');
		});
		res.on('error', function (err) {
			error('Could not download formats.js');
			errlog(err.stack);
		});
	}).on('error', function (err) {
		error('Could not download formats.js');
		errlog(err.stack);
	});
	var formatsdata = fs.createWriteStream("data/formats-data.js");
	https.get("https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/formats-data.js", function (res) {
		res.pipe(formatsdata);
		res.on('end', function () {
			debug('formats-data.js downloaded');
		});
		res.on('error', function (err) {
			error('Could not download formats-data.js');
			errlog(err.stack);
		});
	}).on('error', function (err) {
		error('Could not download formats-data.js');
		errlog(err.stack);
	});
	var pokedex = fs.createWriteStream("data/pokedex.js");
	https.get("https://play.pokemonshowdown.com/data/pokedex.js?" + datenow, function (res) {
		res.pipe(pokedex);
		res.on('end', function () {
			debug('pokedex.js downloaded');
		});
		res.on('error', function (err) {
			error('Could not download pokedex.js');
			errlog(err.stack);
		});
	}).on('error', function (err) {
		error('Could not download pokedex.js');
		errlog(err.stack);
	});
	var moves = fs.createWriteStream("data/moves.js");
	https.get("https://play.pokemonshowdown.com/data/moves.js?" + datenow, function (res) {
		res.pipe(moves);
		res.on('end', function () {
			debug('moves.js downloaded');
		});
		res.on('error', function (err) {
			error('Could not download moves.js');
			errlog(err.stack);
		});
	}).on('error', function (err) {
		error('Could not download moves.js');
		errlog(err.stack);
	});
	var abilities = fs.createWriteStream("data/abilities.js");
	https.get("https://play.pokemonshowdown.com/data/abilities.js?" + datenow, function (res) {
		res.pipe(abilities);
		res.on('end', function () {
			debug('abilities.js downloaded');
		});
		res.on('error', function (err) {
			error('Could not download abilities.js');
			errlog(err.stack);
		});
	}).on('error', function (err) {
		error('Could not download abilities.js');
		errlog(err.stack);
	});
	var items = fs.createWriteStream("data/items.js");
	https.get("https://play.pokemonshowdown.com/data/items.js?" + datenow, function (res) {
		res.pipe(items);
		res.on('end', function () {
			debug('items.js downloaded');
		});
		res.on('error', function (err) {
			error('Could not download items.js');
			errlog(err.stack);
		});
	}).on('error', function (err) {
		error('Could not download items.js');
		errlog(err.stack);
	});
	var learnsets = fs.createWriteStream("data/learnsets-g6.js");
	https.get("https://play.pokemonshowdown.com/data/learnsets-g6.js?" + datenow, function (res) {
		res.pipe(learnsets);
		res.on('end', function () {
			debug('learnsets-g6.js downloaded');
		});
		res.on('error', function (err) {
			error('Could not download learnsets-g6.js');
			errlog(err.stack);
		});
	}).on('error', function (err) {
		error('Could not download learnsets-g6.js');
		errlog(err.stack);
	});
	var aliases = fs.createWriteStream("data/aliases.js");
	https.get("https://play.pokemonshowdown.com/data/aliases.js?" + datenow, function (res) {
		res.pipe(aliases);
		res.on('end', function () {
			debug('aliases.js downloaded');
		});
		res.on('error', function (err) {
			error('Could not download aliases.js');
			errlog(err.stack);
		});
	}).on('error', function (err) {
		error('Could not download aliases.js');
		errlog(err.stack);
	});
};

/*
	Hangman
*/

var Hangman = require('./constructors.js').Hangman;
var RandomGenerator = require('./wordrand.js');

function send (room, str) {
	Bot.say(room, str);
}

function trans (data, room) {
	var lang = Config.language || 'english';
	if (Settings.settings['language'] && Settings.settings['language'][room]) lang = Settings.settings['language'][room];
	return Tools.translateGlobal('games', 'hangman', lang)[data];
}

exports.id = 'hangman';

exports.title = 'Hangman';

exports.aliases = [];

var generateHang = function (data) {
	var chars = [];
	for (var i = 0; i < data.length; i++) {
		if (data[i].type === 'sep') {
			if (data[i].key === ' ') chars.push(' - ');
			else chars.push(' ' + data[i].key.toUpperCase() + ' ');
		} else if (data[i].type === 'key') {
			if (data[i].guessed) chars.push(data[i].key.toUpperCase());
			else chars.push(' _ ');
		}
	}
	return chars.join('');
};

var parser = function (type, data) {
	switch (type) {
		case 'start':
			send(this.room, "**" + exports.title + ":** " +  generateHang(this.status) + " | **" + this.clue + "** | " + trans('help', this.room).replace("$TOKEN", CommandParser.commandTokens[0]));
			break;
		case 'show':
			send(this.room, "**" + exports.title + ":** " + generateHang(this.status) + " | **" + this.clue + "** | " + this.said.sort().join(' '));
			break;
		case 'win':
			send(this.room, trans('grats1', this.room) + " **" + data.winner + "** " + trans('grats2', this.room) + " __" + this.word.trim() + "__");
			break;
		case 'end':
			send(this.room, trans('lose1', this.room) + " __" + data.victim + "__ " + trans('lose2', this.room) + " __" + this.word.trim() + "__");
			break;
		case 'forceend':
			send(this.room, trans('end', this.room) + " __" + this.word.trim() + "__ ");
			break;
	}
	if (type in {win: 1, end: 1, forceend: 1}) {
		Features.games.deleteGame(this.room);
	}
};

exports.newGame = function (room, opts) {
	var randObj = RandomGenerator.random();
	if (!randObj) return null;
	var generatorOpts = {
		room: room,
		title: 'Hangman',
		word: randObj.word,
		clue: randObj.clue
	};
	var temp;
	for (var i in opts) {
		switch (i) {
			case 'fails':
			case 'lives':
			case 'maxfails':
				temp = parseInt(opts[i]) || 0;
				if (temp && temp < 0) return "maxfails";
				generatorOpts.maxFails = temp;
				break;
			default:
				return "maxfails";
		}
	}
	var game = new Hangman(generatorOpts, parser);
	if (!game) return null;
	game.generator = exports.id;
	return game;
};

exports.commands = {
	guess: 'g',
	g: function (arg, by, room, cmd, game) {
		game.guess(by.substr(1), arg);
	},
	view: function (arg, by, room, cmd, game) {
		this.restrictReply("**" + exports.title + ":** " + generateHang(game.status) + " | **" + game.clue + "** | " + game.said.sort().join(' '), 'games');
	},
	end: 'endhangman',
	endhangman: function (arg, by, room, cmd, game) {
		if (!this.can('games')) return;
		game.end();
	}
};

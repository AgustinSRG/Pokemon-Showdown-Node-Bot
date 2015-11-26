/*
	Poke-Anagrams
*/

var Anagrams = require('./constructors.js').Anagrams;
var RandomGenerator = require('./pokerand.js');

function send (room, str) {
	Bot.say(room, str);
}

function trans (data, room) {
	var lang = Config.language || 'english';
	if (Settings.settings['language'] && Settings.settings['language'][room]) lang = Settings.settings['language'][room];
	return Tools.translateGlobal('games', 'pokeanagrams', lang)[data];
}

function parseWinners (winners, room) {
	var res = {
		type: 'win',
		text: "**" + winners[0] + "**"
	};
	if (winners.length < 2) return res;
	res.type = 'tie';
	for (var i = 1; i < winners.length - 1; i++) {
		res.text += ", **" + winners[i] + "**";
	}
	res.text += " " + trans('and', room) + " **" + winners[winners.length - 1] + "**";
	return res;
}

exports.id = 'pokeanagrams';

exports.title = 'Poke-Anagrams';

exports.aliases = ['pa', 'pokemonanagrams'];

var parser = function (type, data) {
	var txt;
	switch (type) {
		case 'start':
			txt = trans('start', this.room);
			if (this.maxGames) txt += ". " + trans('maxgames1', this.room) + " __" + this.maxGames + " " + trans('maxgames2', this.room) + "__";
			if (this.maxPoints) txt += ". " + trans('maxpoints1', this.room) + " __" + this.maxPoints + " " + trans('maxpoints2', this.room) + "__";
			txt += ". " + trans('timer1', this.room) + " __" + Math.floor(this.answerTime / 1000).toString() + " " + trans('timer2', this.room) + "__";
			txt += ". " + trans('help', this.room).replace("$TOKEN", CommandParser.commandTokens[0]);
			send(this.room, txt);
			break;
		case 'show':
			send(this.room, "**" + exports.title + ": [" + this.clue + "]** " + this.randomizedChars.join(', '));
			break;
		case 'point':
			send(this.room, trans('grats1', this.room) + " **" + data.user + "** " + trans('point2', this.room) + " __" + this.word + "__. " + trans('point3', this.room) + ": " + data.points + " " + trans('points', this.room));
			break;
		case 'timeout':
			send(this.room, trans('timeout', this.room) + " __" + this.word.trim() + "__");
			break;
		case 'end':
			send(this.room, trans('lose', this.room));
			break;
		case 'win':
			var t = parseWinners(data.winners, this.room);
			txt = "**" + trans('end', this.room) + "** ";
			switch (t.type) {
				case 'win':
					txt += trans('grats1', this.room) + " " + t.text + " " + trans('grats2', this.room) + " __" + data.points + " " + trans('points', this.room) + "__!";
					break;
				case 'tie':
					txt += trans('tie1', this.room) + " __" + data.points + " " + trans('points', this.room) + "__ " + trans('tie2', this.room) + " " + t.text;
					break;
			}
			send(this.room, txt);
			break;
		case 'forceend':
			send(this.room, trans('forceend1', this.room) + (this.status === 2 ? (" " + trans('forceend2', this.room) + " __" + this.word.trim() + "__") : ''));
			break;
		case 'error':
			send(this.room, "**" + exports.title + ": Error (could not fetch a word)");
			this.end(true);
			break;
	}
	if (type in {win: 1, end: 1, forceend: 1}) {
		Features.games.deleteGame(this.room);
	}
};

var wordGenerator = function (arr, lang) {
	return RandomGenerator.randomNoRepeat(arr, lang);
};

exports.newGame = function (room, opts) {
	if (!RandomGenerator.random()) return null;
	var generatorOpts = {
		room: room,
		title: exports.title,
		maxGames: 5,
		maxPoints: 0,
		waitTime: 2 * 1000,
		answerTime: 30 * 1000,
		wordGenerator: wordGenerator
	};
	var temp;
	for (var i in opts) {
		switch (i) {
			case 'ngames':
			case 'maxgames':
			case 'games':
				temp = parseInt(opts[i]) || 0;
				if (temp && temp < 0) return "games ( >= 0 ), maxpoints, time, lang";
				generatorOpts.maxGames = temp;
				break;
			case 'points':
			case 'maxpoints':
				temp = parseInt(opts[i]) || 0;
				if (temp && temp < 0) return "games, maxpoints ( >= 0 ), time, lang";
				generatorOpts.maxPoints = temp;
				break;
			case 'answertime':
			case 'anstime':
			case 'time':
				temp = parseFloat(opts[i]) || 0;
				if (temp) temp *= 1000;
				if (temp && temp < (5 * 1000)) return "games, maxpoints, time ( seconds, >= 5 ), lang";
				generatorOpts.answerTime = temp;
				break;
			case 'lang':
			case 'language':
				var langAliases = {
					'en': 'english',
					'es': 'spanish',
					'de': 'german',
					'fr': 'french',
					'it': 'italian'
				};
				if (typeof opts[i] !== "string") return "games, maxpoints, time, lang (" + Object.keys(Tools.translations).join('/') + ")";
				var lng = langAliases[toId(opts[i])] || toId(opts[i]);
				if (!Tools.translations[lng]) return "games, maxpoints, time, lang (" + Object.keys(Tools.translations).join('/') + ")";
				generatorOpts.language = lng;
				break;
			default:
				return "games, maxpoints, time, lang";
		}
	}
	if (!generatorOpts.maxGames && !generatorOpts.maxPoints) generatorOpts.maxGames = 5;
	var game = new Anagrams(generatorOpts, parser);
	if (!game) return null;
	game.generator = exports.id;
	return game;
};

exports.commands = {
	gword: 'g',
	guess: 'g',
	g: function (arg, by, room, cmd, game) {
		game.guess(by.substr(1), arg);
	},
	view: function (arg, by, room, cmd, game) {
		if (game.status < 2) return;
		this.restrictReply("**" + exports.title + ": [" + game.clue + "]** " + game.randomizedChars.join(', '), 'games');
	},
	end: 'endanagrams',
	endanagrams: function (arg, by, room, cmd, game) {
		if (!this.can('games')) return;
		game.end(true);
	}
};

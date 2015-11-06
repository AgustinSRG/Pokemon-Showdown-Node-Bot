/*
	PassTheBomb
*/

var PassTheBomb = require('./constructors.js').PassTheBomb;

function send (room, str) {
	Bot.say(room, str);
}

function sendML (room, str) {
	var cmds = [];
	while (str.length > 300) {
		cmds.push(str.substr(0, 300));
		str = str.substr(300);
	}
	cmds.push(str);
	Bot.sendRoom(room, cmds, 1500);
}

function trans (data, room) {
	var lang = Config.language || 'english';
	if (Settings.settings['language'] && Settings.settings['language'][room]) lang = Settings.settings['language'][room];
	return Tools.translateGlobal('games', 'passthebomb', lang)[data];
}

exports.id = 'passthebomb';

exports.title = 'Pass-The-Bomb';

exports.aliases = ['passbomb', 'bomb'];

var parser = function (type, data) {
	switch (type) {
		case 'singups':
			send(this.room, trans("init", this.room).replace(/[$]/g, CommandParser.commandTokens[0]));
			break;
		case 'players':
			sendML(this.room, "**" + exports.title + "** | " + trans("players", this.room) + " (" + data.length + "): " + data.join(', '));
			break;
		case 'round':
			send(this.room, "**" + data + "** " + trans("round", this.room) + " " + trans("help", this.room).replace(/[$]/g, CommandParser.commandTokens[0]));
			break;
		case 'bomb':
			send(this.room, "**BOMB!** " + data + " " + trans("lose", this.room));
			break;
		case 'end':
			send(this.room, trans("end1", this.room) + " **" + data + "** " + trans("end2", this.room));
			break;
		case 'forceend':
			send(this.room, trans("forceend", this.room));
			break;
	}
	if (type in {end: 1, forceend: 1}) {
		Features.games.deleteGame(this.room);
	}
};

exports.newGame = function (room, opts) {
	var generatorOpts = {
		room: room,
		title: exports.title
	};
	var temp;
	for (var i in opts) {
		switch (i) {
			case 'players':
			case 'maxplayers':
				temp = parseInt(opts[i]);
				if (!temp || temp < 2) return "maxplayers ( >= 2 )";
				generatorOpts.maxPlayers = temp;
				break;
			default:
				return "maxplayers";
		}
	}
	var game = new PassTheBomb(generatorOpts, parser);
	if (!game) return null;
	game.generator = exports.id;
	return game;
};

exports.commands = {
	j: 'join',
	"in": 'join',
	join: function (arg, by, room, cmd, game) {
		game.userJoin(by.substr(1));
	},
	l: 'leave',
	out: 'leave',
	leave: function (arg, by, room, cmd, game) {
		game.userLeave(by.substr(1));
	},
	players: function (arg, by, room, cmd, game) {
		var players = [];
		for (var p in game.players) players.push(game.players[p]);
		if (!players.length) return;
		this.restrictReply(trans("players", room) + " (" + players.length + "): " + players.join(', '), "games");
	},
	start: function (arg, by, room, cmd, game) {
		if (game.status !== 1) return;
		if (!this.can('games')) return;
		if (Object.keys(game.players).length < 2) return this.reply(trans("noplayers", room));
		game.start();
	},
	passbomb: 'pass',
	pass: function (arg, by, room, cmd, game) {
		game.pass(by, arg);
	},
	end: 'endpassthebomb',
	endpassthebomb: function (arg, by, room, cmd, game) {
		if (!this.can('games')) return;
		game.forceend();
	}
};

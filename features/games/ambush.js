/*
	Ambush
*/

var Ambush = require('./constructors.js').Ambush;

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
	return Tools.translateGlobal('games', 'ambush', lang)[data];
}

exports.id = 'ambush';

exports.title = 'Ambush';

exports.aliases = [];

var parser = function (type, data) {
	switch (type) {
		case 'singups':
			send(this.room, trans("init", this.room).replace(/[$]/g, CommandParser.commandTokens[0]));
			break;
		case 'round':
			sendML(this.room, "**" + exports.title + ", " + trans("round", this.room) + " " + data.round + "!** | **" + trans("players", this.room) + ":** " + data.players.join(', ') + " | " + trans("help", this.room).replace(/[$]/g, CommandParser.commandTokens[0]));
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
		title: exports.title,
		roundTime: 9500
	};
	var temp;
	for (var i in opts) {
		switch (i) {
			case 'rtime':
			case 'roundtime':
				temp = parseFloat(opts[i]);
				if (!temp || temp < 4) return "roundtime (seconds, >= 4)";
				generatorOpts.roundTime = Math.floor(temp * 1000);
				break;
			default:
				return "roundtime";
		}
	}
	var game = new Ambush(generatorOpts, parser);
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
	fire: function (arg, by, room, cmd, game) {
		game.fire(by, arg);
	},
	end: 'endambush',
	endambush: function (arg, by, room, cmd, game) {
		if (!this.can('games')) return;
		game.forceend();
	}
};

/*
	Games
*/

const MAX_COMMAND_RECURSION = 10;

exports.id = 'games';
exports.desc = 'A collection of chat games';

var gamesList = [
	'hangman.js', 'poke-hangman.js',
	'anagrams.js', 'poke-anagrams.js',
	'trivia.js', 'kunc.js',
	'blackjack.js',
	'ambush.js',
	'passthebomb.js'
];

var Builders = exports.Builders = {};
var Games = exports.Games = {};

var temp = {};
for (var i = 0; i < gamesList.length; i++) {
	try {
		temp = require("./" + gamesList[i]);
		if (!temp.id) {
			Builders[gamesList[i]] = temp;
			debug("Could not load \"" + gamesList[i] + "\" id. Using namefile by default");
		} else {
			Builders[temp.id] = temp;
			debug("Loaded \"" + gamesList[i] + "\" - " + temp.id);
		}
	} catch (err) {
		errlog(err.stack);
		error("Failed to load game: " + gamesList[i]);
	}
}

var cmdParser = exports.cmdParser = function (room, by, msg) {
	if (!Games[room]) return;
	var generator = Games[room].generator;
	if (!Builders[generator]) return;
	var commands = Builders[generator].commands;
	var commandTokens = CommandParser.commandTokens;
	var Context = CommandParser.Context;

	var cmdToken = null;
	for (var i = 0; i < commandTokens.length; i++) {
		if (typeof commandTokens[i] === "string" && msg.substr(0, commandTokens[i].length) === commandTokens[i]) {
			cmdToken = commandTokens[i];
			break;
		}
	}

	if (!cmdToken) return;

	var toParse = msg.substr(cmdToken.length);
	var spaceIndex = toParse.indexOf(' ');

	var cmd, args;
	if (spaceIndex === -1) {
		cmd = toParse;
		args = '';
	} else {
		cmd = toParse.substr(0, spaceIndex);
		args = toParse.substr(spaceIndex + 1);
	}
	cmd = cmd.toLowerCase();
	if (commands[cmd]) {
		var handler = cmd;
		var loopBreaker = 0;
		while (typeof commands[handler] === 'string' && (loopBreaker++ < MAX_COMMAND_RECURSION)) {
			handler = commands[handler];
		}
		if (typeof commands[handler] === 'function') {
			var opts = {
				arg: args,
				by: by,
				room: room,
				cmd: cmd,
				handler: handler,
				cmdToken: cmdToken
			};
			var context = new Context(opts);
			try {
				cmdr("game".cyan + " | " + handler + ' | arg: ' + args + ' | by: ' + by + ' | room: ' + room + ' | cmd: ' + cmd);
				commands[handler].call(context, args, by, room, cmd, Games[room]);
			} catch (e) {
				errlog(e.stack);
				error("Command crash (game): " + cmd + ' | by: ' + by + ' | room: ' + room + ' | ' + sys.inspect(e));
				Bot.say(room, 'The command crashed: ' + sys.inspect(e).toString().split('\n').join(' '));
			}
			return true;
		} else {
			error("unkwown command type: " + cmd + ' = ' + sys.inspect(commands[handler]));
		}
	}
};

exports.getTitle = function (id) {
	var builder = null;
	for (var i in Builders) {
		if (id === i || Builders[i].aliases.indexOf(id) >= 0) {
			builder = Builders[i];
		}
	}
	if (!builder) return id;
	return builder.title || id;
};

exports.newGame = function (room, type, args) {
	if (Settings.lockdown) return {err: true};
	if (Games[room]) return {err: true};//Another game is already started
	var builder = null;
	for (var i in Builders) {
		if (type === i || Builders[i].aliases.indexOf(type) >= 0) {
			builder = Builders[i];
		}
	}
	if (!builder) return {err: 'builder'};
	var game = builder.newGame(room, args);
	if (!game) return {err: true};
	if (typeof game === "string") return {err: 'args', info: game};
	Games[room] = game;
	Games[room].init();
};

exports.deleteGame = function (room) {
	if (!Games[room]) return;
	if (typeof Games[room].clearTimers === "function") Games[room].clearTimers();
	delete Games[room];
};

exports.init = function () {
	Settings.addParseFilter("games", cmdParser);
	for (var i in Games) {
		if (typeof Games[i].clearTimers === "function") Games[i].clearTimers();
		delete Games[i];
	}
};

exports.parse = null;

exports.readyToDie = function () {
	var gamesKeys = Object.keys(Games);
	if (gamesKeys.length) return ("Active games in: " + gamesKeys.join(', '));
};

exports.destroy = function () {
	Settings.deleteParseFilter("games");
	for (var i in Games) {
		if (typeof Games[i].clearTimers === "function") Games[i].clearTimers();
		delete Games[i];
	}
	for (var i in Builders) {
		delete Builders[i];
	}
	if (Features[exports.id]) delete Features[exports.id];
};

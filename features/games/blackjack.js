/*
	Black Jack
*/

var BlackJack = require('./constructors.js').BlackJack;

function send (room, str) {
	Bot.say(room, str);
}

function trans (data, room) {
	var lang = Config.language || 'english';
	if (Settings.settings['language'] && Settings.settings['language'][room]) lang = Settings.settings['language'][room];
	return Tools.translateGlobal('games', 'blackjack', lang)[data];
}

function joinArray (arr, str1) {
	if (!arr.length) return '';
	var txt = "**" + arr[0] + "**";
	if (arr.length > 1) {
		for (var i = 1; i < arr.length - 1; i++) txt += ", **" + arr[i] + "**";
		txt += " " + str1 + " " + "**" + arr[arr.length - 1] + "**";
	}
	return txt;
}

function formateHand (hand, total, str1) {
	var txt = "";
	for (var i = 0; i < hand.length; i++) {
		txt += "**[" + hand[i].card + hand[i].value + "]** ";
	}
	txt += " " + str1 + ": **" + total + "**";
	return txt;
}

exports.id = 'blackjack';

exports.title = 'BlackJack';

exports.aliases = ['bj', '21'];

var parser = function (type, data) {
	var handval;
	switch (type) {
		case 'singups':
			send(this.room, trans("init", this.room).replace(/[$]/g, CommandParser.commandTokens[0]));
			break;
		case 'start':
			send(this.room, "**" + trans("start", this.room) + "** " + trans("topcard", this.room) + ": **[" + this.dealerHand[0].card + this.dealerHand[0].value + "]**");
			break;
		case 'turn':
			send(this.room, "**" + exports.title + ":** " + trans("turn1", this.room) + " " + data.name + trans("turn2", this.room) + " " + trans("helpturn1", this.room).replace(/[$]/g, CommandParser.commandTokens[0]) + " " + Math.floor(this.turnTime / 1000).toString() + " " + trans("helpturn2", this.room));
			send(this.room, "**" + exports.title + ":** " + trans("hand1", this.room) + " " + data.name + "" + trans("hand2", this.room) + ": " + formateHand(data.hand, this.getHandValue(data.hand), trans("total", this.room)));
			break;
		case 'player':
			if (data.type === "stand") {
				send(this.room, "**" + exports.title + ":** " + this.currPlayer.name + " " + trans("stand", this.room) + "!");
			} else if (data.type === "hit") {
				send(this.room, "**" + exports.title + ":** " + this.currPlayer.name + " " + trans("hit", this.room) + ": " + formateHand(this.currPlayer.hand, this.getHandValue(this.currPlayer.hand), trans("total", this.room)));
			}
			handval = this.getHandValue(this.currPlayer.hand);
			if (handval === 21) {
				send(this.room, "**" + exports.title + ":** " + this.currPlayer.name + " " + trans("bj", this.room) + "!");
			} else if (handval > 21) {
				send(this.room, "**" + exports.title + ":** " + this.currPlayer.name + " " + trans("bust", this.room) + " " + handval + "");
			}
			break;
		case 'timeout':
			send(this.room, "**" + exports.title + ":** " + trans("timeout1", this.room) + " " + data.name + "" + trans("timeout2", this.room));
			handval = this.getHandValue(data.hand);
			if (handval === 21) {
				send(this.room, "**" + exports.title + ":** " + data.name + " " + trans("bj", this.room) + "!");
			} else if (handval > 21) {
				send(this.room, "**" + exports.title + ":** " + data.name + " " + trans("bust", this.room) + " " + handval + "");
			}
			break;
		case 'dealer':
			if (data.type === "stand") {
				send(this.room, "**" + exports.title + ":** " + trans("dealer", this.room) + " " + trans("stand", this.room) + "!");
			} else if (data.type === "hit") {
				send(this.room, "**" + exports.title + ":** " + trans("dealer", this.room) + " " + trans("hit", this.room) + ": " + formateHand(this.dealerHand, this.getHandValue(this.dealerHand), trans("total", this.room)));
			} else if (data.type === "turn") {
				return send(this.room, "**" + exports.title + ":** " + trans("dhand", this.room) + ": " + formateHand(this.dealerHand, this.getHandValue(this.dealerHand), trans("total", this.room)));
			}
			handval = this.getHandValue(this.dealerHand);
			if (handval === 21) {
				send(this.room, "**" + exports.title + ":** " + trans("dbj", this.room));
			} else if (handval > 21) {
				send(this.room, "**" + exports.title + ":** " + trans("dbust1", this.room) + " " + handval + ". " + trans("dbust2", this.room));
			}
			break;
		case 'end':
			if (data.naturals.length) send(this.room, trans("grats1", this.room) + " " + joinArray(data.naturals, trans("and", this.room)) + " " + trans("natural", this.room) + "!");
			var txt = "**" + trans("end", this.room) + "**";
			if (data.winners.length) {
				txt += " " + trans("grats1", this.room) + " " + joinArray(data.winners, trans("and", this.room)) + " " + trans("grats2", this.room) + "!";
			} else {
				txt += " " + trans("lose", this.room);
			}
			send(this.room, txt);
			break;
		case 'forceend':
			send(this.room, trans("forceend", this.room));
			break;
	}
	if (type in {win: 1, end: 1, forceend: 1}) {
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
			case 'turntime':
			case 'time':
				temp = parseFloat(opts[i]) || 0;
				if (temp) temp *= 1000;
				if (temp < (5 * 1000)) return "time ( seconds, >= 5 ), maxplayers";
				generatorOpts.turnTime = temp;
				break;
			case 'players':
			case 'maxplayers':
				temp = parseInt(opts[i]);
				if (!temp || temp < 1) return "time, maxplayers ( > 0 )";
				generatorOpts.maxPlayers = temp;
				break;
			default:
				return "time, maxplayers";
		}
	}
	var game = new BlackJack(generatorOpts, parser);
	if (!game) return null;
	game.generator = exports.id;
	return game;
};

exports.commands = {
	j: 'join',
	"in": 'join',
	join: function (arg, by, room, cmd, game) {
		game.userJoin(by);
	},
	l: 'leave',
	out: 'leave',
	leave: function (arg, by, room, cmd, game) {
		game.userLeave(by);
	},
	start: function (arg, by, room, cmd, game) {
		if (game.status !== 1) return;
		if (!this.can('games')) return;
		if (Object.keys(game.users).length < 1) return this.reply(trans("noplayers", room));
		game.start();
	},
	stand: function (arg, by, room, cmd, game) {
		game.stand(by);
	},
	hit: function (arg, by, room, cmd, game) {
		game.hit(by);
	},
	hand: 'viewhand',
	viewhand: function (arg, by, room, cmd, game) {
		if (game.status !== 3) return;
		if (!game.currPlayer || game.currPlayer.id !== toId(by)) return;
		this.pmReply("[" + room + "] " + "**" + exports.title + ":** " + trans("yourhand", room) + ": " + formateHand(game.currPlayer.hand, game.getHandValue(game.currPlayer.hand), trans("total", room)));
	},
	players: function (arg, by, room, cmd, game) {
		if (!Object.keys(game.users).length) return this.restrictReply(trans("noplayers", room), "games");
		this.restrictReply("**" + trans("players", room) + " (" + Object.keys(game.users).length + "):** " + game.getPlayers().join(', '), 'games');
	},
	end: 'endblackjack',
	endblackjack: function (arg, by, room, cmd, game) {
		if (!this.can('games')) return;
		game.end(true);
	}
};

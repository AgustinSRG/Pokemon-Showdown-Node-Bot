/*
	Commands for Games feature
*/

Settings.addPermissions(['games']);

exports.commands = {
	/* Fast aliases */
	//Add games aliases here. Example -> pa: 'pokeanagrams',
	bj: 'blackjack',

	/* Specific generators */
	hangman: 'execgame',
	anagrams: 'execgame',
	pokehangman: 'execgame',
	pokeanagrams: 'execgame',
	trivia: 'execgame',
	blackjack: 'execgame',
	kunc: 'execgame',
	ambush: 'execgame',
	passthebomb: 'execgame',

	/* General commands for games */
	games: 'game',
	newgame: 'game',
	game: function (arg, by, room, cmd) {
		if (!this.can('games')) return;
		if (!Features["games"]) return;
		if (cmd === 'games' || !arg) return this.reply(this.trad('games') + ": " + Object.keys(Features["games"].Builders).sort().join(', '));
		if (Features["games"].Games[room]) return this.reply(this.trad('already1') + " " + Features["games"].Games[room].title + " " + this.trad('already2'));
		var args = arg.split(',');
		var gametype = toId(args[0]);
		var opts = {}, temp;
		for (var i = 1; i < args.length; i++) {
			temp = args[i].split('=');
			if (!toId(temp[0])) continue;
			opts[toId(temp[0])] = temp[1] || true;
		}
		var pg = Features["games"].newGame(room, gametype, opts);
		if (pg) {
			switch (pg.err) {
				case 'builder':
					return this.reply(this.trad('games') + ": " + Object.keys(Features["games"].Builders).sort().join(', '));
				case 'args':
					return this.reply(this.trad('args1') + " " + Features["games"].getTitle(gametype) + " " + this.trad('args2') + ": " + pg.info);
				default:
					return this.reply(this.trad('err'));
			}
		}
	},

	endgame: function (arg, by, room, cmd) {
		if (!this.can('games')) return;
		if (!Features["games"]) return;
		if (!Features["games"].Games[room]) return this.reply(this.trad('nogame'));
		var gametype = Features["games"].Games[room].title;
		Features["games"].deleteGame(room);
		this.reply(this.trad('del1') + " " + gametype + " " + this.trad('del2'));
	},

	/* Single-Command games */

	spr: 'rps',
	rps: function (arg) {
		var values = ['r', 'p', 's'];
		var gameTable = {
			r: {r: 3, p: 2, s: 1},
			p: {r: 1, p: 3, s: 2},
			s: {r: 2, p: 1, s: 3}
		};
		//1 - win, 2 - lose, 3 - tie
		var text = "";
		var aliases = {
			'rock': 'r',
			'paper': 'p',
			'scissors': 's'
		};
		var langAliases = this.trad('aliases');
		if (langAliases) Object.merge(aliases, langAliases);
		var chosenByUser = toId(arg);
		if (aliases[chosenByUser]) chosenByUser = aliases[chosenByUser];
		if (values.indexOf(chosenByUser) < 0) return this.restrictReply(this.trad('err'), 'games');
		var chosenByBot = values[Math.floor(Math.random() * values.length)];
		var result = gameTable[chosenByUser][chosenByBot];
		text += "/me " + this.trad('chosen') + " " + this.trad(chosenByBot) + ". ";
		switch (result) {
			case 1:
				text += "**" + this.trad('win') + "!**";
				break;
			case 2:
				text += "**" + this.trad('lose') + "**";
				break;
			case 3:
				text += "**" + this.trad('tie') + "!**";
				break;
			default:
				return this.restrictReply(this.trad('err'), 'games');
		}
		this.restrictReply(text, 'games');
	},

	/* Development */

	execgame: function (arg, by, room, cmd) {
		this.parse(this.cmdToken + "game " + cmd + "," + arg);
	},

	reloadgames: function (arg, by, room, cmd) {
		this.parse(this.cmdToken + "reload feature, games");
	}
};

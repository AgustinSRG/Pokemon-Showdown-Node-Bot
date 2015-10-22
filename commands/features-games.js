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

	execgame: function (arg, by, room, cmd) {
		this.parse(this.cmdToken + "game " + cmd + "," + arg);
	},

	reloadgames: function (arg, by, room, cmd) {
		this.parse(this.cmdToken + "reload feature, games");
	}
};

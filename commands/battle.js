/*
	Battle commands (challenges, tours, ladder)
*/

Settings.addPermissions(['challenge', 'searchbattle', 'jointour']);

exports.commands = {
	reloadteams: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		if (Features['battle'].TeamBuilder.loadTeamList(true)) {
			this.reply(this.trad('s'));
		} else {
			this.reply(this.trad('e'));
		}
	},

	reloadbattle: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		try {
			Tools.uncacheTree('./features/battle/index.js');
			Features['battle'] = require('./../features/battle/index.js');
			Features['battle'].init();
			this.reply("Battle feature hotpatched");
		} catch (e) {
			this.reply("Error: " + sys.inspect(e));
		}
	},

	unblockchallenges: 'blockchallenges',
	blockchallenges: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return;
		if (cmd === "blockchallenges") {
			this.say('', '/blockchallenges');
			this.say(room, this.trad('b'));
		} else {
			this.say('', '/unblockchallenges');
			this.say(room, this.trad('nb'));
		}
	},

	move: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		if (this.roomType !== 'battle') return this.reply(this.trad('notbattle'));
		try {
			if (!arg) Features['battle'].BattleBot.receive(room, "|forcemove|");
			else if (arg === "random") Features['battle'].BattleBot.receive(room, "|forcemoverandom|");
			else this.say(room, '/choose ' + arg);
		} catch (e) {
			this.reply('Error: ' + sys.inspect(e));
		}
	},

	jointours: function (arg, by, room, cmd) {
		if (!this.can('jointour')) return false;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		if (!Settings.settings['jointours']) Settings.settings['jointours'] = {};
		if (toId(arg) === "off") {
			if (!Settings.settings['jointours'][room]) return this.reply(this.trad('ad') + ' ' + room);
			delete Settings.settings['jointours'][room];
			Settings.save();
			this.reply(this.trad('d') + ' ' + room);
		} else {
			if (Settings.settings['jointours'][room]) return this.reply(this.trad('ae') + ' ' + room);
			Settings.settings['jointours'][room] = 1;
			Settings.save();
			this.reply(this.trad('e') + ' ' + room);
		}
	},

	sb: 'searchbattle',
	searchbattle: function (arg, by, room, cmd) {
		if (!this.can('searchbattle')) return false;
		if (!arg || !arg.length) return this.reply(this.trad('e1'));
		var format = Tools.parseAliases(arg);
		if (!Formats[format] || !Formats[format].ladder) return this.reply(this.trad('e21') + ' ' + format + ' ' + this.trad('e22'));
		if (Formats[format].team && !Features['battle'].TeamBuilder.hasTeam(format)) return this.reply(this.trad('e31') + ' ' + format + '. ' + this.trad('e32'));
		Features['battle'].LadderManager.reportsRoom = room;
		var cmds = [];
		var team = Features['battle'].TeamBuilder.getTeam(format);
		if (team) cmds.push('|/useteam ' + team);
		cmds.push('|/search ' + arg);
		Bot.send(cmds);
	},

	ladderstop: 'ladderstart',
	ladderstart: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (cmd === 'ladderstop') {
			if (Features['battle'].LadderManager.stop()) this.reply(this.trad('stop'));
			return;
		}
		var format = Tools.parseAliases(arg);
		if (!Formats[format] || !Formats[format].ladder) return this.reply(this.trad('e21') + ' ' + format + ' ' + this.trad('e22'));
		if (Formats[format].team && !Features['battle'].TeamBuilder.hasTeam(format)) return this.reply(this.trad('e31') + ' ' + format + '. ' + this.trad('e32'));
		if (Features['battle'].LadderManager.start(format)) this.reply(this.trad('start') + ' ' + format);
	},

	challme: 'challenge',
	challengeme: 'challenge',
	chall: 'challenge',
	challenge: function (arg, by, room, cmd) {
		if (!this.can('challenge')) return false;
		var args = arg.split(",");
		if (cmd in {'challme': 1, 'challengeme': 1}) {
			args = [by, arg];
		}
		if (args.length < 2) return this.reply(this.trad('e11') + ': ' + this.cmdToken + cmd + " " + this.trad('e12'));
		var format = Tools.parseAliases(args[1]);
		if (!format || !Formats[format] || !Formats[format].chall) return this.reply(this.trad('e21') + ' "' + format + '" ' + this.trad('e22'));
		if (Formats[format].team && !Features['battle'].TeamBuilder.hasTeam(format)) return this.reply(this.trad('e31') + ' ' + format + '. ' + this.trad('e32'));
		var cmds = [];
		var team = Features['battle'].TeamBuilder.getTeam(format);
		if (team) cmds.push('|/useteam ' + team);
		cmds.push('|/challenge ' + toId(args[0]) + ", " + format);
		Bot.send(cmds);
	},

	checktour: 'jointour',
	tourjoin: 'jointour',
	jt: 'jointour',
	jointour: function (arg, by, room, cmd) {
		if (!this.can('jointour')) return false;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		if (!Features['battle'].TourManager.tourData[room] || !Features['battle'].TourManager.tourData[room].format) return this.reply(this.trad('e1'));
		if (cmd === 'checktour') return this.say(room, '/tour getupdate');
		if (Features['battle'].TourManager.tourData[room].isJoined) return this.reply(this.trad('e2'));
		if (Features['battle'].TourManager.tourData[room].isStarted) return this.reply(this.trad('e3'));
		var format = toId(Features['battle'].TourManager.tourData[room].format);
		if (Formats[format] && Formats[format].team && !Features['battle'].TeamBuilder.hasTeam(format)) return this.reply(this.trad('e41') + ' ' + format + '. ' + this.trad('e42'));
		this.reply("/tour join");
	},

	leavetour: function (arg, by, room, cmd) {
		if (!this.isRanked('#')) return false;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		if (!Features['battle'].TourManager.tourData[room] || !Features['battle'].TourManager.tourData[room].format) return this.reply(this.trad('e1'));
		if (!Features['battle'].TourManager.tourData[room].isJoined) return this.reply(this.trad('e2'));
		this.reply("/tour leave");
	},

	battlepermissions: 'battleset',
	battlesettings: 'battleset',
	battleset: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var setPermission = function (room, perm, rank) {
			if (!Settings.settings.commands) Settings.settings.commands = {};
			if (!Settings.settings.commands[room]) Settings.settings.commands[room] = {};
			Settings.settings.commands[room][perm] = rank;
			Settings.save();
		};
		var args = arg.split(",");
		if (args.length < 2) return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
		var perm = toId(args[0]);
		var rank = args[1].trim();
		if (!(perm in Settings.permissions)) {
			return this.reply(this.trad('ps') + ": " + Object.keys(Settings.permissions).sort().join(", "));
		}
		if (rank in {'off': 1, 'disable': 1}) {
			setPermission('battle-', perm, true);
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('d'));
		}
		if (rank in {'on': 1, 'all': 1, 'enable': 1}) {
			setPermission('battle-', perm, ' ');
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('a'));
		}
		if (Config.ranks.indexOf(rank) >= 0) {
			setPermission('battle-', perm, rank);
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('r') + ' ' + rank + " " + this.trad('r2'));
		} else {
			return this.reply(this.trad('not1') + " " + rank + " " + this.trad('not2'));
		}
	}
};

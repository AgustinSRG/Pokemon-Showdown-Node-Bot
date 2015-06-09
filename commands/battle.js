/*
	Battle commands (challenges, tours, ladder)
*/

Settings.addPermissions(['searchbattle', 'jointour']);

exports.commands = {
	reloadteams: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		if (Features['battle'].TeamBuilder.loadTeamList(true)) {
			this.reply("Teams reloaded");
		} else {
			this.reply("An error ocurred, could not reload teams");
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
			this.say(room, 'Challenges bloqued');
		} else {
			this.say('', '/unblockchallenges');
			this.say(room, 'Challenges no longer blocked');
		}
	},

	move: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		if (this.roomType !== 'battle') return this.reply('This command is only avaliable for battle rooms');
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
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
		if (!Settings.settings['jointours']) Settings.settings['jointours'] = {};
		if (toId(arg) === "off") {
			if (!Settings.settings['jointours'][room]) return this.reply('Mode "tour autojoin" already disabled for room ' + room);
			delete Settings.settings['jointours'][room];
			Settings.save();
			this.reply('Mode "tour autojoin" disabled for room ' + room);
		} else {
			if (Settings.settings['jointours'][room]) return this.reply('Mode "tour autojoin" already enabled for room ' + room);
			Settings.settings['jointours'][room] = 1;
			Settings.save();
			this.reply('Mode "tour autojoin" enabled for room ' + room);
		}
	},

	sb: 'searchbattle',
	searchbattle: function (arg, by, room, cmd) {
		if (!this.can('searchbattle')) return false;
		if (!arg || !arg.length) return this.reply('You must specify a format');
		var format = toId(arg);
		if (!Formats[format] || !Formats[format].ladder) return this.reply('Format ' + format + ' is not valid for searching battle');
		if (Formats[format].team && !Features['battle'].TeamBuilder.hasTeam(format)) return this.reply('I do not have teams for searching battle in format ' + format + '. Edit teams.js to add more bot teams');
		Features['battle'].LadderManager.reportsRoom = room;
		var cmds = [];
		var team = Features['battle'].TeamBuilder.getTeam(format);
		if (team) cmds.push('|/useteam ' + team);
		cmds.push('|/search ' + arg);
		Bot.send(cmds);
	},

	chall: 'challenge',
	challenge: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var args = arg.split(",");
		if (args.length < 2) return this.reply('Usage: ' + Config.commandChar + cmd + " [user], [format]");
		var format = toId(args[1]);
		if (!Formats[format] || !Formats[format].chall) return this.reply('Format ' + format + ' is not valid for challenging');
		if (Formats[format].team && !Features['battle'].TeamBuilder.hasTeam(format)) return this.reply('I do not have teams for challenging in format ' + format + '. Edit teams.js to add more bot teams');
		var cmds = [];
		var team = Features['battle'].TeamBuilder.getTeam(format);
		if (team) cmds.push('|/useteam ' + team);
		cmds.push('|/challenge ' + toId(args[0]) + ", " + format);
		Bot.send(cmds);
	},

	tourjoin: 'jointour',
	jt: 'jointour',
	jointour: function (arg, by, room, cmd) {
		if (!this.can('jointour')) return false;
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
		if (!Features['battle'].TourManager.tourData[room] || !Features['battle'].TourManager.tourData[room].format) return this.reply('There is not a tournament in this room');
		if (Features['battle'].TourManager.tourData[room].isJoined) return this.reply('Error: Already joined');
		if (Features['battle'].TourManager.tourData[room].isStarted) return this.reply('Error: Tournament has already started');
		var format = toId(Features['battle'].TourManager.tourData[room].format);
		if (Formats[format] && Formats[format].team && !Features['battle'].TeamBuilder.hasTeam(format)) return this.reply('I do not have teams for joining a tornament in format ' + format + '. Edit teams.js to add more bot teams.');
		this.reply("/tour join");
	},

	leavetour: function (arg, by, room, cmd) {
		if (!this.isRanked('#')) return false;
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
		if (!Features['battle'].TourManager.tourData[room] || !Features['battle'].TourManager.tourData[room].format) return this.reply('There is not a tournament in this room');
		if (!Features['battle'].TourManager.tourData[room].isJoined) return this.reply('Error: Not joined');
		this.reply("/tour leave");
	}
};

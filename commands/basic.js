/*
	Basic Commands
*/

function setPermission(room, perm, rank) {
	if (!Settings.settings.commands) Settings.settings.commands = {};
	if (!Settings.settings.commands[room]) Settings.settings.commands[room] = {};
	Settings.settings.commands[room][perm] = rank;
	Settings.save();
}

Settings.addPermissions(['say']);

exports.commands = {
	credits: 'about',
	bot: 'about',
	about: function (arg, by, room, cmd) {
		var text = this.trad('about') + " (https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot)";
		if (!this.isRanked('#')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},

	bottime: 'time',
	time: function (arg, by, room, cmd) {
		var f = new Date();
		var text = "**" + this.trad('time') + ":** __" + f.toString() + "__";
		if (!this.isRanked('#')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},

	uptime: function (arg, by, room, cmd) {
		var text = '';
		text += '**Uptime:** ';
		var divisors = [52, 7, 24, 60, 60];
		var units = [this.trad('week'), this.trad('day'), this.trad('hour'), this.trad('minute'), this.trad('second')];
		var buffer = [];
		var uptime = ~~(process.uptime());
		do {
			var divisor = divisors.pop();
			var unit = uptime % divisor;
			if (!unit) {
				units.pop();
				uptime = ~~(uptime / divisor);
				continue;
			}
			buffer.push(unit > 1 ? unit + ' ' + units.pop() + 's' : unit + ' ' + units.pop());
			uptime = ~~(uptime / divisor);
		} while (uptime);

		switch (buffer.length) {
		case 5:
			text += buffer[4] + ', ';
			text += buffer[3] + ', ';
			text += buffer[2] + ', ' + buffer[1] + ', ' + this.trad('and') + ' ' + buffer[0];
			break;
		case 4:
			text += buffer[3] + ', ';
			text += buffer[2] + ', ' + buffer[1] + ', ' + this.trad('and') + ' ' + buffer[0];
			break;
		case 3:
			text += buffer[2] + ', ' + buffer[1] + ', ' + this.trad('and') + ' ' + buffer[0];
			break;
		case 2:
			text += buffer[1] + ' ' + this.trad('and') + ' ' + buffer[0];
			break;
		case 1:
			text += buffer[0];
			break;
		}
		if (!this.isRanked('#')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},

	seen: function (arg, by, room, cmd) {
		var text = '';
		var name = arg;
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.pmReply(this.trad('inv'));
		if (arg === toId(Bot.status.nickName)) return this.pmReply(this.trad('bot'));
		if (arg === toId(by)) return this.pmReply(this.trad('self'));
		if (Settings.seen[arg]) {
			var dSeen = Settings.seen[arg];
			var lang = Config.language || 'english';
			if (Settings.settings['language'] && Settings.settings['language'][room]) lang = Settings.settings['language'][room];
			text += name + ' ' + this.trad('s1') + ' ' + Tools.getTimeAgo(dSeen.time, lang) + (this.trad('s2') ? (' ' + this.trad('s2')) : '');
			if (dSeen.room) {
				switch (dSeen.action) {
					case 'j':
						text += ', ' + this.trad('j') + ' ' + dSeen.room;
						break;
					case 'l':
						text += ', ' + this.trad('l') + ' ' + dSeen.room;
						break;
					case 'c':
						text += ', ' + this.trad('c') + ' ' + dSeen.room;
						break;
					case 'n':
						text += ', ' + this.trad('n') + ' ' + dSeen.args[0];
						break;
				}
			}
		} else {
			text += this.trad('n1') + ' ' + arg + ' ' + this.trad('n2');
		}
		this.pmReply(text);
	},

	say: function (arg, by, room, cmd) {
		if (!arg) return;
		if (!this.can('say')) return;
		this.reply(Tools.stripCommands(arg));
	},

	lang: 'language',
	language: function (arg, by, room, cmd) {
		if (!this.isRanked('#')) return false;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		var lang = toId(arg);
		if (!lang.length) return this.reply(this.trad('nolang'));
		if (!Tools.translations[lang]) return this.reply(this.trad('v') + ': ' + Object.keys(Tools.translations).join(', '));
		if (!Settings.settings['language']) Settings.settings['language'] = {};
		Settings.settings['language'][room] = lang;
		Settings.save();
		this.reply(this.trad('l'));
	},

	settings: 'set',
	set: function (arg, by, room, cmd) {
		if (!this.isRanked('#')) return false;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		var args = arg.split(",");
		if (args.length < 2) return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
		var perm = toId(args[0]);
		var rank = args[1].trim();
		if (!(perm in Settings.permissions)) {
			return this.reply(this.trad('ps') + ": " + Object.keys(Settings.permissions).sort().join(", "));
		}
		if (rank in {'off': 1, 'disable': 1}) {
			if (!this.canSet(perm, true)) return this.reply(this.trad('denied'));
			setPermission(room, perm, true);
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('d'));
		}
		if (rank in {'on': 1, 'all': 1, 'enable': 1}) {
			if (!this.canSet(perm, ' ')) return this.reply(this.trad('denied'));
			setPermission(room, perm, ' ');
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('a'));
		}
		if (Config.ranks.indexOf(rank) >= 0) {
			if (!this.canSet(perm, rank)) return this.reply(this.trad('denied'));
			setPermission(room, perm, rank);
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('r') + ' ' + rank + " " + this.trad('r2'));
		} else {
			return this.reply(this.trad('not1') + " " + rank + " " + this.trad('not2'));
		}
	}
};

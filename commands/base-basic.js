/*
	Basic Commands
*/

Settings.addPermissions(['say']);

exports.commands = {
	credits: 'about',
	bot: 'about',
	about: function () {
		this.restrictReply(this.trad('about') + ". " + this.trad('author') + ": " + Settings.package.author.name + ". (" + Settings.package.homepage + ")", 'info');
	},

	git: 'github',
	github: function () {
		if (Settings.package.repository) this.restrictReply(Tools.stripCommands(Settings.package.repository.url), 'info');
	},

	botversion: 'version',
	version: function () {
		this.restrictReply(Tools.stripCommands(Settings.package.version), 'info');
	},

	guide: 'help',
	botguide: 'help',
	help: function () {
		this.restrictReply(this.trad('guide') + ': ' + (Config.botguide || (Settings.package.homepage + "/blob/master/commands/README.md")), 'info');
	},

	bottime: 'time',
	time: function () {
		var f = new Date();
		this.restrictReply("**" + this.trad('time') + ":** __" + f.toString() + "__", 'info');
	},

	uptime: function () {
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
		this.restrictReply(text, 'info');
	},

	seen: function (arg, by, room, cmd) {
		var text = '';
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.pmReply(this.trad('inv'));
		if (arg === toId(Bot.status.nickName)) return this.pmReply(this.trad('bot'));
		if (arg === toId(by)) return this.pmReply(this.trad('self'));
		var dSeen = Settings.userManager.getSeen(arg);
		if (dSeen) {
			text += '**' + (dSeen.name || arg).trim() + '** ' + this.trad('s1') + ' __' + Tools.getTimeAgo(dSeen.time, this.language).trim() + (this.trad('s2') ? ('__ ' + this.trad('s2')) : '__');
			if (dSeen.room) {
				switch (dSeen.action) {
					case 'j':
						text += ', ' + this.trad('j') + ' <<' + dSeen.room + '>>';
						break;
					case 'l':
						text += ', ' + this.trad('l') + ' <<' + dSeen.room + '>>';
						break;
					case 'c':
						text += ', ' + this.trad('c') + ' <<' + dSeen.room + '>>';
						break;
					case 'n':
						text += ', ' + this.trad('n') + ' **' + dSeen.args[0] + '**';
						break;
				}
			}
		} else {
			text += this.trad('n1') + ' ' + arg + ' ' + this.trad('n2');
		}
		this.pmReply(text);
	},

	publicalts: 'alts',
	alts: function (arg) {
		var text = '';
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.pmReply(this.trad('inv'));
		var alts = Settings.userManager.getAlts(arg);
		if (alts && alts.length) {
			if (this.can("alts")) {
				var cmds = [];
				var toAdd;
				text += this.trad('alts') + " " + Settings.userManager.getName(arg) + ": ";
				for (var i = 0; i < alts.length; i++) {
					toAdd = alts[i] + (i < alts.length - 1 ? ", " : "");
					if ((text + toAdd).length > 300) {
						cmds.push(text);
						text = "";
					}
					text += toAdd;
				}
				if (text.length) cmds.push(text);
				this.pmReply(cmds);
				return;
			} else {
				if (alts.length <= 10) {
					text += this.trad('alts') + " " + Settings.userManager.getName(arg) + ": " + alts.join(", ");
				} else {
					var fAlts = [];
					for (var i = alts.length - 1; i >= 0 && i > alts.length - 10; i--) {
						fAlts.push(alts[i]);
					}
					text += this.trad('alts') + " " + Settings.userManager.getName(arg) + ": " + fAlts.join(", ") + ", (" + (alts.length - 10) + this.trad('more') + ")";
				}
			}
		} else {
			text += this.trad('n') + ' ' +  Settings.userManager.getName(arg);
		}
		this.pmReply(text);
	},

	say: function (arg) {
		if (!arg) return;
		if (!this.can('say')) return;
		this.reply(Tools.stripCommands(arg));
	}
};

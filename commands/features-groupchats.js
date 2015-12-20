/*
	Commands for groupchats feature
*/

function wpmEnabled (room) {
	if (Settings.settings.pmwmsg[room]) return !!Settings.settings.pmwmsg[room].enabled;
	return false;
}

exports.commands = {
	igc: 'ignoregroupchat',
	ignoregroupchat: function (arg, user, room, cmd) {
		if (!this.isExcepted) return false;
		var tarRoom = toRoomid(arg) || room;
		if (!Features['groupchats']) return false;
		if (Features['groupchats'].ignored[tarRoom]) return this.reply("Group Chat __" + tarRoom + "__ already ignored");
		Features['groupchats'].ignored[tarRoom] = true;
		this.sclog();
		this.reply("Group Chat __" + tarRoom + "__ was temporarily ignored");
	},

	unigc: 'unignoregroupchat',
	unignoregroupchat: function (arg, user, room, cmd) {
		if (!this.isExcepted) return false;
		var tarRoom = toRoomid(arg) || room;
		if (!Features['groupchats']) return false;
		if (!Features['groupchats'].ignored[tarRoom]) return this.reply("Group Chat __" + tarRoom + "__ is not being ignored");
		delete Features['groupchats'].ignored[tarRoom];
		this.sclog();
		this.reply("Group Chat __" + tarRoom + "__ is no longer ignored");
	},

	/* Automated Promotion */

	setautopromote: 'autopromote',
	setautorank: 'autopromote',
	listautopromote: 'autopromote',
	listautorank: 'autopromote',
	autorank: 'autopromote',
	autopromote: function (arg, user, room, cmd) {
		if (!this.isRanked('roomowner')) return false;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		if (!Settings.settings.autopromote) Settings.settings.autopromote = {};
		if (!Settings.settings.autopromote[tarRoom]) Settings.settings.autopromote[tarRoom] = {'enabled': false, 'all': 0, 'users': {}};
		if (cmd in {'setautopromote': 1, 'setautorank': 1}) {
			if (toId(arg) in {'on': 1, 'enable': 1}) {
				Settings.settings.autopromote[tarRoom].enabled = true;
				Settings.save();
				this.sclog();
				this.reply(this.trad('on') + textHelper);
			} else if (toId(arg) in {'off': 1, 'disable': 1}) {
				Settings.settings.autopromote[tarRoom].enabled = false;
				Settings.save();
				this.sclog();
				this.reply(this.trad('off') + textHelper);
			} else {
				this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [on/off]");
			}
			return;
		}
		if (!Settings.settings.autopromote[tarRoom].enabled) return this.reply(this.trad('dis') + textHelper);
		if (cmd in {'listautopromote': 1, 'listautorank': 1}) {
			var txt = "Automated promotion in " + tarRoom + ":\n\n";
			txt += "General promotion: " + (Settings.settings.autopromote[tarRoom].all ? Settings.settings.autopromote[tarRoom].all : "(deauth)") + "\n\n";
			var users = [];
			for (var i in Settings.settings.autopromote[tarRoom].users) {
				users.push(Settings.settings.autopromote[tarRoom].users[i] + i);
			}
			txt += users.join(', ');
			Tools.uploadToHastebin(txt, function (r, link) {
				if (r) return this.pmReply(this.trad('list') + " " + tarRoom + ': ' + link);
				else this.pmReply(this.trad('err'));
			}.bind(this));
			return;
		}
		if (!arg) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [user], [rank] " + this.trad('or') + " " + this.cmdToken + cmd + " [rank] " + this.trad('usage2'));
		var args = arg.split(',');
		if (args.length === 1) {
			var rank = args[0].trim();
			if (!rank) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [user], [rank] " + this.trad('or') + " " + this.cmdToken + cmd + " [rank] " + this.trad('usage2'));
			if (rank in {'off': 1, 'disable': 1, 'deauth': 1}) {
				Settings.settings.autopromote[tarRoom].all = 0;
				Settings.save();
				this.sclog();
				this.reply(this.trad('general1') + textHelper);
				return;
			}
			if (Config.ranks.indexOf(rank) >= 0) {
				Settings.settings.autopromote[tarRoom].all = rank;
				Settings.save();
				this.sclog();
				this.reply(this.trad('general2') + " " + rank + textHelper);
			} else {
				return this.reply(this.trad('rank') + " " + rank + " " + this.trad('notrank'));
			}
		} else if (args.length === 2) {
			var userid = toId(args[0]);
			var rank = args[1].trim();
			if (!userid || !rank) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [user], [rank] " + this.trad('or') + " " + this.cmdToken + cmd + " [rank] " + this.trad('usage2'));
			if (rank in {'off': 1, 'disable': 1, 'deauth': 1}) {
				if (!Settings.settings.autopromote[tarRoom].users[userid]) return this.reply(this.trad('user') + " " + userid + " " + this.trad('notuser') + textHelper);
				delete Settings.settings.autopromote[tarRoom].users[userid];
				Settings.save();
				this.sclog();
				this.reply(this.trad('user') + " " + userid + " " + this.trad('del') + textHelper);
				return;
			}
			if (Config.ranks.indexOf(rank) >= 0) {
				Settings.settings.autopromote[tarRoom].users[userid] = rank;
				Settings.save();
				this.sclog();
				this.reply(this.trad('auser') + " " + userid + " " + this.trad('set') + " " + rank + textHelper);
			} else {
				return this.reply(this.trad('rank') + " " + rank + " " + this.trad('notrank'));
			}
		} else {
			return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [user], [rank] " + this.trad('or') + " " + this.cmdToken + cmd + " [rank] " + this.trad('usage2'));
		}
	},

	/* Welcome PM message */

	setwpm: 'wpm',
	delwpm: 'wpm',
	wpm: function (arg, user, room, cmd) {
		if (!this.isRanked('roomowner')) return false;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		if (!Settings.settings.pmwmsg) Settings.settings.pmwmsg = {};
		switch (cmd) {
			case "wpm":
				if (!arg) return this.reply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [enable / disable / view]");
				switch (toId(arg)) {
					case 'on':
					case 'enable':
						if (!this.isExcepted) return;
						if (!Settings.settings.pmwmsg[tarRoom]) Settings.settings.pmwmsg[tarRoom] = {msg: '', enabled: true};
						Settings.settings.pmwmsg[tarRoom].enabled = true;
						Settings.save();
						this.sclog();
						this.reply(this.trad('on') + " " + tarRoom);
						break;
					case 'off':
					case 'disable':
						if (!this.isExcepted) return;
						if (!Settings.settings.pmwmsg[tarRoom]) Settings.settings.pmwmsg[tarRoom] = {msg: '', enabled: false};
						Settings.settings.pmwmsg[tarRoom].enabled = false;
						if (!Settings.settings.pmwmsg[tarRoom].msg) delete Settings.settings.pmwmsg[tarRoom];
						Settings.save();
						this.sclog();
						this.reply(this.trad('off') + " " + tarRoom);
						break;
					case 'view':
						if (!wpmEnabled(tarRoom)) return this.reply(this.trad('dis') + " " + tarRoom);
						if (!Settings.settings.pmwmsg[tarRoom].msg) return this.reply(this.trad('not') + " " + tarRoom);
						this.reply(Tools.stripCommands(Settings.settings.pmwmsg[tarRoom].msg));
						break;
					default:
						return this.reply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [enable / disable / view]");
				}
				break;
			case "setwpm":
				if (!wpmEnabled(tarRoom)) return this.reply(this.trad('dis') + " " + tarRoom);
				arg = Tools.stripCommands(arg.trim());
				if (!arg) return this.reply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [message]");
				if (!Settings.settings.pmwmsg[tarRoom]) Settings.settings.pmwmsg[tarRoom] = {msg: '', enabled: true};
				Settings.settings.pmwmsg[tarRoom].msg = arg;
				Settings.save();
				this.sclog();
				this.reply(this.trad('set') + " " + tarRoom);
				break;
			case "delwpm":
				if (!wpmEnabled(tarRoom)) return this.reply(this.trad('dis') + " " + tarRoom);
				if (!Settings.settings.pmwmsg[tarRoom]) Settings.settings.pmwmsg[tarRoom] = {msg: '', enabled: true};
				if (!Settings.settings.pmwmsg[tarRoom].msg) return this.reply(this.trad('not') + " " + tarRoom);
				Settings.settings.pmwmsg[tarRoom].msg = false;
				Settings.save();
				this.sclog();
				this.reply(this.trad('del') + " " + tarRoom);
				break;
		}
	}
};

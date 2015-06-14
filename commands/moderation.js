/*
	Commands for Moderation Feature
*/

function blacklistUser(user, room) {
	if (!Settings.settings['autoban'] || !Settings.settings['autoban'][room] || !Settings.settings['autoban'][room][user]) {
		if (!Settings.settings['autoban']) Settings.settings['autoban'] = {};
		if (!Settings.settings['autoban'][room]) Settings.settings['autoban'][room] = {};
		Settings.settings['autoban'][room][user] = 1;
		return true;
	}
	return false;
}

function unblacklistUser(user, room) {
	if (Settings.settings['autoban'] && Settings.settings['autoban'][room] && Settings.settings['autoban'][room][user]) {
		delete Settings.settings['autoban'][room][user];
		return true;
	}
	return false;
}

function blacklistRegex(regex, room) {
	if (!Settings.settings['regexautoban'] || !Settings.settings['regexautoban'][room] || !Settings.settings['regexautoban'][room][regex]) {
		if (!Settings.settings['regexautoban']) Settings.settings['regexautoban'] = {};
		if (!Settings.settings['regexautoban'][room]) Settings.settings['regexautoban'][room] = {};
		Settings.settings['regexautoban'][room][regex] = 1;
		return true;
	}
	return false;
}

function unblacklistRegex(regex, room) {
	if (Settings.settings['regexautoban'] && Settings.settings['regexautoban'][room] && Settings.settings['regexautoban'][room][regex]) {
		delete Settings.settings['regexautoban'][room][regex];
		return true;
	}
	return false;
}

Settings.addPermissions(['autoban', 'banword', 'joinphrase']);

exports.commands = {
	/**************************
	* Autoban
	***************************/

	blacklist: 'autoban',
	ban: 'autoban',
	ab: 'autoban',
	autoban: function (arg, by, room, cmd) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " " + this.trad('notmod'));

		var added = [];
		var illegalNick = [];
		var alreadyAdded = [];

		arg = arg.split(',');

		if (!arg.length || (arg.length === 1 && !arg[0].trim().length)) return this.reply(this.trad('notarg'));

		for (var i = 0; i < arg.length; i++) {
			var tarUser = toId(arg[i]);
			if (tarUser.length < 1 || tarUser.length > 18) {
				illegalNick.push(tarUser);
				continue;
			}
			if (!blacklistUser(tarUser, room)) {
				alreadyAdded.push(tarUser);
				continue;
			}
			this.reply('/roomban ' + tarUser + ', ' + this.trad('bu'));
			added.push(tarUser);
		}

		var text = '';
		var mn = '';
		if (added.length) {
			text += this.trad('u') + ' "' + added.join('", "') + '" ' + this.trad('added') + ' ';
			mn += text;
			Settings.save();
		}
		if (alreadyAdded.length) text += this.trad('u') + ' "' + alreadyAdded.join('", "') + '" ' + this.trad('already') + ' ';
		if (illegalNick.length) text += this.trad('all') + ' ' + (text.length ? (this.trad('other') + ' ') : '') + ' ' + this.trad('illegal');
		if (mn.length) this.reply("/mn " + text + " | By: " + by);
		this.reply(text);
	},

	unblacklist: 'unautoban',
	unban: 'unautoban',
	unab: 'unautoban',
	unautoban: function (arg, by, room, cmd) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " " + this.trad('notmod'));

		arg = arg.split(',');

		var removed = [];
		var notRemoved = [];

		if (!arg.length || (arg.length === 1 && !arg[0].trim().length)) return this.reply(this.trad('notarg'));

		for (var i = 0; i < arg.length; i++) {
			var tarUser = toId(arg[i]);
			if (tarUser.length < 1 || tarUser.length > 18) {
				notRemoved.push(tarUser);
				continue;
			}
			if (!unblacklistUser(tarUser, room)) {
				notRemoved.push(tarUser);
				continue;
			}
			this.reply('/roomunban ' + tarUser);
			removed.push(tarUser);
		}

		var text = '';
		if (removed.length) {
			text += this.trad('u') + ' "' + removed.join('", "') + '" ' + this.trad('r') + ' ';
			Settings.save();
		}
		if (notRemoved.length) text += (text.length ? (this.trad('noother') + ' ') : (this.trad('no') + ' ')) + this.trad('nopresent');
		this.reply(text);
	},

	rab: 'regexautoban',
	regexautoban: function (arg, user, room) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " " + this.trad('notmod'));

		if (!arg) return this.say(room, this.trad('notarg'));

		try {
			var testing = new RegExp(arg, 'i');
		} catch (e) {
			return this.say(room, e.message);
		}

		if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:\*|\{\d+\,(?:\d+)?\}))+$/i.test(arg)) {
			return this.say(room, this.trad('re') + ' /' + arg + '/i ' + this.trad('notadd'));
		}

		var regex = '/' + arg + '/i';
		if (!blacklistRegex(regex, room)) return this.say(room, '/' + regex + '/ ' + this.trad('already'));
		Settings.save();
		this.say(room, '/modnote ' + this.trad('re') + ' ' + regex + ' ' + this.trad('addby') + ' ' + user + '.');
		this.say(room, this.trad('re') + ' ' + regex + ' ' + this.trad('add'));
	},

	unrab: 'unregexautoban',
	unregexautoban: function (arg, user, room) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " " + this.trad('notmod'));

		if (!arg) return this.say(room, this.trad('notarg'));

		arg = '/' + arg.replace(/\\\\/g, '\\') + '/i';
		if (!unblacklistRegex(arg, room)) return this.say(room, this.trad('re') + ' ' + arg + ' ' + this.trad('notpresent'));

		Settings.save();
		this.say(room, '/modnote ' + this.trad('re') + ' ' + arg + ' ' + this.trad('rby') + ' ' + user + '.');
		this.say(room, this.trad('re') + ' ' + arg + ' ' + this.trad('r'));
	},

	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function (arg, by, room, cmd) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));

		var text = '';
		var nBans = 0;

		if (arg.length) {
			if (Settings.settings['autoban'] && Settings.settings['autoban'][room]) {
				var nick = toId(arg);
				if (nick.length < 1 || nick.length > 18) {
					return this.pmReply(this.trad('iu') + ': "' + nick + '".');
				} else {
					return this.pmReply(this.trad('u') + ' "' + nick + '" ' + this.trad('currently') + ' ' + (nick in Settings.settings['autoban'][room] ? '' : (this.trad('not') + ' ')) + this.trad('b') + ' ' + room + '.');
				}
			} else {
				return this.pmReply(this.trad('nousers') + ' ' + room);
			}
		}

		if (Settings.settings['autoban'] && Settings.settings['autoban'][room]) {
			text += this.trad('listab') + ' ' + room + ':\n\n';
			for (var i in Settings.settings['autoban'][room]) {
				text += i + "\n";
				nBans++;
			}
		}

		if (Settings.settings['regexautoban'] && Settings.settings['regexautoban'][room]) {
			text += '\n' + this.trad('listrab') + ' ' + room + ':\n\n';
			for (var i in Settings.settings['regexautoban'][room]) {
				text += i + "\n";
				nBans++;
			}
		}

		if (nBans) {
			Tools.uploadToHastebin(text, function (r, linkStr) {
				if (r) this.pmReply(linkStr);
				else this.pmReply(this.trad('err'));
			}.bind(this));
		} else {
			this.pmReply(this.trad('nousers') + ' ' + room);
		}
	},

	/**************************
	* Banned words
	***************************/

	banphrase: 'banword',
	banword: function (arg, user, room) {
		arg = arg.trim().toLowerCase();
		if (!arg) return false;

		var tarRoom = room;
		if (this.roomType === 'pm') {
			if (!this.isExcepted()) return false;
			tarRoom = 'global';
		} else if (this.can('banword') && this.roomType === 'chat') {
			tarRoom = room;
		} else {
			return false;
		}

		var bannedPhrases = Settings.settings['bannedphrases'] ? Settings.settings['bannedphrases'][tarRoom] : null;
		if (!bannedPhrases) {
			if (bannedPhrases === null) Settings.settings['bannedphrases'] = {};
			bannedPhrases = (Settings.settings['bannedphrases'][tarRoom] = {});
		} else if (bannedPhrases[arg]) {
			return this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('already'));
		}
		bannedPhrases[arg] = 1;

		Settings.save();
		this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('ban'));
	},

	unbanphrase: 'unbanword',
	unbanword: function (arg, user, room) {
		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isExcepted()) return false;
			tarRoom = 'global';
		} else if (this.can('banword') && this.roomType === 'chat') {
			tarRoom = room;
		} else {
			return false;
		}

		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		if (!Settings.settings['bannedphrases']) return this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('not'));

		var bannedPhrases = Settings.settings['bannedphrases'][tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('not'));

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete Settings.settings['bannedphrases'][tarRoom];
			if (Object.isEmpty(Settings.settings['bannedphrases'])) delete Settings.settings['bannedphrases'];
		}

		Settings.save();
		this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('unban'));
	},

	viewbannedphrases: 'viewbannedwords',
	vbw: 'viewbannedwords',
	viewbannedwords: function (arg, user, room) {
		var tarRoom = room;
		var text = '';
		var bannedFrom = '';
		if (this.roomType === 'pm') {
			if (!this.isExcepted()) return false;
			tarRoom = 'global';
			bannedFrom += this.trad('globally');
		} else if (this.can('banword') && this.roomType === 'chat') {
			text += '/pm ' + user + ', ';
			bannedFrom += this.trad('in') + ' ' + room;
		} else {
			return false;
		}

		if (!Settings.settings['bannedphrases']) return this.say(room, text + this.trad('nowords'));
		var bannedPhrases = Settings.settings['bannedphrases'][tarRoom];
		if (!bannedPhrases) return this.say(room, text + this.trad('nowords'));

		if (arg.length) {
			text += this.trad('phrase') + ' "' + arg + '" ' + this.trad('curr') + ' ' + (bannedPhrases[arg] ? '' : (this.trad('not') + ' ')) + this.trad('banned') + ' ' + bannedFrom + '.';
			return this.say(room, text);
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.say(room, text + this.trad('nowords'));

		Tools.uploadToHastebin(this.trad('list') + ' ' + bannedFrom + ':\n\n' + banList.join('\n'), function (r, link) {
			if (r) return this.say(room, text + this.trad('link') + ' ' + bannedFrom + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	},

	inapropiatephrase: 'inapword',
	inapword: function (arg, user, room) {
		arg = arg.trim().toLowerCase();
		if (!arg) return false;

		var tarRoom = room;
		if (this.roomType === 'pm') {
			if (!this.isExcepted()) return false;
			tarRoom = 'global';
		} else if (this.can('banword') && this.roomType === 'chat') {
			tarRoom = room;
		} else {
			return false;
		}

		var bannedPhrases = Settings.settings['inapropiatephrases'] ? Settings.settings['inapropiatephrases'][tarRoom] : null;
		if (!bannedPhrases) {
			if (bannedPhrases === null) Settings.settings['inapropiatephrases'] = {};
			bannedPhrases = (Settings.settings['inapropiatephrases'][tarRoom] = {});
		} else if (bannedPhrases[arg]) {
			return this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('already'));
		}
		bannedPhrases[arg] = 1;

		Settings.save();
		this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('ban'));
	},

	uninapropiatephrase: 'uninapword',
	uninapword: function (arg, user, room) {
		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isExcepted()) return false;
			tarRoom = 'global';
		} else if (this.can('banword') && this.roomType === 'chat') {
			tarRoom = room;
		} else {
			return false;
		}

		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		if (!Settings.settings['inapropiatephrases']) return this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('not'));

		var bannedPhrases = Settings.settings['inapropiatephrases'][tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('not'));

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete Settings.settings['inapropiatephrases'][tarRoom];
			if (Object.isEmpty(Settings.settings['inapropiatephrases'])) delete Settings.settings['inapropiatephrases'];
		}

		Settings.save();
		this.say(room, this.trad('phrase') + ' "' + arg + '" ' + this.trad('unban'));
	},

	viewinapropiatephrases: 'viewinapwords',
	viw: 'viewinapwords',
	viewinapwords: function (arg, user, room) {
		var tarRoom = room;
		var text = '';
		var bannedFrom = '';
		if (this.roomType === 'pm') {
			if (!this.isExcepted()) return false;
			tarRoom = 'global';
			bannedFrom += 'globally';
		} else if (this.can('banword') && this.roomType === 'chat') {
			text += '/pm ' + user + ', ';
			bannedFrom += 'in ' + room;
		} else {
			return false;
		}

		if (!Settings.settings['inapropiatephrases']) return this.say(room, text + this.trad('nowords'));
		var bannedPhrases = Settings.settings['inapropiatephrases'][tarRoom];
		if (!bannedPhrases) return this.say(room, text + this.trad('nowords'));

		if (arg.length) {
			text += this.trad('phrase') + ' "' + arg + '" ' + this.trad('curr') + ' ' + (bannedPhrases[arg] || (this.trad('not') + ' ')) + this.trad('banned') + ' ' + bannedFrom + '.';
			return this.say(room, text);
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.say(room, text + this.trad('nowords'));

		Tools.uploadToHastebin(this.trad('list') + ' ' + bannedFrom + ':\n\n' + banList.join('\n'), function (r, link) {
			if (r) return this.say(room, text + this.trad('link') + ' ' + bannedFrom + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	},

	/**************************
	* Join Phrases
	***************************/

	jp: 'joinphrase',
	joinphrase: function (arg, by, room, cmd) {
		if (!this.can('joinphrase')) return;
		if (!Settings.settings['joinphrases']) Settings.settings['joinphrases'] = {};

		if (this.roomType === 'chat' && toId(arg) in {'on': 1, 'enable': 1}) {
			if (!this.isRanked('#')) return false;
			if (!Settings.settings['jpdisable']) Settings.settings['jpdisable'] = {};
			if (Settings.settings['jpdisable'][room]) delete Settings.settings['jpdisable'][room];
			else return this.reply(this.trad('ae'));
			Settings.save();
			return this.reply(this.trad('e'));
		}

		if (this.roomType === 'chat' && toId(arg) in {'off': 1, 'disable': 1}) {
			if (!this.isRanked('#')) return false;
			if (!Settings.settings['jpdisable']) Settings.settings['jpdisable'] = {};
			if (!Settings.settings['jpdisable'][room]) Settings.settings['jpdisable'][room] = 1;
			else return this.reply(this.trad('ad'));
			Settings.save();
			return this.reply(this.trad('d'));
		}

		var args = arg.split(",");

		if (args.length < 2) return this.reply(this.trad('u1') + ": " + Config.commandChar + cmd + " " + this.trad('u2'));
		if (Settings.settings['jpdisable'] && Settings.settings['jpdisable'][room]) return this.reply(this.trad('dis'));

		if (toId(args[0]) !== "delete" && args.length === 2) {
			arg = "set," + toId(args[0]) + "," + arg.substr(args[0].length + 1);
			args = arg.split(",");
		}

		arg = arg.substr(args[0].length + args[1].length + 2);
		arg = arg.trim();

		var user = toId(args[1]);
		if (!user) return false;

		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isExcepted()) return false;
			tarRoom = 'global';
		} else if (this.can('banword') && this.roomType === 'chat') {
			tarRoom = room;
		} else {
			return false;
		}

		switch (toId(args[0])) {
			case 'set':
			case 'add':
			case 'change':
				if (!arg || !arg.length) return false;
				if (args.length < 3) return this.reply(this.trad('u1') + ": " + Config.commandChar + cmd + " " + this.trad('u2'));
				if (!Settings.settings['joinphrases'][tarRoom]) Settings.settings['joinphrases'][tarRoom] = {};
				Settings.settings['joinphrases'][tarRoom][user] = Tools.stripCommands(arg);
				Settings.save();
				this.reply(this.trad('jpfor') + " " + user + ' ' + this.trad('modified') + ' ' + ((tarRoom === 'global') ? this.trad('globally') : this.trad('forthis')));
				break;
			case 'delete':
				if (!Settings.settings['joinphrases'][tarRoom]) Settings.settings['joinphrases'][tarRoom] = {};
				if (!Settings.settings['joinphrases'][tarRoom][user]) return this.reply(this.trad('jpfor') + " " + user + " " + this.trad('not') + " " + ((tarRoom === 'global') ? this.trad('globally') : this.trad('forthis')));
				delete Settings.settings['joinphrases'][tarRoom][user];
				Settings.save();
				this.reply(this.trad('jpfor') + " " + user + ' ' + this.trad('del') + ' ' + ((tarRoom === 'global') ? this.trad('globally') : this.trad('forthis')));
				break;
			default:
				return this.reply(this.trad('u1') + ": " + Config.commandChar + cmd + " " + this.trad('u2'));
		}
	},

	vjp: 'viewjoinphrases',
	viewjoinphrases: function (arg, by, room, cmd) {
		if (!this.can('joinphrase')) return;
		if (!Settings.settings['joinphrases']) Settings.settings['joinphrases'] = {};
		arg = toId(arg);

		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isExcepted()) return false;
			tarRoom = 'global';
		} else if (this.can('banword') && this.roomType === 'chat') {
			tarRoom = room;
		} else {
			return false;
		}

		if (!Settings.settings['joinphrases'][tarRoom]) Settings.settings['joinphrases'][tarRoom] = {};

		if (arg) {
			if (arg.length < 1 || arg.length > 18) return this.reply(this.trad('iu'));
			if (Settings.settings['joinphrases'][tarRoom][arg]) return this.reply(Settings.settings['joinphrases'][tarRoom][arg]);
			else return this.reply(this.trad('not') + " " + arg + ".");
		}

		var List = [];
		for (var i in Settings.settings['joinphrases'][tarRoom]) {
			List.push(i + " => " + Settings.settings['joinphrases'][tarRoom][i]);
		}
		if (!List.length) return this.reply(this.trad('empty'));
		Tools.uploadToHastebin(this.trad('jp') + " " + (tarRoom === 'global' ? this.trad('globally') : (this.trad('in') + " " + room)) + ":\n\n" + List.join('\n'), function (r, link) {
			if (r) return this.pmReply(this.trad('jp') + ' ' + (tarRoom === 'global' ? this.trad('globally') : (this.trad('in') + " " + room)) + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	},

	/**************************
	* Mod Settings
	***************************/

	setmod: 'mod',
	modset: 'mod',
	modsettings: 'mod',
	mod: function (arg, by, room, cmd) {
		if (!this.isRanked('#')) return false;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		var modTable = {
			'caps': 1,
			'stretching': 1,
			'flooding': 1,
			'spam': 1,
			'bannedwords': 1,
			'inapropiate': 1,
			'spoiler': 1,
			'youtube': 1,
			'psservers': 1,
			'multiple': 1
		};
		var args = arg.split(",");
		if (args.length < 2) return this.reply(this.trad('u1') + ": " + Config.commandChar + cmd + " " + this.trad('u2'));
		args[0] = toId(args[0]);
		args[1] = toId(args[1]);
		if (args[1] !== 'on' && args[1] !== 'off') return this.reply(this.trad('u1') + ": " + Config.commandChar + cmd + " " + this.trad('u2'));
		if (!(args[0] in modTable)) return this.reply(this.trad('valid') + ": " + Object.keys(modTable).sort().join(", "));

		if (!Settings.settings['modding']) Settings.settings['modding'] = {};
		if (!Settings.settings['modding'][room]) Settings.settings['modding'][room] = {};

		if (args[1] === 'on') {
			if (Settings.settings['modding'][room][args[0]] === 1) {
				this.reply(this.trad('mod') + " **" + args[0] + "** " + this.trad('ae'));
			} else {
				Settings.settings['modding'][room][args[0]] = 1;
				Settings.save();
				this.reply(this.trad('mod') + " **" + args[0] + "** " + this.trad('e'));
			}
		} else {
			if (Settings.settings['modding'][room] === 0) {
				this.reply(this.trad('mod') + " **" + args[0] + "** " + this.trad('ad'));
			} else {
				Settings.settings['modding'][room][args[0]] = 0;
				Settings.save();
				this.reply(this.trad('mod') + " **" + args[0] + "** " + this.trad('d'));
			}
		}
	}
};

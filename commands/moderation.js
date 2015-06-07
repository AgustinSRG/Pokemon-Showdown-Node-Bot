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
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " requires moderator rank (@) or highter to ban users");

		var added = [];
		var illegalNick = [];
		var alreadyAdded = [];

		arg = arg.split(',');

		if (!arg.length || (arg.length === 1 && !arg[0].trim().length)) return this.reply('You must specify at least one user to blacklist.');

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
			this.reply('/roomban ' + tarUser + ', Blacklisted user');
			added.push(tarUser);
		}

		var text = '';
		var mn = '';
		if (added.length) {
			text += 'User(s) "' + added.join('", "') + '" added to blacklist successfully.';
			mn += text;
			Settings.save();
		}
		if (alreadyAdded.length) text += 'User(s) "' + alreadyAdded.join('", "') + '" already present in blacklist. ';
		if (illegalNick.length) text += 'All ' + (text.length ? 'other ' : '') + ' users had illegal nicks and were not blacklisted.';
		if (mn.length) this.reply("/mn " + text + " | By: " + by);
		this.reply(text);
	},

	unblacklist: 'unautoban',
	unban: 'unautoban',
	unab: 'unautoban',
	unautoban: function (arg, by, room, cmd) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " requires moderator rank (@) or highter to ban users");

		arg = arg.split(',');

		var removed = [];
		var notRemoved = [];

		if (!arg.length || (arg.length === 1 && !arg[0].trim().length)) return this.reply('You must specify at least one user to unblacklist.');

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
			text += 'User(s) "' + removed.join('", "') + '" removed from blacklist successfully. ';
			Settings.save();
		}
		if (notRemoved.length) text += (text.length ? 'No other ' : 'No ') + 'specified users were present in the blacklist.';
		this.reply(text);
	},

	rab: 'regexautoban',
	regexautoban: function (arg, user, room) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " requires moderator rank (@) or highter to ban users");

		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		try {
			var testing = new RegExp(arg, 'i');
		} catch (e) {
			return this.say(room, e.message);
		}

		if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:\*|\{\d+\,(?:\d+)?\}))+$/i.test(arg)) {
			return this.say(room, 'Regular expression /' + arg + '/i cannot be added to the blacklist. Don\'t be Machiavellian!');
		}

		var regex = '/' + arg + '/i';
		if (!blacklistRegex(regex, room)) return this.say(room, '/' + regex + ' is already present in the blacklist.');
		Settings.save();
		this.say(room, '/modnote Regular expression ' + regex + ' was added to the blacklist by user ' + user + '.');
		this.say(room, 'Regular expression ' + regex + ' was added to the blacklist.');
	},

	unrab: 'unregexautoban',
	unregexautoban: function (arg, user, room) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " requires moderator rank (@) or highter to ban users");

		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		arg = '/' + arg.replace(/\\\\/g, '\\') + '/i';
		if (!unblacklistRegex(arg, room)) return this.say(room, '/' + arg + ' is not present in the blacklist.');

		Settings.save();
		this.say(room, '/modnote Regular expression ' + arg + ' was removed from the blacklist user by ' + user + '.');
		this.say(room, 'Regular expression ' + arg + ' was removed from the blacklist.');
	},

	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function (arg, by, room, cmd) {
		if (!this.can('autoban')) return;
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");

		var text = '';
		var nBans = 0;

		if (arg.length) {
			if (Settings.settings['autoban'] && Settings.settings['autoban'][room]) {
				var nick = toId(arg);
				if (nick.length < 1 || nick.length > 18) {
					return this.pmReply('Invalid nickname: "' + nick + '".');
				} else {
					return this.pmReply('User "' + nick + '" is currently ' + (nick in Settings.settings['autoban'][room] ? '' : 'not ') + 'blacklisted in ' + room + '.');
				}
			} else {
				return this.pmReply('No users are blacklisted in ' + room);
			}
		}

		if (Settings.settings['autoban'] && Settings.settings['autoban'][room]) {
			text += 'The following users are banned in ' + room + ':\n\n';
			for (var i in Settings.settings['autoban'][room]) {
				text += i + "\n";
				nBans++;
			}
		}

		if (Settings.settings['regexautoban'] && Settings.settings['regexautoban'][room]) {
			text += '\nThe following regexes are banned in ' + room + ':\n\n';
			for (var i in Settings.settings['regexautoban'][room]) {
				text += i + "\n";
				nBans++;
			}
		}

		if (nBans) {
			Tools.uploadToHastebin(text, function (r, linkStr) {
				if (r) this.pmReply(linkStr);
				else this.pmReply("upload failure, could not upload blacklist to hastebin");
			}.bind(this));
		} else {
			this.pmReply('No users are blacklisted in ' + room);
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
			return this.say(room, 'Phrase "' + arg + '" is already banned.');
		}
		bannedPhrases[arg] = 1;

		Settings.save();
		this.say(room, 'Phrase "' + arg + '" is now banned.');
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
		if (!Settings.settings['bannedphrases']) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

		var bannedPhrases = Settings.settings['bannedphrases'][tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete Settings.settings['bannedphrases'][tarRoom];
			if (Object.isEmpty(Settings.settings['bannedphrases'])) delete Settings.settings['bannedphrases'];
		}

		Settings.save();
		this.say(room, 'Phrase "' + arg + '" is no longer banned.');
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
			bannedFrom += 'globally';
		} else if (this.can('banword') && this.roomType === 'chat') {
			text += '/pm ' + user + ', ';
			bannedFrom += 'in ' + room;
		} else {
			return false;
		}

		if (!Settings.settings['bannedphrases']) return this.say(room, text + 'No phrases are banned in this room.');
		var bannedPhrases = Settings.settings['bannedphrases'][tarRoom];
		if (!bannedPhrases) return this.say(room, text + 'No phrases are banned in this room.');

		if (arg.length) {
			text += 'The phrase "' + arg + '" is currently ' + (bannedPhrases[arg] ? '' : 'not ') + 'banned ' + bannedFrom + '.';
			return this.say(room, text);
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.say(room, text + 'No phrases are banned in this room.');

		Tools.uploadToHastebin('The following phrases are banned ' + bannedFrom + ':\n\n' + banList.join('\n'), function (r, link) {
			if (r) return this.say(room, text + 'Banned phrases ' + bannedFrom + ': ' + link);
			else this.pmReply("upload failure, could not upload banwords to hastebin");
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
			return this.say(room, 'Phrase "' + arg + '" is already inapropiate.');
		}
		bannedPhrases[arg] = 1;

		Settings.save();
		this.say(room, 'Phrase "' + arg + '" is now inapropiate.');
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
		if (!Settings.settings['inapropiatephrases']) return this.say(room, 'Phrase "' + arg + '" is not currently inapropiate.');

		var bannedPhrases = Settings.settings['inapropiatephrases'][tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.say(room, 'Phrase "' + arg + '" is not currently inapropiate.');

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete Settings.settings['inapropiatephrases'][tarRoom];
			if (Object.isEmpty(Settings.settings['inapropiatephrases'])) delete Settings.settings['inapropiatephrases'];
		}

		Settings.save();
		this.say(room, 'Phrase "' + arg + '" is no longer inapropiate.');
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

		if (!Settings.settings['inapropiatephrases']) return this.say(room, text + 'No phrases are banned in this room.');
		var bannedPhrases = Settings.settings['inapropiatephrases'][tarRoom];
		if (!bannedPhrases) return this.say(room, text + 'No phrases are banned in this room.');

		if (arg.length) {
			text += 'The phrase "' + arg + '" is currently ' + (bannedPhrases[arg] || 'not ') + 'inapropiate ' + bannedFrom + '.';
			return this.say(room, text);
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.say(room, text + 'No phrases are inapropiate in this room.');

		Tools.uploadToHastebin('The following phrases are inapropiate ' + bannedFrom + ':\n\n' + banList.join('\n'), function (r, link) {
			if (r) return this.say(room, text + 'Inapropiate phrases ' + bannedFrom + ': ' + link);
			else this.pmReply("upload failure, could not upload inapwords to hastebin");
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
			if (!Settings.settings['jpdisable']) Settings.settings['jpdisable'] = {};
			if (Settings.settings['jpdisable'][room]) delete Settings.settings['jpdisable'][room];
			else return this.reply("Join phrases already enabled for this room");
			Settings.save();
			return this.reply("Join phrases are now enabled for this room");
		}

		if (this.roomType === 'chat' && toId(arg) in {'off': 1, 'disable': 1}) {
			if (!Settings.settings['jpdisable']) Settings.settings['jpdisable'] = {};
			if (!Settings.settings['jpdisable'][room]) Settings.settings['jpdisable'][room] = 1;
			else return this.reply("Join phrases already disabled for this room");
			Settings.save();
			return this.reply("Join phrases are now disabled for this room");
		}

		var args = arg.split(",");

		if (args.length < 2) return this.reply("Usage: " + Config.commandChar + cmd + " [set/delete], [user], [phrase]");
		if (Settings.settings['jpdisable'] && Settings.settings['jpdisable'][room]) return this.reply("Joinphrases are disabled in this room");

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
				if (args.length < 3) return this.reply("Usage: " + Config.commandChar + cmd + " [set/delete], [user], [phrase]");
				if (!Settings.settings['joinphrases'][tarRoom]) Settings.settings['joinphrases'][tarRoom] = {};
				Settings.settings['joinphrases'][tarRoom][user] = Tools.stripCommands(arg);
				Settings.save();
				this.reply("The Join Phrase for user " + user + " has been modified " + ((tarRoom === 'global') ? 'globally.' : 'for this room.'));
				break;
			case 'delete':
				if (!Settings.settings['joinphrases'][tarRoom]) Settings.settings['joinphrases'][tarRoom] = {};
				if (!Settings.settings['joinphrases'][tarRoom][user]) return this.reply("The Join Phrase for user " + user + " does not exists " + ((tarRoom === 'global') ? 'globally' : 'for this room.'));
				delete Settings.settings['joinphrases'][tarRoom][user];
				Settings.save();
				this.reply("The Join Phrase for user " + user + " has been deleted " + ((tarRoom === 'global') ? 'globally.' : 'for this room.'));
				break;
			default:
				return this.reply("Usage: " + Config.commandChar + cmd + " [set/delete], [user], [phrase]");
		}
	},

	vjf: 'viewjoinphrases',
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
			if (arg.length < 1 || arg.length > 18) return this.reply("Invalid username.");
			if (Settings.settings['joinphrases'][tarRoom][arg]) return this.reply(Settings.settings['joinphrases'][tarRoom][arg]);
			else return this.reply("No Joinphrase set for " + arg + ".");
		}

		var List = [];
		for (var i in Settings.settings['joinphrases'][tarRoom]) {
			List.push(i + " => " + Settings.settings['joinphrases'][tarRoom][i]);
		}
		if (!List.length) return this.reply("There are not JoinPhrases in this room.");
		Tools.uploadToHastebin("Join Phrases set " + (tarRoom === 'global' ? "globally" : ("in " + room)) + ":\n\n" + List.join('\n'), function (r, link) {
			if (r) return this.pmReply('Join phrases ' + (tarRoom === 'global' ? "globally" : ("in " + room)) + ': ' + link);
			else this.pmReply("upload failure, could not upload joinphrases to hastebin");
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
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
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
		if (args.length < 2) return this.reply("Usage: " + Config.commandChar + cmd + " [mod], [on/off]");
		args[0] = toId(args[0]);
		args[1] = toId(args[1]);
		if (args[1] !== 'on' && args[1] !== 'off') return this.reply("Usage: " + Config.commandChar + cmd + " [mod], [on/off]");
		if (!(args[0] in modTable)) return this.reply("Valid moderations are: " + Object.keys(modTable).sort().join(", "));

		if (!Settings.settings['modding']) Settings.settings['modding'] = {};
		if (!Settings.settings['modding'][room]) Settings.settings['modding'][room] = {};

		if (args[1] === 'on') {
			if (Settings.settings['modding'][room][args[0]] === 1) {
				this.reply("Moderation for **" + args[0] + "** already ON for this room");
			} else {
				Settings.settings['modding'][room][args[0]] = 1;
				Settings.save();
				this.reply("Moderation for **" + args[0] + "** is now ON for this room");
			}
		} else {
			if (Settings.settings['modding'][room] === 0) {
				this.reply("Moderation for **" + args[0] + "** already OFF for this room");
			} else {
				Settings.settings['modding'][room][args[0]] = 0;
				Settings.save();
				this.reply("Moderation for **" + args[0] + "** is now OFF for this room");
			}
		}
	}
};

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

function addZeroTolUser(user, level) {
	if (!Settings.settings['zerotol'] || Settings.settings['zerotol'][user] !== level) {
		if (!Settings.settings['zerotol']) Settings.settings['zerotol'] = {};
		Settings.settings['zerotol'][user] = level;
		return true;
	}
	return false;
}

function removeZeroTolUser(user) {
	if (Settings.settings['zerotol'] && Settings.settings['zerotol'][user]) {
		delete Settings.settings['zerotol'][user];
		return true;
	}
	return false;
}

function getZeroTol(user) {
	if (Settings.settings['zerotol'] && Settings.settings['zerotol'][user]) return Settings.settings['zerotol'][user];
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
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		if (!this.isExcepted && !this.botRanked(Tools.getGroup('moderator'))) return this.reply(this.botName + " " + this.trad('notmod').replace('@', Tools.getGroup('moderator')));

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
			if (!blacklistUser(tarUser, tarRoom)) {
				alreadyAdded.push(tarUser);
				continue;
			}
			this.say(tarRoom, '/roomban ' + tarUser + ', ' + this.trad('bu'));
			this.sclog("Blacklisted: " + tarUser);
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
		if (mn.length && (!Config.moderation || !Config.moderation.disableModNote)) this.say(tarRoom, "/mn " + text + " | By: " + by);
		this.reply(text);
	},

	unblacklist: 'unautoban',
	unban: 'unautoban',
	unab: 'unautoban',
	unautoban: function (arg, by, room, cmd) {
		if (!this.can('autoban')) return;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		if (!this.isExcepted && !this.botRanked(Tools.getGroup('moderator'))) return this.reply(this.botName + " " + this.trad('notmod').replace('@', Tools.getGroup('moderator')));

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
			if (!unblacklistUser(tarUser, tarRoom)) {
				notRemoved.push(tarUser);
				continue;
			}
			this.say(tarRoom, '/roomunban ' + tarUser);
			this.sclog("Un-Blacklisted: " + tarUser);
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
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		if (!this.isExcepted && !this.botRanked(Tools.getGroup('moderator'))) return this.reply(Bot.status.nickName + " " + this.trad('notmod').replace('@', Tools.getGroup('moderator')));

		if (!arg) return this.reply(this.trad('notarg'));

		try {
			var testing = new RegExp(arg, 'i');
		} catch (e) {
			return this.reply(e.message);
		}

		if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:\*|\{\d+\,(?:\d+)?\}))+$/i.test(arg)) {
			return this.reply(this.trad('re') + ' /' + arg + '/i ' + this.trad('notadd'));
		}

		var regex = '/' + arg + '/i';
		if (!blacklistRegex(regex, tarRoom)) return this.reply('/' + regex + '/ ' + this.trad('already'));
		Settings.save();
		this.sclog("Blacklisted RegExp: " + regex);
		if (!Config.moderation || !Config.moderation.disableModNote) this.say(tarRoom, '/modnote ' + this.trad('re') + ' ' + regex + ' ' + this.trad('addby') + ' ' + user + '.');
		this.reply(this.trad('re') + ' ' + regex + ' ' + this.trad('add'));
	},

	unrab: 'unregexautoban',
	unregexautoban: function (arg, user, room) {
		if (!this.can('autoban')) return;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		if (!this.isExcepted && !this.botRanked(Tools.getGroup('moderator'))) return this.reply(Bot.status.nickName + " " + this.trad('notmod').replace('@', Tools.getGroup('moderator')));

		if (!arg) return this.reply(this.trad('notarg'));

		arg = '/' + arg.replace(/\\\\/g, '\\') + '/i';
		if (!unblacklistRegex(arg, tarRoom)) return this.reply(this.trad('re') + ' ' + arg + ' ' + this.trad('notpresent'));
		Settings.save();
		this.sclog("Un-Blacklisted RegExp: " + arg);
		if (!Config.moderation || !Config.moderation.disableModNote) this.say(tarRoom, '/modnote ' + this.trad('re') + ' ' + arg + ' ' + this.trad('rby') + ' ' + user + '.');
		this.reply(this.trad('re') + ' ' + arg + ' ' + this.trad('r'));
	},

	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function (arg, by, room, cmd) {
		if (!this.can('autoban')) return;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);

		var text = '';
		var nBans = 0;

		if (arg.length) {
			if (Settings.settings['autoban'] && Settings.settings['autoban'][tarRoom]) {
				var nick = toId(arg);
				if (nick.length < 1 || nick.length > 18) {
					return this.pmReply(this.trad('iu') + ': "' + nick + '".');
				} else {
					return this.pmReply(this.trad('u') + ' "' + nick + '" ' + this.trad('currently') + ' ' + (nick in Settings.settings['autoban'][tarRoom] ? '' : (this.trad('not') + ' ')) + this.trad('b') + ' ' + tarRoom + '.');
				}
			} else {
				return this.pmReply(this.trad('nousers') + ' ' + tarRoom);
			}
		}

		if (Settings.settings['autoban'] && Settings.settings['autoban'][tarRoom]) {
			text += this.trad('listab') + ' ' + tarRoom + ':\n\n';
			for (var i in Settings.settings['autoban'][tarRoom]) {
				text += i + "\n";
				nBans++;
			}
		}

		if (Settings.settings['regexautoban'] && Settings.settings['regexautoban'][tarRoom]) {
			text += '\n' + this.trad('listrab') + ' ' + tarRoom + ':\n\n';
			for (var i in Settings.settings['regexautoban'][tarRoom]) {
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
			this.pmReply(this.trad('nousers') + ' ' + tarRoom);
		}
	},

	/**************************
	* Zero Tolerance
	***************************/

	'0tol': 'zerotol',
	'0tole': 'zerotol',
	zt: 'zerotol',
	vzt: 'zerotol',
	viewzerotol: 'zerotol',
	zerotol: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('admin'))) return;
		var ztLevels, defaultLevel, aliases;
		if (Config.moderation && Config.moderation.zeroToleranceLevels && Config.moderation.zeroToleranceDefaultLevel) {
			ztLevels = Config.moderation.zeroToleranceLevels;
			defaultLevel = Config.moderation.zeroToleranceDefaultLevel;
			aliases = {};
			for (var l in ztLevels) {
				if (ztLevels[l].name) aliases[toId(ztLevels[l].name)] = l;
			}
		} else {
			return this.reply(this.trad('nolevels'));
		}
		if (cmd === 'vzt' || cmd === 'viewzerotol') {
			var ztList = [];
			if (Settings.settings['zerotol']) {
				for (var i in Settings.settings['zerotol']) {
					var level = ztLevels[Settings.settings['zerotol'][i]] ? ztLevels[Settings.settings['zerotol'][i]].name : Settings.settings['zerotol'][i];
					ztList.push(this.trad('user') + ': ' + i + ' | ' + this.trad('level') + ': ' + level);
				}
			}
			if (ztList.length) {
				Tools.uploadToHastebin(this.trad('ztl') + ':\n\n' + ztList.join('\n'), function (r, linkStr) {
					if (r) this.pmReply(linkStr);
					else this.pmReply(this.trad('err'));
				}.bind(this));
			} else {
				this.reply(this.trad('empty'));
			}
			return;
		}
		var args = arg.split(',');
		if (!args[1]) {
			var user = toId(args[0]);
			var level = getZeroTol(user);
			if (level) level = (ztLevels[level] && ztLevels[level].name) ? ztLevels[level].name : level;
			this.reply(this.trad('user') + ' "' + user + '" ' + this.trad('is') + ' ' + (level ? this.trad('y') : this.trad('n')) + ' ' + this.trad('in') + '. ' + (level ? ('(' + level + ')') : ''));
		} else {
			var aliases = {
				'low': 'l',
				'normal': 'n',
				'high': 'h'
			};
			var text;
			switch (toId(args[0])) {
				case 'add':
					if (args.length < 2) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u2'));
					var added = [], illegal = [], alreadyAdded = [], levelFail = [];
					for (var i = 1; i < args.length; i++) {
						var splArg = args[i].split(':');
						var user = toId(splArg[0]);
						var level = toId(splArg[1] || defaultLevel);
						if (aliases[level]) level = aliases[level];
						if (!user.length || user.length > 18) {
							illegal.push(user);
							continue;
						}
						if (!ztLevels[level]) {
							levelFail.push(user);
							continue;
						}
						if (addZeroTolUser(user, level)) {
							added.push(user);
							this.sclog("0tol user: " + user + "; Level: " + level);
						} else {
							alreadyAdded.push(user);
						}
					}
					text = '';
					if (added.length) {
						text += this.trad('users') + ' "' + added.join('", "') + '" ' + this.trad('add') + '. ';
						Settings.save();
					}
					if (illegal.length) {
						text += illegal.length + ' ' + this.trad('illegal') + '. ';
					}
					if (levelFail.length) {
						text += this.trad('users') + ' "' + levelFail.join('", "') + '" ' + this.trad('invalid') + '. ';
					}
					if (alreadyAdded.length) {
						text += this.trad('users') + ' "' + alreadyAdded.join('", "') + '" ' + this.trad('already') + '. ';
					}
					this.reply(text);
					break;
				case 'delete':
				case 'remove':
					if (args.length < 2) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u2'));
					var removed = [], notFound = [];
					for (var i = 1; i < args.length; i++) {
						var user = toId(args[i]);
						if (removeZeroTolUser(user)) {
							removed.push(user);
							this.sclog("Un-0tol user: " + user);
						} else {
							notFound.push(user);
						}
					}
					text = '';
					if (removed.length) {
						text += this.trad('users') + ' "' + removed.join('", "') + '" ' + this.trad('removed') + '. ';
						Settings.save();
					}
					if (notFound.length) {
						text += notFound.length + ' ' + this.trad('not') + '. ';
					}
					this.reply(text);
					break;
				default:
					this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u2'));
			}
		}
	},

	/**************************
	* Banned words
	***************************/

	banphrase: 'banword',
	banword: function (arg, user, room) {
		if (!this.can('banword')) return;
		if (!arg) return false;

		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = 'global';
		} else {
			tarRoom = room;
		}

		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}

		if (tarRoom !== 'global' && (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat')) return this.reply(this.trad('notchat') + textHelper);
		arg = arg.trim().toLowerCase();

		var bannedPhrases = Settings.settings['bannedphrases'] ? Settings.settings['bannedphrases'][tarRoom] : null;
		if (!bannedPhrases) {
			if (bannedPhrases === null) Settings.settings['bannedphrases'] = {};
			bannedPhrases = (Settings.settings['bannedphrases'][tarRoom] = {});
		} else if (bannedPhrases[arg]) {
			return this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('already') + textHelper);
		}
		bannedPhrases[arg] = 1;

		Settings.save();
		this.sclog();
		this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('ban') + textHelper);
	},

	unbanphrase: 'unbanword',
	unbanword: function (arg, user, room) {
		if (!this.can('banword')) return;
		if (!arg) return false;

		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = 'global';
		} else {
			tarRoom = room;
		}

		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}

		if (tarRoom !== 'global' && (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat')) return this.reply(this.trad('notchat') + textHelper);
		arg = arg.trim().toLowerCase();

		if (!Settings.settings['bannedphrases']) return this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('not') + textHelper);

		var bannedPhrases = Settings.settings['bannedphrases'][tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('not') + textHelper);

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete Settings.settings['bannedphrases'][tarRoom];
			if (Object.isEmpty(Settings.settings['bannedphrases'])) delete Settings.settings['bannedphrases'];
		}

		Settings.save();
		this.sclog();
		this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('unban') + textHelper);
	},

	viewbannedphrases: 'viewbannedwords',
	vbw: 'viewbannedwords',
	viewbannedwords: function (arg, user, room) {
		if (!this.can('banword')) return;
		var tarRoom;
		var text = '';
		var bannedFrom = '';
		if (this.roomType === 'pm') {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = 'global';
		} else {
			tarRoom = room;
		}
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}

		if (tarRoom !== 'global' && (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat')) return this.reply(this.trad('notchat') + textHelper);

		if (tarRoom === 'global') bannedFrom += this.trad('globally');
		else bannedFrom += this.trad('in') + ' ' + tarRoom;

		if (!Settings.settings['bannedphrases']) return this.reply(this.trad('nowords') + textHelper);
		var bannedPhrases = Settings.settings['bannedphrases'][tarRoom];
		if (!bannedPhrases) return this.reply(this.trad('nowords') + textHelper);

		if (arg.length) {
			return this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('curr') + ' ' + (bannedPhrases[arg] ? '' : (this.trad('not') + ' ')) + this.trad('banned') + ' ' + bannedFrom + '.');
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.reply(this.trad('nowords') + textHelper);

		Tools.uploadToHastebin(this.trad('list') + ' ' + bannedFrom + ':\n\n' + banList.join('\n'), function (r, link) {
			if (r) return this.pmReply(this.trad('link') + ' ' + bannedFrom + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	},

	inappropriatephrase: 'inapword',
	inapword: function (arg, user, room) {
		if (!this.can('banword')) return;
		if (!arg) return false;

		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = 'global';
		} else {
			tarRoom = room;
		}

		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}

		if (tarRoom !== 'global' && (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat')) return this.reply(this.trad('notchat') + textHelper);
		arg = arg.trim().toLowerCase();

		var bannedPhrases = Settings.settings['inapropiatephrases'] ? Settings.settings['inapropiatephrases'][tarRoom] : null;
		if (!bannedPhrases) {
			if (bannedPhrases === null) Settings.settings['inapropiatephrases'] = {};
			bannedPhrases = (Settings.settings['inapropiatephrases'][tarRoom] = {});
		} else if (bannedPhrases[arg]) {
			return this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('already') + textHelper);
		}
		bannedPhrases[arg] = 1;

		Settings.save();
		this.sclog();
		this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('ban') + textHelper);
	},

	uninappropriatephrase: 'uninapword',
	uninapword: function (arg, user, room) {
		if (!this.can('banword')) return;
		if (!arg) return false;

		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = 'global';
		} else {
			tarRoom = room;
		}

		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}

		if (tarRoom !== 'global' && (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat')) return this.reply(this.trad('notchat') + textHelper);
		arg = arg.trim().toLowerCase();

		if (!Settings.settings['inapropiatephrases']) return this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('not') + textHelper);

		var bannedPhrases = Settings.settings['inapropiatephrases'][tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('not') + textHelper);

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete Settings.settings['inapropiatephrases'][tarRoom];
			if (Object.isEmpty(Settings.settings['inapropiatephrases'])) delete Settings.settings['inapropiatephrases'];
		}

		Settings.save();
		this.sclog();
		this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('unban') + textHelper);
	},

	viewinapropiatephrases: 'viewinapwords',
	viw: 'viewinapwords',
	viewinapwords: function (arg, user, room) {
		if (!this.can('banword')) return;
		var tarRoom;
		var text = '';
		var bannedFrom = '';
		if (this.roomType === 'pm') {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = 'global';
		} else {
			tarRoom = room;
		}
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}

		if (tarRoom !== 'global' && (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat')) return this.reply(this.trad('notchat') + textHelper);

		if (tarRoom === 'global') bannedFrom += this.trad('globally');
		else bannedFrom += this.trad('in') + ' ' + tarRoom;

		if (!Settings.settings['inapropiatephrases']) return this.reply(this.trad('nowords') + textHelper);
		var bannedPhrases = Settings.settings['inapropiatephrases'][tarRoom];
		if (!bannedPhrases) return this.reply(this.trad('nowords') + textHelper);

		if (arg.length) {
			return this.reply(this.trad('phrase') + ' "' + arg + '" ' + this.trad('curr') + ' ' + (bannedPhrases[arg] || (this.trad('not') + ' ')) + this.trad('banned') + ' ' + bannedFrom + '.');
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.reply(this.trad('nowords') + textHelper);

		Tools.uploadToHastebin(this.trad('list') + ' ' + bannedFrom + ':\n\n' + banList.join('\n'), function (r, link) {
			if (r) return this.pmReply(this.trad('link') + ' ' + bannedFrom + ': ' + link);
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

		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = 'global';
		} else {
			tarRoom = room;
		}

		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (tarRoom !== 'global' && (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat')) return this.reply(this.trad('notchat') + textHelper);

		if (Bot.rooms[tarRoom] && Bot.rooms[tarRoom].type === 'chat' && toId(arg) in {'on': 1, 'enable': 1}) {
			if (!this.isRanked(Tools.getGroup('roomowner'))) return false;
			if (!Settings.settings['jpdisable']) Settings.settings['jpdisable'] = {};
			if (Settings.settings['jpdisable'][tarRoom]) delete Settings.settings['jpdisable'][tarRoom];
			else return this.reply(this.trad('ae') + textHelper);
			Settings.save();
			this.sclog();
			return this.reply(this.trad('e') + textHelper);
		}

		if (Bot.rooms[tarRoom] && Bot.rooms[tarRoom].type === 'chat' && toId(arg) in {'off': 1, 'disable': 1}) {
			if (!this.isRanked(Tools.getGroup('roomowner'))) return false;
			if (!Settings.settings['jpdisable']) Settings.settings['jpdisable'] = {};
			if (!Settings.settings['jpdisable'][tarRoom]) Settings.settings['jpdisable'][tarRoom] = 1;
			else return this.reply(this.trad('ad') + textHelper);
			Settings.save();
			this.sclog();
			return this.reply(this.trad('d') + textHelper);
		}

		var args = arg.split(",");

		if (args.length < 2) return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
		if (Settings.settings['jpdisable'] && Settings.settings['jpdisable'][tarRoom]) return this.reply(this.trad('dis') + textHelper);

		if (toId(args[0]) !== "delete" && args.length === 2) {
			arg = "set," + toId(args[0]) + "," + arg.substr(args[0].length + 1);
			args = arg.split(",");
		}

		arg = arg.substr(args[0].length + args[1].length + 2);
		arg = arg.trim();

		var user = toId(args[1]);
		if (!user) return false;

		switch (toId(args[0])) {
			case 'set':
			case 'add':
			case 'change':
				if (!arg || !arg.length) return false;
				if (args.length < 3) return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
				if (!Settings.settings['joinphrases'][tarRoom]) Settings.settings['joinphrases'][tarRoom] = {};
				Settings.settings['joinphrases'][tarRoom][user] = Tools.stripCommands(arg);
				Settings.save();
				this.sclog();
				this.reply(this.trad('jpfor') + " " + user + ' ' + this.trad('modified') + ' ' + ((tarRoom === 'global') ? this.trad('globally') : (this.trad('forthis') + textHelper)));
				break;
			case 'delete':
				if (!Settings.settings['joinphrases'][tarRoom]) Settings.settings['joinphrases'][tarRoom] = {};
				if (!Settings.settings['joinphrases'][tarRoom][user]) return this.reply(this.trad('jpfor') + " " + user + " " + this.trad('not') + " " + ((tarRoom === 'global') ? this.trad('globally') : (this.trad('forthis') + textHelper)));
				delete Settings.settings['joinphrases'][tarRoom][user];
				Settings.save();
				this.sclog();
				this.reply(this.trad('jpfor') + " " + user + ' ' + this.trad('del') + ' ' + ((tarRoom === 'global') ? this.trad('globally') : (this.trad('forthis') + textHelper)));
				break;
			default:
				return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
		}
	},

	vjp: 'viewjoinphrases',
	viewjoinphrases: function (arg, by, room, cmd) {
		if (!this.can('joinphrase')) return;
		if (!Settings.settings['joinphrases']) Settings.settings['joinphrases'] = {};

		var tarRoom;
		if (this.roomType === 'pm') {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = 'global';
		} else {
			tarRoom = room;
		}

		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (tarRoom !== 'global' && (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat')) return this.reply(this.trad('notchat') + textHelper);

		arg = toId(arg);

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
		if (!List.length) return this.reply(this.trad('empty') + textHelper);
		Tools.uploadToHastebin(this.trad('jp') + " " + (tarRoom === 'global' ? this.trad('globally') : (this.trad('in') + " " + tarRoom)) + ":\n\n" + List.join('\n'), function (r, link) {
			if (r) return this.pmReply(this.trad('jp') + ' ' + (tarRoom === 'global' ? this.trad('globally') : (this.trad('in') + " " + tarRoom)) + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	},

	/**************************
	* Mod Settings
	***************************/

	modex: 'modexception',
	modexception: function (arg, by, room, cmd) {
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		if (!arg) {
			var exceptionSettings = Settings.settings['modexception'] || {};
			var ex = Config.moderation.modException;
			if (room in exceptionSettings) ex = exceptionSettings[tarRoom];
			if (ex === ' ') ex = "**" + this.trad('all') + "**";
			else ex = this.trad('rank') + " **" + ex + "**";
			return this.restrictReply(this.trad('modex-inf1') + " " + ex + " " + this.trad('modex-inf2') + textHelper, 'info');
		}
		if (!this.isRanked(Tools.getGroup('roomowner'))) return false;
		if (!Settings.settings['modexception']) Settings.settings['modexception'] = {};
		var rank = arg.trim();
		if (Config.ranks.indexOf(rank) >= 0) {
			Settings.settings['modexception'][tarRoom] = rank;
			Settings.save();
			this.sclog();
			return this.reply(this.trad('modex-set1') + " " + this.trad('rank') + " **" + rank + "** " + this.trad('modex-set2') + textHelper);
		} else if (toId(rank) === 'all') {
			Settings.settings['modexception'][tarRoom] = ' ';
			Settings.save();
			this.sclog();
			return this.reply(this.trad('modex-set1') + " **" + this.trad('all') + "** " + this.trad('modex-set2') + textHelper);
		} else {
			return this.reply(this.trad('not1') + " " + rank + " " + this.trad('not2'));
		}
	},

	setmod: 'mod',
	modset: 'mod',
	modsettings: 'mod',
	mod: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('roomowner'))) return false;
		var tarRoom = room;
		var args = arg.split(",");
		if (args.length > 2) {
			if (!this.isRanked(Tools.getGroup('admin'))) return false;
			tarRoom = toRoomid(args[0]);
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + ' (' + tarRoom + ')');
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
			'multiple': 1,
			'zerotol': 1,
			'replays': 1
		};
		if (args.length < 2) return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
		var mod = (args.length < 3) ? toId(args[0]) : toId(args[1]);
		var set = (args.length < 3) ? toId(args[1]) : toId(args[2]);
		if (set !== 'on' && set !== 'off') return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
		if (!(mod in modTable)) return this.reply(this.trad('valid') + ": " + Object.keys(modTable).sort().join(", "));

		if (!Settings.settings['modding']) Settings.settings['modding'] = {};
		if (!Settings.settings['modding'][tarRoom]) Settings.settings['modding'][tarRoom] = {};

		if (set === 'on') {
			if (Settings.settings['modding'][tarRoom][mod] === 1) {
				this.reply(this.trad('mod') + " **" + mod + "** " + this.trad('ae') + ' ' + tarRoom);
			} else {
				Settings.settings['modding'][tarRoom][mod] = 1;
				Settings.save();
				this.sclog();
				this.reply(this.trad('mod') + " **" + mod + "** " + this.trad('e') + ' ' + tarRoom);
			}
		} else {
			if (Settings.settings['modding'][tarRoom][mod] === 0) {
				this.reply(this.trad('mod') + " **" + mod + "** " + this.trad('ad') + ' ' + tarRoom);
			} else {
				Settings.settings['modding'][tarRoom][mod] = 0;
				Settings.save();
				this.sclog();
				this.reply(this.trad('mod') + " **" + mod + "** " + this.trad('d') + ' ' + tarRoom);
			}
		}
	}
};

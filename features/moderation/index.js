/*
	Moderation Feature
*/

exports.id = 'moderation';
exports.desc = 'Automated moderation for chat rooms';

var MOD_CONSTS = {
	FLOOD_MESSAGE_NUM: 5,
	FLOOD_PER_MSG_MIN: 500, // this is the minimum time between messages for legitimate spam. It's used to determine what "flooding" is caused by lag
	FLOOD_MESSAGE_TIME: 6 * 1000,
	MIN_CAPS_LENGTH: 18,
	MIN_CAPS_PROPORTION: 0.8,
	MAX_STRETCH: 7,
	MAX_REPEAT: 4
};

function getConst (c) {
	if (Config.moderation && Config.moderation.MOD_CONSTS && typeof Config.moderation.MOD_CONSTS[c] !== 'undefined') return Config.moderation.MOD_CONSTS[c];
	return MOD_CONSTS[c];
}

var DEFAULT_MOD_VALUES = {
	'spam-p': 3,
	'spam': 4,
	'spam-link': 4,
	'flood-hard': 3,
	'flood': 2,
	'caps': 1,
	'stretch': 1,
	'banwords': 2,
	'inapwords': 2,
	'servers': 2,
	'youtube': 2,
	'spoiler': 2,
	'replays': 1
};

function getValue (key) {
	if (Config.moderation && Config.moderation.values && typeof Config.moderation.values[key] === 'number') return parseInt(Config.moderation.values[key]);
	return DEFAULT_MOD_VALUES[key] || 1;
}

function getModException (room) {
	if (Settings.settings['modexception'] && typeof Settings.settings['modexception'][room] !== 'undefined') return Settings.settings['modexception'][room];
	if (Config.moderation && typeof Config.moderation.modException !== 'undefined') return Config.moderation.modException;
	return Tools.getGroup('driver');
}

function trad (data, room) {
	var lang = Config.language || 'english';
	if (Settings.settings['language'] && Settings.settings['language'][room]) lang = Settings.settings['language'][room];
	return Tools.translateGlobal('moderation', data, lang);
}

var chatData = exports.chatData = {};
var chatLog = exports.chatLog = {};
var zeroTol = exports.zeroTol = {};
var cleanDataTimer = null;

var cleanData = exports.cleanData = function () {
	for (var room in chatData) {
		for (var user in chatData[room]) {
			var now = Date.now();
			if (!chatData[room][user] || !chatData[room][user].times.length) {
				delete chatData[room][user];
				continue;
			}
			if (now - chatData[room][user].times[chatData[room][user].times.length - 1] > 24 * 60 * 60 * 1000) {
				delete chatData[room][user];
				continue;
			}
			var newTimes = [];
			for (var j = 0; j < chatData[room][user].times.length; j++) {
				if (now - chatData[room][user].times[j] < 60 * 60 * 1000) newTimes.push(chatData[room][user].times[j]);
			}
			delete chatData[room][user].times;
			chatData[room][user].times = newTimes;
			if (chatData[room][user].points) chatData[room][user].points--;
		}
	}
};

function isBotRanked (room, rank) {
	if (!Bot.rooms[room]) return false;
	var ident = Bot.rooms[room].users[toId(Bot.status.nickName)];
	if (ident) return Tools.equalOrHigherRank(ident, rank);
	return false;
}

function isBanned (room, user, noregexp) {
	user = toId(user);
	if (Settings.settings['autoban'] && Settings.settings['autoban'][room] && Settings.settings['autoban'][room][user]) return true;
	if (!noregexp && Settings.settings['regexautoban'] && Settings.settings['regexautoban'][room]) {
		for (var i in Settings.settings['regexautoban'][room]) {
			try {
				var regexObj = new RegExp(i.substr(1, i.length - 3), 'i');
				if (regexObj.test(user)) return '#range';
			} catch (e) {}
		}
	}
	return false;
}

function blacklistUser(user, room) {
	if (!Settings.settings['autoban'] || !Settings.settings['autoban'][room] || !Settings.settings['autoban'][room][user]) {
		if (!Settings.settings['autoban']) Settings.settings['autoban'] = {};
		if (!Settings.settings['autoban'][room]) Settings.settings['autoban'][room] = {};
		Settings.settings['autoban'][room][user] = 1;
		return true;
	}
	return false;
}

function getJoinPhrase (room, user) {
	user = toId(user);
	if (Settings.settings['jpdisable'] && Settings.settings['jpdisable'][room]) return false;
	if (Settings.settings['joinphrases'] && Settings.settings['joinphrases'][room] && Settings.settings['joinphrases'][room][user]) return Settings.settings['joinphrases'][room][user];
	if (Settings.settings['joinphrases'] && Settings.settings['joinphrases']['global'] && Settings.settings['joinphrases']['global'][user]) return Settings.settings['joinphrases']['global'][user];
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

function getServersAds (text) {
	var aux = text.toLowerCase();
	var serversAds = [];
	var spamindex;
	var actualAd = '';
	while (aux.indexOf(".psim.us") > -1) {
		spamindex = aux.indexOf(".psim.us");
		actualAd = '';
		for (var i = spamindex - 1; i >= 0; i--) {
			if (aux.charAt(i).replace(/[^a-z0-9]/g, '') === '') break;
			actualAd = aux.charAt(i) + actualAd;
		}
		if (actualAd.length) serversAds.push(toId(actualAd));
		aux = aux.substr(spamindex + ".psim.us".length);
	}
	return serversAds;
}

function parseChat (room, time, by, message) {
	var user = toId(by);
	if (Tools.equalOrHigherRank(by, getModException(room))) return;
	var ban = isBanned(room, by);
	if (ban) Bot.say(room, '/roomban ' + by + ', ' + trad('ab', room) + ((ban === '#range') ? ' (RegExp)' : ''));

	/* Chat Logs */

	if (!chatLog[room]) chatLog[room] = {
		times: [0, 0, 0, 0],
		users: ['', '', '', ''],
		msgs: ['', '', '', '']
	};

	chatLog[room].times.push(time);
	chatLog[room].users.push(user);
	chatLog[room].msgs.push(message);

	chatLog[room].times.shift();
	chatLog[room].users.shift();
	chatLog[room].msgs.shift();

	var msg = message.trim().replace(/[ \u0000\u200B-\u200F]+/g, " "); // removes extra spaces and null characters so messages that should trigger stretching do so

	if (!chatData[room]) chatData[room] = {};

	if (!chatData[room][user]) chatData[room][user] = {times:[], lastMsgs: ['', '', ''], points:0, lastAction:0};

	chatData[room][user].lastMsgs.push(msg);
	chatData[room][user].lastMsgs.shift();

	chatData[room][user].times.push(time);

	/* Moderation */

	if (!Config.moderation.allowmute) return;
	if (!isBotRanked(room, Tools.getGroup('driver'))) return; // Bot is not a driver or above

	var infractions = [];
	var muteMessage = '';
	var pointVal = 0;
	var totalPointVal = 0;
	var times = chatData[room][user].times;

	var modSettings = {};
	var useDefault = !(Settings.settings['modding'] && Settings.settings['modding'][room]);
	if (useDefault) {
		modSettings = Config.moderation.modDefault;
	} else {
		for (var i in Config.moderation.modDefault) {
			if (typeof Settings.settings['modding'][room][i] === "undefined") {
				modSettings[i] = Config.moderation.modDefault[i];
			} else {
				modSettings[i] = Settings.settings['modding'][room][i];
			}
		}
	}

	var pv = 0;
	var capsMatch = msg.replace(/[^A-Za-z]/g, '').match(/[A-Z]/g);
	capsMatch = capsMatch && toId(msg).length > getConst('MIN_CAPS_LENGTH') && (capsMatch.length >= Math.floor(toId(msg).length * getConst('MIN_CAPS_PROPORTION')));
	var stretchRegExp = new RegExp('(.)\\1{' + getConst('MAX_STRETCH').toString() + ',}', 'g');
	var repeatRegExp = new RegExp('(..+)\\1{' + getConst('MAX_REPEAT').toString() + ',}', 'g');
	var stretchMatch = msg.toLowerCase().match(stretchRegExp);
	var inlineSpam = stretchMatch ? false : msg.toLowerCase().match(repeatRegExp);
	var isFlooding = (times.length >= getConst('FLOOD_MESSAGE_NUM') && (time - times[times.length - getConst('FLOOD_MESSAGE_NUM')]) < getConst('FLOOD_MESSAGE_TIME') && (time - times[times.length - getConst('FLOOD_MESSAGE_NUM')]) > (getConst('FLOOD_PER_MSG_MIN') * getConst('FLOOD_MESSAGE_NUM')));
	var addFlood = false;

	/*****************
	* Spam Mod
	******************/

	if (modSettings['spam'] !== 0 || modSettings['flooding'] !== 0) {
		if (times.length >= getConst('FLOOD_MESSAGE_NUM') && (time - times[times.length - getConst('FLOOD_MESSAGE_NUM')]) < getConst('FLOOD_MESSAGE_TIME')) {
			var isSpamming = false;
			for (var i = chatLog[room].users.length - 2; i > chatLog[room].users.length - 4; i--) {
				if (chatLog[room].users[i] !== chatLog[room].users[chatLog[room].users.length - 1]) {
					isSpamming = true;
					break;
				}
			}
			if (isSpamming) {
				if (msg.toLowerCase().indexOf("http://") > -1 || msg.toLowerCase().indexOf("https://") > -1 || msg.toLowerCase().indexOf("www.") > -1) {
					if (modSettings['spam'] !== 0) {
						muteMessage = ', ' + trad('automod', room) + ': ' + trad('sl', room);
						pointVal = getValue('spam-link');
					} else if (modSettings['flooding'] !== 0) {
						pointVal = getValue('flood');
						muteMessage = ', ' + trad('automod', room) + ': ' + trad('f', room);
						addFlood = true;
					}
				} else {
					if (msg.length > 70 || capsMatch || msg.toLowerCase().indexOf("**") > -1 || stretchMatch || inlineSpam) {
						if (modSettings['spam'] !== 0) {
							muteMessage = ', ' + trad('automod', room) + ': ' + trad('s', room);
							pointVal = getValue('spam');
						} else if (modSettings['flooding'] !== 0) {
							pointVal = getValue('flood');
							muteMessage = ', ' + trad('automod', room) + ': ' + trad('f', room);
							addFlood = true;
						}
					} else {
						if (modSettings['flooding'] !== 0) {
							pointVal = getValue('flood');
							muteMessage = ', ' + trad('automod', room) + ': ' + trad('f', room);
							addFlood = true;
						}
					}
				}
			}
		}
	}

	pv = getValue('spam-p');
	if (modSettings['spam'] !== 0 && pointVal < pv) {
		if (times.length >= 3 && (time - times[times.length - 3]) < getConst('FLOOD_MESSAGE_TIME') && msg === chatData[room][user].lastMsgs[0] && chatData[room][user].lastMsgs[0] === chatData[room][user].lastMsgs[1]) {
			pointVal = pv;
			muteMessage = ', ' + trad('automod', room) + ': ' + trad('fs', room);
			if (msg.toLowerCase().indexOf("http://") > -1 || msg.toLowerCase().indexOf("https://") > -1 || msg.toLowerCase().indexOf("www.") > -1) {
				muteMessage = ', ' + trad('automod', room) + ': ' + trad('sl', room);
				pointVal = getValue('spam-link');
			} else if (msg.length > 70 || capsMatch || msg.toLowerCase().indexOf("**") > -1 || stretchMatch || inlineSpam) {
				muteMessage = ', ' + trad('automod', room) + ': ' + trad('s', room);
				pointVal = getValue('spam');
			}
		}
	}

	/********************************************
	* Bacic Mods (caps, stretching, flooding)
	*********************************************/

	if (modSettings['caps'] !== 0 && capsMatch) {
		infractions.push(trad('caps-0', room));
		pv = getValue("caps");
		totalPointVal += pv;
		if (pointVal < pv) {
			pointVal = pv;
			muteMessage = ', ' + trad('automod', room) + ': ' + trad('caps', room);
		}
	}

	pv = getValue("stretch");
	if (inlineSpam) {
		infractions.push(trad('rep-0', room));
		totalPointVal += pv;
	}

	if (modSettings['stretching'] !== 0 && stretchMatch) {
		infractions.push(trad('stretch-0', room));
		totalPointVal += pv;
		if (pointVal < pv) {
			pointVal = pv;
			muteMessage = ', ' + trad('automod', room) + ': ' + trad('stretch', room);
		}
	}

	pv = getValue("flood");
	if (modSettings['flooding'] !== 0 && isFlooding) {
		addFlood = true;
		if (pointVal < pv) {
			pointVal = pv;
			muteMessage = ', ' + trad('automod', room) + ': ' + trad('f', room);
		}
	}
	if (addFlood) {
		infractions.push(trad('flood-0', room));
		totalPointVal += pv;
	}

	/*****************************
	* Specific Mods
	******************************/

	pv = getValue("spoiler");
	if (modSettings['spoiler'] !== 0 && (msg.toLowerCase().indexOf("spoiler:") > -1 || msg.toLowerCase().indexOf("spoilers:") > -1)) {
		infractions.push(trad('spoiler-0', room));
		totalPointVal += pv;
		if (pointVal < pv) {
			pointVal = pv;
			muteMessage = ', ' + trad('automod', room) + ': ' + trad('spoiler', room);
		}
	}

	pv = getValue("youtube");
	if (modSettings['youtube'] !== 0 && (msg.toLowerCase().indexOf("youtube.com/channel/") > -1 || msg.toLowerCase().indexOf("youtube.com/user/") > -1)) {
		infractions.push(trad('youtube-0', room));
		totalPointVal += pv;
		if (pointVal < pv) {
			pointVal = pv;
			muteMessage = ', ' + trad('automod', room) + ': ' + trad('youtube', room);
		}
	}

	pv = getValue("replays");
	if (modSettings['replays'] !== 0 && (msg.toLowerCase().indexOf("replay.pokemonshowdown.com/") > -1)) {
		infractions.push(trad('replays-0', room));
		totalPointVal += pv;
		if (pointVal < pv) {
			pointVal = pv;
			muteMessage = ', ' + trad('automod', room) + ': ' + trad('replays', room);
		}
	}

	pv = getValue("servers");
	if (modSettings['psservers'] !== 0 && msg.toLowerCase().indexOf(".psim.us") > -1) {
		var serverAds = getServersAds(msg);
		for (var z = 0; z < serverAds.length; z++) {
			if (!(serverAds[z] in Config.moderation.psServersExcepts)) {
				infractions.push(trad('server-0', room));
				totalPointVal += pv;
				if (pointVal < pv) {
					pointVal = pv;
					muteMessage = ', ' + trad('automod', room) + ': ' + trad('server', room);
				}
				break;
			}
		}
	}

	/****************************
	* Banned Words
	*****************************/

	pv = getValue("inapwords");
	if (modSettings['inapropiate'] !== 0) {
		var inapropiatephraseSettings = Settings.settings['inapropiatephrases'];
		var inapropiatePhrases = !!inapropiatephraseSettings ? (Object.keys(inapropiatephraseSettings[room] || {})).concat(Object.keys(inapropiatephraseSettings['global'] || {})) : [];
		var msgrip = " " + msg.toLowerCase().replace(/[^a-z0-9]/g, ' ') + " ";
		for (var i = 0; i < inapropiatePhrases.length; i++) {
			if (msgrip.indexOf(" " + inapropiatePhrases[i] + " ") > -1) {
				infractions.push(trad('inapword-0', room));
				totalPointVal += pv;
				if (pointVal < pv) {
					pointVal = pv;
					muteMessage = ', ' + trad('automod', room) + ': ' + trad('inapword', room);
				}
				break;
			}
		}
	}

	pv = getValue("banwords");
	if (modSettings['bannedwords'] !== 0) {
		var banphraseSettings = Settings.settings['bannedphrases'];
		var bannedPhrases = !!banphraseSettings ? (Object.keys(banphraseSettings[room] || {})).concat(Object.keys(banphraseSettings['global'] || {})) : [];
		var msglow = msg.toLowerCase();
		for (var i = 0; i < bannedPhrases.length; i++) {
			if (msglow.indexOf(bannedPhrases[i]) > -1) {
				infractions.push(trad('banword-0', room));
				totalPointVal += pv;
				if (pointVal < pv) {
					pointVal = pv;
					muteMessage = ', ' + trad('automod', room) + ': ' + trad('banword', room);
				}
				break;
			}
		}
	}

	/*****************************
	* Multiple infraction
	******************************/

	if (modSettings['multiple'] !== 0) {
		if (infractions.length >= 2) {
			pointVal = totalPointVal;
			muteMessage = ', ' + trad('automod', room) + '. ' + trad('mult', room) + ': ' + infractions.join(", ");
		}
	}

	/* Zero Tolerance */

	if (modSettings['zerotol'] && pointVal > 0 && Config.moderation && Config.moderation.zeroToleranceLevels && getZeroTol(user)) {
		var ztObj = Config.moderation.zeroToleranceLevels[getZeroTol(user)];
		if (ztObj && ztObj.value) {
			muteMessage += ' ' + trad('0tol', room);
			pointVal += ztObj.value;
		}
	}

	/* Applying punishment */

	if (pointVal > 0) {
		var cmd = 'mute';
		pointVal += chatData[room][user].points;
		chatData[room][user].points++;
		if (pointVal > Config.moderation.punishments.length) pointVal = Config.moderation.punishments.length;
		if (pointVal >= 2) {
			if (!zeroTol[user]) zeroTol[user] = 0;
			zeroTol[user]++;
			if (zeroTol[user] > 4 && Config.moderation.zeroToleranceDefaultLevel) {
				addZeroTolUser(user, Config.moderation.zeroToleranceDefaultLevel);
			}
		}

		cmd = Config.moderation.punishments[pointVal - 1];

		if (cmd  === 'roomban' && !isBotRanked(room, Tools.getGroup('moderator'))) cmd = 'hourmute'; //Bot is not a moderator
		if ((room in Config.privateRooms) && cmd === 'warn') cmd = 'mute'; //can't warn in private rooms

		Bot.say(room, '/' + cmd + ' ' + user + muteMessage);
	}
}

function parseJoin (room, by) {
	var jp = getJoinPhrase(room, by);
	if (jp) Bot.say(room, jp);
	if (Tools.equalOrHigherRank(by, Config.moderation.modException)) return;
	var ban = isBanned(room, by);
	if (ban) Bot.say(room, '/roomban ' + by + ', ' + trad('ab', room) + ((ban === '#range') ? ' (RegExp)' : ''));
}

function parseLeave (room, by) {
	return; // parseLeave is useless now, but can be useful later
}

function parseRename (room, by, old) {
	if (Tools.equalOrHigherRank(by, Config.moderation.modException)) return;
	var ban = isBanned(room, by);
	if (ban) {
		Bot.say(room, '/roomban ' + by + ', ' + trad('ab', room) + ((ban === '#range') ? ' (RegExp)' : ''));
		if (ban !== '#range' && !isBanned(room, old)) {
			blacklistUser(room, old); // Blacklist alt
			SecurityLog.log("User \"" + old + "\" was blacklisted for being alt of \"" + toId(by) + "\" | Room: " + room);
		}
	}
}

exports.init = function () {
	for (var i in chatData)
		delete chatData[i];
	for (var i in chatLog)
		delete chatLog[i];

	if (cleanDataTimer) clearInterval(cleanDataTimer);
	cleanDataTimer = null;
	cleanDataTimer = setInterval(cleanData, 30 * 60 * 1000);
};

exports.parse = function (room, message, isIntro, spl) {
	if (isIntro) return;
	if (!Bot.rooms[room] || Bot.rooms[room].type !== "chat") return;
	if (!Config.moderation) Config.moderation = {};
	var by, timeOff;
	switch (spl[0]) {
		case 'c':
			by = spl[1];
			timeOff = Date.now();
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|").length));
			break;

		case 'c:':
			by = spl[2];
			timeOff = parseInt(spl[1]) * 1000;
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|" + spl[2] + "|").length));
			break;

		case 'J': case 'j':
			parseJoin(room, spl[1]);
			break;

		case 'l': case 'L':
			parseLeave(room, spl[1]);
			break;

		case 'n': case 'N':
			parseRename(room, spl[1], spl[2]);
			break;
	}
};

exports.destroy = function () {
	if (cleanDataTimer) clearInterval(cleanDataTimer);
	cleanDataTimer = null;
	if (Features[exports.id]) delete Features[exports.id];
};

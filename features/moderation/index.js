/*
	Moderation Feature
*/

const FLOOD_MESSAGE_NUM = 5;
const FLOOD_PER_MSG_MIN = 500; // this is the minimum time between messages for legitimate spam. It's used to determine what "flooding" is caused by lag
const FLOOD_MESSAGE_TIME = 6*1000;
const MIN_CAPS_LENGTH = 18;
const MIN_CAPS_PROPORTION = 0.8;

exports.id = 'moderation';
exports.desc = 'Automated moderation for chat rooms';

var chatData = exports.chatData = {};
var chatLog = exports.chatLog = {};
var zeroTol = exports.zeroTol = {};

function isBotRanked (room, rank) {
	if (!Bot.rooms[room]) return false;
	var ident = Bot.rooms[room].users[toId(Bot.status.nickName)];
	if (ident) return equalOrHigherRank(ident, rank);
	return false;
}

function isBanned (room, user) {
	user = toId(user);
	if (Settings.settings['autoban'] && Settings.settings['autoban'][room] && Settings.settings['autoban'][room][user]) return true;
	if (Settings.settings['regexautoban'] && Settings.settings['regexautoban'][room]) {
		for (var i = 0; i < Settings.settings['regexautoban'][room].length; i++) {
			try {
				var regexObj = new RegExp(arg, 'i');
				if (regexObj.test(user)) return '#range';
			} catch (e) {}
		}
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
	if (equalOrHigherRank(by, Config.moderation.modException)) return;
	var ban = isBanned(room, by);
	if (ban) Bot.say(room, '/roomban ' + by + ', Blacklisted user' + ((ban === '#range') ? ' (range)' : ''));
	
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
	
	if (!chatData[room][user]) chatData[room][user] = {times:[], lastMsgs: ['', ''], points:0, lastAction:0};
	
	chatData[room][user].lastMsgs.push(msg);
	chatData[room][user].lastMsgs.shift();
	
	chatData[room][user].times.push(time)
	
	/* Moderation */
	
	if (!Config.moderation.allowmute) return;
	if (!isBotRanked(room, '%')) return; // Bot is not a driver or above
	
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
	
	var capsMatch = msg.replace(/[^A-Za-z]/g, '').match(/[A-Z]/g);
	capsMatch = capsMatch && toId(msg).length > MIN_CAPS_LENGTH && (capsMatch.length >= Math.floor(toId(msg).length * MIN_CAPS_PROPORTION));
	var stretchMatch = msg.toLowerCase().match(/(.)\1{7,}/g);
	var inlineSpam = stretchMatch ? false : msg.toLowerCase().match(/(..+)\1{4,}/g);
	
	var isFlooding = (times.length >= FLOOD_MESSAGE_NUM && (time - times[times.length - FLOOD_MESSAGE_NUM]) < FLOOD_MESSAGE_TIME
		&& (time - times[times.length - FLOOD_MESSAGE_NUM]) > (FLOOD_PER_MSG_MIN * FLOOD_MESSAGE_NUM));
	
	/*****************
	* Spam Mod
	******************/
	
	if (modSettings['spam'] !== 0) {
		if (times.length >= FLOOD_MESSAGE_NUM && (time - times[times.length - FLOOD_MESSAGE_NUM]) < FLOOD_MESSAGE_TIME) {
			var isSpamming = false;
			for (var i = chatLog[room].users.length - 2; i > chatLog[room].users.length - 4; i--) {
				if (chatLog[room].users[i] !== chatLog[room].users[chatLog[room].users.length - 1]) {
					isSpamming = true;
					break;
				}
			}
			if (isSpamming) {
				if (msg.length < 10) {
					muteMessage = ', Automated moderation: Flooding / Spamming.';
					pointVal = 3;
				} else if (msg.toLowerCase().indexOf("http://") > -1 || msg.toLowerCase().indexOf("https://") > -1 || msg.toLowerCase().indexOf("www.") > -1) {
					muteMessage = ', Automated moderation: Spamming links.';
					pointVal = 4;
				} else {
					if (msg.length > 70 || capsMatch || msg.toLowerCase().indexOf("**") > -1 || stretchMatch || inlineSpam) {
						muteMessage = ', Automated moderation: Spamming.';
						pointVal = 4;
					} else {
						if (modSettings['flooding'] !== 0) {
							pointVal = 2;
							muteMessage = ', Automated moderation: Flooding.';
						}
					}
				}
			}
		}
	}
	
	if (modSettings['spam'] !== 0 && pointVal < 3) {
		if (times.length >= 3 && (time - times[times.length - 3]) < FLOOD_MESSAGE_TIME && msg === chatData[room][user].lastMsgs[0] && chatData[room][user].lastMsgs[0] === chatData[room][user].lastMsgs[1]) {
			pointVal = 3;
			muteMessage = ', Automated moderation: Possible spammer detected.';
			if (msg.toLowerCase().indexOf("http://") > -1 || msg.toLowerCase().indexOf("https://") > -1 || msg.toLowerCase().indexOf("www.") > -1) {
				muteMessage = ', Automated moderation: Spamming links.';
				pointVal = 4;
			} else if (msg.length > 70 || capsMatch || msg.toLowerCase().indexOf("**") > -1 || stretchMatch || inlineSpam) {
				muteMessage = ', Automated moderation: Spamming.';
				pointVal = 4;
			} 
		}
	}
	
	/********************************************
	* Bacic Mods (caps, stretching, flooding)
	*********************************************/
	
	if (modSettings['caps'] !== 0 && capsMatch) {
		infractions.push("Caps");
		totalPointVal += 1;
		if (pointVal < 1) {
			pointVal = 1;
			muteMessage = ', Automated moderation: Excessive capitalization.';
		}
	}
	
	if (inlineSpam) {
		infractions.push("Repeating");
		totalPointVal += 1;
	}
	
	if (modSettings['stretching'] !== 0 && stretchMatch) {
		infractions.push("Stretching");
		totalPointVal += 1;
		if (pointVal < 1) {
			pointVal = 1;
			muteMessage = ', Automated moderation: Stretching.';
		}
	}
	
	if (modSettings['flooding'] !== 0 && isFlooding) {
		infractions.push("Flooding");
		totalPointVal += 2;
		if (pointVal < 2) {
			pointVal = 2;
			muteMessage = ', Automated moderation: Flooding.';
		}
	}
	
	/*****************************
	* Specific Mods
	******************************/
	
	if (modSettings['spoiler'] !== 0 && (msg.toLowerCase().indexOf("spoiler:") > -1 || msg.toLowerCase().indexOf("spoilers:") > -1)) {
		infractions.push("Spoiler");
		totalPointVal += 2;
		if (pointVal < 2) {
			pointVal = 2;
			muteMessage = ', Automated moderation: Spoilers are not allowed in this room.';
		}
	}
	
	if (modSettings['youtube'] !== 0 && (msg.toLowerCase().indexOf("youtube.com/channel/") > -1 || msg.toLowerCase().indexOf("youtube.com/user/") > -1)) {
		infractions.push("Youtube channel");
		totalPointVal += 2;
		if (pointVal < 2) {
			pointVal = 2;
			muteMessage = ', Automated moderation: Youtube channels are not allowed in this room.';
		}
	}
	
	if (modSettings['psservers'] !== 0 && msg.toLowerCase().indexOf(".psim.us") > -1) {
		var serverAds = getServersAds(msg);
		for (var z = 0; z < serverAds.length; z++) {
			if (!(serverAds[z] in Config.moderation.psServersExcepts)) {
				infractions.push("Private Servers");
				totalPointVal += 2;
				if (pointVal < 2) {
					pointVal = 2;
					muteMessage = ', Automated moderation: Pokemon Showdown private servers are not allowed in this room.';
				}
				break;
			}
		}
	}
	
	/****************************
	* Banned Words
	*****************************/
	
	if (modSettings['inapropiate'] !== 0) {
		var inapropiatephraseSettings = Settings.settings['inapropiatephrases'];
		var inapropiatePhrases = !!inapropiatephraseSettings ? (Object.keys(inapropiatephraseSettings[room] || {})).concat(Object.keys(inapropiatephraseSettings['global'] || {})) : [];
		var msgrip = " " + msg.toLowerCase().replace(/[^a-z0-9]/g, ' ') + " ";
		for (var i = 0; i < inapropiatePhrases.length; i++) {
			if (msgrip.indexOf(" " + inapropiatePhrases[i] + " ") > -1) {
					infractions.push("Inapropiate");
					totalPointVal += 2;
					if (pointVal < 2) {
						pointVal = 2;
						muteMessage = ', Automated moderation: Your message contained an inapropiate phrase';
					}
					break;
			}
		}
	}
	
	if (modSettings['bannedwords'] !== 0) {
		var banphraseSettings = Settings.settings['bannedphrases'];
		var bannedPhrases = !!banphraseSettings ? (Object.keys(banphraseSettings[room] || {})).concat(Object.keys(banphraseSettings['global'] || {})) : [];
		var msglow = msg.toLowerCase();
		for (var i = 0; i < bannedPhrases.length; i++) {
			if (msglow.indexOf(bannedPhrases[i]) > -1) {
				infractions.push("Bannedwords");
				totalPointVal += 2;
				if (pointVal < 2) {
					pointVal = 2;
					muteMessage = ', Automated moderation: Your message contained a banned phrase';
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
			muteMessage = ', Multiple infraction: ' + infractions.join(", ");
		}
	}
	
	/* Zero Tolerance */
	
	if (pointVal > 0 && zeroTol[user] && zeroTol[user] > 4) {
		muteMessage += ' (zero tolerance)';
		pointVal = Config.moderation.punishments.length;
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
		}
		
		var cmd = Config.moderation.punishments[pointVal - 1];
		
		if (cmd  ==='roomban' && !isBotRanked(room, '@')) cmd = 'hourmute'; // Bot is not a moderator
		if ((room in Config.privateRooms) && cmd === 'warn') cmd = 'mute'; // can't warn in private rooms
		
		Bot.say(room, '/' + cmd + ' ' + user + muteMessage);
	}
	
	
}

function parseJoin (room, by) {
	var jp = getJoinPhrase(room, by);
	if (jp) Bot.say(room, jp);
	if (equalOrHigherRank(by, Config.moderation.modException)) return;
	var ban = isBanned(room, by);
	if (ban) Bot.say(room, '/roomban ' + by + ', Blacklisted user' + ((ban === '#range') ? ' (range)' : ''));
}

function parseLeave (room, by) {
	return; // parseLeave is useless now, but can be useful later
}

function parseRename (room, by, old) {
	if (equalOrHigherRank(by, Config.moderation.modException)) return;
	var ban = isBanned(room, by);
	if (ban) Bot.say(room, '/roomban ' + by + ', Blacklisted user' + ((ban === '#range') ? ' (range)' : ''));
}

exports.init = function () {
	for (var i in chatData) 
		delete chatData[i];
	for (var i in chatLog) 
		delete chatLog[i];
};

exports.parse = function (room, message, isIntro, spl) {
	if (isIntro) return;
	if (!Bot.rooms[room] || Bot.rooms[room].type !== "chat") return;
	switch (spl[0]) {
		case 'c':
			var by = spl[1];
			var timeOff = Date.now();
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|").length));
			break;
		
		case 'c:':
			var by = spl[2];
			var timeOff = parseInt(spl[1]) * 1000;
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|" + spl[2] + "|").length));
			break;
		
		case 'J': case 'j':
			parseJoin(room, spl[1]);
			break;
		
		case 'l': case 'L':
			parseLeave(room, spl[1]);
			break;
		
		case 'N':
			parseRename(room, spl[1], spl[3]);
			break;
	}
};



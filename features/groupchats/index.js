/*
	Groupchats Tools
*/

var groupChatTryJoinInterval = Config.groupChatTryJoinInterval || 60000;

exports.id = 'groupchats';
exports.desc = 'Tools for groupchats (temporal rooms)';

exports.ignored = {};

function isConfigured (room) {
	if (!Config.groupchats || !Config.groupchats[room]) return false;
	return true;
}

function parseInit (room) {
	if (!Config.groupchats[room].onJoin || !Config.groupchats[room].onJoin.length) return;
	Bot.sendRoom(room, Config.groupchats[room].onJoin.slice(0), 2000);
}

function parseDeinit (room) {
	if (!Config.groupchats[room].onLeave || !Config.groupchats[room].onLeave.length) return;
	setTimeout(function () {
		Bot.sendRoom('', Config.groupchats[room].onLeave.slice(0), 2000);
	}, 1000);
}

function parseJoin (room, by) {
	if (!Config.groupchats[room].roomAuth) return;
	var user = toId(by);
	if (user === toId(Bot.status.nickName)) return;
	for (var group in Config.groupchats[room].roomAuth) {
		if (!Config.groupchats[room].roomAuth[group] || !Config.groupchats[room].roomAuth[group].length) continue;
		for (var i = 0; i < Config.groupchats[room].roomAuth[group].length; i++) {
			if (typeof Config.groupchats[room].roomAuth[group][i] === "string") {
				if (user === Config.groupchats[room].roomAuth[group][i]) {
					if (!Tools.equalOrHigherRank(by.charAt(0), group)) Bot.say(room, "/roompromote " + user + "," + group);
					return;
				}
			} else if (typeof Config.groupchats[room].roomAuth[group][i] === "object" && (Config.groupchats[room].roomAuth[group][i] instanceof RegExp)) {
				if (Config.groupchats[room].roomAuth[group][i].test(user)) {
					if (!Tools.equalOrHigherRank(by.charAt(0), group)) Bot.say(room, "/roompromote " + user + "," + group);
					return;
				}
			}
		}
	}
}

var intervalJoin = exports.intervalJoin = function () {
	if (!Config.groupchats) return;
	if (!Bot.status.connected) return;
	var cmds = [];
	for (var id in Config.groupchats) {
		if (!Config.groupchats[id].toJoin) continue;
		if (exports.ignored[id]) return;
		if (!Bot.rooms[id]) cmds = cmds.concat(Config.groupchats[id].toJoin);
	}
	if (cmds.length) Bot.sendRoom('', cmds, 2000);
};

exports.timer = null;

exports.init = function () {
	if (exports.timer) {
		clearInterval(exports.timer);
		exports.timer = null;
	}
	exports.timer = setInterval(intervalJoin, groupChatTryJoinInterval);
};

exports.parse = function (room, message, isIntro, spl) {
	if (!isConfigured(room)) return;
	if (exports.ignored[room]) return;
	if (spl[0] === 'init') parseInit(room);
	if (spl[0] === 'deinit') parseDeinit(room);
	if (isIntro) return;
	switch (spl[0]) {
		case 'J': case 'j':
			parseJoin(room, spl[1]);
			break;
	}
};

exports.destroy = function () {
	if (exports.timer) {
		clearInterval(exports.timer);
		exports.timer = null;
	}
	if (Features[exports.id]) delete Features[exports.id];
};

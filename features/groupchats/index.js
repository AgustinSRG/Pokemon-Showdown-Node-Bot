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

function runAutopromote (room, by) {
	if (!Settings.settings.autopromote) return;
	if (!Settings.settings.autopromote[room]) return;
	var autoPromotion = Settings.settings.autopromote[room];
	if (!autoPromotion.enabled) return;
	var userid = toId(by);
	if (autoPromotion.users && autoPromotion.users[userid] && !Tools.equalOrHigherRank(by.charAt(0), autoPromotion.users[userid])) return Bot.say(room, '/roompromote ' + userid + "," + autoPromotion.users[userid]);
	if (autoPromotion.all && !Tools.equalOrHigherRank(by.charAt(0), autoPromotion.all)) return Bot.say(room, '/roompromote ' + userid + "," + autoPromotion.all);
}

function runWelcomeMessage (room, by) {
	if (!Settings.settings.pmwmsg) return;
	if (!Settings.settings.pmwmsg[room]) return;
	if (!Settings.settings.pmwmsg[room].enabled || !Settings.settings.pmwmsg[room].msg) return;
	Bot.say(room, "/pm " + by + "," + Tools.stripCommands(Settings.settings.pmwmsg[room].msg));
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
	if (exports.ignored[room]) return;
	if (!isIntro && spl[0] === 'J' || spl[0] === 'j') {
		runAutopromote(room, spl[1]);
		runWelcomeMessage(room, spl[1]);
		return;
	}
	if (!isConfigured(room)) return;
	if (spl[0] === 'init') return parseInit(room);
	if (spl[0] === 'deinit') return parseDeinit(room);
};

exports.destroy = function () {
	if (exports.timer) {
		clearInterval(exports.timer);
		exports.timer = null;
	}
	if (Features[exports.id]) delete Features[exports.id];
};

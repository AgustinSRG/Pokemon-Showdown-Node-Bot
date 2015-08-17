/*
	Chatlogger feature
*/

exports.id = 'chatlogger';
exports.desc = 'Save logs of Pokemon Showdown chat rooms';

var logManager = require('./log.js');

var LogServer = require('./log-server.js');
if (Config.logServer) {
	exports.logServer = new LogServer(Config.logServer);
	exports.logServer.listen();
}

exports.init = function () {
	return;
};

exports.parse = function (room, message, isIntro, spl) {
	if (!Config.chatLogger || !Config.chatLogger.rooms) return;
	if (isIntro && !Config.chatLogger.logIntroMessages) return;
	if (message.charAt(0) === '>') return;
	if (spl[0] === 'pm') room = 'pm';
	if (Config.chatLogger.rooms.indexOf(room) < 0) return;
	if (Config.chatLogger.ignore && spl[0] in Config.chatLogger.ignore) {
		if (Config.chatLogger.ignore[spl[0]] === true) return;
		if (typeof Config.chatLogger.ignore[spl[0]] === 'object' && Config.chatLogger.ignore[spl[0]].indexOf(spl[1]) >= 0) return;
	}
	logManager.log(room, message, isIntro);
};

exports.destroy = function () {
	try {
		if (exports.logServer) exports.logServer.destroy();
	} catch (e) {}
	logManager.destroy();
	if (Features[exports.id]) delete Features[exports.id];
};

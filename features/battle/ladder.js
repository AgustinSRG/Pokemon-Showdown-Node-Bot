
exports.reportsRoom = false;

exports.reportBattle = function (room) {
	if (exports.reportsRoom) Bot.say(exports.reportsRoom, Config.clientUrl + room);
	exports.reportsRoom = false;
};


exports.reportsRoom = false;

exports.reportBattle = function (room) {
	if (!exports.reportsRoom) return;
	var lang = Config.language || 'english';
	if (Settings.settings['language'] && Settings.settings['language'][exports.reportsRoom]) lang = Settings.settings['language'][exports.reportsRoom];
	Bot.say(exports.reportsRoom, Tools.translateGlobal('battle', 'battlefound', lang) + ": <<" + room + ">>");
	exports.reportsRoom = false;
};

exports.laddering = false;
exports.ladderTimer = null;

exports.start = function (format) {
	if (!format) return false;
	if (exports.laddering) return false;
	format = toId(format);
	var check = function () {
		if (Settings.lockdown) return;
		var counter = 0;
		var maxBattles = 1;
		if (Config.ladderNumberOfBattles && Config.ladderNumberOfBattles > 0) maxBattles = Config.ladderNumberOfBattles;
		for (var i in Features['battle'].BattleBot.battles) {
			if (Features['battle'].BattleBot.battles[i].tier && toId(Features['battle'].BattleBot.battles[i].tier) === format && Features['battle'].BattleBot.battles[i].rated) counter++;
		}
		if (counter >= maxBattles) return;
		var cmds = [];
		var team = Features['battle'].TeamBuilder.getTeam(format);
		if (team) cmds.push('|/useteam ' + team);
		cmds.push('|/search ' + format);
		Bot.send(cmds);
	};
	exports.laddering = true;
	exports.ladderTimer = setInterval(check, Config.ladderCheckInterval || (10 * 1000));
	check();
	return true;
};

exports.stop = function () {
	if (!exports.laddering) return false;
	exports.laddering = false;
	if (exports.ladderTimer) clearTimeout(exports.ladderTimer);
	exports.ladderTimer = null;
	return true;
};

exports.destroy = function () {
	exports.laddering = false;
	if (exports.ladderTimer) clearTimeout(exports.ladderTimer);
	exports.ladderTimer = null;
};

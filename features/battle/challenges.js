
exports.challenges = {};

function canChallenge(i, nBattles) {
	if (!nBattles) return true;
	if (Config.aceptAll) return true;
	if (Tools.equalOrHigherRank(i, '%')) return true;
	return false;
}

exports.parse = function (room, message, isIntro, spl) {
	if (spl[0] !== 'updatechallenges') return;
	var nBattles = Object.keys(Features['battle'].BattleBot.data).length;
	try {
		exports.challenges = JSON.parse(message.substr(18));
	} catch (e) {return;}
	if (exports.challenges.challengesFrom) {
		for (var i in exports.challenges.challengesFrom) {
			if (canChallenge(i, nBattles)) {
				var format = exports.challenges.challengesFrom[i];

				if (!(format in Formats) || !Formats[format].chall) {
					Bot.say('', '/reject ' + i);
					continue;
				}
				if (Formats[format].team && !Features['battle'].TeamBuilder.hasTeam(format)) {
					Bot.say('', '/reject ' + i);
					continue;
				}

				var team = Features['battle'].TeamBuilder.getTeam(format);
				if (team) {
					Bot.say('', '/useteam ' + team);
				}
				Bot.say('', '/accept ' + i);
				nBattles++;
				debug("acepted battle: " + i + " | " + exports.challenges.challengesFrom[i]);
			} else {
				Bot.say('', '/reject ' + i);
				debug("rejected battle: " + i + " | " + exports.challenges.challengesFrom[i]);
				continue;
			}
		}
	}
};


exports.challenges = {};

function canChallenge(i, nBattles) {
	if (!nBattles) return true; //If it is not busy, accept the challenge
	if (Config.aceptAll) return true; //Acept all challenges if 'aceptAll' is enabled
	if (Config.maxBattles && Config.maxBattles > nBattles) return true; //If it is not in too many battles, accept the challenge
	if (Tools.equalOrHigherRank(i, Tools.getGroup('driver'))) return true; //Staff exception
	return false;
}

exports.parse = function (room, message, isIntro, spl) {
	if (spl[0] !== 'updatechallenges') return;
	var nBattles = Object.keys(Features['battle'].BattleBot.battles).length;
	try {
		exports.challenges = JSON.parse(message.substr(18));
	} catch (e) {return;}
	if (exports.challenges.challengesFrom) {
		for (var i in exports.challenges.challengesFrom) {
			if (canChallenge(i, nBattles)) {
				var format = exports.challenges.challengesFrom[i];

				if (Settings.lockdown || !(format in Formats) || !Formats[format].chall) {
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

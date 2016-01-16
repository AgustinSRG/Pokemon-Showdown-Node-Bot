/*
	Battle Feature
*/

exports.id = 'battle';
exports.desc = 'Automated battle bot';

var BattleBot = exports.BattleBot = require('./battle-ai/index.js');

var TeamBuilder = exports.TeamBuilder = require('./teambuilder.js');

var ChallManager = exports.ChallManager = require('./challenges.js');

var TourManager = exports.TourManager = require('./tournaments.js');

var LadderManager = exports.LadderManager = require('./ladder.js');

exports.init = function () {
	BattleBot.init();
	TourManager.clearData();
	TeamBuilder.loadTeamList();
};

exports.parse = function (room, message, isIntro, spl) {
	switch (spl[0]) {
		case 'updatechallenges':
			ChallManager.parse(room, message, isIntro, spl);
			break;
		case 'tournament':
			TourManager.parse(room, message, isIntro, spl);
			break;
		case 'rated':
			LadderManager.reportBattle(room);
			break;
	}

	if (!Bot.rooms[room]) {
		if (spl[0] !== 'init' || spl[1] !== 'battle') return;
	} else if (Bot.rooms[room].type !== "battle") return;

	try {
		BattleBot.receive(room, message, isIntro);
	} catch (e) {
		errlog(e.stack);
		error("BattleBot crash");
	}
};

exports.getInitCmds = function () {
	return BattleBot.tryJoinAbandonedBattles();
};

exports.readyToDie = function () {
	var battles = Object.keys(BattleBot.battles);
	if (battles.length) return ("There are " + battles.length + " battles in progress");
};

exports.destroy = function () {
	LadderManager.destroy();
	BattleBot.destroy();
	if (Features[exports.id]) delete Features[exports.id];
};

/*
	Battle Feature
*/

exports.id = 'battle';
exports.desc = 'Automated battle bot';

var BattleBot = exports.BattleBot = require('./battle-bot.js');

var TeamBuilder = exports.TeamBuilder = require('./teambuilder.js');

var ChallManager = exports.ChallManager = require('./challenges.js');

var TourManager = exports.TourManager = require('./tournaments.js');

var LadderManager = exports.LadderManager = require('./ladder.js');

exports.init = function () {
	BattleBot.init();
	BattleBot.clearData();
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
		if (spl[0] !== 'init' || spl[2] !== 'battle') return;
	} else if (Bot.rooms[room].type !== "battle") return;

	try {
		BattleBot.receive(room, message);
	} catch (e) {
		errlog(e.stack);
		error("BattleBot crash");
	}
};

exports.destroy = function () {
	if (Features[exports.id]) delete Features[exports.id];
};

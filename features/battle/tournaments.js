

var tourData = exports.tourData = {};

exports.clearData = function () {
	for (var i in tourData)
		delete tourData[i];
};

exports.parse = function (room, message, isIntro, spl) {
	if (spl[0] !== 'tournament') return;
	if (!tourData[room]) tourData[room] = {};
	switch (spl[1]) {
		case 'update':
			try {
				var data = JSON.parse(spl[2]);
				for (var i in data)
					tourData[room][i] = data[i];
			} catch (e){}
			break;
		case 'updateEnd':
			if (Settings.settings['jointours'] && Settings.settings['jointours'][room] && tourData[room].format && !tourData[room].isJoined && !tourData[room].isStarted) {
				var format = toId(tourData[room].format);
				if (Formats[format] && !Formats[format].team) {
					Bot.say(room, '/tour join');
				} else {
					if (Features['battle'].TeamBuilder.hasTeam(tourData[room].format)) Bot.say(room, '/tour join');
				}
			}

			if (tourData[room].challenges && tourData[room].challenges.length) {
				var team = Features['battle'].TeamBuilder.getTeam(tourData[room].format);
				if (team) Bot.say(room, '/useteam ' + team);
				for (var i = 0; i < tourData[room].challenges.length; i++) Bot.say(room, '/tour challenge ' + tourData[room].challenges[i]);
			} else if (tourData[room].challenged) {
				var team = Features['battle'].TeamBuilder.getTeam(tourData[room].format);
				if (team) Bot.say(room, '/useteam ' + team);
				Bot.say(room, '/tour acceptchallenge');
			}
			break;
		case 'end':
		case 'forceend':
			delete tourData[room];
			break;
	}
};

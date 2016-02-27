/*
* Tournaments points system
*/

const toursDataFile = AppOptions.data + 'leaderboards.json';

var toursFFM = exports.toursFFM = new Settings.FlatFileManager(toursDataFile);

var ladder = exports.ladder = {};

try {
	ladder = exports.ladder = toursFFM.readObj();
} catch (e) {
	errlog(e.stack);
	error("Could not import tours data: " + sys.inspect(e));
}

var save = exports.save = function () {
	toursFFM.writeObj(ladder);
};

var isConfigured = exports.isConfigured = function (room) {
	if ((!Config.leaderboards || !Config.leaderboards[room]) && (!Settings.settings.leaderboards || !Settings.settings.leaderboards[room])) return false;
	return true;
};

var filterTier = exports.filterTier = function (tier, filter) {
	tier = toId(tier || "");
	if (typeof filter === "string") {
		return (tier === toId(filter));
	} else if (filter !== null && typeof filter === "object") {
		if (filter instanceof Array) {
			if (filter.indexOf(tier) >= 0) return true;
			return false;
		} else if (filter instanceof RegExp) {
			return filter.test(tier);
		} else {
			if (tier in filter) return true;
			return false;
		}
	} else {
		return true;
	}
};

var getConfig = exports.getConfig = function (room) {
	var res = {
		tierFilter: null,
		onlyOfficial: false,
		winnerPoints: 5,
		finalistPoints: 3,
		semiFinalistPoints: 1,
		battlePoints: 0
	};
	if (Config.leaderboards && Config.leaderboards[room]) {
		res.winnerPoints = parseInt(Config.leaderboards[room].winnerPoints) || 0;
		res.finalistPoints = parseInt(Config.leaderboards[room].finalistPoints) || 0;
		res.semiFinalistPoints = parseInt(Config.leaderboards[room].semiFinalistPoints) || 0;
		res.battlePoints = parseInt(Config.leaderboards[room].battlePoints) || 0;
		res.tierFilter = Config.leaderboards[room].tierFilter;
		res.onlyOfficial = Config.leaderboards[room].onlyOfficial || false;
	} else if (Settings.settings.leaderboards && Settings.settings.leaderboards[room]) {
		res.winnerPoints = parseInt(Settings.settings.leaderboards[room].winnerPoints) || 0;
		res.finalistPoints = parseInt(Settings.settings.leaderboards[room].finalistPoints) || 0;
		res.semiFinalistPoints = parseInt(Settings.settings.leaderboards[room].semiFinalistPoints) || 0;
		res.battlePoints = parseInt(Settings.settings.leaderboards[room].battlePoints) || 0;
		res.onlyOfficial = Settings.settings.leaderboards[room].onlyOfficial || false;
	}
	return res;
};

var parseTourTree = exports.parseTourTree = function (tree) {
	var auxobj = {};
	var team = tree.team;
	var state = tree.state;
	var children = tree.children;
	if (!children) children = [];
	if (!auxobj[team]) auxobj[team] = 0;
	if (state && state === "finished") {
		auxobj[team] += 1;
	}
	var aux;
	for (var i = 0; i < children.length; i++) {
		aux = parseTourTree(children[i]);
		for (var j in aux) {
			if (!auxobj[j]) auxobj[j] = 0;
			auxobj[j] += aux[j];
		}
	}
	return auxobj;
};

var parseTournamentResults = exports.parseTournamentResults = function (data) {
	var generator = toId(data.generator || "");
	if (generator === "singleelimination") {
		var res = {};
		var parsedTree = parseTourTree(data.bracketData.rootNode);
		res.players = Object.keys(parsedTree);
		res.general = {};
		for (var i in parsedTree) res.general[toId(i)] = parsedTree[i];
		//winners
		res.winner = toId(data.results[0][0]);
		res.finalist = "";
		res.semiFinalists = [];
		var aux, aux2;
		if (data.bracketData.rootNode.children) {
			for (var f = 0; f < data.bracketData.rootNode.children.length; f++) {
				aux = toId(data.bracketData.rootNode.children[f].team || "");
				if (aux && aux !== res.winner) {
					res.finalist = aux;
				}
				if (data.bracketData.rootNode.children[f].children) {
					for (var j = 0; j < data.bracketData.rootNode.children[f].children.length; j++) {
						aux2 = toId(data.bracketData.rootNode.children[f].children[j].team || "");
						if (aux2 && aux2 !== res.winner && aux2 !== res.finalist && res.semiFinalists.indexOf(aux2) < 0) {
							res.semiFinalists.push(aux2);
						}
					}
				}
			}
		}
		return res;
	} else {
		debug("Incompatible generator: " + data.generator);
		return null; //Not compatible generator
	}
};

var getPoints = exports.getPoints = function (room, user) {
	var userid = toId(user);
	var roomConfig = getConfig(room);
	var pWin = roomConfig.winnerPoints;
	var pFinal = roomConfig.finalistPoints;
	var pSemiFinal = roomConfig.semiFinalistPoints;
	var pBattle = roomConfig.battlePoints;
	var res = {
		name: user,
		room: room,
		wins: 0,
		finals: 0,
		semis: 0,
		battles: 0,
		tours: 0,
		points: 0
	};
	if (!ladder[room] || !ladder[room][userid]) return res;
	res.name = ladder[room][userid][0];
	res.wins = ladder[room][userid][1];
	res.finals = ladder[room][userid][2];
	res.semis = ladder[room][userid][3];
	res.battles = ladder[room][userid][4];
	res.tours = ladder[room][userid][5];
	res.points = (pWin * res.wins) + (res.finals * pFinal) + (res.semis * pSemiFinal) + (res.battles * pBattle);
	return res;
};

var getTop = exports.getTop = function (room) {
	if (!isConfigured(room)) return null;
	var roomConfig = getConfig(room);
	var pWin = roomConfig.winnerPoints;
	var pFinal = roomConfig.finalistPoints;
	var pSemiFinal = roomConfig.semiFinalistPoints;
	var pBattle = roomConfig.battlePoints;
	if (!ladder[room]) return [];
	var top = [];
	var points = 0;
	for (var u in ladder[room]) {
		points = (pWin * ladder[room][u][1]) + (pFinal * ladder[room][u][2]) + (pSemiFinal * ladder[room][u][3]) + (pBattle * ladder[room][u][4]);
		top.push(ladder[room][u].concat([points]));
	}
	return top.sort(function (a, b) {
		if (a[6] !== b[6]) return b[6] - a[6]; //Points
		if (a[1] !== b[1]) return b[1] - a[1]; //Wins
		if (a[2] !== b[2]) return b[2] - a[2]; //Finals
		if (a[3] !== b[3]) return b[3] - a[3]; //Semis
		if (a[4] !== b[4]) return b[4] - a[4]; //Battles
		if (a[5] !== b[5]) return b[5] - a[5]; //Tours played
		return 0;
	});
};

var getTable = exports.getTable = function (room, n) {
	if (!isConfigured(room)) return null;
	var top = getTop(room);
	if (!top) return null;
	var table = "Room: " + room + "\n\n";
	table += " N\u00BA | Name | Ranking | W | F | SF | Tours Played | Battles won\n";
	table += "----|------|---------|---|---|----|-------------|-------------\n";
	for (var i = 0; i < n && i < top.length; i++) {
		table += (i + 1) + " | " + top[i][0] + " | " + top[i][6] + " | " + top[i][1] + " | " + top[i][2] + " | " + top[i][3] + " | " + top[i][5] + " | " + top[i][4];
		table += "\n";
	}
	return table;
};

var addUser = exports.addUser = function (room, user, type, auxData) {
	if (!ladder[room]) ladder[room] = {};
	var userid = toId(user);
	if (!ladder[room][userid]) ladder[room][userid] = [user, 0, 0, 0, 0, 0];
	switch (type) {
		case 'A':
			ladder[room][userid][0] = user; //update user name
			ladder[room][userid][5]++;
			break;
		case 'W':
			ladder[room][userid][1]++;
			break;
		case 'F':
			ladder[room][userid][2]++;
			break;
		case 'S':
			ladder[room][userid][3]++;
			break;
		case 'B':
			var val = parseInt(auxData);
			if (!val) return;
			ladder[room][userid][4] += val;
			break;
	}
};

var writeResults = exports.writeResults = function (room, results) {
	if (!results) return;
	for (var i = 0; i < results.players.length; i++) addUser(room, results.players[i], 'A');
	if (results.winner) addUser(room, results.winner, 'W');
	if (results.finalist) addUser(room, results.finalist, 'F');
	for (var i = 0; i < results.semiFinalists.length; i++) addUser(room, results.semiFinalists[i], 'S');
	for (var user in results.general) addUser(room, user, 'B', results.general[user]);
};

exports.onTournamentEnd = function (room, data) {
	if (!isConfigured(room)) return;
	if (!data.isOfficialTour) {
		//debug(JSON.stringify(getConfig(room)));
		if (getConfig(room).onlyOfficial) {
			debug("Discarded tour because it is not official. Tier: " + data.format + " | Room: " + room);
			return;
		}
		var filter = getConfig(room).tierFilter;
		if (!filterTier(data.format, filter)) {
			debug("Discarded tour because of tier filter. Tier: " + data.format + " | Room: " + room);
			return;
		}
	}
	var results = parseTournamentResults(data);
	//console.log(JSON.stringify(results));
	if (!results) return;
	debug("Updating leaderboard...");
	writeResults(room, results);
	save();
	debug("Leaderboard updated. " + Tools.getDateString());
};

var resetCodes = exports.resetCodes = {};

exports.getResetHashCode = function (room) {
	if (!ladder[room]) return null;
	for (var i in resetCodes) {
		if (resetCodes[i] === room) delete resetCodes[i];
	}
	var code = Tools.generateRandomNick(10);
	resetCodes[code] = room;
	return code;
};

exports.execResetHashCode = function (code) {
	if (resetCodes[code]) {
		var room = resetCodes[code];
		if (ladder[room]) {
			delete ladder[room];
			save();
		}
		delete resetCodes[code];
		return room;
	}
	return false;
};

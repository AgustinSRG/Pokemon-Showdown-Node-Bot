
/* Globals */

global.toId = function (text) {
	return text.toLowerCase().replace(/[^a-z0-9]/g, '');
};

global.toRoomid = function (roomid) {
	return roomid.replace(/[^a-zA-Z0-9-]+/g, '').toLowerCase();
};

global.ok = function (str) {
	if (Config.debug && Config.debug.ok === false) return;
	console.log('ok'.green + '\t' + str);
};

global.info = function (str) {
	if (Config.debug && Config.debug.info === false) return;
	console.log('info'.cyan + '\t' + str);
};

global.error = function (str) {
	if (Config.debug && Config.debug.error === false) return;
	console.log('error'.red + '\t' + str);
};

global.errlog = function (str) {
	if (Config.debug && Config.debug.errlog === false) return;
	console.log(str);
};

global.debug = function (str) {
	if (Config.debug && Config.debug.debug === false) return;
	console.log('debug'.blue + '\t' + str);
};

global.cmdr = function (str) {
	if (Config.debug && Config.debug.cmdr === false) return;
	console.log('cmdr'.magenta + '\t' + str);
};

global.recv = function (str) {
	if (Config.debug && Config.debug.recv === false) return;
	console.log('recv'.grey + '\t' + str);
};

global.sent = function (str) {
	if (Config.debug && Config.debug.sent === false) return;
	console.log('sent'.grey + '\t' + str);
};

global.monitor = function (str) {
	if (Config.debug && Config.debug.monitor === false) return;
	console.log('monitor'.bgBlue + '\t' + str);
};

/* Tools */

exports.stripCommands = function (text) {
	return ((text.trim().charAt(0) === '/') ? '/' : ((text.trim().charAt(0) === '!') ? ' ' : '')) + text.trim();
};

exports.addLeftZero = function (num, nz) {
	var str = num.toString();
	while (str.length < nz) str = "0" + str;
	return str;
};

exports.generateRandomNick = function (numChars) {
	var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	var str = '';
	for (var i = 0, l = chars.length; i < numChars; i++) {
		str += chars.charAt(~~(Math.random() * l));
	}
	return str;
};

exports.equalOrHigherRank = function (userIdentity, rank) {
	if (rank === ' ') return true;
	if (!Config.ranks) Config.ranks = [];
	var userId = toId(userIdentity);
	var userRank = '';
	if (userId in Config.exceptions) {
		userRank = Config.exceptions[userId];
	} else {
		userRank = userIdentity.charAt(0);
	}
	if (userRank === true) return true;
	if (rank === true) return false;
	if (Config.ranks.indexOf(userRank) === -1) return false;
	if (Config.ranks.indexOf(userRank) >= Config.ranks.indexOf(rank)) return true;
	return false;
};

exports.getTimeAgo = function (time, lang) {
	time = Date.now() - time;
	time = Math.round(time / 1000); // rounds to nearest second
	var seconds = time % 60;
	var times = [];
	var trans = function (data) {
		if (!lang) lang = Config.language || 'english';
		return Tools.translateGlobal('time', data, lang);
	};
	if (seconds) times.push(String(seconds) + ' ' + (seconds === 1 ? trans('second') : trans('seconds')));
	var minutes, hours, days;
	if (time >= 60) {
		time = (time - seconds) / 60; // converts to minutes
		minutes = time % 60;
		if (minutes) times = [String(minutes) + ' ' + (minutes === 1 ? trans('minute') : trans('minutes'))].concat(times);
		if (time >= 60) {
			time = (time - minutes) / 60; // converts to hours
			hours = time % 24;
			if (hours) times = [String(hours) + ' ' + (hours === 1 ? trans('hour') : trans('hours'))].concat(times);
			if (time >= 24) {
				days = (time - hours) / 24; // you can probably guess this one
				if (days) times = [String(days) + ' ' + (days === 1 ? trans('day') : trans('days'))].concat(times);
			}
		}
	}
	if (!times.length) times.push('0 ' + trans('seconds'));
	return times.join(', ');
};

exports.uncacheTree = function (root) {
	var uncache = [require.resolve(root)];
	do {
		var newuncache = [];
		for (var i = 0; i < uncache.length; ++i) {
			if (require.cache[uncache[i]]) {
				newuncache.push.apply(newuncache,
					require.cache[uncache[i]].children.map(function (module) {
						return module.filename;
					})
				);
				delete require.cache[uncache[i]];
			}
		}
		uncache = newuncache;
	} while (uncache.length > 0);
};

exports.uploadToHastebin = function (toUpload, callback) {
	var reqOpts = {
		hostname: "hastebin.com",
		method: "POST",
		path: '/documents'
	};
	var req = require('http').request(reqOpts, function (res) {
		res.on('data', function (chunk) {
			try {
				var linkStr = "hastebin.com/" + JSON.parse(chunk.toString())['key'];
				if (typeof callback === "function") callback(true, linkStr);
			} catch (e) {
				if (typeof callback === "function") callback(false, e);
			}
		});
	});
	req.on('error', function (e) {
		if (typeof callback === "function") callback(false, e);
	});
	req.write(toUpload);
	req.end();
};

exports.checkConfig = function () {
	var issue = function (text) {
		console.log('issue'.yellow + '\t' + text);
	};
	if (typeof Config.rooms !== 'string' && (typeof Config.rooms !== 'object' || typeof Config.rooms.length !== 'number')) {
		issue('Config.rooms is not an array');
		Config.rooms = [];
	}
	if (typeof Config.privateRooms !== 'object') {
		issue('Config.privateRooms is not an object');
		Config.privateRooms = {};
	}
	if (typeof Config.initCmds !== 'object' || typeof Config.initCmds.length !== 'number') {
		issue('Config.initCmds is not an array');
		Config.initCmds = [];
	}
	if (typeof Config.exceptions !== 'object') {
		issue('Config.exceptions is not an object');
		Config.exceptions = {};
	}
	if (typeof Config.ranks !== 'object' || typeof Config.ranks.length !== 'number') {
		issue('Config.ranks is not an array');
		Config.ranks = [];
	}
	if (typeof Config.permissionExceptions !== 'object') {
		issue('Config.permissionExceptions is not an object');
		Config.permissionExceptions = {};
	}
	if (typeof Config.debug !== 'object') {
		issue('Config.debug is not an object');
		Config.debug = {};
	}
};

exports.reloadFeature = function (feature) {
	try {
		if (!fs.existsSync('./features/' + feature + '/index.js')) return -1;
		Tools.uncacheTree('./features/' + feature + '/index.js');
		var f = require('./features/' + feature + '/index.js');
		if (f.id) {
			if (Features[f.id] && typeof Features[f.id].destroy === "function") Features[f.id].destroy();
			Features[f.id] = f;
			Features[f.id].init();
		} else {
			return -1;
		}
		return false;
	} catch (e) {
		return e;
	}
};

var translations = exports.translations = {};
var loadTranslations = exports.loadTranslations = function (reloading) {
	var errs = [];
	fs.readdirSync('./languages').forEach(function (file) {
		if (file.substr(-3) === '.js') {
			if (reloading) Tools.uncacheTree('./languages/' + file);
			try {
				translations[toId(file).substr(0, toId(file).length - 2)] = require('./languages/' + file).translations;
			} catch (e) {
				errlog(e.stack);
				error("Could not import translations file: ./languages/" + file + " | " + sys.inspect(e));
				errs.push(file);
			}
		}
	});
	return errs;
};

exports.translateCmd = function (cmd, data, lang) {
	if (translations[lang] && translations[lang]['commands'] && translations[lang]['commands'][cmd]) {
		return translations[lang]['commands'][cmd][data];
	} else {
		lang = 'english';
		if (!translations[lang] || !translations[lang]['commands'] || !translations[lang]['commands'][cmd]) {
			return '__(not found)__';
		} else {
			return translations[lang]['commands'][cmd][data];
		}
	}
};

exports.translateGlobal = function (glob, data, lang) {
	if (translations[lang] && translations[lang][glob]) {
		return translations[lang][glob][data];
	} else {
		lang = 'english';
		if (!translations[lang] || !translations[lang][glob]) {
			return '__(not found)__';
		} else {
			return translations[lang][glob][data];
		}
	}
};

loadTranslations();

var BattleStatIDs = exports.BattleStatIDs = {
	HP: 'hp',
	hp: 'hp',
	Atk: 'atk',
	atk: 'atk',
	Def: 'def',
	def: 'def',
	SpA: 'spa',
	SAtk: 'spa',
	SpAtk: 'spa',
	spa: 'spa',
	SpD: 'spd',
	SDef: 'spd',
	SpDef: 'spd',
	spd: 'spd',
	Spe: 'spe',
	Spd: 'spe',
	spe: 'spe'
};

var BattleStatNames = exports.BattleStatNames = {
	hp: 'HP',
	atk: 'Atk',
	def: 'Def',
	spa: 'SpA',
	spd: 'SpD',
	spe: 'Spe'
};

var BattleTypeChart = exports.BattleTypeChart = {
	"Bug": {
		damageTaken: {
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 2,
			"Fire": 1,
			"Flying": 1,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 2,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 1,
			"Steel": 0,
			"Water": 0
		},
		HPivs: {"atk":30, "def":30, "spd":30}
	},
	"Dark": {
		damageTaken: {
			"Bug": 1,
			"Dark": 2,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 1,
			"Fighting": 1,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 2,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 3,
			"Rock": 0,
			"Steel": 0,
			"Water": 0
		},
		HPivs: {}
	},
	"Dragon": {
		damageTaken: {
			"Bug": 0,
			"Dark": 0,
			"Dragon": 1,
			"Electric": 2,
			"Fairy": 1,
			"Fighting": 0,
			"Fire": 2,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 0,
			"Ice": 1,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 0,
			"Steel": 0,
			"Water": 2
		},
		HPivs: {"atk":30}
	},
	"Electric": {
		damageTaken: {
			par: 3,
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 2,
			"Fairy": 0,
			"Fighting": 0,
			"Fire": 0,
			"Flying": 2,
			"Ghost": 0,
			"Grass": 0,
			"Ground": 1,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 0,
			"Steel": 2,
			"Water": 0
		},
		HPivs: {"spa":30}
	},
	"Fairy": {
		damageTaken: {
			"Bug": 2,
			"Dark": 2,
			"Dragon": 3,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 2,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 0,
			"Poison": 1,
			"Psychic": 0,
			"Rock": 0,
			"Steel": 1,
			"Water": 0
		}
	},
	"Fighting": {
		damageTaken: {
			"Bug": 2,
			"Dark": 2,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 1,
			"Fighting": 0,
			"Fire": 0,
			"Flying": 1,
			"Ghost": 0,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 1,
			"Rock": 2,
			"Steel": 0,
			"Water": 0
		},
		HPivs: {"def":30, "spa":30, "spd":30, "spe":30}
	},
	"Fire": {
		damageTaken: {
			brn: 3,
			"Bug": 2,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 2,
			"Fighting": 0,
			"Fire": 2,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 1,
			"Ice": 2,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 1,
			"Steel": 2,
			"Water": 1
		},
		HPivs: {"atk":30, "spa":30, "spe":30}
	},
	"Flying": {
		damageTaken: {
			"Bug": 2,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 1,
			"Fairy": 0,
			"Fighting": 2,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 3,
			"Ice": 1,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 1,
			"Steel": 0,
			"Water": 0
		},
		HPivs: {"hp":30, "atk":30, "def":30, "spa":30, "spd":30}
	},
	"Ghost": {
		damageTaken: {
			trapped: 3,
			"Bug": 2,
			"Dark": 1,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 3,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 1,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 3,
			"Poison": 2,
			"Psychic": 0,
			"Rock": 0,
			"Steel": 0,
			"Water": 0
		},
		HPivs: {"def":30, "spd":30}
	},
	"Grass": {
		damageTaken: {
			powder: 3,
			"Bug": 1,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 2,
			"Fairy": 0,
			"Fighting": 0,
			"Fire": 1,
			"Flying": 1,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 2,
			"Ice": 1,
			"Normal": 0,
			"Poison": 1,
			"Psychic": 0,
			"Rock": 0,
			"Steel": 0,
			"Water": 2
		},
		HPivs: {"atk":30, "spa":30}
	},
	"Ground": {
		damageTaken: {
			sandstorm: 3,
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 3,
			"Fairy": 0,
			"Fighting": 0,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 1,
			"Ground": 0,
			"Ice": 1,
			"Normal": 0,
			"Poison": 2,
			"Psychic": 0,
			"Rock": 2,
			"Steel": 0,
			"Water": 1
		},
		HPivs: {"spa":30, "spd":30}
	},
	"Ice": {
		damageTaken: {
			hail: 3,
			frz: 3,
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 1,
			"Fire": 1,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 0,
			"Ground": 0,
			"Ice": 2,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 1,
			"Steel": 1,
			"Water": 0
		},
		HPivs: {"atk":30, "def":30}
	},
	"Normal": {
		damageTaken: {
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 1,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 3,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 0,
			"Steel": 0,
			"Water": 0
		}
	},
	"Poison": {
		damageTaken: {
			psn: 3,
			tox: 3,
			"Bug": 2,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 2,
			"Fighting": 2,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 1,
			"Ice": 0,
			"Normal": 0,
			"Poison": 2,
			"Psychic": 1,
			"Rock": 0,
			"Steel": 0,
			"Water": 0
		},
		HPivs: {"def":30, "spa":30, "spd":30}
	},
	"Psychic": {
		damageTaken: {
			"Bug": 1,
			"Dark": 1,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 2,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 1,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 2,
			"Rock": 0,
			"Steel": 0,
			"Water": 0
		},
		HPivs: {"atk":30, "spe":30}
	},
	"Rock": {
		damageTaken: {
			sandstorm: 3,
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 1,
			"Fire": 2,
			"Flying": 2,
			"Ghost": 0,
			"Grass": 1,
			"Ground": 1,
			"Ice": 0,
			"Normal": 2,
			"Poison": 2,
			"Psychic": 0,
			"Rock": 0,
			"Steel": 1,
			"Water": 1
		},
		HPivs: {"def":30, "spd":30, "spe":30}
	},
	"Steel": {
		damageTaken: {
			psn: 3,
			tox: 3,
			sandstorm: 3,
			"Bug": 2,
			"Dark": 0,
			"Dragon": 2,
			"Electric": 0,
			"Fairy": 2,
			"Fighting": 1,
			"Fire": 1,
			"Flying": 2,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 1,
			"Ice": 2,
			"Normal": 2,
			"Poison": 3,
			"Psychic": 2,
			"Rock": 2,
			"Steel": 2,
			"Water": 0
		},
		HPivs: {"spd":30}
	},
	"Water": {
		damageTaken: {
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 1,
			"Fairy": 0,
			"Fighting": 0,
			"Fire": 2,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 1,
			"Ground": 0,
			"Ice": 2,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 0,
			"Steel": 2,
			"Water": 2
		},
		HPivs: {"atk":30, "def":30, "spa":30}
	}
};

var teamToJSON = exports.teamToJSON = function (text) {
	text = text.split("\n");
	var team = [];
	var curSet = null;
	for (var i = 0; i < text.length; i++) {
		var line = text[i].trim();
		if (line === '' || line === '---') {
			curSet = null;
		} else if (!curSet) {
			curSet = {name: '', species: '', gender: ''};
			team.push(curSet);
			var atIndex = line.lastIndexOf(' @ ');
			if (atIndex !== -1) {
				curSet.item = line.substr(atIndex + 3);
				if (toId(curSet.item) === 'noitem') curSet.item = '';
				line = line.substr(0, atIndex);
			}
			if (line.substr(line.length - 4) === ' (M)') {
				curSet.gender = 'M';
				line = line.substr(0, line.length - 4);
			}
			if (line.substr(line.length - 4) === ' (F)') {
				curSet.gender = 'F';
				line = line.substr(0, line.length - 4);
			}
			var parenIndex = line.lastIndexOf(' (');
			if (line.substr(line.length - 1) === ')' && parenIndex !== -1) {
				line = line.substr(0, line.length - 1);
				curSet.species = line.substr(parenIndex + 2);
				line = line.substr(0, parenIndex);
				curSet.name = line;
			} else {
				curSet.species = line;
				curSet.name = curSet.species;
			}
		} else if (line.substr(0, 7) === 'Trait: ') {
			line = line.substr(7);
			curSet.ability = line;
		} else if (line.substr(0, 9) === 'Ability: ') {
			line = line.substr(9);
			curSet.ability = line;
		} else if (line === 'Shiny: Yes') {
			curSet.shiny = true;
		} else if (line.substr(0, 7) === 'Level: ') {
			line = line.substr(7);
			curSet.level = parseInt(line);
		} else if (line.substr(0, 11) === 'Happiness: ') {
			line = line.substr(11);
			curSet.happiness = parseInt(line);
		} else if (line.substr(0, 9) === 'Ability: ') {
			line = line.substr(9);
			curSet.ability = line;
		} else if (line.substr(0, 5) === 'EVs: ') {
			line = line.substr(5);
			var evLines = line.split('/');
			curSet.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			for (var j = 0; j < evLines.length; j++) {
				var evLine = evLines[j].trim();
				var spaceIndex = evLine.indexOf(' ');
				if (spaceIndex === -1) continue;
				var statid = BattleStatIDs[evLine.substr(spaceIndex + 1)];
				var statval = parseInt(evLine.substr(0, spaceIndex));
				if (!statid) continue;
				curSet.evs[statid] = statval;
			}
		} else if (line.substr(0, 5) === 'IVs: ') {
			line = line.substr(5);
			var ivLines = line.split(' / ');
			curSet.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
			for (var j = 0; j < ivLines.length; j++) {
				var ivLine = ivLines[j];
				var spaceIndex = ivLine.indexOf(' ');
				if (spaceIndex === -1) continue;
				var statid = BattleStatIDs[ivLine.substr(spaceIndex + 1)];
				var statval = parseInt(ivLine.substr(0, spaceIndex));
				if (!statid) continue;
				curSet.ivs[statid] = statval;
			}
		} else if (line.match(/^[A-Za-z]+ (N|n)ature/)) {
			var natureIndex = line.indexOf(' Nature');
			if (natureIndex === -1) natureIndex = line.indexOf(' nature');
			if (natureIndex === -1) continue;
			line = line.substr(0, natureIndex);
			curSet.nature = line;
		} else if (line.substr(0, 1) === '-' || line.substr(0, 1) === '~') {
			line = line.substr(1);
			if (line.substr(0, 1) === ' ') line = line.substr(1);
			if (!curSet.moves) curSet.moves = [];
			if (line.substr(0, 14) === 'Hidden Power [') {
				var hptype = line.substr(14, line.length - 15);
				line = 'Hidden Power ' + hptype;
				if (!curSet.ivs) {
					curSet.ivs = {};
					for (var stat in BattleTypeChart[hptype].HPivs) {
						curSet.ivs[stat] = BattleTypeChart[hptype].HPivs[stat];
					}
				}
			}
			if (line === 'Frustration') {
				curSet.happiness = 0;
			}
			curSet.moves.push(line);
		}
	}
	return team;
};

var packTeam = exports.packTeam = function (team) {
	var buf = '';
	if (!team) return '';
	for (var i = 0; i < team.length; i++) {
		var set = team[i];
		if (buf) buf += ']';
		// name
		buf += (set.name || set.species);
		// species
		var id = toId(set.species || set.name);
		buf += '|' + (toId(set.name || set.species) === id ? '' : id);
		// item
		buf += '|' + toId(set.item);
		// ability
		var template = set.species || set.name;
		try {
			template = require('./data/pokedex.js').BattlePokedex[toId(template)];
		} catch (e) {
			errlog(e.stack);
			template = null;
		}
		if (!template) return '';
		var abilities = template.abilities;
		id = toId(set.ability);
		if (abilities) {
			if (abilities['0'] && id === toId(abilities['0'])) {
				buf += '|';
			} else if (abilities['1'] && id === toId(abilities['1'])) {
				buf += '|1';
			} else if (abilities['H'] && id === toId(abilities['H'])) {
				buf += '|H';
			} else {
				buf += '|' + id;
			}
		} else {
			buf += '|' + id;
		}
		// moves
		buf += '|' + set.moves.map(toId).join(',');
		// nature
		buf += '|' + set.nature;
		// evs
		var evs = '|';
		if (set.evs) {
			evs = '|' + (set.evs['hp'] || '') + ',' + (set.evs['atk'] || '') + ',' + (set.evs['def'] || '') + ',' + (set.evs['spa'] || '') + ',' + (set.evs['spd'] || '') + ',' + (set.evs['spe'] || '');
		}
		if (evs === '|,,,,,') {
			buf += '|';
		} else {
			buf += evs;
		}
		// gender
		if (set.gender && set.gender !== template.gender) {
			buf += '|' + set.gender;
		} else {
			buf += '|';
		}
		// ivs
		var ivs = '|';
		if (set.ivs) {
			ivs = '|' + (set.ivs['hp'] === 31 || set.ivs['hp'] === undefined ? '' : set.ivs['hp']) + ',' + (set.ivs['atk'] === 31 || set.ivs['atk'] === undefined ? '' : set.ivs['atk']) + ',' + (set.ivs['def'] === 31 || set.ivs['def'] === undefined ? '' : set.ivs['def']) + ',' + (set.ivs['spa'] === 31 || set.ivs['spa'] === undefined ? '' : set.ivs['spa']) + ',' + (set.ivs['spd'] === 31 || set.ivs['spd'] === undefined ? '' : set.ivs['spd']) + ',' + (set.ivs['spe'] === 31 || set.ivs['spe'] === undefined ? '' : set.ivs['spe']);
		}
		if (ivs === '|,,,,,') {
			buf += '|';
		} else {
			buf += ivs;
		}
		// shiny
		if (set.shiny) {
			buf += '|S';
		} else {
			buf += '|';
		}
		// level
		if (set.level && set.level !== 100) {
			buf += '|' + set.level;
		} else {
			buf += '|';
		}
		// happiness
		if (set.happiness !== undefined && set.happiness !== 255) {
			buf += '|' + set.happiness;
		} else {
			buf += '|';
		}
	}
	return buf;
};

var fastUnpackTeam = exports.fastUnpackTeam = function (buf) {
	if (!buf) return [];

	var team = [];
	var i = 0, j = 0;

	while (true) {
		var set = {};
		team.push(set);

		// name
		j = buf.indexOf('|', i);
		set.name = buf.substring(i, j);
		i = j + 1;

		// species
		j = buf.indexOf('|', i);
		set.species = buf.substring(i, j) || set.name;
		i = j + 1;

		// item
		j = buf.indexOf('|', i);
		set.item = buf.substring(i, j);
		i = j + 1;

		// ability
		j = buf.indexOf('|', i);
		var ability = buf.substring(i, j);
		var template = Tools.getTemplate(set.species);
		set.ability = (template.abilities && ability in {'': 1, 0: 1, 1: 1, H: 1} ? template.abilities[ability || '0'] : ability);
		i = j + 1;

		// moves
		j = buf.indexOf('|', i);
		set.moves = buf.substring(i, j).split(',');
		i = j + 1;

		// nature
		j = buf.indexOf('|', i);
		set.nature = buf.substring(i, j);
		i = j + 1;

		// evs
		j = buf.indexOf('|', i);
		if (j !== i) {
			var evs = buf.substring(i, j).split(',');
			set.evs = {
				hp: Number(evs[0]) || 0,
				atk: Number(evs[1]) || 0,
				def: Number(evs[2]) || 0,
				spa: Number(evs[3]) || 0,
				spd: Number(evs[4]) || 0,
				spe: Number(evs[5]) || 0
			};
		}
		i = j + 1;

		// gender
		j = buf.indexOf('|', i);
		if (i !== j) set.gender = buf.substring(i, j);
		i = j + 1;

		// ivs
		j = buf.indexOf('|', i);
		if (j !== i) {
			var ivs = buf.substring(i, j).split(',');
			set.ivs = {
				hp: ivs[0] === '' ? 31 : Number(ivs[0]),
				atk: ivs[1] === '' ? 31 : Number(ivs[1]),
				def: ivs[2] === '' ? 31 : Number(ivs[2]),
				spa: ivs[3] === '' ? 31 : Number(ivs[3]),
				spd: ivs[4] === '' ? 31 : Number(ivs[4]),
				spe: ivs[5] === '' ? 31 : Number(ivs[5])
			};
		}
		i = j + 1;

		// shiny
		j = buf.indexOf('|', i);
		if (i !== j) set.shiny = true;
		i = j + 1;

		// level
		j = buf.indexOf('|', i);
		if (i !== j) set.level = parseInt(buf.substring(i, j), 10);
		i = j + 1;

		// happiness
		j = buf.indexOf(']', i);
		if (j < 0) {
			if (buf.substring(i)) {
				set.happiness = Number(buf.substring(i));
			}
			break;
		}
		if (i !== j) set.happiness = Number(buf.substring(i, j));
		i = j + 1;
	}
	return team;
};

var teamOverview = exports.teamOverview = function (buf) {
	var team = fastUnpackTeam(buf);
	if (!team) return '(empty)';
	var pokes = [];
	for (var i = 0; i < team.length; i++) {
		pokes.push(team[i].species);
	}
	if (!pokes.length) return '(empty)';
	return pokes.join(', ');
};

exports.getTemplate = function (name) {
	name = toId(name || '');
	try {
		return (require('./data/pokedex.js').BattlePokedex[name] || {});
	} catch (e) {}
	return {};
};

exports.getItem = function (name) {
	name = toId(name || '');
	try {
		return (require('./data/items.js').BattleItems[name] || {});
	} catch (e) {}
	return {};
};

exports.getAbility = function (name) {
	name = toId(name || '');
	try {
		return (require('./data/abilities.js').BattleAbilities[name] || {});
	} catch (e) {}
	return {};
};

exports.getMove = function (name) {
	name = toId(name || '');
	try {
		return (require('./data/moves.js').BattleMovedex[name] || {});
	} catch (e) {}
	return {};
};

exports.exportTeam = function (team) {
	if (!team) return "";
	if (typeof team === 'string') {
		if (team.indexOf('\n') >= 0) return team;
		team = Tools.fastUnpackTeam(team);
	}
	var text = '';
	for (var i = 0; i < team.length; i++) {
		var curSet = team[i];
		if (curSet.name !== curSet.species) {
			text += '' + curSet.name + ' (' + (Tools.getTemplate(curSet.species).name || curSet.species) + ')';
		} else {
			text += '' + (Tools.getTemplate(curSet.species).name || curSet.species);
		}
		if (curSet.gender === 'M') text += ' (M)';
		if (curSet.gender === 'F') text += ' (F)';
		if (curSet.item) {
			curSet.item = Tools.getItem(curSet.item).name || curSet.item;
			text += ' @ ' + curSet.item;
		}
		text += "\n";
		if (curSet.ability) {
			text += 'Ability: ' + curSet.ability + "\n";
		}
		if (curSet.level && curSet.level !== 100) {
			text += 'Level: ' + curSet.level + "\n";
		}
		if (curSet.shiny) {
			text += 'Shiny: Yes\n';
		}
		if (typeof curSet.happiness === 'number' && curSet.happiness !== 255) {
			text += 'Happiness: ' + curSet.happiness + "\n";
		}
		var first = true;
		if (curSet.evs) {
			for (var j in BattleStatNames) {
				if (!curSet.evs[j]) continue;
				if (first) {
					text += 'EVs: ';
					first = false;
				} else {
					text += ' / ';
				}
				text += '' + curSet.evs[j] + ' ' + BattleStatNames[j];
			}
		}
		if (!first) {
			text += "\n";
		}
		if (curSet.nature) {
			text += '' + curSet.nature + ' Nature' + "\n";
		}
		var first = true;
		if (curSet.ivs) {
			var defaultIvs = true;
			var hpType = false;
			for (var j = 0; j < curSet.moves.length; j++) {
				var move = curSet.moves[j];
				if (move.substr(0, 13) === 'Hidden Power ' && move.substr(0, 14) !== 'Hidden Power [') {
					hpType = move.substr(13);
					if (!exports.BattleTypeChart[hpType].HPivs) {
						continue;
					}
					for (var stat in BattleStatNames) {
						if ((curSet.ivs[stat] === undefined ? 31 : curSet.ivs[stat]) !== (exports.BattleTypeChart[hpType].HPivs[stat] || 31)) {
							defaultIvs = false;
							break;
						}
					}
				}
			}
			if (defaultIvs && !hpType) {
				for (var stat in BattleStatNames) {
					if (curSet.ivs[stat] !== 31 && typeof curSet.ivs[stat] !== undefined) {
						defaultIvs = false;
						break;
					}
				}
			}
			if (!defaultIvs) {
				for (var stat in BattleStatNames) {
					if (typeof curSet.ivs[stat] === 'undefined' || isNaN(curSet.ivs[stat]) || curSet.ivs[stat] === 31) continue;
					if (first) {
						text += 'IVs: ';
						first = false;
					} else {
						text += ' / ';
					}
					text += '' + curSet.ivs[stat] + ' ' + BattleStatNames[stat];
				}
			}
		}
		if (!first) {
			text += "\n";
		}
		if (curSet.moves) {
			for (var j = 0; j < curSet.moves.length; j++) {
				var move = curSet.moves[j];
				if (move.substr(0, 13) === 'Hidden Power ') {
					move = move.substr(0, 13) + '[' + move.substr(13) + ']';
				}
				text += '- ' + (Tools.getMove(move).name || move) + "\n";
			}
		}
		text += "\n";
	}
	return text;
};

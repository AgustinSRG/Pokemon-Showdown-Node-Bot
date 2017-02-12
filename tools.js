/*
* Tools file
*/

/* String utils */

global.toId = exports.toId = function (text) {
	return text.toLowerCase().replace(/[^a-z0-9]/g, '');
};

global.toRoomid = exports.toRoomid = function (roomid) {
	return roomid.replace(/[^a-zA-Z0-9-]+/g, '').toLowerCase();
};

exports.toName = function (text) {
	if (!text) return '';
	return text.trim();
};

exports.addLeftZero = function (num, nz) {
	var str = num.toString();
	while (str.length < nz) str = "0" + str;
	return str;
};

exports.escapeHTML = function (str) {
	if (!str) return '';
	return ('' + str).escapeHTML();
};

exports.generateRandomNick = function (numChars) {
	var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	var str = '';
	for (var i = 0, l = chars.length; i < numChars; i++) {
		str += chars.charAt(~~(Math.random() * l));
	}
	return str;
};

exports.levenshtein = function (s, t, l) { // s = string 1, t = string 2, l = limit
	// Original levenshtein distance function by James Westgate, turned out to be the fastest
	var d = []; // 2d matrix
	// Step 1
	var n = s.length;
	var m = t.length;
	if (n === 0) return m;
	if (m === 0) return n;
	if (l && Math.abs(m - n) > l) return Math.abs(m - n);
	// Create an array of arrays in javascript (a descending loop is quicker)
	for (var i = n; i >= 0; i--) d[i] = [];
	// Step 2
	for (var i = n; i >= 0; i--) d[i][0] = i;
	for (var j = m; j >= 0; j--) d[0][j] = j;
	// Step 3
	for (var i = 1; i <= n; i++) {
		var s_i = s.charAt(i - 1);
		// Step 4
		for (var j = 1; j <= m; j++) {
			// Check the jagged ld total so far
			if (i === j && d[i][j] > 4) return n;
			var t_j = t.charAt(j - 1);
			var cost = (s_i === t_j) ? 0 : 1; // Step 5
			// Calculate the minimum
			var mi = d[i - 1][j] + 1;
			var b = d[i][j - 1] + 1;
			var c = d[i - 1][j - 1] + cost;
			if (b < mi) mi = b;
			if (c < mi) mi = c;
			d[i][j] = mi; // Step 6
		}
	}
	// Step 7
	return d[n][m];
};

/* Console reporting */

global.ok = function (str) {
	if (AppOptions.debugmode) {
		if (AppOptions.debugmode > 3) return;
	} else if (Config.debug && Config.debug.ok === false) return;
	console.log('ok'.green + '\t' + str);
};

global.info = function (str) {
	if (AppOptions.debugmode) {
		if (AppOptions.debugmode > 3) return;
	} else if (Config.debug && Config.debug.info === false) return;
	console.log('info'.cyan + '\t' + str);
};

global.error = function (str) {
	if (AppOptions.debugmode) {
		if (AppOptions.debugmode > 3) return;
	} else if (Config.debug && Config.debug.error === false) return;
	console.log('error'.red + '\t' + str);
};

global.errlog = function (str) {
	if (AppOptions.debugmode) {
		if (AppOptions.debugmode > 3) return;
	} else if (Config.debug && Config.debug.errlog === false) return;
	console.log(str);
};

global.debug = function (str) {
	if (AppOptions.debugmode) {
		if (AppOptions.debugmode > 1) return;
	} else if (Config.debug && Config.debug.debug === false) return;
	console.log('debug'.blue + '\t' + str);
};

global.cmdr = function (str) {
	if (AppOptions.debugmode) {
		if (AppOptions.debugmode > 1) return;
	} else if (Config.debug && Config.debug.cmdr === false) return;
	console.log('cmdr'.magenta + '\t' + str);
};

global.recv = function (str) {
	if (AppOptions.debugmode) {
		if (AppOptions.debugmode > 1) return;
	} else if (Config.debug && Config.debug.recv === false) return;
	console.log('recv'.grey + '\t' + str);
};

global.sent = function (str) {
	if (AppOptions.debugmode) {
		if (AppOptions.debugmode > 1) return;
	} else if (Config.debug && Config.debug.sent === false) return;
	console.log('sent'.grey + '\t' + str);
};

global.monitor = function (str, type, flag) {
	switch (type) {
		case 'room':
			if (AppOptions.debugmode) {
				if (AppOptions.debugmode > 3) return;
			} else if (Config.debug && Config.debug.room === false) return;
			switch (flag) {
				case 'join':
					console.log('room'.green + '\t' + str);
					break;
				case 'leave':
					console.log('room'.yellow + '\t' + str);
					break;
				case 'error':
					console.log('room'.red + '\t' + str);
					break;
				default:
					console.log('room'.blue + '\t' + str);
			}
			break;
		case 'battle':
			if (AppOptions.debugmode) {
				if (AppOptions.debugmode > 2) return;
			} else if (Config.debug && Config.debug.battle === false) return;
			switch (flag) {
				case 'join':
					console.log('battle'.green + '\t' + str);
					break;
				case 'leave':
					console.log('battle'.yellow + '\t' + str);
					break;
				case 'error':
					console.log('battle'.red + '\t' + str);
					break;
				default:
					console.log('battle'.blue + '\t' + str);
			}
			break;
		case 'status':
			if (AppOptions.debugmode) {
				if (AppOptions.debugmode > 2) return;
			} else if (Config.debug && Config.debug.status === false) return;
			console.log('status'.blue + '\t' + str);
			break;
		default:
			if (AppOptions.debugmode) {
				if (AppOptions.debugmode > 2) return;
			} else if (Config.debug && Config.debug.monitor === false) return;
			console.log('monitor'.cyan + '\t' + str);
	}
};

/* Process arguments */

exports.paseArguments = function (arr) {
	var opts = {};
	var arg = '';
	for (var i = 0; i < arr.length; i++) {
		arg = arr[i].toLowerCase().trim();
		if (arg.charAt(0) === '-') {
			switch (arg) {
				case '-h':
				case '-help':
					opts.help = true;
					break;
				case '-production':
				case '-p':
					opts.debugmode = 3;
					break;
				case '-monitor':
				case '-m':
					opts.debugmode = 2;
					break;
				case '-debug':
				case '-d':
					opts.debugmode = 1;
					break;
				case '-test':
				case '-t':
					opts.testmode = true;
					break;
				case '-c':
				case '-config':
					if (!arr[i + 1]) opts.help = true;
					opts.config = arr[i + 1];
					i++;
					break;
				case '-dt':
				case '-data':
					if (!arr[i + 1]) opts.help = true;
					opts.data = arr[i + 1];
					i++;
					break;
				default:
					console.log('unknown parametter: ' + arg);
					opts.help = true;
			}
		}
	}
	return opts;
};

/* Commands and Permissions */

exports.stripCommands = function (text) {
	return ((text.trim().charAt(0) === '/') ? '/' : ((text.trim().charAt(0) === '!') ? ' ' : '')) + text.trim();
};

exports.getTargetRoom = function (arg) {
	if (!arg) return null;
	if (arg.indexOf("[") !== 0) return null;
	if (arg.indexOf("]") < 0) return null;
	var target = toRoomid(arg.substr(arg.indexOf("[") + 1, arg.indexOf("]") - arg.indexOf("[") - 1));
	var newArg = arg.substr(arg.indexOf("]") + 1);
	return {arg: newArg, room: target};
};

exports.equalOrHigherRank = function (userIdentity, rank) {
	if (typeof rank === "string" && rank.length > 1) rank = Tools.getGroup(rank);
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

exports.getGroup = function (perm) {
	if (!perm) return true;
	var globalPermissions = {'voice': '+', 'driver': '%', 'moderator': '@', 'roomowner': '#', 'admin': '~'};
	if (Config.globalPermissions) {
		for (var i in Config.globalPermissions) globalPermissions[i] = Config.globalPermissions[i];
	}
	return globalPermissions[perm] || true;
};

/* Time and Dates */

exports.getDateString = function () {
	var date = new Date();
	return (Tools.addLeftZero(date.getDate(), 2) + '/' + Tools.addLeftZero(date.getMonth() + 1, 2) + '/' + Tools.addLeftZero(date.getFullYear(), 4) + ' ' + Tools.addLeftZero(date.getHours(), 2) + ':' + Tools.addLeftZero(date.getMinutes(), 2) + ':' + Tools.addLeftZero(date.getSeconds(), 2));
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

/* File system utils */

exports.watchFile = function () {
	try {
		return fs.watchFile.apply(fs, arguments);
	} catch (e) {
		error('Your version of node does not support `fs.watchFile`');
		return false;
	}
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

/* Http utils */

exports.httpGet = function (url, callback) {
	if (typeof callback !== "function") return;
	var http = require("http");
	http.get(url, function (res) {
		var data = '';
		res.on('data', function (part) {
			data += part;
		});
		res.on('end', function () {
			callback(data);
		});
		res.on('error', function (e) {
			callback(null, e);
		});
	}).on('error', function (e) {
		callback(null, e);
	});
};

exports.uploadToHastebin = function (toUpload, callback) {
	var reqOpts = {
		hostname: "hastebin.com",
		method: "POST",
		path: '/documents'
	};
	var req = require('https').request(reqOpts, function (res) {
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

/* Languages */

var loadLang = exports.loadLang = function (lang, reloading) {
	var tradObj = {}, cmdsTra = {}, tempObj = {};
	fs.readdirSync('./languages/' + lang).forEach(function (file) {
		if (file.substr(-3) !== '.js') return;
		if (reloading) Tools.uncacheTree('./languages/' + lang + '/' + file);
		tempObj = require('./languages/' + lang + '/' + file).translations;
		for (var t in tempObj) {
			if (t === "commands") Object.merge(cmdsTra, tempObj[t]);
			else tradObj[t] = tempObj[t];
		}
	});
	tradObj.commands = cmdsTra;
	return tradObj;
};

var translations = exports.translations = {};
var loadTranslations = exports.loadTranslations = function (reloading) {
	var errs = [];
	fs.readdirSync('./languages').forEach(function (lang) {
		if (fs.lstatSync('./languages/' + lang).isDirectory()) {
			try {
				translations[lang] = loadLang(lang, reloading);
			} catch (e) {
				errlog(e.stack);
				error("Could not import language: ./languages/" + lang + "/ | " + sys.inspect(e));
				errs.push(lang);
			}
		}
	});
	if (reloading) info('Languages reloaded' + (errs.length ? ('. Errors: ' + errs.join(', ')) : '') + '. Languages: ' + Object.keys(translations).join(', '));
	else ok('Loaded languages' + (errs.length ? ('. Errors: ' + errs.join(', ')) : '') + '. Languages: ' + Object.keys(translations).join(', '));
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
	if (translations[lang] && translations[lang][glob] && typeof translations[lang][glob][data] !== "undefined") {
		return translations[lang][glob][data];
	} else {
		lang = 'english';
		if (!translations[lang] || !translations[lang][glob] || typeof translations[lang][glob][data] === "undefined") {
			return '__(not found)__';
		} else {
			return translations[lang][glob][data];
		}
	}
};

exports.tryTranslate = function (type, name, lang) {
	if (!lang) return name;
	var id = toId(name);
	if (translations[lang] && translations[lang][type] && translations[lang][type][id]) {
		return translations[lang][type][id];
	}
	return name;
};

/* Battle formats and data */

exports.parseAliases = function (format) {
	if (!format) return '';
	format = toId(format);
	var aliases = Config.formatAliases || {};
	if (Formats[format]) return format;
	if (aliases[format]) format = toId(aliases[format]);
	if (Formats[format]) return format;
	try {
		var psAliases = DataDownloader.getAliases();
		if (psAliases[format]) format = toId(psAliases[format]);
	} catch (e) {}
	return format;
};

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

var BattleTypeChart = exports.BattleTypeChart = require('./data/typechart.js');

/* Teams - Pokemon Showdown format */

var teamToJSON = exports.teamToJSON = function (text) {
	text = text.split("\n");
	var team = [];
	var curSet = null;
	for (var i = 0; i < text.length; i++) {
		var line = text[i].trim();
		if (line === '' || line === '---') {
			curSet = null;
		} else if (!curSet) {
			curSet = {name: '', species: '', gender: '', item: '', ability: '', nature: ''};
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
			template = DataDownloader.getPokedex()[toId(template)];
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
		return (DataDownloader.getPokedex()[name] || {});
	} catch (e) {}
	return {};
};

exports.getItem = function (name) {
	name = toId(name || '');
	try {
		return (DataDownloader.getItems()[name] || {});
	} catch (e) {}
	return {};
};

exports.getAbility = function (name) {
	name = toId(name || '');
	try {
		return (DataDownloader.getAbilities()[name] || {});
	} catch (e) {}
	return {};
};

exports.getMove = function (name) {
	name = toId(name || '');
	try {
		return (DataDownloader.getMovedex()[name] || {});
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
		first = true;
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

/* Other tools */

exports.checkConfig = function () {
	var issue = function (text) {
		console.log('issue'.yellow + '\t' + text);
	};
	if (Config.server && Config.server.substr(-8) === ".psim.us") {
		issue('WARNING: YOUR SERVER URL ' + Config.server.red + ' SEEMS A CLIENT URL, NOT A SERVER ONE. USE ' + 'node serverconfig.js'.cyan + ' TO GET THE CORRECT SERVER, PORT AND SERVERID VALUES\n');
	}
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
			if (typeof Features[f.id].init === "function") Features[f.id].init();
			info("Feature \"" + f.id + '\" reloaded');
		} else {
			return -1;
		}
		return false;
	} catch (e) {
		return e;
	}
};

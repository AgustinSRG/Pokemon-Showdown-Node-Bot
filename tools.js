
/* Globals */

global.toId = function (text) {
	return text.toLowerCase().replace(/[^a-z0-9]/g, '');
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
	var self = this;
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

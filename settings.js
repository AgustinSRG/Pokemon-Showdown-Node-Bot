/*
	Settings Manager
*/

const settingsDataFile = AppOptions.data + 'settings.json';
const cacheDataFile = AppOptions.data + '_temp/' + 'http-cache.json';

var settings = exports.settings = {};

var FlatFileManager = exports.FlatFileManager = (function () {
	function FlatFileManager (file) {
		this.file = file;
		if (!fs.existsSync(file))
			fs.writeFileSync(file, '{}');
		this.writing = false;
		this.writePending = false;
		this.dataPending = null;
	}

	FlatFileManager.prototype.read = function () {
		return fs.readFileSync(this.file).toString();
	};

	FlatFileManager.prototype.readObj = function () {
		return JSON.parse(this.read());
	};

	FlatFileManager.prototype.write = function (data) {
		var self = this;
		var finishWriting = function () {
			self.writing = false;
			if (self.writePending) {
				self.writePending = false;
				self.write(self.dataPending);
				self.dataPending = null;
			}
		};
		if (self.writing) {
			self.writePending = true;
			self.dataPending = data;
			return;
		}
		fs.writeFile(self.file + '.0', data, function () {
			// rename is atomic on POSIX, but will throw an error on Windows
			fs.rename(self.file + '.0', self.file, function (err) {
				if (err) {
					// This should only happen on Windows.
					fs.writeFile(self.file, data, finishWriting);
					return;
				}
				finishWriting();
			});
		});
	};

	FlatFileManager.prototype.writeObj = function (obj) {
		this.write(JSON.stringify(obj));
	};

	return FlatFileManager;
})();

var settingsFFM = exports.settingsFFM = new FlatFileManager(settingsDataFile);

try {
	settings = exports.settings = settingsFFM.readObj();
} catch (e) {
	errlog(e.stack);
	error("Could not import settings: " + sys.inspect(e));
}

var save = exports.save =  function () {
	settingsFFM.writeObj(settings);
};

/*
 * Permissions
 */

exports.userCan = function (room, user, permission) {
	var rank;
	if (!settings['commands'] || !settings['commands'][room] || typeof settings['commands'][room][permission] === "undefined") {
		rank = Config.defaultPermission;
		if (Config.permissionExceptions[permission]) rank = Config.permissionExceptions[permission];
	} else {
		rank = settings['commands'][room][permission];
	}
	return Tools.equalOrHigherRank(user, rank);
};

var permissions = exports.permissions = {};

exports.addPermissions = function (perms) {
	for (var i = 0; i < perms.length; i++) {
		permissions[perms[i]] = 1;
	}
};

exports.setPermission = function (room, perm, rank) {
	if (!settings.commands) settings.commands = {};
	if (!settings.commands[room]) settings.commands[room] = {};
	settings.commands[room][perm] = rank;
};

/*
 * Configuration
 */

var parserFilters = exports.parserFilters = {};

exports.callParseFilters = function (room, by, msg) {
	for (var f in parserFilters) {
		if (typeof parserFilters[f] === "function") {
			if (parserFilters[f].call(this, room, by, msg)) return true;
		}
	}
	return false;
};

exports.addParseFilter = function (id, func) {
	parserFilters[id] = func;
	return true;
};

exports.deleteParseFilter = function (id) {
	if (!parserFilters[id]) return false;
	delete parserFilters[id];
	return true;
};

var isSleeping = exports.isSleeping = function (room) {
	if (settings.sleep && typeof settings.sleep[room] === "boolean") return settings.sleep[room];
	if (Config.ignoreRooms) return !!Config.ignoreRooms[room];
	return false;
};

exports.sleepRoom = function (room) {
	if (isSleeping(room)) return false;
	if (!settings.sleep) settings.sleep = {};
	settings.sleep[room] = true;
	save();
	return true;
};

exports.unsleepRoom = function (room) {
	if (!isSleeping(room)) return false;
	if (!settings.sleep) settings.sleep = {};
	settings.sleep[room] = false;
	save();
	return true;
};

exports.applyConfig = function () {
	Bot.opts.server = Config.server;
	Bot.opts.port = Config.port;
	Bot.opts.loginServer = 'https://play.pokemonshowdown.com/~~' + Config.serverid + '/action.php';
	Bot.opts.serverid = Config.serverid;
	Bot.opts.connectionTimeout = Config.connectionTimeout;
	Bot.opts.showErrors = Bot.opts.debug = (Config.debug ? Config.debug.debug : true);
};

/*
 * Seen / Alts feature
 */

var users = exports.users = {};

var User = exports.User = (function () {
	function User (name) {
		this.name = name;
		this.id = toId(name);
		this.alts = [];
		this.lastSeen = null;
		this.online = false;
		this.rooms = {};
	}

	User.prototype.markAlt = function (alt) {
		alt = toId(alt);
		if (alt === this.id) return;
		if (this.alts.indexOf(alt) < 0) {
			this.alts.push(alt);
			for (var i = 0; i < this.alts.length; i++) {
				if (users[this.alts[i]]) {
					users[this.alts[i]].markAlt(alt); // recursive
				}
			}
		}
	};

	User.prototype.setOnline = function () {
		this.online = true;
	};

	User.prototype.setOffline = function () {
		this.online = false;
		for (var r in this.rooms) delete this.rooms[r];
	};

	User.prototype.reportSeen = function (room, action, args) {
		if (!args) args = [];
		var dSeen = {};
		dSeen.name = this.name;
		dSeen.time = Date.now();
		if (!(room in Config.privateRooms)) {
			dSeen.room = room;
			dSeen.action = action;
			dSeen.args = args;
		}
		this.lastSeen = dSeen;
	};

	return User;
})();

exports.userManager = {
	isOnline: function (user) {
		var userid = toId(user);
		if (!users[userid]) return false;
		return !!users[userid].online;
	},

	getName: function (user) {
		var userid = toId(user);
		if (!users[userid]) return userid;
		return users[userid].name;
	},

	getSeen: function (user) {
		var userid = toId(user);
		if (!users[userid]) return null;
		return users[userid].lastSeen;
	},

	getAlts: function (user) {
		var userid = toId(user);
		if (!users[userid]) return null;
		return users[userid].alts;
	},

	reportJoin: function (user, room) {
		if (Config.disableSeen) return;
		var userid = toId(user);
		if (!users[userid]) {
			users[userid] = new User(user.substr(1));
		}
		var userObj = users[userid];
		userObj.setOnline();
		userObj.rooms[room] = {group: user.charAt(0)};
		userObj.reportSeen(room, 'j', []);
	},

	reportChat: function (user, room) {
		if (Config.disableSeen) return;
		var userid = toId(user);
		if (!users[userid]) {
			users[userid] = new User(user.substr(1));
		}
		var userObj = users[userid];
		userObj.setOnline();
		userObj.reportSeen(room, 'c', []);
	},

	reportLeave: function (user, room) {
		if (Config.disableSeen) return;
		var userid = toId(user);
		if (!users[userid]) {
			users[userid] = new User(user.substr(1));
		}
		var userObj = users[userid];
		if (userObj.rooms[room]) delete userObj.rooms[room];
		userObj.reportSeen(room, 'l', []);
		if (Object.keys(userObj.rooms).length > 0) {
			userObj.setOnline();
		} else {
			userObj.setOffline();
		}
	},

	reportRename: function (user, newName, room) {
		if (Config.disableSeen) return;
		var userid = toId(user);
		if (!users[userid]) {
			users[userid] = new User(user.substr(1));
		}
		var userObj = users[userid];
		if (toId(user) === toId(newName)) {
			// Just a name change
			userObj.name = newName.substr(1);
			userObj.rooms[room] = {group: newName.charAt(0)};
		} else {
			// User change
			var newUserid = toId(newName);
			userObj.setOffline();
			if (!Config.disableAlts) userObj.markAlt(newUserid);
			userObj.reportSeen(room, 'n', [newName.substr(1)]);
			if (!users[newUserid]) {
				users[newUserid] = new User(newName.substr(1));
			}
			var newUserObj = users[newUserid];
			newUserObj.setOnline();
			newUserObj.rooms[room] = {group: newName.charAt(0)};
			if (!Config.disableAlts) {
				newUserObj.markAlt(userid);
				// merge alts
				for (var i = 0; i < userObj.alts.length; i++) {
					newUserObj.markAlt(userObj.alts[i]);
				}
			}
			newUserObj.reportSeen(room, 'j', []);
		}
	}
};

/*
 * Cache System
 */

var httpCache = exports.httpCache = {};

var cacheFFM = exports.cacheFFM = new FlatFileManager(cacheDataFile);

try {
	httpCache = exports.httpCache = cacheFFM.readObj();
} catch (e) {
	errlog(e.stack);
	error("Could not import http cache: " + sys.inspect(e));
}

exports.httpGetAndCache = function (url, callback, onDownload) {
	for (var i in httpCache) {
		if (httpCache[i].url === url) {
			fs.readFile(AppOptions.data + '_temp/' + i, function (err, data) {
				if (err) {
					Settings.unCacheUrl(url);
					if (typeof callback === "function") callback(null, err);
					return;
				}
				if (typeof callback === "function") callback(data.toString(), null);
			});
			return;
		}
	}
	if (typeof onDownload === "function") onDownload();
	Tools.httpGet(url, function (data, err) {
		if (err) {
			if (typeof callback === "function") callback(null, err);
			return;
		}
		var file;
		do {
			file = "cache.http." + Tools.generateRandomNick(5) + ".tmp";
		} while (httpCache[file]);
		fs.writeFile(AppOptions.data + '_temp/' + file, data, function (err) {
			if (!err) {
				httpCache[file] = {url: url, time: Date.now()};
				cacheFFM.writeObj(httpCache);
			}
			if (typeof callback === "function") callback(data, null);
		});
	});
};

exports.unCacheUrl = function (url) {
	var uncache, changed = false;
	for (var file in httpCache) {
		uncache = false;
		if (typeof url === "string") {
			if (url === httpCache[file].url) uncache = true;
		} else if (typeof url === "object" && url instanceof RegExp) {
			if (url.test(httpCache[file].url)) uncache = true;
		} else if (url === true) {
			uncache = true;
		}
		if (uncache) {
			try {
				fs.unlinkSync(AppOptions.data + '_temp/' + file);
			} catch (err) {
				debug(err.stack);
				debug("Could not remove cache file: " + AppOptions.data + '_temp/' + file);
			}
			delete httpCache[file];
			changed = true;
		}
	}
	if (changed) cacheFFM.writeObj(httpCache);
};

exports.lockdown = false;

exports.package = require('./package.json');
ok('Loaded Settings. Bot version: ' + exports.package.version);

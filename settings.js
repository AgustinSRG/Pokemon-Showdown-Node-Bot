/*
	Settings Manager
*/

const settingsDataFile = AppOptions.data + 'settings.json';

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

var seen = exports.seen = {};
var reportSeen = exports.reportSeen = function (user, room, action, args) {
	if (!args) args = [];
	var userid = toId(user);
	var dSeen = {};
	dSeen.name = user.substr(1);
	dSeen.time = Date.now();
	if (!(room in Config.privateRooms)) {
		dSeen.room = room;
		dSeen.action = action;
		dSeen.args = args;
	}
	seen[userid] = dSeen;
};

exports.lockdown = false;

exports.package = require('./package.json');
ok('Loaded Settings. Bot version: ' + exports.package.version);

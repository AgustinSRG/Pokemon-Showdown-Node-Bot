/*
	Settings Manager
*/

const settingsDataFile = './data/settings.json';

var settings = exports.settings = {};

if (!fs.existsSync(settingsDataFile))
	fs.writeFileSync(settingsDataFile, '{}');

try {
	settings = exports.settings = JSON.parse(fs.readFileSync(settingsDataFile).toString());
} catch (e) {
	errlog(e.stack);
	error("Could not import settings: " + sys.inspect(e));
}

var writing = exports.writing = false;
var writePending = exports.writePending = false;
var save = exports.save =  function () {
	var data = JSON.stringify(settings);
	var finishWriting = function () {
		writing = false;
		if (writePending) {
			writePending = false;
			save();
		}
	};
	if (writing) {
		writePending = true;
		return;
	}
	fs.writeFile(settingsDataFile + '.0', data, function () {
		// rename is atomic on POSIX, but will throw an error on Windows
		fs.rename(settingsDataFile + '.0', settingsDataFile, function (err) {
			if (err) {
				// This should only happen on Windows.
				fs.writeFile(settingsDataFile, data, finishWriting);
				return;
			}
			finishWriting();
		});
	});
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

var seen = exports.seen = {};
var reportSeen = exports.reportSeen = function (user, room, action, args) {
	if (!args) args = [];
	user = toId(user);
	var dSeen = {};
	dSeen.time = Date.now();
	if (!(room in Config.privateRooms)) {
		dSeen.room = room;
		dSeen.action = action;
		dSeen.args = args;
	}
	seen[user] = dSeen;
};

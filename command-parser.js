/*
	Command parser for Pokemon Showdown Bot
*/

const dynCommandsDataFile = AppOptions.data + 'commands.json';
const MAX_COMMAND_RECURSION = 10;
const MAX_CMD_FLOOD = 30;
const FLOOD_INTERVAL = 45 * 1000;
const HELP_TIME_INTERVAL = 2 * 60 * 1000;

var commands = exports.commands = {};
var dynCommands = exports.dynCommands = {};
var tempVar = exports.tempVar = '';

/* Resource Monitor */

var resourceMonitor = exports.resourceMonitor = {
	/* PM helper */
	lasthelp: {},
	counthelp: function (user) {
		user = toId(user);
		var now = Date.now();
		for (var i in this.lasthelp) {
			if (now - this.lasthelp[i] >= HELP_TIME_INTERVAL) delete this.lasthelp[i];
		}
		if (this.lasthelp[user]) return false;
		this.lasthelp[user] = now;
		return true;
	},
	/* Cmd Usage */
	cmdusage: {},
	cmdtimes: {},
	lockedlist: {},
	countcmd: function (user) {
		user = toId(user);
		var now = Date.now();
		if (!this.cmdtimes[user]) {
			this.cmdusage[user] = 1;
			this.cmdtimes[user] = now;
			return;
		}
		var duration = now - this.cmdtimes[user];
		if (user in this.cmdusage && duration < FLOOD_INTERVAL) {
			this.cmdusage[user]++;
			if (this.cmdusage[user] < MAX_CMD_FLOOD && this.cmdusage[user] % 10 === 0 && duration < 12 * 1000) {
				monitor('User ' + user + ' has used ' + this.cmdusage[user] + ' commands in the last ' + duration.duration());
			} else if (this.cmdusage[user] < MAX_CMD_FLOOD && this.cmdusage[user] % 20 === 0 && duration < 24 * 1000) {
				monitor('User ' + user + ' has used ' + this.cmdusage[user] + ' commands in the last ' + duration.duration());
			} else if (this.cmdusage[user] >= MAX_CMD_FLOOD) {
				this.lock(user);
				monitor('User ' + user + ' has been ignored (command flood: ' + this.cmdusage[user] + ' commands in the last ' + duration.duration() + ')');
				return true;
			}
		} else {
			this.cmdusage[user] = 1;
			this.cmdtimes[user] = now;
		}
	},
	lock: function (user) {
		user = toId(user);
		this.lockedlist[user] = 1;
	},
	unlock: function (user) {
		user = toId(user);
		if (this.lockedlist[user]) delete this.lockedlist[user];
	},
	isLocked: function (user) {
		return this.lockedlist[toId(user)];
	}
};

/* Load commands */
var loadCommands = exports.loadCommands = function (reloading) {
	var errs = [];
	fs.readdirSync('./commands').forEach(function (file) {
		if (file.substr(-3) === '.js') {
			if (reloading) Tools.uncacheTree('./commands/' + file);
			try {
				Object.merge(commands, require('./commands/' + file).commands);
			} catch (e) {
				errlog(e.stack);
				error("Could not import commands file: ./commands/" + file + " | " + sys.inspect(e));
				errs.push(file);
			}
		}
	});
	if (reloading) info('Commands reloaded' + (errs.length ? ('. Errors: ' + errs.join(', ')) : ''));
	else ok('Loaded commands' + (errs.length ? ('. Errors: ' + errs.join(', ')) : ''));
	return errs;
};

if (!fs.existsSync(dynCommandsDataFile))
	fs.writeFileSync(dynCommandsDataFile, '{}');

try {
	dynCommands = exports.dynCommands = JSON.parse(fs.readFileSync(dynCommandsDataFile).toString());
} catch (e) {
	errlog(e.stack);
	error("Could not import dynamic commands: " + sys.inspect(e));
}

var writing = exports.writing = false;
var writePending = exports.writePending = false;
var saveDynCmds = exports.saveDinCmds =  function () {
	var data = JSON.stringify(dynCommands);
	var finishWriting = function () {
		writing = false;
		if (writePending) {
			writePending = false;
			saveDynCmds();
		}
	};
	if (writing) {
		writePending = true;
		return;
	}
	fs.writeFile(dynCommandsDataFile + '.0', data, function () {
		// rename is atomic on POSIX, but will throw an error on Windows
		fs.rename(dynCommandsDataFile + '.0', dynCommandsDataFile, function (err) {
			if (err) {
				// This should only happen on Windows.
				fs.writeFile(dynCommandsDataFile, data, finishWriting);
				return;
			}
			finishWriting();
		});
	});
};

/* Parser */

var commandTokens = exports.commandTokens = [];

var reloadTokens = exports.reloadTokens = function () {
	commandTokens = exports.commandTokens = [];
	if (Config.commandTokens && Config.commandTokens.length) {
		for (var i = 0; i < Config.commandTokens.length; i++)
			commandTokens.push(Config.commandTokens[i]);
	}
	if (typeof Config.commandChar === "string") commandTokens.push(Config.commandChar);
	if (!commandTokens.length) {
		error('No command Tokens, using "." by default');
		commandTokens = exports.commandTokens = ['.'];
	}
};

reloadTokens();

var Context = exports.Context = (function () {
	function Context (opts) {
		this.arg = opts.arg || '';
		this.by = opts.by || '';
		this.room = opts.room || 'lobby';
		this.cmd = opts.cmd || '';
		this.handler = opts.handler || '';
		this.cmdToken = opts.cmdToken || '';
		this.roomType = (this.room.charAt(0) === ',') ? 'pm' : (Bot.rooms[this.room] ? Bot.rooms[this.room].type : 'chat');
		this.botName = Bot.status.nickName;
		this.isExcepted = Tools.equalOrHigherRank(this.by, true);
		var lang = Config.language || 'english';
		if (this.roomType === 'chat' && Settings.settings['language'] && Settings.settings['language'][this.room]) lang = Settings.settings['language'][this.room];
		this.language = lang;
	}

	Context.prototype.reply = function (data) {
		Bot.say(this.room, data);
	};
	Context.prototype.pmReply = function (data) {
		Bot.pm(this.by, data);
	};
	Context.prototype.restrictReply = function (data, perm) {
		if (!this.can(perm)) {
			this.pmReply(data);
		} else {
			this.reply(data);
		}
	};
	Context.prototype.say = function (targetRoom, data) {
		Bot.say(targetRoom, data);
	};
	Context.prototype.isRanked = function (rank) {
		return Tools.equalOrHigherRank(this.by, rank);
	};
	Context.prototype.isRoomRanked = function (targetRoom, rank) {
		if (Bot.rooms && Bot.rooms[targetRoom] && Bot.rooms[targetRoom].users) {
			var userIdent = Bot.rooms[targetRoom].users[toId(this.by)] || this.by;
			return Tools.equalOrHigherRank(userIdent, rank);
		}
		return this.isRanked(rank);
	};
	Context.prototype.can = function (permission) {
		if (this.roomType === 'battle') return Settings.userCan('battle-', this.by, permission);
		else return Settings.userCan(this.room, this.by, permission);
	};
	Context.prototype.canSet = function (permission, rank) {
		var rankSet;
		if (!Settings.settings['commands'] || !Settings.settings['commands'][this.room] || typeof Settings.settings['commands'][this.room][permission] === "undefined") {
			rankSet = Config.defaultPermission;
			if (Config.permissionExceptions[permission]) rankSet = Config.permissionExceptions[permission];
		} else {
			rankSet = Settings.settings['commands'][this.room][permission];
		}
		if (Tools.equalOrHigherRank(this.by, rankSet) && Tools.equalOrHigherRank(this.by, rank)) return true;
		return false;
	};
	Context.prototype.botRanked = function (rank) {
		if (!Bot.rooms[this.room]) return false;
		var ident = Bot.rooms[this.room].users[toId(Bot.status.nickName)];
		if (ident) return Tools.equalOrHigherRank(ident, rank);
		return false;
	};
	Context.prototype.hasRank = function (user, rank, targetRoom) {
		if (!targetRoom) targetRoom = this.room;
		if (Bot.rooms && Bot.rooms[targetRoom] && Bot.rooms[targetRoom].users) {
			var userIdent = Bot.rooms[targetRoom].users[toId(user)] || user;
			return Tools.equalOrHigherRank(userIdent, rank);
		}
		return Tools.equalOrHigherRank(user, rank);
	};
	Context.prototype.getRoom = function (targetRoom) {
		if (!Bot.rooms[targetRoom]) return null;
		var roomObj = {};
		roomObj.id = toRoomid(targetRoom);
		roomObj.type = Bot.rooms[targetRoom].type;
		roomObj.title = Bot.rooms[targetRoom].title;
		roomObj.users = this.getRoomUsers(targetRoom);
		return roomObj;
	};
	Context.prototype.getRoomUsers = function (targetRoom) {
		if (!Bot.rooms[targetRoom]) return null;
		var users = [];
		for (var i in Bot.rooms[targetRoom].users) {
			users.push(Bot.rooms[targetRoom].users[i]);
		}
		return users;
	};
	Context.prototype.getUser = function (user, targetRoom) {
		if (!Bot.rooms[targetRoom]) return null;
		user = toId(user);
		if (!(user in Bot.rooms[targetRoom].users)) return null;
		return {
			room: targetRoom,
			ident: Bot.rooms[targetRoom].users[user],
			id: toId(Bot.rooms[targetRoom].users[user]),
			name: Bot.rooms[targetRoom].users[user].substr(1),
			rank: Bot.rooms[targetRoom].users[user].charAt(0)
		};
	};
	Context.prototype.trad = Context.prototype.tra = function (data) {
		return Tools.translateCmd(this.handler, data, this.language);
	};
	Context.prototype.parse = function (data) {
		return exports.parse(this.room, this.by, data);
	};

	return Context;
})();

var parse = exports.parse = function (room, by, msg) {
	if (Config.ignoreRooms && Config.ignoreRooms[room]) return;
	if (!Tools.equalOrHigherRank(by, true)) {
		if (resourceMonitor.isLocked(by)) return;
	}
	if (msg.substr(0, 8) === '/invite ' && Tools.equalOrHigherRank(by, '%')) {
		Bot.say('', '/join ' +  msg.substr(8));
		return;
	}

	if (Settings.callParseFilters(room, by, msg)) return;

	var cmdToken = null;

	for (var i = 0; i < commandTokens.length; i++) {
		if (typeof commandTokens[i] === "string" && msg.substr(0, commandTokens[i].length) === commandTokens[i]) {
			cmdToken = commandTokens[i];
			break;
		}
	}

	if (!cmdToken) {
		if (room.charAt(0) === ',' && Config.pmhelp && resourceMonitor.counthelp(by)) Bot.pm(by, Config.pmhelp);
		return;
	}

	var toParse = msg.substr(cmdToken.length);
	var spaceIndex = toParse.indexOf(' ');

	var cmd, args;
	if (spaceIndex === -1) {
		cmd = toParse;
		args = '';
	} else {
		cmd = toParse.substr(0, spaceIndex);
		args = toParse.substr(spaceIndex + 1);
	}

	cmd = cmd.toLowerCase();

	if (!commands[cmd] && dynCommands[toId(cmd)]) {
		args = cmd;
		cmd = 'dyn';
	}

	if (commands[cmd]) {
		var handler = cmd;
		var loopBreaker = 0;
		while (typeof commands[handler] === 'string' && (loopBreaker++ < MAX_COMMAND_RECURSION)) {
			handler = commands[handler];
		}
		if (typeof commands[handler] === 'function') {
			var opts = {
				arg: args,
				by: by,
				room: room,
				cmd: cmd,
				handler: handler,
				cmdToken: cmdToken
			};
			var context = new Context(opts);
			try {
				if (!Tools.equalOrHigherRank(by, true)) {
					if (resourceMonitor.countcmd(by)) return;
				}
				cmdr(handler + ' | arg: ' + args + ' | by: ' + by + ' | room: ' + room + ' | cmd: ' + cmd);
				commands[handler].call(context, args, by, room, cmd);
			} catch (e) {
				errlog(e.stack);
				error("Command crash: " + cmd + ' | by: ' + by + ' | room: ' + room + ' | ' + sys.inspect(e));
				Bot.say(room, 'The command crashed: ' + sys.inspect(e).toString().split('\n').join(' '));
			}
		} else {
			error("unkwown command type: " + cmd + ' = ' + sys.inspect(commands[handler]));
		}
	}
};

/*
	Command parser for Pokemon Showdown Bot
*/

const dynCommandsDataFile = './data/commands.json';
const MAX_COMMAND_RECURSION = 10;
const MAX_CMD_FLOOD = 30;
const FLOOD_INTERVAL = 45 * 1000;

var commands = exports.commands = {};
var dynCommands = exports.dynCommands = {};
var tempVar = exports.tempVar = '';

/* Resource Monitor */

var resourceMonitor = exports.resourceMonitor = {
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
	commandTokens = [];
	if (Config.commandTokens && Config.commandTokens.length) {
		for (var i = 0; i < Config.commandTokens.length; i++)
			commandTokens.push(Config.commandTokens[i]);
	}
	if (typeof Config.commandChar === "string") commandTokens.push(Config.commandChar);
	if (!commandTokens.length) {
		error('No command Tokens, using "." by default');
		commandTokens = ['.'];
	}
};

reloadTokens();

var parse = exports.parse = function (room, by, msg) {
	if (!Tools.equalOrHigherRank(by, true)) {
		if (resourceMonitor.isLocked(by)) return;
	}
	if (msg.substr(0, 8) === '/invite ' && Tools.equalOrHigherRank(by, '%')) {
		Bot.say('', '/join ' +  msg.substr(8));
		return;
	}

	var cmdToken = null;

	for (var i = 0; i < commandTokens.length; i++) {
		if (typeof commandTokens[i] === "string" && msg.substr(0, commandTokens[i].length) === commandTokens[i]) {
			cmdToken = commandTokens[i];
			break;
		}
	}

	if (!cmdToken) return;

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
			var context = {
				/* Basic information */
				arg: args,
				by: by,
				room: room,
				cmd: cmd,
				handler: handler,
				cmdToken: cmdToken,
				roomType:(room.charAt(0) === ',') ? 'pm' : (Bot.rooms[room] ? Bot.rooms[room].type : 'chat'),
				botName: Bot.status.nickName,

				/* Reply functions */
				reply: function (data) {
					Bot.say(room, data);
				},
				pmReply: function (data) {
					Bot.pm(by, data);
				},
				restrictReply: function (data, perm) {
					if (!this.can(perm)) {
						this.pmReply(data);
					} else {
						this.reply(data);
					}
				},
				say: function (targetRoom, data) {
					Bot.say(targetRoom, data);
				},

				/* Persmission functions */
				isRanked: function (rank) {
					return Tools.equalOrHigherRank(by, rank);
				},
				isRoomRanked: function (targetRoom, rank) {
					if (Bot.rooms && Bot.rooms[targetRoom] && Bot.rooms[targetRoom].users) {
						var userIdent = Bot.rooms[targetRoom].users[toId(by)] || by;
						return Tools.equalOrHigherRank(userIdent, rank);
					}
					return this.isRanked(rank);
				},
				isExcepted: Tools.equalOrHigherRank(by, true),
				can: function (permission) {
					if (this.roomType === 'battle') return Settings.userCan('battle-', by, permission);
					else return Settings.userCan(room, by, permission);
				},
				canSet: function (permission, rank) {
					var rankSet;
					if (!Settings.settings['commands'] || !Settings.settings['commands'][room] || typeof Settings.settings['commands'][room][permission] === "undefined") {
						rankSet = Config.defaultPermission;
						if (Config.permissionExceptions[permission]) rankSet = Config.permissionExceptions[permission];
					} else {
						rankSet = Settings.settings['commands'][room][permission];
					}
					if (Tools.equalOrHigherRank(by, rankSet) && Tools.equalOrHigherRank(by, rank)) return true;
					return false;
				},
				botRanked: function (rank) {
					if (!Bot.rooms[room]) return false;
					var ident = Bot.rooms[room].users[toId(Bot.status.nickName)];
					if (ident) return Tools.equalOrHigherRank(ident, rank);
					return false;
				},
				hasRank: function (user, rank, targetRoom) {
					if (!targetRoom) targetRoom = room;
					if (Bot.rooms && Bot.rooms[targetRoom] && Bot.rooms[targetRoom].users) {
						var userIdent = Bot.rooms[targetRoom].users[toId(user)] || user;
						return Tools.equalOrHigherRank(userIdent, rank);
					}
					return Tools.equalOrHigherRank(user, rank);
				},

				/* Rooms and users */
				getRoomUsers: function (targetRoom) {
					if (!Bot.rooms[targetRoom]) return null;
					return Bot.rooms[room].users;
				},
				getUser: function (user, targetRoom) {
					if (!Bot.rooms[targetRoom]) return null;
					user = toId(user);
					if (!(user in Bot.rooms[room].users)) return null;
					return Bot.rooms[room].users[user];
				},

				/* System functions */
				trad: function (data) {
					var lang = Config.language || 'english';
					if (this.roomType === 'chat' && Settings.settings['language'] && Settings.settings['language'][room]) lang = Settings.settings['language'][room];
					return Tools.translateCmd(handler, data, lang);
				},
				parse: function (data) {
					return exports.parse(room, by, data);
				}
			};
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

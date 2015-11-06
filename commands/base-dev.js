/*
	Development Commands
*/

exports.commands = {
	"eval": 'js',
	js: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		try {
			var result = eval(arg.trim());
			this.say(room, '``' + JSON.stringify(result) + '``');
		} catch (e) {
			this.say(room, e.name + ": " + e.message);
		}
	},

	send: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		this.send(arg);
	},

	unignore: 'ignore',
	ignore: function (arg, by, room, cmd) {
		if (!this.isExcepted || !arg) return false;
		if (cmd.substr(0, 2) === 'un') {
			if (CommandParser.resourceMonitor.isLocked(arg)) {
				CommandParser.resourceMonitor.unlock(arg);
				this.reply('User ' + arg + ' is no longer ignored');
			} else {
				this.reply('User ' + arg + ' is not ignored');
			}
		} else {
			if (!CommandParser.resourceMonitor.isLocked(arg)) {
				CommandParser.resourceMonitor.lock(arg);
				this.reply('User ' + arg + ' has been ignored by CommandParser');
			} else {
				this.reply('User ' + arg + ' is already ignored');
			}
		}
	},

	sleep: function (arg, by, room) {
		if (!this.isExcepted) return false;
		var roomObj = this.getRoom(toRoomid(arg) || room);
		if (!roomObj) {
			if (!arg) return this.pmReply("Usage: " + this.cmdToken + this.cmd + " [room]");
			return this.pmReply("Room \"" + arg + "\" not found");
		}
		if (Settings.sleepRoom(roomObj.id)) this.pmReply("Status for room <<" + roomObj.id + ">> is now ``Sleeping``");
		else this.pmReply("The <<" + roomObj.id + ">> room status was already ``Sleeping``");
	},

	wake: 'unsleep',
	unsleep: function (arg, by, room) {
		if (!this.isExcepted) return false;
		var roomObj = this.getRoom(toRoomid(arg) || room);
		if (!roomObj) {
			if (!arg) return this.pmReply("Usage: " + this.cmdToken + this.cmd + " [room]");
			return this.pmReply("Room \"" + arg + "\" not found");
		}
		if (Settings.unsleepRoom(roomObj.id)) this.pmReply("Status for room <<" + roomObj.id + ">> is now ``Ready``");
		else this.pmReply("The <<" + roomObj.id + ">> room status was already ``Ready``");
	},

	roomstatus: 'status',
	status: function (arg, by, room) {
		if (!this.isExcepted) return false;
		if (this.cmd === "roomstatus") {
			if (room.charAt(0) !== ',') arg = arg || room;
			else if (!arg) return this.pmReply("Usage: " + this.cmdToken + this.cmd + " [room]");
		}
		if (!arg) {
			var rooms = "", roomArr = [];
			for (var i in Bot.rooms) {
				var botIdent = Bot.rooms[i].users[toId(Bot.status.nickName)] || " ";
				roomArr.push("<<" + i + ">> (" + Bot.rooms[i].type.charAt(0).toLowerCase() + (Settings.isSleeping(i) ? "s" : "r") + (botIdent.charAt(0) !== " " ? botIdent.charAt(0) : "u") + (Config.privateRooms[i] ? "h" : "p") + ")");
			}
			if (roomArr.length) rooms = roomArr.join(', ');
			return this.pmReply(this.splitReply("**Bot status** | Username: ``" + Bot.status.nickName + "`` | Rooms: " + (rooms || "(none)")));
		}
		var tarRoom = toRoomid(arg);
		var roomObj = this.getRoom(tarRoom);
		if (!roomObj) return this.pmReply("Room \"" + tarRoom + "\" not found");
		var sleep = Settings.isSleeping(tarRoom) ? "Sleeping" : "Ready";
		var botIdent = Bot.rooms[roomObj.id].users[toId(Bot.status.nickName)] || " ";
		this.pmReply("**" + roomObj.title + "** <<" + roomObj.id + ">> | Type: ``" + roomObj.type + "``" + (Config.privateRooms[roomObj.id] ? " (Hidden)" : "") + " | Users: ``" + roomObj.users.length + "`` | Bot group: ``" + (botIdent.charAt(0) !== " " ? botIdent.charAt(0) : "(regular user)") + "`` | Status: ``" + sleep + "``");
	},

	hotpatch: 'reload',
	reload: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		var args = arg.split(",");
		var opt = toId(args[0]);
		switch (opt) {
			case '':
			case 'commands':
				var res = CommandParser.loadCommands(true) || [];
				if (!res.length) return this.reply('Commands hotpatched');
				return this.reply('Some command files crashed: ' + res.join(", "));
			case 'features':
				var errs = reloadFeatures() || [];
				if (!errs.length) return this.reply('Features hotpatched');
				return this.reply('Some features crashed: ' + errs.join(", "));
			case 'feature':
				if (!args[1]) return this.reply("You must specify a feature");
				args[1] = args[1].trim();
				var e = Tools.reloadFeature(args[1]);
				if (e) {
					if (e === -1) {
						return this.reply("Error: Feature " + args[1] + " not found");
					} else {
						errlog(e.stack);
						return this.reply("Error: Feature " + args[1] + " crashed");
					}
				} else {
					return this.reply("Feature: " + args[1] + " hotpatched");
				}
				break;
			case 'commandparser':
			case 'parser':
				try {
					Tools.uncacheTree('./command-parser.js');
					global.CommandParser = require('./../command-parser.js');
					this.reply('command-parser.js reloaded');
					info('command-parser.js reloaded');
					CommandParser.loadCommands(true);
				} catch (e) {
					errlog(e.stack);
					this.reply('Error: command-parser.js has errors');
				}
				break;
			case 'tools':
				try {
					Tools.uncacheTree('./tools.js');
					global.Tools = require('./../tools.js');
					this.reply('tools.js reloaded');
					info('tools.js reloaded');
					Tools.loadTranslations(true);
				} catch (e) {
					errlog(e.stack);
					this.reply('Error: tools.js has errors');
				}
				break;
			case 'data':
				DataDownloader.download();
				this.reply('Data files reloaded');
				break;
			case 'config':
				reloadConfig();
				this.reply('config.js reloaded');
				info('config.js reloaded');
				break;
			case 'lang':
			case 'languages':
				var errs = Tools.loadTranslations(true) || [];
				if (!errs.length) return this.reply('Languages hotpatched');
				this.reply('Some languages crashed: ' + errs.join(", "));
				break;
			default:
				 this.reply('Valid arguments are: commands, feature, features, parser, tools, data, config, languages');
		}
	},

	updatebranch: 'updategit',
	updategit: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;

		if (global.updateGitLock) {
			return this.reply("There is currently another update in progress");
		}

		global.updateGitLock = true;

		var self = this;
		var exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', function (error) {
			var cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash && ' + cmd + ' && git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					self.reply("Error:" + error);
					global.updateServerLock = false;
					return;
				}
			}
			var entry = "Running `" + cmd + "`";
			self.reply(entry);
			exec(cmd, function (error, stdout, stderr) {
				("" + stdout + stderr).split("\n").forEach(function (s) {
					self.reply(s);
				});
				global.updateGitLock = false;
			});
		});
	},

	exit: 'kill',
	kill: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		console.log('Forced Exit. By: ' + by);
		process.exit();
	}
};

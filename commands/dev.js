/*
	Development Commands
*/

exports.commands = {
	"eval": 'js',
	js: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		try {
			var result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		} catch (e) {
			this.say(room, e.name + ": " + e.message);
		}
	},

	c: 'custom',
	custom: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var tarRoom;
		if (arg.indexOf('[') === 0 && arg.indexOf(']') > -1) {
			tarRoom = arg.slice(1, arg.indexOf(']'));
			arg = arg.substr(arg.indexOf(']') + 1).trim();
		}
		this.say(tarRoom || room, arg);
	},

	joinallrooms: 'joinall',
	joinrooms: 'joinall',
	joinall: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var target = 'all';
		arg = toId(arg);
		if (arg.length || cmd === 'joinrooms') {
			if (arg === 'official') target = 'official';
			else if (arg === 'public') target = 'public';
			else if (arg === 'all') target = 'all';
			else return this.reply('Usage: ' + this.cmdToken + cmd + ' [official/public/all]');
		}
		Bot.on('queryresponse', function (data) {
			data = data.split('|');
			if (data[0] === 'rooms') {
				data.splice(0, 1);
				var str = data.join('|');
				var cmds = [];
				try {
					var rooms = JSON.parse(str);
					var offRooms = [], publicRooms = [];
					if (rooms.official) {
						for (var i = 0; i < rooms.official.length; i++) {
							if (rooms.official[i].title) offRooms.push(toId(rooms.official[i].title));
						}
					}
					if (rooms.chat) {
						for (var i = 0; i < rooms.chat.length; i++) {
							if (rooms.chat[i].title) publicRooms.push(toId(rooms.chat[i].title));
						}
					}
					if (target === 'all' || target === 'official') {
						for (var i = 0; i < offRooms.length; i++) cmds.push('|/join ' + offRooms[i]);
					}
					if (target === 'all' || target === 'public') {
						for (var i = 0; i < publicRooms.length; i++) cmds.push('|/join ' + publicRooms[i]);
					}
				} catch (e) {}
				Bot.send(cmds, 2000);
				Bot.on('queryresponse', function () {return;});
			}
		});
		Bot.send('|/cmd rooms');
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

	hotpatch: 'reload',
	reload: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		arg = toId(arg);
		switch (arg) {
			case '':
			case 'commands':
				var res = CommandParser.loadCommands(true) || [];
				if (!res.length) return this.reply('Commands hotpatched');
				return this.reply('Some command files crashed: ' + res.join(", "));
			case 'features':
				var errs = reloadFeatures() || [];
				if (!errs.length) return this.reply('Features hotpatched');
				return this.reply('Some features crashed: ' + errs.join(", "));
			case 'commandparser':
			case 'parser':
				try {
					Tools.uncacheTree('./command-parser.js');
					global.CommandParser = require('./../command-parser.js');
					this.reply('command-parser.js hotpatched');
				} catch (e) {
					this.reply('Error: command-parser.js has syntax errors');
				}
				break;
			case 'tools':
				try {
					Tools.uncacheTree('./tools.js');
					global.Tools = require('./../tools.js');
					this.reply('tools.js hotpatched');
				} catch (e) {
					this.reply('Error: tools.js has syntax errors');
				}
				break;
			case 'data':
				DataDownloader.download();
				this.reply('Data files reloaded');
				break;
			case 'config':
				reloadConfig();
				this.reply('config.js reloaded');
				break;
			case 'lang':
			case 'languages':
				var errs = Tools.loadTranslations(true) || [];
				if (!errs.length) return this.reply('Languages hotpatched');
				this.reply('Some languages crashed: ' + errs.join(", "));
				break;
			default:
				 this.reply('Valid arguments are: commands, features, parser, tools, data, config, languages');
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

	end: 'kill',
	exit: 'kill',
	kill: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		console.log('Forced Exit. By: ' + by);
		process.exit();
	}
};

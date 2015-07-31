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

	jsbattle: 'evalbattle',
	eb: 'evalbattle',
	evalbattle: function (arg, by, room, cmd) {
		if (!this.isExcepted) return false;
		var tarRoom = room;
		var tarObj = Tools.getTargetRoom(arg);
		if (tarObj) {
			arg = tarObj.arg;
			tarRoom = tarObj.room;
		}
		if (!Features['battle'] || !Features['battle'].BattleBot || !Features['battle'].BattleBot.data) return false;
		if (!Features['battle'].BattleBot.data[tarRoom]) return this.reply('Battle "' + tarRoom + '" not found');
		var battleContext = {
			id: tarRoom,
			room: room,
			data: Features['battle'].BattleBot.data[tarRoom],
			request: Features['battle'].BattleBot.data[tarRoom].request,
			status: Features['battle'].BattleBot.data[tarRoom].statusData,
			opponentTeamData: Features['battle'].BattleBot.data[tarRoom].oppTeamOffSet,
			opponentTeam: Features['battle'].BattleBot.data[tarRoom].oppTeam,
			system: Features['battle'].BattleBot,
			sendBattle: function (data) {
				return Bot.say(this.id, data);
			},
			report: function (data) {
				Bot.say(this.room, data);
				return '';
			},
			manual: function (flag) {
				if (flag === undefined) flag = true;
				this.data['manual'] = flag;
				if (flag) this.sendBattle('/undo');
				return this.data['manual'];
			},
			timer: function (flag) {
				if (flag === undefined) flag = true;
				if (flag) this.sendBattle('/timer on');
				else this.sendBattle('/timer off');
				return !!flag;
			},
			decision: function (decision) {
				var rqid = 0;
				if (this.request) rqid = parseInt(this.request.rqid);
				if (decision.length === undefined) decision = [decision];
				return this.system.sendDecision(this.id, decision, rqid);
			},
			moves: function (num) {
				if (!num) num = 0;
				if (!this.request.active || !this.request.active[num] || !this.request.active[num].moves) return [];
				var poke = this.request.active[num];
				var moves = [];
				for (var i in poke.moves) {
					moves.push(poke.moves[i].move);
				}
				return moves;
			},
			pokemon: function () {
				var pokes = [];
				if (this.request && this.request.side && this.request.side.pokemon) {
					var poke;
					for (var i = 0; i < this.request.side.pokemon.length; i++) {
						if (this.request.side.pokemon[i].details.indexOf(",") > -1) poke = this.request.side.pokemon[i].details.substr(0, this.request.side.pokemon[i].details.indexOf(","));
						else poke = this.request.side.pokemon[i].details;
						pokes.push(poke);
					}
				}
				return pokes;
			},
			move: function (move, mega, target, poke) {
				if (typeof move === 'string') {
					var moves = this.moves(poke || 0);
					for (var i = 0; i < moves.length; i++) moves[i] = toId(moves[i]);
					return {type: 'move', move: (moves.indexOf(toId(move)) + 1), mega: mega, target: target};
				} else {
					return {type: 'move', move: parseInt(move), mega: mega, target: target};
				}
			},
			"switch": function (pokemon) {
				var side = this.pokemon();
				for (var i = 0; i < side.length; i++) side[i] = toId(side[i]);
				if (typeof pokemon === "string" && side.indexOf(toId(pokemon)) >= 0) {
					return {type: 'switch', switchIn: (side.indexOf(toId(pokemon)) + 1)};
				} else {
					return {type: 'switch', switchIn: parseInt(pokemon)};
				}
			},
			pass: function () {
				return {type: 'pass'};
			},
			team: function (team) {
				return {type: 'team', team: team};
			},
			random: function () {
				return this.system.getRandomMove(this.id);
			},
			cancel: function () {
				this.sendBattle('/undo');
				return true;
			},
			forfeit: function () {
				this.sendBattle('/forfeit');
				return '';
			}
		};
		var evalFunction = function (txt) {
			try {
				var battle = this;

				/* Fast access methods - decisions */
				var choose = this.decision.bind(this);
				var move = this.move.bind(this);
				var sw = this.switch.bind(this);
				var pass = this.pass.bind(this);
				var team = this.team.bind(this);
				var cancel = this.cancel.bind(this);

				/* Eval */
				var result = eval(txt.trim());
				if (result !== '') Bot.say(room, '``' + JSON.stringify(result) + '``');
			} catch (e) {
				Bot.say(room, e.name + ": " + e.message);
			}
		};
		evalFunction.call(battleContext, arg);
	},

	send: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		Bot.send(arg);
	},

	c: 'custom',
	custom: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var tarRoom;
		if (arg.indexOf('[') === 0 && arg.indexOf(']') > -1) {
			tarRoom = toRoomid(arg.slice(1, arg.indexOf(']')));
			arg = arg.substr(arg.indexOf(']') + 1).trim();
		}
		this.say(tarRoom || room, arg);
	},

	"join": function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (!arg) return;
		arg = arg.split(',');
		var cmds = [];
		for (var i = 0; i < arg.length; i++) {
			cmds.push('|/join ' + arg[i]);
		}
		Bot.send(cmds, 2000);
	},

	leave: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (!arg) {
			if (this.roomType !== 'pm') this.reply('/leave');
			return;
		}
		arg = arg.split(',');
		var cmds = [];
		for (var i = 0; i < arg.length; i++) {
			cmds.push(toId(arg[i]) + '|/leave');
		}
		Bot.send(cmds, 2000);
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
	},

	reloadroomauth: 'getroomauth',
	useroomauth: 'getroomauth',
	getroomauth: function (arg, user, room, cmd) {
		if (!this.isExcepted) return false;
		var tarRoom = toRoomid(arg) || room;
		if (!Features['autoinvite']) return false;
		if (!Bot.rooms || !Bot.rooms[tarRoom]) return false;
		if (cmd === 'reloadroomauth') {
			Features['autoinvite'].roomAuthChanges[tarRoom] = 1;
			Features['autoinvite'].checkAuth();
			this.reply('Room auth from room __' + tarRoom + '__ has been reloaded');
		} else if (cmd === 'getroomauth') {
			if (!Features['autoinvite'].roomAuth[tarRoom]) return this.reply('Room auth for room __' + tarRoom + '__ is empty. Try ' + this.cmdToken + 'reloadroomauth');
			Tools.uploadToHastebin('Room auth (' + tarRoom + ')\n\n' + JSON.stringify(Features['autoinvite'].roomAuth[tarRoom]), function (r, link) {
				if (r) return this.reply('Room auth of __' + tarRoom + '__: ' + link);
				else this.reply('Error connecting to hastebin');
			}.bind(this));
		} else if (cmd === 'useroomauth') {
			if (!Features['autoinvite'].roomAuth[tarRoom]) return this.reply('Room auth for room __' + tarRoom + '__ is empty. Try ' + this.cmdToken + 'reloadroomauth');
			var auth = Features['autoinvite'].roomAuth[tarRoom];
			for (var i in auth) {
				if (Tools.equalOrHigherRank(i, '&')) continue; //Global auth and excepted users
				Config.exceptions[i] = auth[i];
			}
			monitor('Auth exceptions changed temporarily\n' + JSON.stringify(Config.exceptions));
			this.reply('Using room auth of room __' + tarRoom + '__ as global auth. Use ' + this.cmdToken + 'reload config to revert it.');
		}
	}
};

/*
	Tournaments Commands
*/

Settings.addPermissions(['tournament', 'rank', 'official']);

function tryGetRoomName (room) {
	if (!Bot.rooms[room]) return room;
	return Bot.rooms[room].title;
}

exports.commands = {
	tourhelp: function (arg, by, room, cmd) {
		this.restrictReply('Usage: ' + this.cmdToken + this.trad('h'), 'tournament');
	},

	tourstart: 'tourend',
	tourend: function (arg, by, room, cmd) {
		if (this.roomType !== 'chat' || !this.can('tournament')) return;
		if (!Features['tours'].tourData[room]) return this.reply(this.trad('err'));
		if (cmd === 'tourstart' && Features['tours'].tourData[room].isStarted) return this.reply(this.trad('err2'));
		this.reply("/tournament " + (cmd === 'tourend' ? 'end' : 'start'));
	},

	maketour: 'tournament',
	newtour: 'tournament',
	tour: 'tournament',
	tournament: function (arg, by, room, cmd) {
		if (this.roomType !== 'chat' || !this.can('tournament')) return;
		if (Features['tours'].tourData[room]) {
			if (toId(arg) === 'end') return this.parse(this.cmdToken + 'tourend');
			if (toId(arg) === 'start') return this.parse(this.cmdToken + 'tourstart');
			return this.reply(this.trad('e2'));
		}
		var details = {
			format: 'ou',
			type: 'elimination',
			maxUsers: null,
			timeToStart: 30 * 1000,
			autodq: 1.5
		};
		if (typeof Config.tourDefault === 'object') {
			for (var i in Config.tourDefault) {
				details[i] = Config.tourDefault[i];
			}
		}
		if (arg && arg.length) {
			var args = arg.split(",");
			var params = {
				format: null,
				type: null,
				maxUsers: null,
				timeToStart: null,
				autodq: null,
				scout: null
			};
			var splArg;
			for (var i = 0; i < args.length; i++) {
				args[i] = args[i].trim();
				if (!args[i]) continue;
				splArg = args[i].split("=");
				if (splArg.length < 2) {
					switch (i) {
						case 0:
							params.format = args[i];
							break;
						case 1:
							params.timeToStart = args[i];
							break;
						case 2:
							params.autodq = args[i];
							break;
						case 3:
							params.maxUsers = args[i];
							break;
						case 4:
							params.type = args[i];
							break;
					}
				} else {
					var idArg = toId(splArg[0]);
					var valueArg = splArg[1].trim();
					switch (idArg) {
						case 'format':
						case 'tier':
							params.format = valueArg;
							break;
						case 'time':
						case 'singups':
						case 'timer':
							params.timeToStart = valueArg;
							break;
						case 'autodq':
						case 'dq':
							params.autodq = valueArg;
							break;
						case 'maxusers':
						case 'users':
							params.maxUsers = valueArg;
							break;
						case 'generator':
						case 'type':
							params.type = valueArg;
							break;
						case 'scouting':
						case 'scout':
						case 'setscout':
						case 'setscouting':
							params.scout = valueArg;
							break;
						default:
							return this.reply(this.trad('param') + ' ' + idArg + ' ' + this.trad('paramhelp') + ": tier, timer, dq, users, type, scout");
					}
				}
			}
			if (params.format) {
				var format = Tools.parseAliases(params.format);
				if (!Formats[format] || !Formats[format].chall) return this.reply(this.trad('e31') + ' ' + format + ' ' + this.trad('e32'));
				details.format = format;
			}
			if (params.timeToStart) {
				if (toId(params.timeToStart) === 'off') {
					details.timeToStart = null;
				} else {
					var time = parseInt(params.timeToStart);
					if (!time || time < 10) return this.reply(this.trad('e4'));
					details.timeToStart = time * 1000;
				}
			}
			if (params.autodq) {
				if (toId(params.autodq) === 'off') {
					details.autodq = false;
				} else {
					var dq = parseFloat(params.autodq);
					if (!dq || dq < 0) return this.reply(this.trad('e5'));
					details.autodq = dq;
				}
			}
			if (params.maxUsers) {
				if (toId(params.maxUsers) === 'off') {
					details.maxUsers = null;
				} else {
					var musers = parseInt(params.maxUsers);
					if (!musers || musers < 4) return this.reply(this.trad('e6'));
					details.maxUsers = musers;
				}
			}
			if (params.type) {
				var type = toId(params.type);
				if (type !== 'elimination' && type !== 'roundrobin') return this.reply(this.trad('e7'));
				details.type = type;
			}
			if (params.scout) {
				var scout = toId(params.scout);
				if (scout in {'yes': 1, 'on': 1, 'true': 1, 'allow': 1, 'allowed': 1})  details.scoutProtect = false;
				else details.scoutProtect = true;
			}
		}
		Features['tours'].newTour(room, details);
		setTimeout(function () {
			if (Features['tours'].tournaments[room] && !Features['tours'].tourData[room]) {
				Bot.say(room, this.trad('notstarted'));
				delete Features['tours'].tournaments[room];
			}
		}.bind(this), 2500);
	},

	unofficial: 'official',
	official: function (arg, by, room, cmd) {
		if (!this.can("official")) return;
		if (!Features['tours'].Leaderboards.isConfigured(room)) return this.reply(this.trad('not') + " " + room);
		if (!Features['tours'].tourData[room]) return this.reply(this.trad("notour"));
		if (cmd === "unofficial") {
			if (!Features['tours'].tourData[room].isOfficialTour) return this.reply(this.trad("already-not"));
			Features['tours'].tourData[room].isOfficialTour = false;
			this.reply(this.trad("unofficial"));
		} else {
			if (Features['tours'].tourData[room].isOfficialTour) return this.reply(this.trad("already"));
			Features['tours'].tourData[room].isOfficialTour = true;
			this.reply(this.trad("official"));
		}
	},

	rank: 'leaderboard',
	ranking: 'leaderboard',
	top: 'leaderboard',
	leaderboards: 'leaderboard',
	leaderboard: function (arg, by, room, cmd) {
		var args = arg.split(",");
		var opt = cmd;
		var tarRoom;
		if (cmd in {leaderboards: 1, leaderboard: 1}) {
			opt = toId(args.shift());
			cmd += " " + opt + ",";
		}
		switch (opt) {
			case "rank":
			case "ranking":
				tarRoom = room;
				if (this.roomType !== "chat") tarRoom = toRoomid(args.shift());
				if (args.length > 1) tarRoom = toRoomid(args.shift());
				if (!tarRoom) return this.restrictReply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room], [user]", "rank");
				if (!Features['tours'].Leaderboards.isConfigured(tarRoom)) return this.restrictReply(this.trad('not') + " " + tarRoom, "rank");
				var target = toId(args[0] || by);
				if (target.length > 18) return this.restrictReply(this.trad('invuser'));
				var rank = Features['tours'].Leaderboards.getPoints(tarRoom, target);
				var txt = this.trad('rank') + " **" + Tools.toName(rank.name) + "** " + this.trad('in') + " __" + Tools.toName(tryGetRoomName(tarRoom)) + "__ | ";
				txt += this.trad('points') + ": " + rank.points + " | ";
				txt += this.trad('w') + ": " + rank.wins + " " + this.trad('times') + ", " + this.trad('f') + ": " + rank.finals + " " + this.trad('times') + ", " + this.trad('sf') + ": " + rank.semis + " " + this.trad('times') + ". ";
				txt += this.trad('total') + ": " + rank.tours + " " + this.trad('tours') + ", " + rank.battles + " " + this.trad('bwon') + ".";
				this.restrictReply(txt, "rank");
				break;
			case "top":
				if (args.length > 0) tarRoom = toRoomid(args[0]);
				if (!tarRoom && this.roomType === "chat") tarRoom = room;
				if (!tarRoom) return this.restrictReply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room]", "rank");
				if (!Features['tours'].Leaderboards.isConfigured(tarRoom)) return this.restrictReply(this.trad('not') + " " + tarRoom, "rank");
				var top = Features['tours'].Leaderboards.getTop(tarRoom);
				if (!top || !top.length) return this.restrictReply(this.trad('empty') + " " + tarRoom, "rank");
				var topResults = [];
				for (var i = 0; i < 5 && i < top.length; i++) {
					topResults.push("__#" + (i + 1) + "__ **" + Tools.toName(top[i][0]) + "** (" + top[i][6] + ")");
				}
				this.restrictReply("**" + Tools.toName(tryGetRoomName(tarRoom)) + "** | " + topResults.join(", "), "rank");
				break;
			case "table":
				if (!this.isRanked('roomowner')) return false;
				if (args.length > 0) tarRoom = toRoomid(args[0]);
				if (!tarRoom && this.roomType === "chat") tarRoom = room;
				if (!tarRoom) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room]");
				if (!Features['tours'].Leaderboards.isConfigured(tarRoom)) return this.reply(this.trad('not') + " " + tarRoom);
				var size = args[1] ? parseInt(args[1]) : 100;
				if (!size || size < 0) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room], [size]");
				var table = Features['tours'].Leaderboards.getTable(tarRoom, size);
				if (!table) return this.reply(this.trad('empty') + " " + tarRoom);
				Tools.uploadToHastebin(table, function (r, link) {
					if (r) return this.pmReply(this.trad('table') + " ("  + tarRoom + '): ' + link);
					else this.pmReply(this.trad('err'));
				}.bind(this));
				break;
			case "reset":
				if (!this.isExcepted) return false;
				if (args.length < 1 || !toId(args[0])) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room]");
				tarRoom = toRoomid(args[0]);
				var code = Features['tours'].Leaderboards.getResetHashCode(tarRoom);
				if (!code) return this.reply(this.trad('empty') + " " + tarRoom);
				this.reply(this.trad('use') + " ``" + this.cmdToken + this.handler + " confirmreset, " + code + "`` " + this.trad('confirm') + " " + room);
				break;
			case "confirmreset":
				if (!this.isExcepted) return false;
				if (args.length < 1 || !toId(args[0])) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [hashcode]");
				var _code = args[0].trim();
				var r =  Features['tours'].Leaderboards.execResetHashCode(_code);
				if (!r) return this.reply(this.trad('invhash'));
				this.sclog();
				this.reply(this.trad('data') + " __" + r + "__ " + this.trad('del'));
				break;
			case "viewconfig":
				if (!this.isExcepted) return false;
				if (args.length < 1 || !toId(args[0])) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room]");
				tarRoom = toRoomid(args[0]);
				var rConf = Features['tours'].Leaderboards.getConfig(tarRoom);
				if (Config.leaderboards && Config.leaderboards[tarRoom]) {
					this.reply("Room: " + tarRoom + " | ``config.js`` - static | " +
							   "W: " + rConf.winnerPoints + ", F: " + rConf.finalistPoints +
							   ", SF: " + rConf.semiFinalistPoints + ", B: " + rConf.battlePoints +
							   (rConf.onlyOfficial ? " | Only official tours" : ""));
				} else if (Settings.settings.leaderboards && Settings.settings.leaderboards[tarRoom]) {
					this.reply("Room: " + tarRoom + " | " +
							   "W: " + rConf.winnerPoints + ", F: " + rConf.finalistPoints +
							   ", SF: " + rConf.semiFinalistPoints + ", B: " + rConf.battlePoints +
							   (rConf.onlyOfficial ? " | Only official tours" : ""));
				} else {
					this.reply(this.trad('not') + " " + tarRoom);
				}
				break;
			case "setconfig":
				if (!this.isExcepted) return false;
				if (!Settings.settings.leaderboards) Settings.settings.leaderboards = {};
				if (args.length < 2 || !toId(args[0])) return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room], [on/off], [W], [F], [SF], [B], [official/all]");
				if (args[6] && toId(args[6]) !== "official" && toId(args[6]) !== "all") return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room], [on/off], [W], [F], [SF], [B], [official/all]");
				tarRoom = toRoomid(args[0]);
				var enabled = toId(args[1]);
				var rConfAux = Features['tours'].Leaderboards.getConfig(tarRoom);
				if (enabled in {on: 1, enabled: 1}) {
					if (args[2]) rConfAux.winnerPoints = parseInt(args[2]);
					if (args[3]) rConfAux.finalistPoints = parseInt(args[3]);
					if (args[4]) rConfAux.semiFinalistPoints = parseInt(args[4]);
					if (args[5]) rConfAux.battlePoints = parseInt(args[5]);
					if (args[6]) {
						switch (toId(args[6])) {
							case "official":
								rConfAux.onlyOfficial = true;
								break;
							case "all":
								rConfAux.onlyOfficial = false;
								break;
						}
					}
					this.sclog();
					Settings.settings.leaderboards[tarRoom] = rConfAux;
					Settings.save();
					this.reply(this.trad('wasset') + " " + tarRoom);
				} else if (enabled in {off: 1, disabled: 1}) {
					if (Settings.settings.leaderboards && Settings.settings.leaderboards[tarRoom]) {
						this.sclog();
						delete Settings.settings.leaderboards[tarRoom];
						Settings.save();
						this.reply(this.trad('wasdisabled') + " " + tarRoom);
					} else {
						this.reply(this.trad('alrdisabled') + " " + tarRoom);
					}
				} else {
					return this.reply(this.trad('usage') + ": " + this.cmdToken + cmd + " [room], [on/off], [W], [F], [SF], [B], [official/all]");
				}
				break;
			default:
				this.restrictReply(this.trad('unknown') + ". " + this.trad('usage') + ": " + this.cmdToken + this.handler + " [rank/top/table/reset/setconfig/viewconfig]", "rank");
		}
	}
};

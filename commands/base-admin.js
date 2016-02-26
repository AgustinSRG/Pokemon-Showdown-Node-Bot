/*
	Admin Commands
*/

exports.commands = {
	c: 'custom',
	custom: function (arg, by, room, cmd) {
		if (!this.isRanked('admin')) return false;
		var tarRoom;
		if (arg.indexOf('[') === 0 && arg.indexOf(']') > -1) {
			tarRoom = toRoomid(arg.slice(1, arg.indexOf(']')));
			arg = arg.substr(arg.indexOf(']') + 1).trim();
		}
		this.sclog();
		this.say(tarRoom || room, arg);
	},

	sendpm: 'pm',
	pm: function (arg, by, room, cmd) {
		if (!this.isRanked('admin')) return false;
		var args = arg.split(",");
		if (args.length < 2) return this.reply("Usage: " + this.cmdToken + cmd + " [user], [message]");
		var targetUser = toId(args.shift());
		var msg = args.join(",").trim();
		if (!targetUser || !msg) return this.reply("Usage: " + this.cmdToken + cmd + " [user], [message]");
		this.sclog();
		this.sendPM(targetUser, msg);
	},

	"join": function (arg, by, room, cmd) {
		if (!this.isRanked('admin')) return false;
		if (!arg) return;
		arg = arg.split(',');
		var cmds = [];
		for (var i = 0; i < arg.length; i++) {
			cmds.push('|/join ' + arg[i]);
		}
		this.sclog();
		this.send(cmds);
	},

	leave: function (arg, by, room, cmd) {
		if (!this.isRanked('admin')) return false;
		if (!arg) {
			if (this.roomType !== 'pm') this.reply('/leave');
			this.sclog();
			return;
		}
		arg = arg.split(',');
		var cmds = [];
		for (var i = 0; i < arg.length; i++) {
			cmds.push(toId(arg[i]) + '|/leave');
		}
		this.sclog();
		this.send(cmds);
	},

	joinallrooms: 'joinall',
	joinrooms: 'joinall',
	joinall: function (arg, by, room, cmd) {
		if (!this.isRanked('admin')) return false;
		var target = 'all';
		arg = toId(arg);
		if (arg.length || cmd === 'joinrooms') {
			if (arg === 'official') target = 'official';
			else if (arg === 'public') target = 'public';
			else if (arg === 'all') target = 'all';
			else return this.reply('Usage: ' + this.cmdToken + cmd + ' [official/public/all]');
		}
		var qParser = function (data) {
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
				Bot.removeListener('queryresponse', qParser);
			}
		};
		Bot.on('queryresponse', qParser);
		this.sclog();
		Bot.send('|/cmd rooms');
	},

	lang: 'language',
	language: function (arg, by, room, cmd) {
		if (!this.isRanked('roomowner')) return false;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		var lang = toId(arg);
		if (!lang.length) return this.reply(this.trad('nolang') + ". " + this.trad('v') + ': ' + Object.keys(Tools.translations).join(', '));
		if (!Tools.translations[lang]) return this.reply(this.trad('v') + ': ' + Object.keys(Tools.translations).join(', '));
		if (!Settings.settings['language']) Settings.settings['language'] = {};
		Settings.settings['language'][tarRoom] = lang;
		Settings.save();
		this.sclog();
		this.language = lang;
		this.reply(this.trad('l') + textHelper);
	},

	settings: 'set',
	set: function (arg, by, room, cmd) {
		if (!this.isRanked('roomowner')) return false;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		var args = arg.split(",");
		if (args.length < 2) return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
		var perm = toId(args[0]);
		var rank = args[1].trim();
		if (!(perm in Settings.permissions)) {
			return this.reply(this.trad('ps') + ": " + Object.keys(Settings.permissions).sort().join(", "));
		}
		if (rank in {'off': 1, 'disable': 1}) {
			if (!this.canSet(perm, true)) return this.reply(this.trad('denied'));
			Settings.setPermission(tarRoom, perm, true);
			Settings.save();
			this.sclog();
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('d') + textHelper);
		}
		if (rank in {'on': 1, 'all': 1, 'enable': 1}) {
			if (!this.canSet(perm, ' ')) return this.reply(this.trad('denied'));
			Settings.setPermission(tarRoom, perm, ' ');
			Settings.save();
			this.sclog();
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('a') + textHelper);
		}
		if (Config.ranks.indexOf(rank) >= 0) {
			if (!this.canSet(perm, rank)) return this.reply(this.trad('denied'));
			Settings.setPermission(tarRoom, perm, rank);
			Settings.save();
			this.sclog();
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('r') + ' ' + rank + " " + this.trad('r2') + textHelper);
		} else {
			return this.reply(this.trad('not1') + " " + rank + " " + this.trad('not2'));
		}
	},

	battlepermissions: 'battleset',
	battlesettings: 'battleset',
	battleset: function (arg, by, room, cmd) {
		if (!this.isRanked('admin')) return false;
		var args = arg.split(",");
		if (args.length < 2) return this.reply(this.trad('u1') + ": " + this.cmdToken + cmd + " " + this.trad('u2'));
		var perm = toId(args[0]);
		var rank = args[1].trim();
		if (!(perm in Settings.permissions)) {
			return this.reply(this.trad('ps') + ": " + Object.keys(Settings.permissions).sort().join(", "));
		}
		if (rank in {'off': 1, 'disable': 1}) {
			Settings.setPermission('battle-', perm, true);
			Settings.save();
			this.sclog();
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('d'));
		}
		if (rank in {'on': 1, 'all': 1, 'enable': 1}) {
			Settings.setPermission('battle-', perm, ' ');
			Settings.save();
			this.sclog();
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('a'));
		}
		if (Config.ranks.indexOf(rank) >= 0) {
			Settings.setPermission('battle-', perm, rank);
			Settings.save();
			this.sclog();
			return this.reply(this.trad('p') + " **" + perm + "** " + this.trad('r') + ' ' + rank + " " + this.trad('r2'));
		} else {
			return this.reply(this.trad('not1') + " " + rank + " " + this.trad('not2'));
		}
	}
};

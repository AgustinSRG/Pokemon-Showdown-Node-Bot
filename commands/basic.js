/*
	Basic Commands
*/

function setPermission(room, perm, rank) {
	if (!Settings.settings.rooms) Settings.settings.rooms = {};
	if (!Settings.settings.rooms[room]) Settings.settings.rooms[room] = {};
	if (!Settings.settings.rooms[room]['cmds']) Settings.settings.rooms[room]['cmds'] = {};
	Settings.settings.rooms[room]['cmds'][perm] = rank;
	Settings.save();
}

Settings.addPermissions(['say', 'pick']);

exports.commands = {
	
	about: 'bot',
	bot: function (arg, by, room, cmd) {
		var text = "I'm a **Pokemon Showdown Bot** written in JavaScript for Node. By: Ecuacion (https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot)";
		if (!this.isRanked('#')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},
	
	bottime: 'time',
	time: function(arg, by, room, cmd) {
		var f = new Date();
		var text = "**Bot Time:** " + addLeftZero(f.getHours(), 2) + ":" + addLeftZero(f.getMinutes(), 2) + ":" + addLeftZero(f.getSeconds(), 2);
		if (!this.isRanked('#')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},
	
	uptime: function (arg, by, room, cmd) {
		var text = '';
		text += '**Uptime:** ';
		var divisors = [52, 7, 24, 60, 60];
		var units = ['week', 'day', 'hour', 'minute', 'second'];
		var buffer = [];
		var uptime = ~~(process.uptime());
		do {
			var divisor = divisors.pop();
			var unit = uptime % divisor;
			buffer.push(unit > 1 ? unit + ' ' + units.pop() + 's' : unit + ' ' + units.pop());
			uptime = ~~(uptime / divisor);
		} while (uptime);

		switch (buffer.length) {
		case 5:
			text += buffer[4] + ', ';
		case 4:
			text += buffer[3] + ', ';
		case 3:
			text += buffer[2] + ', ' + buffer[1] + ', and ' + buffer[0];
			break;
		case 2:
			text += buffer[1] + ' and ' + buffer[0];
			break;
		case 1:
			text += buffer[0];
			break;
		}
		if (!this.isRanked('#')) {
			this.pmReply(text);
		} else {
			this.reply(text);
		}
	},
	
	choose: 'pick',
	pick: function (arg, by, room, cmd) {
		var choices = arg.split(",");
		choices = choices.filter(function(i) {return (toId(i) !== '')});
		if (choices.length < 2) return this.pmReply("You must give at least 2 valid choices");
		var choice = choices[Math.floor(Math.random() * choices.length)];
		if (!this.can('pick') || this.roomType === 'pm') {
			this.pmReply(stripCommands(choice));
		} else {
			this.reply(stripCommands(choice));
		}
	},
	
	seen: function (arg, by, room, cmd) {
		var text = '';
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.pmReply('Invalid username.');
		if (arg === toId(Bot.status.nickName)) return this.pmReply('You might be either blind or illiterate. Might want to get that checked out.');
		if (arg = toId(by)) return this.pmReply('Have you looked in the mirror lately?');
		if (Settings.seen[arg]) {
			var dSeen = Settings.seen[arg];
			text += arg + ' was last seen ' + getTimeAgo(dSeen.time) + ' ago';
			if (dSeen.room) {
				switch (dSeen.action) {
					case 'j':
						text += ', joining ' + dSeen.room;
						break;
					case 'l':
						text += ', leaving ' + dSeen.room;
						break;
					case 'c':
						text += ', chatting in ' + dSeen.room;
						break;
					case 'n':
						text += ', changing nick to ' + dSeen.args[0];
						break;
				}
			}
		} else {
			text += 'The user ' + arg + ' has never been seen, at least since the last bot reset.';
		}
		this.pmReply(text);
	},
	
	say: function (arg, by, room, cmd) {
		if (!arg) return;
		if (this.roomType !== 'chat') {
			if (this.isRanked('%')) return;
			this.reply(stripCommands(arg));
		}
		if (!this.can('say')) return;
		this.reply(stripCommands(arg));
	},
	
	settings: 'set',
	set: function (arg, by, room, cmd) {
		if (!this.isRanked('#')) return false;
		if (this.roomType !== 'chat') return this.reply("This command is only avaliable for chat rooms");
		var args = arg.split(",");
		if (args.length < 2) return this.reply("Usage: " + Config.commandChar + cmd + " [permission], [rank]");
		var perm = toId(args[0]);
		var rank = args[1].trim();
		if (!(perm in Settings.permissions)) {
			return this.reply("Permissions: " + Object.keys(Settings.permissions).sort().join(", "));
		}
		if (rank in {'off': 1, 'disable': 1}) {
			setPermission(room, perm, true);
			return this.reply("Permission **" + perm + "** in this room is now disabled");
		}
		if (rank in {'on': 1, 'all': 1, 'enable': 1}) {
			setPermission(room, perm, ' ');
			return this.reply("Permission **" + perm + "** in this room is now avaliable for all users");
		}
		if (Config.ranks.indexOf(rank) >= 0) {
			setPermission(room, perm, rank);
			return this.reply("Permission **" + perm + "** in this room is now avaliable for users with rank " + rank + " or highter");
		} else {
			return this.reply("Rank " + rank + " not found");
		}
	}
};
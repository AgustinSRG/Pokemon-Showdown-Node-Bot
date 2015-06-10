/*
	Tournaments Commands
*/

Settings.addPermissions(['tournament']);

exports.commands = {
	tourhelp: function (arg, by, room, cmd) {
		this.restrictReply('Usage: ' + Config.commandChar + 'tour (format), (seconds to start or off), (minutes autodq or off), (max Users or off), (elimination or roundrobin). All arguments are optional.', 'tournament');
	},

	maketour: 'tournament',
	newtour: 'tournament',
	tour: 'tournament',
	tournament: function (arg, by, room, cmd) {
		if (this.roomType !== 'chat' || !this.can('tournament')) return;
		if (!this.botRanked('@')) this.reply(Bot.status.nickName + " requires moderator rank (@) or highter to create tornaments");
		if (Features['tours'].tourData[room]) return this.reply('There is already a tournament in this room');
		var details = {
			format: 'ou',
			type: 'elimination',
			maxUsers: null,
			timeToStart: 30 * 1000,
			autodq: 1.5
		};
		if (arg && arg.length) {
			var args = arg.split(",");
			if (args[0]) {
				var format = toId(args[0]);
				if (!Formats[format] || !Formats[format].chall) return this.reply('Format ' + format + ' is not valid for tournaments');
				details.format = format;
			}
			if (args[1]) {
				if (toId(args[1]) === 'off') {
					details.timeToStart = null;
				} else {
					var time = parseInt(args[1]);
					if (!time || time < 0) return this.reply('Time to start is not a valid time');
					details.timeToStart = time;
				}
			}
			if (args[2]) {
				if (toId(args[2]) === 'off') {
					details.autodq = false;
				} else {
					var dq = parseFloat(args[2]);
					if (!dq || dq < 0) return this.reply('Autodq is not a valid time');
					details.autodq = dq;
				}
			}
			if (args[3]) {
				if (toId(args[3]) === 'off') {
					details.maxUsers = null;
				} else {
					var musers = parseInt(args[3]);
					if (!musers || musers < 2) return this.reply('Max users number is not valid');
					details.maxUsers = musers;
				}
			}
			if (args[4]) {
				var type = toId(args[4]);
				if (type !== 'elimination' && type !== 'roundrobin') return this.reply('Tour type is not valid. Valid types are: elimination, roundrobin');
				details.type = type;
			}
		}
		Features['tours'].newTour(room, details);
		setTimeout(function () {
			if (Features['tours'].tournaments[room] && !Features['tours'].tourData[room]) {
				Bot.say(room, 'Error: the tournament did not start, probably because I have not permission to create tournaments or commands got changed.');
				delete Features['tours'].tournaments[room];
			}
		}, 2500);
	}
};

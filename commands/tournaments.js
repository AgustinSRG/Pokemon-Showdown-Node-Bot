/*
	Tournaments Commands
*/

var formatAliases = {
	'random': 'Random Battle',
	'randomdoubles': 'Random Doubles Battle',
	'randomtriples': 'Random Triples Battle',
	'doubles': 'Doubles OU',
	'triples': 'Smogon Triples',
	'vgc': 'Battle Spot Doubles (VGC 2015)',
	'vgc2015': 'Battle Spot Doubles (VGC 2015)',
	'oras': 'OU',
	'bw': '[Gen 5] OU',
	'dpp': '[Gen 4] OU',
	'adv': '[Gen 3] OU',
	'gsc': '[Gen 2] OU',
	'rby': '[Gen 1] OU'
};

Settings.addPermissions(['tournament']);

exports.commands = {
	tourhelp: function (arg, by, room, cmd) {
		this.restrictReply('Usage: ' + this.cmdToken + this.trad('h'), 'tournament');
	},

	maketour: 'tournament',
	newtour: 'tournament',
	tour: 'tournament',
	tournament: function (arg, by, room, cmd) {
		if (this.roomType !== 'chat' || !this.can('tournament')) return;
		if (Features['tours'].tourData[room]) return this.reply(this.trad('e2'));
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
			if (args[0]) {
				var format = toId(args[0]);
				if (formatAliases[format]) format = toId(formatAliases[format]);
				if (!Formats[format] || !Formats[format].chall) return this.reply(this.trad('e31') + ' ' + format + ' ' + this.trad('e32'));
				details.format = format;
			}
			if (args[1]) {
				if (toId(args[1]) === 'off') {
					details.timeToStart = null;
				} else {
					var time = parseInt(args[1]);
					if (!time || time < 0) return this.reply(this.trad('e4'));
					details.timeToStart = time * 1000;
				}
			}
			if (args[2]) {
				if (toId(args[2]) === 'off') {
					details.autodq = false;
				} else {
					var dq = parseFloat(args[2]);
					if (!dq || dq < 0) return this.reply(this.trad('e5'));
					details.autodq = dq;
				}
			}
			if (args[3]) {
				if (toId(args[3]) === 'off') {
					details.maxUsers = null;
				} else {
					var musers = parseInt(args[3]);
					if (!musers || musers < 2) return this.reply(this.trad('e6'));
					details.maxUsers = musers;
				}
			}
			if (args[4]) {
				var type = toId(args[4]);
				if (type !== 'elimination' && type !== 'roundrobin') return this.reply(this.trad('e7'));
				details.type = type;
			}
		}
		Features['tours'].newTour(room, details);
		setTimeout(function () {
			if (Features['tours'].tournaments[room] && !Features['tours'].tourData[room]) {
				Bot.say(room, this.trad('notstarted'));
				delete Features['tours'].tournaments[room];
			}
		}.bind(this), 2500);
	}
};

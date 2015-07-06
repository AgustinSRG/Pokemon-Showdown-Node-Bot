/*
	Miscellaneous commands
*/

Settings.addPermissions(['pick', 'randomanswer', 'usage', 'help']);

exports.commands = {
	choose: 'pick',
	pick: function (arg, by, room, cmd) {
		var choices = arg.split(",");
		choices = choices.filter(function (i) {return (toId(i) !== '');});
		if (choices.length < 2) return this.pmReply(this.trad('err'));
		var choice = choices[Math.floor(Math.random() * choices.length)];
		if (!this.can('pick') || this.roomType === 'pm') {
			this.pmReply(Tools.stripCommands(choice));
		} else {
			this.reply(Tools.stripCommands(choice));
		}
	},

	'8ball': 'randomanswer',
	helix: 'randomanswer',
	randomanswer: function (arg, user, room) {
		if (room === user) return false;
		var text = '';
		var rand = ~~(20 * Math.random());
		var answers = this.trad('answers');
		text += (answers[rand] || answers[0]);
		this.restrictReply(text, 'randomanswer');
	},

	usagestats: 'usage',
	usage: function (arg, user, room) {
		this.restrictReply(this.trad('stats') + ': http://www.smogon.com/stats/', 'usage');
	},

	guide: 'help',
	botguide: 'help',
	help: function (arg, user, room) {
		this.restrictReply(this.trad('guide') + ': https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot/blob/master/commands/README.md', 'help');
	},

	youtubelinks: 'youtube',
	youtube: function (arg, user, room, cmd) {
		if (!this.isRanked('#')) return false;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		arg = toId(arg);
		if (!Settings.settings['ytlinks']) Settings.settings['ytlinks'] = {};
		switch (arg) {
			case 'on':
			case 'enable':
				if (Settings.settings['ytlinks'][room]) return this.reply(this.trad('ae') + ' ' + room);
				Settings.settings['ytlinks'][room] = 1;
				Settings.save();
				this.reply(this.trad('e'));
				break;
			case 'off':
			case 'disable':
				if (Settings.settings['ytlinks'][room] === 0) return this.reply(this.trad('ad') + ' ' + room);
				Settings.settings['ytlinks'][room] = 0;
				Settings.save();
				this.reply(this.trad('d'));
				break;
			default:
				this.reply(this.trad('u') + ': ' + this.cmdToken + cmd + ' [on/off]');
		}
	}
};

/*
	Miscellaneous commands
*/

Settings.addPermissions(['pick', 'randomanswer']);

exports.commands = {
	choose: 'pick',
	pick: function (arg) {
		var choices = arg.split(",");
		choices = choices.filter(function (i) {return (toId(i) !== '');});
		if (choices.length < 2) return this.pmReply(this.trad('err'));
		var choice = choices[Math.floor(Math.random() * choices.length)];
		this.restrictReply(Tools.stripCommands(choice), 'pick');
	},

	'8ball': 'randomanswer',
	helix: 'randomanswer',
	randomanswer: function () {
		var answers = this.trad('answers');
		if (!answers || !answers.length) return;
		this.restrictReply(answers[Math.floor(Math.random() * answers.length)], 'randomanswer');
	},

	usagestats: 'usage',
	usage: function () {
		this.restrictReply(this.trad('stats') + ': http://www.smogon.com/stats/', 'info');
	},

	guide: 'help',
	botguide: 'help',
	help: function () {
		this.restrictReply(this.trad('guide') + ': https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot/blob/master/commands/README.md', 'info');
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

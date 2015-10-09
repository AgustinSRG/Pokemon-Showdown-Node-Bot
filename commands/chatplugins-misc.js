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
		this.restrictReply("**" + this.trad('pick') + ":** " + Tools.stripCommands(choice), 'pick');
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
	}
};

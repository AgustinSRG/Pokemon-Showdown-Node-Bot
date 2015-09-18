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
	spr: function (arg, by, room) {
		if (!this.hasRank('voice')) return false;
		arg = toId(arg);
		var values = ['rock', 'paper', 'scissors'];
		if (values.indexOf(arg) === -1) return this.reply('Please choose either: scissors, paper or rock.');
		var action = ['You win!', 'You lose', 'It\'s a draw!'][~~(Math.random() * 3)];
		switch (action) {
			case 'You win!':
				var choice = values[values.indexOf(arg) + 2];
				break;
			case 'You lose':
				 choice = values[values.indexOf(arg) + 1];
				break;
			case 'It\'s a draw!':
				 choice = arg;
				break;
		}
		this.reply('/me chose ' + choice + '. **' + action + '**');
	}
};

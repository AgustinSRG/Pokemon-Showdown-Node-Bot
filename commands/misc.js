/*
	Miscellaneous commands
*/

Settings.addPermissions(['pick', 'randomanswer']);

exports.commands = {
	choose: 'pick',
	pick: function (arg, by, room, cmd) {
		var choices = arg.split(",");
		choices = choices.filter(function (i) {return (toId(i) !== '');});
		if (choices.length < 2) return this.pmReply("You must give at least 2 valid choices");
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
		switch (rand) {
			case 0:
				text += "Signs point to yes.";
				break;
			case 1:
				text += "Yes.";
				break;
			case 2:
				text += "Reply hazy, try again.";
				break;
			case 3:
				text += "Without a doubt.";
				break;
			case 4:
				text += "My sources say no.";
				break;
			case 5:
				text += "As I see it, yes.";
				break;
			case 6:
				text += "You may rely on it.";
				break;
			case 7:
				text += "Concentrate and ask again.";
				break;
			case 8:
				text += "Outlook not so good.";
				break;
			case 9:
				text += "It is decidedly so.";
				break;
			case 10:
				text += "Better not tell you now.";
				break;
			case 11:
				text += "Very doubtful.";
				break;
			case 12:
				text += "Yes - definitely.";
				break;
			case 13:
				text += "It is certain.";
				break;
			case 14:
				text += "Cannot predict now.";
				break;
			case 15:
				text += "Most likely.";
				break;
			case 16:
				text += "Ask again later.";
				break;
			case 17:
				text += "My reply is no.";
				break;
			case 18:
				text += "Outlook good.";
				break;
			case 19:
				text += "Don't count on it.";
				break;
		}
		this.restrictReply(text, 'randomanswer');
	}
};

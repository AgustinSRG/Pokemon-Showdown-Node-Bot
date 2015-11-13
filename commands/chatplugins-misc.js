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
		var generateUsageLink = function (monthmod) {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth();
			if (monthmod) month += monthmod;
			while (month < 0) {
				month += 11;
				year--;
			}
			while (month > 11) {
				month -= 11;
				year++;
			}
			return "http://www.smogon.com/stats/" + Tools.addLeftZero(year, 4) + "-" + Tools.addLeftZero(month + 1, 2) + "/";
		};
		var getUsageLink = function (callback) {
			var realLink = generateUsageLink(-1);
			var currLink = Settings.settings.usagelink;
			if (currLink !== realLink) {
				Tools.httpGet(realLink, function (data, err) {
					if (!err && data.indexOf("<title>404 Not Found</title>") < 0) {
						Settings.settings.usagelink = realLink;
						Settings.save();
						debug("Usage link updated: " + Settings.settings.usagelink);
						callback(realLink);
					} else {
						callback(currLink);
					}
				});
			} else {
				callback(currLink);
			}
		};
		getUsageLink(function (link) {
			if (!link) link = generateUsageLink(-2);
			return this.restrictReply(this.trad('stats') + ': ' + link, 'info');
		}.bind(this));
	}
};

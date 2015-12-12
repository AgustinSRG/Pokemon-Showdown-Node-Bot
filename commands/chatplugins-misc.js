/*
	Miscellaneous commands
*/

function getESTDiff (timestamp) {
	var date = new Date(timestamp);
	if (date.getMonth() < 11 && date.getMonth() > 1) {
		if (date.getMonth() === 10 && (date.getDate() - date.getDay() <= 6)) return -5;
		if (date.getMonth() === 2 && (date.getDate() - date.getDay() < 0)) return -5;
		return -4;
	}
	return -5;
}

var downloadingFlag = {};

function markDownload (user, b) {
	if (b === false) {
		if (downloadingFlag[user]) delete downloadingFlag[user];
	} else if (b === true) {
		downloadingFlag[user] = true;
	} else {
		return downloadingFlag[user] || false;
	}
}

var regdateCache = [];

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

	regtime: 'regdate',
	regdate: function (arg) {
		var target = toId(arg) || toId(this.by);
		if (!target || target.length > 18) return this.pmReply(this.trad('inv'));
		var url = "http://pokemonshowdown.com/users/" + target + ".json";
		if (markDownload(toId(this.by))) return this.pmReply(this.trad('busy'));
		var callback = function (data, err, nocache) {
			markDownload(toId(this.by), false);
			if (err) return this.pmReply(this.trad('err') + " " + url);
			try {
				data = JSON.parse(data);
			} catch (e) {
				debug(sys.inspect(e));
				return this.pmReply(this.trad('err') + " " + url);
			}
			if (typeof data.registertime !== "number") {
				error("Regdate | Corrupted data: " + JSON.stringify(data));
				return this.pmReply(this.trad('err') + " " + url);
			}
			if (data.registertime <= 0) return this.pmReply(this.trad('user') + " " + (data.username || target) + " " + this.trad('not'));
			if (!nocache) {
				regdateCache.push(data);
				if (regdateCache.length > 10) regdateCache.shift();
			}
			var regTimestamp = data.registertime * 1000;
			if (this.cmd === "regtime") {
				regTimestamp -= 364000;
				this.pmReply(this.trad('user') + " " + (data.username || target) + " " + this.trad('regtime1') + " __" + Tools.getTimeAgo(regTimestamp, this.language).trim() + "__ " + this.trad('regtime2'));
			} else {
				regTimestamp += (1000 * 60 * 60 * getESTDiff(regTimestamp)) + (new Date().getTimezoneOffset() * 60 * 1000) - 364000;
				this.pmReply(this.trad('user') + " " + (data.username || target) + " " + this.trad('regdate') + " __" + (new Date(regTimestamp)).toString().substr(4, 20).trim() + "__ (EST)");
			}
		};
		for (var i = 0; i < regdateCache.length; i++) {
			if (regdateCache[i].username && toId(regdateCache[i].username) === target) {
				callback.call(this, JSON.stringify(regdateCache[i]), null, true);
				return;
			}
		}
		markDownload(toId(this.by), true);
		Tools.httpGet(url, callback.bind(this));
	}
};

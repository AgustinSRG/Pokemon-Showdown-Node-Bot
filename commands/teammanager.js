/*
	Commands for manage teams
*/

exports.commands = {
	botteams: 'team',
	teams: 'team',
	team: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (!arg) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u2'));
		arg = arg.split(',');
		var opt = toId(arg[0]);
		switch (opt) {
			case 'add':
			case 'new':
				if (arg.length < 4) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u3'));
				var name = toId(arg[1]);
				var format = Tools.parseAliases(arg[2]);
				var link = arg[3].trim();
				if (!link) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u2'));
				if (link.substr(-1) === '/') link = link.substr(0, link.length - 1);
				var splitedLink = link.split('/');
				link = 'http://hastebin.com/raw/' + splitedLink[splitedLink.length - 1];
				if (!Formats[format]) return this.reply(this.trad('format') + " __" + format + "__ " + this.trad('notexists'));
				this.reply(this.trad('download') + '... (' + link + ')');
				var http = require('http');
				http.get(link, function (res) {
					var data = '';
					res.on('data', function (part) {
						data += part;
					}.bind(this));
					res.on('end', function (end) {
						if (data === '{"message":"Document not found."}') {
							Bot.say(room, this.trad('err1'));
							return;
						}
						var team, packed;
						try {
							team = Tools.teamToJSON(data);
							packed = Tools.packTeam(team);
						} catch (e) {
							errlog(e.stack);
							Bot.say(room, this.trad('err2'));
							return;
						}
						if (Features['battle'].TeamBuilder.addTeam(name, format, packed)) {
							Bot.say(room, this.trad('team') + " __" + name + "__ " + this.trad('added'));
						} else {
							Bot.say(room, this.trad('err3'));
						}
					}.bind(this));
					res.on('error', function (end) {
						Bot.say(room, this.trad('err4'));
					}.bind(this));
				}.bind(this)).on('error', function (e) {
					Bot.say(room, this.trad('err4'));
				}.bind(this));
				break;
			case 'get':
				if (arg.length < 2) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u5'));
				var id = toId(arg[1]);
				if (!Features['battle'].TeamBuilder.dynTeams[id]) return this.reply(this.trad('team') + " __" + name + "__ " + this.trad('notexists'));
				try {
					var data = Tools.exportTeam(Features['battle'].TeamBuilder.dynTeams[id].packed);
					Tools.uploadToHastebin(data, function (r, link) {
						if (r) return this.pmReply(id + ': ' + link);
						else this.pmReply(this.trad('err'));
					}.bind(this));
				} catch (e) {
					errlog(e.stack);
					this.pmReply(this.trad('err2'));
				}
				break;
			case 'check':
				if (arg.length < 2) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u6'));
				var id = toId(arg[1]);
				if (!Features['battle'].TeamBuilder.dynTeams[id]) return this.reply(this.trad('team') + " __" + name + "__ " + this.trad('notexists'));
				var cmds = [];
				var team = Features['battle'].TeamBuilder.dynTeams[id].packed;
				if (team) cmds.push('|/useteam ' + team);
				cmds.push('|/challenge ' + toId(arg[2] || by) + ", " + Features['battle'].TeamBuilder.dynTeams[id].format);
				Bot.send(cmds);
				break;
			case 'delete':
			case 'remove':
				if (arg.length < 2) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u4'));
				var name = toId(arg[1]);
				if (Features['battle'].TeamBuilder.removeTeam(name)) {
					this.reply(this.trad('team') + " __" + name + "__ " + this.trad('removed'));
				} else {
					this.reply(this.trad('team') + " __" + name + "__ " + this.trad('notexists'));
				}
				break;
			default:
				return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u2'));
		}
	},

	viewteamlist: 'teamlist',
	viewteamslist: 'teamlist',
	teamslist: 'teamlist',
	teamlist: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var teamsStr = this.trad('list') + ':\n\n';
		var teams = Features['battle'].TeamBuilder.dynTeams;
		var nTeams = 0;
		for (var i in teams) {
			teamsStr += this.trad('id') + ': ' + i + ' | ' + this.trad('format') + ': ' + teams[i].format + ' | ' + this.trad('pokemon') + ': ' + Tools.teamOverview(teams[i].packed) + '\n';
			nTeams++;
		}
		if (!nTeams) return this.pmReply(this.trad('empty'));
		Tools.uploadToHastebin(teamsStr, function (r, link) {
			if (r) return this.pmReply(this.trad('list') + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	}
};

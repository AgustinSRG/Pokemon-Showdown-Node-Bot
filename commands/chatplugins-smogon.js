/*
	Smogon related commads
*/

/* Default tier */

function getDefaultTier (room) {
	if (Settings.settings.deftier && Settings.settings.deftier[room]) return Settings.settings.deftier[room];
	return "ou";
}

/* Usage utils */

function generateUsageLink (monthmod) {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	if (monthmod) month += monthmod;
	while (month < 0) {
		month += 12;
		year--;
	}
	while (month > 11) {
		month -= 12;
		year++;
	}
	return "http://www.smogon.com/stats/" + Tools.addLeftZero(year, 4) + "-" + Tools.addLeftZero(month + 1, 2) + "/";
}

function getUsageLink (callback) {
	var realLink = generateUsageLink(-1);
	var currLink = Settings.settings.usagelink;
	if (currLink !== realLink) {
		Tools.httpGet(realLink, function (data, err) {
			if (!err && data.indexOf("<title>404 Not Found</title>") < 0) {
				Settings.settings.usagelink = realLink;
				Settings.save();
				Settings.unCacheUrl(new RegExp(currLink));
				debug("Usage link updated: " + Settings.settings.usagelink);
				callback(realLink);
			} else {
				callback(currLink);
			}
		});
	} else {
		callback(currLink);
	}
}

var downloadingFlag = {};

function markDownload (link, b) {
	if (b === false) {
		if (downloadingFlag[link]) delete downloadingFlag[link];
	} else if (b === true) {
		downloadingFlag[link] = true;
	} else {
		return downloadingFlag[link] || false;
	}
}

function tierName (tier) {
	if (!tier) return "";
	if (Formats[tier]) return Formats[tier].name;
	return tier.toUpperCase();
}

/* Commands */

Settings.addPermissions(['usage']);

exports.commands = {
	defaulttier: 'deftier',
	deftier: function (arg, by, room, cmd) {
		if (!this.isRanked('roomowner')) return false;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		var tier = toId(arg);
		if (!tier) return this.reply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [tier]");
		if (!Formats[tier] && !Formats[tier + "suspecttest"]) return this.restrictReply(this.trad('tiererr1') + " \"" + tier + "\" " + this.trad('tiererr2'), 'info');
		if (!Settings.settings.deftier) Settings.settings.deftier = {};
		Settings.settings.deftier[tarRoom] = tier;
		Settings.save();
		this.reply(this.trad('set') + " **" + tierName(tier) + "**" + textHelper);
		this.sclog();
	},

	delsuspect: 'setsuspect',
	setsuspect: function (arg) {
		if (!this.isRanked('admin')) return false;
		if (!Settings.settings.suspect) Settings.settings.suspect = {};
		if (this.cmd === "delsuspect") {
			if (!arg) return this.reply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [tier]");
			arg = Tools.parseAliases(arg);
			if (!Settings.settings.suspect[arg]) return this.reply(this.trad('d1') + " \"" + arg + "\" " + this.trad('notfound'));
			delete Settings.settings.suspect[arg];
			Settings.save();
			this.sclog();
			this.reply(this.trad('d1') + " \"" + arg + " " + this.trad('d2'));
		} else {
			var args = arg.split(",");
			var tier, poke, link;
			if (args.length < 3) return this.reply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [tier], [pokemon], [link]");
			tier = Tools.parseAliases(args.shift());
			if (!Formats[tier] && !Formats[tier + "suspecttest"]) return this.reply(this.trad('tier') + " \"" + tier + "\" " + this.trad('notfound'));
			link = args.pop().trim();
			poke = args.join(",");
			Settings.settings.suspect[tier] = {
				poke: poke,
				link: link
			};
			Settings.save();
			this.sclog();
			this.parse(this.cmdToken + "suspect " + tier);
		}
	},

	suspecttest: 'suspect',
	suspect: function (arg) {
		var tier = getDefaultTier(this.room);
		if (arg) {
			tier = Tools.parseAliases(arg);
		}
		if (Settings.settings.suspect && Settings.settings.suspect[tier]) {
			//Suspect
			this.restrictReply("Suspect test " + this.trad('in') + " **" + tierName(tier) + "**: **" + Tools.toName(Settings.settings.suspect[tier].poke) + "**. " + Settings.settings.suspect[tier].link, "info");
		} else if (Formats[tier] || Formats[tier + "suspecttest"]) {
			//No suspect
			this.restrictReply(this.trad('nosuspect') + " " + tierName(tier) + (this.isRanked('admin') ? (". " + this.trad('aux1') + " ``" + this.cmdToken + "setsuspect`` " + this.trad('aux2')) : ""), "info");
		} else {
			this.restrictReply(this.trad('tiererr1') + " \"" + tier + "\" " + this.trad('tiererr2'), 'info');
		}
	},

	usagedata: 'usage',
	usagestats: 'usage',
	usagedatalink: 'usage',
	usagelink: 'usage',
	usage: function (arg) {
		var topTiers = {'ou': 1, 'oususpecttest': 1, 'doublesou': 1};
		getUsageLink(function (link) {
			if (!link) link = generateUsageLink(-2);
			if (!arg) {
				return this.restrictReply(this.trad((this.cmd === "usagedata" ? "data" : "stats")) + ': ' + link + (this.cmd === "usagedata" ? "moveset/" : ""), 'usage');
			}
			if (this.cmd === "usagelink" || this.cmd === "usagedatalink") {
				var tFormat = Tools.parseAliases(arg);
				return this.restrictReply(this.trad((this.cmd === "usagedata" ? "data" : "stats")) + ': ' + link + (this.cmd === "usagedatalink" ? "moveset/" : "") + (tFormat ? (tFormat + "-" + ((tFormat in topTiers) ? "1695" : "1630") + ".txt") : ""), 'usage');
			}
			var poke = "garchomp", searchIndex = -1;
			var tier = getDefaultTier(this.room);
			var dataType = "";
			var ladderType = 1630;
			var args = arg.split(",");
			for (var i = 0; i < args.length; i++) args[i] = toId(args[i]);
			poke = toId(args[0]);
			try {
				var aliases = DataDownloader.getAliases();
				if (aliases[poke]) poke = toId(aliases[poke]);
			} catch (e) {
				debug("Could not fetch aliases. Cmd: " + this.cmd + " " + arg + " | Room: " + this.room + " | By: " + this.by);
			}
			if (parseInt(poke)) searchIndex = parseInt(poke);
			if (this.cmd === "usagedata") {
				if (args.length < 2) return this.restrictReply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [pokemon], [moves / items / abilities / spreads / teammates], (tier)", 'usage');
				dataType = toId(args[1]);
				if (!(dataType in {"moves": 1, "items": 1, "abilities": 1, "teammates": 1, "spreads": 1})) return this.restrictReply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [pokemon], [moves / items / abilities / spreads / teammates], (tier)", 'usage');
				if (args[2]) {
					tier = Tools.parseAliases(args[2]);
					if (!Formats[tier] && !Formats[tier + "suspecttest"])
						return this.restrictReply(this.trad('tiererr1') + " \"" + tier + "\" " + this.trad('tiererr2'), 'usage');
				}
				if (tier in topTiers) ladderType = 1695; //OU representative usage stats
				if (markDownload(link + "moveset/" + tier + "-" + ladderType + ".txt")) return this.restrictReply(this.trad('busy'), 'usage');
				Settings.httpGetAndCache(link + "moveset/" + tier + "-" + ladderType + ".txt", function (data, err) {
					markDownload(link + "moveset/" + tier + "-" + ladderType + ".txt", false);
					if (err) {
						return this.restrictReply(this.trad('err') + " " + link + "moveset/" + tier + "-" + ladderType + ".txt", 'usage');
					}
					if (data.indexOf("+----------------------------------------+") === -1) return this.restrictReply(this.trad('tiererr1') + " \"" + tierName(tier) + "\" " + this.trad('tiererr3'), 'usage');
					var pokes = data.split(' +----------------------------------------+ \n +----------------------------------------+ ');
					var pokeData = null, chosen = false;
					for (var i = 0; i < pokes.length; i++) {
						pokeData = pokes[i].split("\n");
						if (!pokeData[1] || toId(pokeData[1]) !== poke) continue;
						chosen = true;
						break;
					}
					if (!chosen) return this.restrictReply(this.trad('pokeerr1') + " \"" + poke + "\" " + this.trad('pokeerr2') + " " + tierName(tier) + " " + this.trad('pokeerr3'), 'usage');
					var result = [];
					var resultName = "";
					var pokeName = Tools.toName(pokeData[1].split("|")[1]);
					for (var i = 0; i < pokeData.length; i++) {
						if (pokeData[i + 1] && pokeData[i].trim() === "+----------------------------------------+") {
							switch (toId(pokeData[i + 1])) {
								case 'abilities':
									if (dataType !== "abilities") continue;
									break;
								case 'items':
									if (dataType !== "items") continue;
									break;
								case 'moves':
									if (dataType !== "moves") continue;
									break;
								case 'spreads':
									if (dataType !== "spreads") continue;
									break;
								case 'teammates':
									if (dataType !== "teammates") continue;
									break;
								default:
									continue;
							}
							resultName = this.trad(dataType);
							i = i + 2;
							var auxRes, percent;
							while (i < pokeData.length) {
								if (pokeData[i].trim() === "+----------------------------------------+") break;
								auxRes = pokeData[i].split("|")[1];
								if (auxRes) {
									auxRes = auxRes.trim().split(" ");
									percent = auxRes.pop();
									auxRes = auxRes.join(" ");
									result.push(auxRes + " (" + percent + ")");
								}
								i++;
							}
							break;
						}
					}
					if (!result.length) return this.restrictReply(this.trad('notfound') + " " + this.trad('usagedata1').replace("#NAME", resultName) + pokeName + this.trad('usagedata2').replace("#NAME", resultName) + " " + this.trad('in') + " " + tierName(tier), 'usage');
					var txt = "**" + this.trad('usagedata1').replace("#NAME", resultName) + pokeName + this.trad('usagedata2').replace("#NAME", resultName) + " " + this.trad('in') + " " + tierName(tier) + "**: ";
					var comma, cmds = [];
					for (var i = 0; i < result.length; i++) {
						comma = (i < result.length - 1) ? ", " : "";
						if ((txt.length + result[i].length + comma.length) > 300) {
							cmds.push(txt);
							txt = "";
						}
						txt += result[i] + comma;
					}
					if (txt.length > 0) cmds.push(txt);
					this.restrictReply(cmds, 'usage');
				}.bind(this), function () {
					markDownload(link + "moveset/" + tier + "-" + ladderType + ".txt", true);
				});
			} else {
				if (args.length < 1) return this.restrictReply(this.trad('usage') + ": " + this.cmdToken + this.cmd + " [pokemon], (tier)", 'usage');
				if (args[1]) {
					tier = Tools.parseAliases(args[1]);
					if (!Formats[tier] && !Formats[tier + "suspecttest"])
						return this.restrictReply(this.trad('tiererr1') + " \"" + tier + "\" " + this.trad('tiererr2'), 'usage');
				}
				if (tier in topTiers) ladderType = 1695; //OU representative usage stats
				if (markDownload(link + tier + "-" + ladderType + ".txt")) return this.restrictReply(this.trad('busy'), 'usage');
				Settings.httpGetAndCache(link + tier + "-" + ladderType + ".txt", function (data, err) {
					markDownload(link + tier + "-" + ladderType + ".txt", false);
					if (err) {
						return this.restrictReply(this.trad('err') + " " + link + tier + "-" + ladderType + ".txt", 'usage');
					}
					var lines = data.split("\n");
					if (lines[0].indexOf("Total battles:") === -1) return this.restrictReply(this.trad('tiererr1') + " \"" + tierName(tier) + "\" " + this.trad('tiererr3'), 'usage');
					var dataRes = {
						name: poke,
						pos: -1,
						usage: 0,
						raw: 0
					};
					var line;
					for (var i = 5; i < lines.length; i++) {
						line = lines[i].split("|");
						if (line.length < 7) continue;
						if (toId(line[2]) === poke || searchIndex === parseInt(line[1].trim())) {
							dataRes.name = Tools.toName(line[2]);
							dataRes.pos = parseInt(line[1].trim());
							dataRes.usage = line[3].trim();
							dataRes.raw = line[4].trim();
							break;
						}
					}
					if (!dataRes.pos || dataRes.pos < 1) return this.restrictReply(this.trad('pokeerr1') + " \"" + poke + "\" " + this.trad('pokeerr2') + " " + tierName(tier) + " " + this.trad('pokeerr4'), 'usage');
					this.restrictReply("**" + dataRes.name + "**, #" + dataRes.pos + " " + this.trad('in') + " **" + tierName(tier) + "**. " + this.trad('pokeusage') +  ": " + dataRes.usage + ", " + this.trad('pokeraw') + ": " + dataRes.raw, 'usage');
				}.bind(this), function () {
					markDownload(link + tier + "-" + ladderType + ".txt", true);
				});
			}
		}.bind(this));
	}
};

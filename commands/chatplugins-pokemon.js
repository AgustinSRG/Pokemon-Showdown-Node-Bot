/*
 * Pokemon-related commands
 */

function normalize_init () {
	var str1 = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑÇç";
	var str2 = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuñcc";
	var map = {};
	for (var i = 0; i < str1.length; i++) {
		map[str1.charAt(i)] = str2.charAt(i);
	}
	return map;
}

var normalObj = normalize_init();
function normalize (str) {
	if (!str) return '';
	var res = '';
	for (var i = 0; i < str.length; i++) {
		res += normalObj[str.charAt(i)] ? normalObj[str.charAt(i)] : str.charAt(i);
	}
	return toId(res);
}

function searchInLanguage (lang, word, keys) {
	var dataLang = Tools.translations[lang];
	var translationTemp;
	var results = [];
	var searchResults = [];
	var maxLd = 3;
	var ld;
	if (word.length <= 1) {
		return null;
	} else if (word.length <= 4) {
		maxLd = 1;
	} else if (word.length <= 6) {
		maxLd = 2;
	}
	if (!Tools.translations[lang]) return null;
	for (var i = 0; i < keys.length; i++) {
		if (!Tools.translations[lang][keys[i]]) continue;
		for (var k in Tools.translations[lang][keys[i]]) {
			translationTemp = Tools.translations[lang][keys[i]][k];
			if (!translationTemp) continue;
			if (typeof translationTemp === "string") {
				ld = Tools.levenshtein(word, normalize(translationTemp), maxLd);
				if (ld <= maxLd) {
					results.push({type: keys[i], id: k, title: translationTemp, ld: ld});
				}
			} else if (typeof translationTemp === "object" && typeof translationTemp.length) {
				for (var j = 0; j < translationTemp.length; j++) {
					ld = Tools.levenshtein(word, normalize(translationTemp[j]), maxLd);
					if (ld <= maxLd) {
						results.push({type: keys[i], id: k, title: translationTemp[j], ld: ld});
					}
				}
			}
		}
	}
	var currLd = 10;
	for (var i = 0; i < results.length; i++) {
		if (results[i].ld < currLd) {
			currLd = results[i].ld;
		}
	}
	if (currLd === 10) return [];
	var newResults = [];
	for (var i = 0; i < results.length; i++) {
		if (currLd === results[i].ld) {
			results[i].ld = currLd;
			newResults.push(results[i]);
		}
	}
	return newResults;
}

function getTranslations (from, to, word) {
	word = normalize(word);
	var results = [];
	var toLangData = Tools.translations[to];
	if (!toLangData) return null;
	var ids = searchInLanguage(from, word, ['abilities', 'items', 'moves', 'natures', 'pokemon']);
	if (!ids || !ids.length) return null;
	var type, id;
	for (var i = 0; i < ids.length; i++) {
		id = ids[i].id;
		type = ids[i].type;
		if (!toLangData[type] || !toLangData[type][id]) continue;
		results.push({type: type, from: ids[i].title, to: toLangData[type][id], ld: ids[i].ld});
	}
	return results;
}

Settings.addPermissions(['pokemon']);

exports.commands = {
	tra: 'translate',
	trans: 'translate',
	translate: function (arg) {
		if (!arg) return this.restrictReply(this.trad('u1') + ": " + this.cmdToken + this.cmd + " " + this.trad('u2'), "pokemon");
		var args = arg.split(',');
		var word = args[0];
		var from = toId(args[1] || '');
		var to = toId(args[2] || '');
		var bidirectional = false;
		if (this.language !== "english" && !from && !to) {
			from = this.language;
			to = "english";
			bidirectional = true;
		}
		if (from && !to && from !== "english") {
			to = "english";
		}
		var langAliases = {
			'en': 'english',
			'es': 'spanish',
			'de': 'german',
			'fr': 'french',
			'it': 'italian'
		};
		if (langAliases[from]) from = langAliases[from];
		if (langAliases[to]) to = langAliases[to];
		if (!from || !to || from === to || !word) return this.restrictReply(this.trad('u1') + ": " + this.cmdToken + this.cmd + " " + this.trad('u2'), "pokemon");
		var validlangs = Object.keys(Tools.translations);
		if (validlangs.indexOf(from) < 0) return this.restrictReply(this.trad('lnot1') + " \"" + from + "\" " + this.trad('lnot2') + ": " + validlangs.join(', '), "pokemon");
		if (validlangs.indexOf(to) < 0) return this.restrictReply(this.trad('lnot1') + " \"" + to + "\" " +  this.trad('lnot2') + ": " + validlangs.join(', '), "pokemon");
		if (from === "english" || (to === "english" && bidirectional)) {
			try {
				var aliases = DataDownloader.getAliases();
				if (aliases[toId(word)]) word = aliases[toId(word)];
			} catch (e) {
				debug("Could not fetch aliases. Cmd: " + this.cmd + " " + arg + " | Room: " + this.room + " | By: " + this.by);
			}
		}
		//translation itself
		var translations = getTranslations(from, to, word);
		if (bidirectional) {
			var translationsInv = getTranslations(to, from, word);
			if (translationsInv && translationsInv.length) {
				if ((!translations || !translations.length) || (translationsInv[0].ld < translations[0].ld)) {
					translations = translationsInv;
					var temp = to;
					to = from;
					from = temp;
				}
			}
		}
		if (!translations || !translations.length) return this.restrictReply(this.trad('not1') + " \"" + word + "\" " + this.trad('not2') + " (" + from + " - " + to + ")", "pokemon");
		var text = "";
		if (normalize(translations[0].from) !== normalize(word)) text += this.trad('not1') + " \"" + word + "\" " + this.trad('not3') + ". ";
		text += this.trad('tra') + " **" + Tools.toName(translations[0].from) + "** (" + from + " - " + to + "): ";
		for (var i = 0; i < translations.length; i++) {
			if (normalize(translations[0].from) !== normalize(translations[i].from)) continue;
			if (typeof translations[i].to === "string") {
				text += "**" + Tools.toName(translations[i].to) + "** (" + (this.trad(translations[i].type) || translations[i].type) + ")";
			} else {
				text += "**" + Tools.toName(translations[i].to[0]) + "** (" + (this.trad(translations[i].type) || translations[i].type) + ")";
			}
			if (i < translations.length - 1) text += ", ";
		}
		this.restrictReply(text, "pokemon");
	},

	poke: 'randompokemon',
	randompoke: 'randompokemon',
	rpoke: 'randompokemon',
	randompokemon: function (arg, by, room, cmd) {
		var pokedex;
		try {
			pokedex = DataDownloader.getPokedex();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var pokeList = Object.keys(pokedex);
		var rpoke = pokeList[Math.floor(Math.random() * pokeList.length)];
		rpoke = pokedex[rpoke].species;
		if (!this.can('pokemon')) return this.pmReply(rpoke);
		if (cmd === 'poke' && this.botRanked(Tools.getGroup('voice'))) return this.reply('!dt ' + rpoke);
		this.reply(rpoke);
	},

	gen: function (arg, by, room, cmd) {
		var pokedex, aliases, movedex, abilities, items;
		try {
			pokedex = DataDownloader.getPokedex();
			aliases = DataDownloader.getAliases();
			movedex = DataDownloader.getMovedex();
			abilities = DataDownloader.getAbilities();
			items = DataDownloader.getItems();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var id = toId(arg);
		if (!id.length) return this.restrictReply(this.trad('err2'), 'pokemon');
		if (aliases[id]) id = toId(aliases[id]);
		var text = this.trad('g') + ' ' + id + ': ';
		if (id === 'metronome') {
			text += 'Move: Gen 1; Item: Gen 4';
		} else if (pokedex[id]) {
			if (pokedex[id].num < 0) text += 'CAP';
			else if (pokedex[id].num <= 151) text += 'Gen 1';
			else if (pokedex[id].num <= 251) text += 'Gen 2';
			else if (pokedex[id].num <= 386) text += 'Gen 3';
			else if (pokedex[id].num <= 493) text += 'Gen 4';
			else if (pokedex[id].num <= 649) text += 'Gen 5';
			else text += 'Gen 6';
		} else if (movedex[id]) {
			if (movedex[id].num <= 165) text += 'Gen 1';
			else if (movedex[id].num <= 251) text += 'Gen 2';
			else if (movedex[id].num <= 354) text += 'Gen 3';
			else if (movedex[id].num <= 467) text += 'Gen 4';
			else if (movedex[id].num <= 559) text += 'Gen 5';
			else if (movedex[id].num <= 617) text += 'Gen 6';
			else text += 'CAP';
		} else if (abilities[id]) {
			if (abilities[id].num <= 0) text += 'CAP';
			else if (abilities[id].num <= 76) text += 'Gen 3';
			else if (abilities[id].num <= 123) text += 'Gen 4';
			else if (abilities[id].num <= 164) text += 'Gen 5';
			else text += 'Gen 6';
		} else if (items[id]) {
			text += 'Gen ' + items[id].gen;
		} else {
			return this.restrictReply(this.trad('nfound'), 'pokemon');
		}
		this.restrictReply(text, 'pokemon');
	},

	viablemoves: 'randommoves',
	randommoves: function (arg, by, room, cmd) {
		var aliases, formatsdata, movedex;
		try {
			aliases = DataDownloader.getAliases();
			formatsdata = DataDownloader.getFormatsData();
			movedex = DataDownloader.getMovedex();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var args = arg.split(',');
		var text = '__' + this.trad('r') + '__: ';
		var whichRandom = 'randomBattleMoves';
		if (args[1] && toId(args[1]) in {'doubles': 1, '2': 1, 'double': 1, 'triples': 1, 'triple': 1, '3': 1}) {
			whichRandom = "randomDoubleBattleMoves";
			text = '__' + this.trad('rd') + '__: ';
		}
		var pokemon = toId(args[0]);
		if (!pokemon.length) return this.restrictReply(this.trad('err2'), 'pokemon');
		if (aliases[pokemon]) pokemon = toId(aliases[pokemon]);
		if (formatsdata[pokemon]) {
			var moves = '';
			for (var i in formatsdata[pokemon][whichRandom]) {
				moves += ', ' + movedex[formatsdata[pokemon][whichRandom][i]].name;
			}
			if (moves === '') text += 'none';
			else text += moves.substring(2);
			this.restrictReply(text, 'pokemon');
		} else {
			return this.restrictReply(this.trad('nfound'), 'pokemon');
		}
	},

	heavyslam: function (arg, by, room, cmd) {
		var pokedex, aliases;
		try {
			aliases = DataDownloader.getAliases();
			pokedex = DataDownloader.getPokedex();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var text = '';
		var pokemon = arg.split(',');
		var weight0, weight1;
		if (pokemon.length < 2) return this.restrictReply(this.trad('err2'), 'pokemon');
		pokemon[0] = toId(pokemon[0]);
		pokemon[1] = toId(pokemon[1]);
		if (aliases[pokemon[0]]) pokemon[0] = toId(aliases[pokemon[0]]);
		if (aliases[pokemon[1]]) pokemon[1] = toId(aliases[pokemon[1]]);
		if (pokedex[pokemon[0]]) weight0 = pokedex[pokemon[0]].weightkg;
		else return this.restrictReply(this.trad('n1'), 'pokemon');
		if (pokedex[pokemon[1]]) weight1 = pokedex[pokemon[1]].weightkg;
		else return this.restrictReply(this.trad('n2'), 'pokemon');
		text += this.trad('s') + ": ";
		if (weight0 / weight1 <= 2) text += "40";
		else if (weight0 / weight1 <= 3) text += "60";
		else if (weight0 / weight1 <= 4) text += "80";
		else if (weight0 / weight1 <= 5) text += "100";
		else text += "120";
		this.restrictReply(text, 'pokemon');
	},

	preevo: 'prevo',
	prevo: function (arg, by, room, cmd) {
		var pokedex, aliases;
		try {
			aliases = DataDownloader.getAliases();
			pokedex = DataDownloader.getPokedex();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var text = '';
		var pokemon = toId(arg);
		if (aliases[pokemon]) pokemon = toId(aliases[pokemon]);
		if (pokedex[pokemon]) {
			if (pokedex[pokemon].prevo) {
				text += pokedex[pokemon].prevo;
			} else text += this.trad('p1') + ' ' + pokemon + ' ' + this.trad('p2');
		} else {
			text += this.trad('nfound');
		}
		this.restrictReply(text, 'pokemon');
	},

	priority: function (arg, by, room, cmd) {
		var pokedex, aliases, movedex, learnsets;
		try {
			aliases = DataDownloader.getAliases();
			pokedex = DataDownloader.getPokedex();
			movedex = DataDownloader.getMovedex();
			learnsets = DataDownloader.getLearnsets();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var text = '';
		arg = toId(arg);
		if (aliases[arg]) arg = toId(aliases[arg]);
		if (pokedex[arg]) {
			var prioritymoves = [];
			var pokemonToCheck = [arg];
			var i = true;
			while (i) {
				if (pokedex[pokemonToCheck[pokemonToCheck.length - 1]].prevo) pokemonToCheck.push(pokedex[pokemonToCheck[pokemonToCheck.length - 1]].prevo.toLowerCase());
				else i = false;
			}
			for (var j in pokemonToCheck) {
				if (learnsets[pokemonToCheck[j]]) {
					for (var k in learnsets[pokemonToCheck[j]].learnset) {
						if (movedex[k]) {
							if (movedex[k].priority > 0 && movedex[k].basePower > 0) {
								if (prioritymoves.indexOf(movedex[k].name) === -1) {
									prioritymoves.push(movedex[k].name);
								}
							}
						}
					}
				}
			}
			prioritymoves.sort();
			text += prioritymoves.join(', ');
		} else {
			text += this.trad('err2');
		}
		if (text === '') text = this.trad('err3');
		this.restrictReply(text, 'pokemon');
	},

	boosting: function (arg, by, room, cmd) {
		var pokedex, aliases, movedex, learnsets;
		try {
			pokedex = DataDownloader.getPokedex();
			aliases = DataDownloader.getAliases();
			movedex = DataDownloader.getMovedex();
			learnsets = DataDownloader.getLearnsets();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var text = '';
		arg = toId(arg);
		if (aliases[arg]) arg = toId(aliases[arg]);
		if (pokedex[arg]) {
			var boostingmoves = [];
			var pokemonToCheck = [arg];
			var i = true;
			while (i) {
				if (pokedex[pokemonToCheck[pokemonToCheck.length - 1]].prevo) pokemonToCheck.push(pokedex[pokemonToCheck[pokemonToCheck.length - 1]].prevo);
				else i = false;
			}
			for (var j in pokemonToCheck) {
				if (learnsets[pokemonToCheck[j]]) {
					for (var k in learnsets[pokemonToCheck[j]].learnset) {
						if (movedex[k]) {
							if ((movedex[k].boosts && movedex[k].target === 'self' && k !== 'doubleteam' && k !== 'minimize') || k === 'bellydrum' || (movedex[k].secondary && movedex[k].secondary.chance === 100 && movedex[k].secondary.self && movedex[k].secondary.self.boosts)) {
								if (boostingmoves.indexOf(movedex[k].name) === -1) {
									boostingmoves.push(movedex[k].name);
								}
							}
						}
					}
				}
			}
			boostingmoves.sort();
			text += boostingmoves.join(', ');
		} else {
			text += this.trad('err2');
		}
		if (text === '') text = this.trad('err3');
		this.restrictReply(text, 'pokemon');
	},

	recovery: function (arg, by, room, cmd) {
		var pokedex, aliases, movedex, learnsets;
		try {
			pokedex = DataDownloader.getPokedex();
			aliases = DataDownloader.getAliases();
			movedex = DataDownloader.getMovedex();
			learnsets = DataDownloader.getLearnsets();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var text = '';
		arg = toId(arg);
		if (aliases[arg]) arg = toId(aliases[arg]);
		if (pokedex[arg]) {
			var recoverymoves = [];
			var drainmoves = [];
			var pokemonToCheck = [arg];
			var i = true;
			while (i) {
				if (pokedex[pokemonToCheck[pokemonToCheck.length - 1]].prevo) pokemonToCheck.push(pokedex[pokemonToCheck[pokemonToCheck.length - 1]].prevo);
				else i = false;
			}
			for (var j in pokemonToCheck) {
				if (learnsets[pokemonToCheck[j]]) {
					for (var k in learnsets[pokemonToCheck[j]].learnset) {
						if (movedex[k]) {
							if (movedex[k].heal || k === "synthesis" || k === "moonlight" || k === "morningsun" || k === "wish" || k === "swallow" || k === "rest") {
								if (recoverymoves.indexOf(movedex[k].name) === -1) {
									recoverymoves.push(movedex[k].name);
								}
							} else if (movedex[k].drain) {
								if (drainmoves.indexOf(movedex[k].name) === -1) {
									drainmoves.push(movedex[k].name);
								}
							}
						}
					}
				}
			}
			recoverymoves.sort();
			for (var l = 0; l < drainmoves.length; l++) {
				recoverymoves.push(drainmoves[l]);
			}
			text += recoverymoves.join(', ');
		} else {
			text += this.trad('err2');
		}
		if (text === '') text = this.trad('err3');
		this.restrictReply(text, 'pokemon');
	},

	hazards: 'hazard',
	hazard: function (arg, by, room, cmd) {
		var pokedex, aliases, movedex, learnsets;
		try {
			pokedex = DataDownloader.getPokedex();
			aliases = DataDownloader.getAliases();
			movedex = DataDownloader.getMovedex();
			learnsets = DataDownloader.getLearnsets();
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var text = '';
		arg = toId(arg);
		if (aliases[arg]) arg = toId(aliases[arg]);
		if (pokedex[arg]) {
			var hazards = [];
			var pokemonToCheck = [arg];
			var i = true;
			while (i) {
				if (pokedex[pokemonToCheck[pokemonToCheck.length - 1]].prevo) pokemonToCheck.push(pokedex[pokemonToCheck[pokemonToCheck.length - 1]].prevo);
				else i = false;
			}
			for (var j in pokemonToCheck) {
				if (learnsets[pokemonToCheck[j]]) {
					for (var k in learnsets[pokemonToCheck[j]].learnset) {
						if (movedex[k]) {
							if (k === "stealthrock" || k === "spikes" || k === "toxicspikes" || k === "stickyweb") {
								if (hazards.indexOf(movedex[k].name) === -1) {
									hazards.push(movedex[k].name);
								}
							}
						}
					}
				}
			}
			hazards.sort();
			text += hazards.join(', ');
		} else {
			text += this.trad('err2');
		}
		if (text === '') text = this.trad('err3');
		this.restrictReply(text, 'pokemon');
	}
};

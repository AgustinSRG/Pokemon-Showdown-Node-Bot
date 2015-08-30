
const ALIASES_FILE = './../data/aliases.js';
const POKEDEX_FILE = './../data/pokedex.js';
const MOVEDEX_FILE = './../data/moves.js';
const ABILITIES_FILE = './../data/abilities.js';
const ITEMS_FILE = './../data/items.js';
const LEARNSETS_FILE = './../data/learnsets-g6';
const FORMATS_DATA_FILE = './../data/formats-data.js';

Settings.addPermissions(['pokemon']);

exports.commands = {
	poke: 'randompokemon',
	randompoke: 'randompokemon',
	rpoke: 'randompokemon',
	randompokemon: function (arg, by, room, cmd) {
		var pokedex;
		try {
			pokedex = require(POKEDEX_FILE).BattlePokedex;
		} catch (e) {
			return this.pmReply(this.trad('err'));
		}
		var pokeList = Object.keys(pokedex);
		var rpoke = pokeList[Math.floor(Math.random() * pokeList.length)];
		rpoke = pokedex[rpoke].species;
		if (!this.can('pokemon')) return this.pmReply(rpoke);
		if (cmd === 'poke' && this.botRanked('+')) return this.reply('!dt ' + rpoke);
		this.reply(rpoke);
	},

	gen: function (arg, by, room, cmd) {
		var pokedex, aliases, movedex, abilities, items;
		try {
			pokedex = require(POKEDEX_FILE).BattlePokedex;
			aliases = require(ALIASES_FILE).BattleAliases;
			movedex = require(MOVEDEX_FILE).BattleMovedex;
			abilities = require(ABILITIES_FILE).BattleAbilities;
			items = require(ITEMS_FILE).BattleItems;
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
			this.restrictReply(this.trad('nfound'), 'pokemon');
		}
		this.restrictReply(text, 'pokemon');
	},

	viablemoves: 'randommoves',
	randommoves: function (arg, by, room, cmd) {
		var aliases, formatsdata, movedex;
		try {
			aliases = require(ALIASES_FILE).BattleAliases;
			formatsdata = require(FORMATS_DATA_FILE).BattleFormatsData;
			movedex = require(MOVEDEX_FILE).BattleMovedex;
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
			aliases = require(ALIASES_FILE).BattleAliases;
			pokedex = require(POKEDEX_FILE).BattlePokedex;
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
			aliases = require(ALIASES_FILE).BattleAliases;
			pokedex = require(POKEDEX_FILE).BattlePokedex;
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
			pokedex = require(POKEDEX_FILE).BattlePokedex;
			aliases = require(ALIASES_FILE).BattleAliases;
			movedex = require(MOVEDEX_FILE).BattleMovedex;
			learnsets = require(LEARNSETS_FILE).BattleLearnsets;
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
			pokedex = require(POKEDEX_FILE).BattlePokedex;
			aliases = require(ALIASES_FILE).BattleAliases;
			movedex = require(MOVEDEX_FILE).BattleMovedex;
			learnsets = require(LEARNSETS_FILE).BattleLearnsets;
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
			pokedex = require(POKEDEX_FILE).BattlePokedex;
			aliases = require(ALIASES_FILE).BattleAliases;
			movedex = require(MOVEDEX_FILE).BattleMovedex;
			learnsets = require(LEARNSETS_FILE).BattleLearnsets;
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
			pokedex = require(POKEDEX_FILE).BattlePokedex;
			aliases = require(ALIASES_FILE).BattleAliases;
			movedex = require(MOVEDEX_FILE).BattleMovedex;
			learnsets = require(LEARNSETS_FILE).BattleLearnsets;
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

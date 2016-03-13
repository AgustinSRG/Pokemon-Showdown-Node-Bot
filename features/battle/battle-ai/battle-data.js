/*
	Battle data
*/

const DATA_DIR = "./../../../data/";
const BAT_DATA_DIR = "./../data/";

exports.getEffect = function (effect, gen) {
	if (!effect || typeof effect === 'string') {
		var name = (effect || '').trim();
		if (name.substr(0, 5) === 'item:') {
			return exports.getItem(name.substr(5), gen);
		} else if (name.substr(0, 8) === 'ability:') {
			return exports.getAbility(name.substr(8), gen);
		} else if (name.substr(0, 5) === 'move:') {
			return exports.getMove(name.substr(5), gen);
		}

		var id = toId(name);
		effect = {};

		var pMove = exports.getMove(id, gen);
		var pAbility = exports.getAbility(id, gen);
		var pItem = exports.getItem(id, gen);
		var statuses = require(BAT_DATA_DIR + "statuses.js").BattleStatuses;

		if (id && statuses && statuses[id]) {
			effect = statuses[id];
			effect.exists = true;
		} else if (id && pMove.effect) {
			effect = pMove.effect;
			effect.exists = true;
		} else if (id && pAbility.effect) {
			effect = pAbility.effect;
			effect.exists = true;
		} else if (id && pItem.effect) {
			effect = pItem.effect;
			effect.exists = true;
		} else if (id === 'recoil') {
			effect = {
				effectType: 'Recoil'
			};
			effect.exists = true;
		} else if (id === 'drain') {
			effect = {
				effectType: 'Drain'
			};
			effect.exists = true;
		}
		if (!effect.id) effect.id = id;
		if (!effect.name) effect.name = Tools.escapeHTML(name);
		if (!effect.category) effect.category = 'Effect';
		if (!effect.effectType) effect.effectType = 'Effect';
	}
	return effect;
};

exports.getPokemon = exports.getTemplate = function (poke, gen) {
	if (!gen || gen > 6 || gen < 1) gen = 6;
	poke = toId(poke || "");
	var pokemon = {};
	var temp;
	try {
		temp = DataDownloader.getPokedex()[poke];
		for (var i in temp) pokemon[i] = temp[i];
	} catch (e) {}
	for (var i = 5; i >= gen; i--) {
		try {
			temp = require(BAT_DATA_DIR + "gen" + i + "/pokedex.js").BattlePokedex[poke];
			if (!temp) continue;
		} catch (e) {
			continue;
		}
		if (!temp.inherit) {
			for (var i in pokemon) delete pokemon[i];
		}
		for (var i in temp) pokemon[i] = temp[i];
	}
	if (!pokemon.species) {
		return {
			num: 235,
			species: "Smeargle",
			types: ["Normal"],
			baseStats: {hp: 55, atk: 20, def: 35, spa: 20, spd: 45, spe: 75},
			abilities: {0: "Own Tempo", 1: "Technician", H: "Moody"},
			heightm: 1.2,
			weightkg: 58,
			color: "White",
			eggGroups: ["Field"]
		};
	}
	return pokemon;
};

exports.getMove = function (move, gen) {
	if (!gen || gen > 6 || gen < 1) gen = 6;
	move = toId(move || "");
	if (move.indexOf("hiddenpower") === 0) {
		move = move.replace(/[0-9]/g, "");
	}
	var moveData = {};
	var temp;
	try {
		temp = DataDownloader.getMovedex()[move];
		for (var i in temp) moveData[i] = temp[i];
	} catch (e) {}
	for (var i = 5; i >= gen; i--) {
		try {
			temp = require(BAT_DATA_DIR + "gen" + i + "/moves.js").BattleMovedex[move];
			if (!temp) continue;
		} catch (e) {
			continue;
		}
		if (!temp.inherit) {
			for (var i in moveData) delete moveData[i];
		}
		for (var i in temp) moveData[i] = temp[i];
	}
	if (!moveData.id) {
		return {
			num: 165,
			accuracy: true,
			basePower: 50,
			category: "Physical",
			desc: "Deals typeless damage to one adjacent foe at random. If this move was successful, the user loses 1/4 of its maximum HP, rounded half up; the Ability Rock Head does not prevent this. This move can only be used if none of the user's known moves can be selected.",
			shortDesc: "User loses 25% of its max HP as recoil.",
			id: "struggle",
			name: "Struggle",
			pp: 1,
			noPPBoosts: true,
			priority: 0,
			flags: {contact: 1, protect: 1},
			noSketch: true,
			effectType: "Move"
		};
	}
	if (!moveData.effectType) moveData.effectType = 'Move';
	return moveData;
};

exports.getItem = function (item, gen) {
	if (!gen || gen > 6 || gen < 1) gen = 6;
	item = toId(item || "");
	var itemData = {};
	var temp;
	try {
		temp = DataDownloader.getItems()[item];
		for (var i in temp) itemData[i] = temp[i];
	} catch (e) {}
	for (var i = 5; i >= gen; i--) {
		try {
			temp = require(BAT_DATA_DIR + "gen" + i + "/items.js").BattleItems[item];
			if (!temp) continue;
		} catch (e) {
			continue;
		}
		if (!temp.inherit) {
			for (var i in itemData) delete itemData[i];
		}
		for (var i in temp) itemData[i] = temp[i];
	}
	if (!itemData.id) {
		return {
			id: "pokeball",
			name: "Poke Ball",
			spritenum: 345,
			num: 4,
			gen: 1,
			desc: "A device for catching wild Pokemon. It is designed as a capsule system.",
			category: "Effect",
			effectType: "Item"
		};
	}
	if (!itemData.category) itemData.category = 'Effect';
	if (!itemData.effectType) itemData.effectType = 'Item';
	return itemData;
};

exports.getAbility = function (ab, gen) {
	if (!gen || gen > 6 || gen < 1) gen = 6;
	ab = toId(ab || "");
	var ability = {};
	var temp;
	try {
		temp = DataDownloader.getAbilities()[ab];
		for (var i in temp) ability[i] = temp[i];
	} catch (e) {}
	for (var i = 5; i >= gen; i--) {
		try {
			temp = require(BAT_DATA_DIR + "gen" + i + "/abilities.js").BattleAbilities[ab];
			if (!temp) continue;
		} catch (e) {
			continue;
		}
		if (!temp.inherit) {
			for (var i in ability) delete ability[i];
		}
		for (var i in temp) ability[i] = temp[i];
	}
	if (!ability.id) {
		return {
			desc: "This Pokemon has no ability.",
			shortDesc: "This Pokemon has no ability.",
			id: "none",
			name: "None",
			rating: 1,
			num: 1,
			category: "Effect",
			effectType: "Ability"
		};
	}
	if (!ability.category) ability.category = 'Effect';
	if (!ability.effectType) ability.effectType = 'Ability';
	return ability;
};

var Move = exports.Move = (function () {
	function Move (template) {
		if (!template || typeof template !== "object") throw new Error("Invalid move template");
		this.template = template;
		this.name = this.template.name;
		this.id = this.template.id;
		this.pp = Math.floor(this.template.pp * 1.60);
		this.disabled = false;
		this.helpers = {};
	}

	Move.prototype.restorePP = function (pp) {
		if (pp) {
			this.pp += pp;
		} else {
			this.pp = Math.floor(this.template.pp * 1.60);
		}
	};

	return Move;
})();

exports.Pokemon = (function () {
	function Pokemon (template, properties) {
		if (!template || typeof template !== "object") throw new Error("Invalid pokemon template");

		this.template = template;
		this.species = this.template.species;
		this.name = this.template.species;

		this.transformed = false;
		this.transformPrev = null;

		this.gender = false;
		this.level = 100;
		this.shiny = false;

		this.item = "&unknown";
		this.itemEffect = '';
		this.prevItem = null;
		this.prevItemEffect = '';

		this.ability = "&unknown";
		this.supressedAbility = false;
		this.baseAbility = "&unknown";
		this.abilityStack = [];

		this.moves = [];

		this.active = false;
		this.slot = -1;

		this.hp = 100;
		this.fainted = false;
		this.status = false;
		this.volatiles = {};
		this.boosts = {};

		this.passing = false;
		this.prepared = null;

		this.helpers = {};

		for (var i in properties) {
			if (typeof this[i] === "undefined" || typeof this[i] === "function") continue;
			if (i === "template") continue;
			this[i] = properties[i];
		}
	}

	Pokemon.prototype.addVolatile = function (volatile) {
		volatile = toId(volatile);
		this.volatiles[volatile] = true;
	};

	Pokemon.prototype.removeVolatile = function (volatile) {
		volatile = toId(volatile);
		if (this.volatiles[volatile]) delete this.volatiles[volatile];
	};

	Pokemon.prototype.removeAllVolatiles = function () {
		for (var i in this.volatiles) delete this.volatiles[i];
	};

	Pokemon.prototype.addBoost = function (stat, n) {
		if (!this.boosts[stat]) this.boosts[stat] = 0;
		this.boosts[stat] += n;
	};

	Pokemon.prototype.setBoost = function (stat, n) {
		this.boosts[stat] = n;
	};

	Pokemon.prototype.invertAllBoosts = function () {
		for (var i in this.boosts) {
			this.boosts[i] = this.boosts[i] * (-1);
		}
	};

	Pokemon.prototype.removeAllBoosts = function () {
		for (var i in this.boosts) delete this.boosts[i];
	};

	Pokemon.prototype.markAbility = function (id, isNotBase) {
		this.ability = exports.getAbility(id);
		if ((!this.baseAbility || this.baseAbility === "&unknown") && !isNotBase) {
			this.baseAbility = this.ability;
			this.abilityStack.push(this.ability.id);
		} else if (isNotBase && this.baseAbility && this.baseAbility !== "&unknown") {
			if (this.ability.id === this.baseAbility.id) {
				if (this.abilityStack[this.abilityStack.length - 1] === this.ability.id) {
					this.abilityStack.pop();
				}
				if (this.abilityStack[this.abilityStack.length - 1]) {
					this.baseAbility = exports.getAbility(this.abilityStack[this.abilityStack.length - 1]);
				} else {
					this.baseAbility = "&unknown";
				}
			}
		}
	};

	Pokemon.prototype.prepareMove = function (move, target) {
		this.prepared = {
			move: move,
			target: target
		};
	};

	Pokemon.prototype.markMove = function (id, deduct) {
		id = toId(id);
		var move = null;
		for (var i = 0; i < this.moves.length; i++) {
			if (this.moves[i].id === id) {
				move = this.moves[i];
			}
		}
		if (move && deduct) {
			move.pp += deduct;
		}
		return move;
	};

	Pokemon.prototype.transformInto = function (pokemon) {
		this.transformPrev = {
			template: this.template,
			species: this.species,
			shiny: this.shiny,
			moves: this.moves,
			ability: this.ability,
			baseAbility: this.baseAbility,
			abilityStack: this.abilityStack
		};
		this.species = pokemon.species;
		this.template = pokemon.template;
		this.shiny = pokemon.shiny;
		this.ability = pokemon.shiny;
		this.baseAbility = pokemon.shiny;
		this.abilityStack = pokemon.abilityStack.slice();
		this.moves = [];
		var mv;
		for (var i = 0; i < pokemon.moves.length; i++) {
			mv = new Move(pokemon.moves[i].template);
			mv.pp = 5;
			this.moves.push(mv);
		}
		this.transformed = true;
		this.removeAllBoosts();
		for (var i in pokemon.boosts) this.boosts[i] = pokemon.boosts[i];
		this.addVolatile('transform');
		this.addVolatile('formechange');
		this.volatiles.formechange = (pokemon.volatiles.formechange ? pokemon.volatiles.formechange : pokemon.species);
	};

	Pokemon.prototype.unTransform = function () {
		this.transformed = false;
		if (this.transformPrev) {
			this.template = this.transformPrev.template;
			this.species = this.transformPrev.species;
			this.shiny = this.transformPrev.shiny;
			this.moves = this.transformPrev.moves;
			this.ability = this.transformPrev.ability;
			this.baseAbility = this.transformPrev.baseAbility;
			this.abilityStack = this.transformPrev.abilityStack;
		}
		this.transformPrev = null;
	};

	return Pokemon;
})();

exports.Player = (function () {
	function Player (id, name, avatar) {
		this.id = id || "p0";
		this.name = name || "";
		this.userid = toId(name || "");
		this.avatar = avatar || 0;
		this.active = [];
		this.side = {};
		this.pokemon = [];
		this.teamPv = [];
	}

	Player.prototype.setName = function (name) {
		this.name = name;
		this.userid = toId(name);
	};

	Player.prototype.removeSideCondition = function (condition) {
		condition = toId(condition);
		if (this.side[condition]) delete this.side[condition];
	};

	Player.prototype.addSideCondition = function (condition) {
		condition = toId(condition);
		if (!this.side[condition]) this.side[condition] = 0;
		this.side[condition]++;
	};

	return Player;
})();

exports.getFormatsData = function (gen) {
	if (!gen || gen > 6 || gen < 1) gen = 6;
	try {
		return require(BAT_DATA_DIR + "gen" + gen + "/formats-data.js").BattleFormatsData;
	} catch (e) {
		try {
			return DataDownloader.getFormatsData();
		} catch (ex) {
			return null;
		}
	}
};

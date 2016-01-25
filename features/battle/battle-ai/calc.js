/*
 * Pokemon Showdown Bot - Damage calculator
*/

var typechart = require('./typechart.js');

var Pokemon = exports.Pokemon = (function () {
	function Pokemon (template, properties) {
		if (!template || typeof template !== "object") throw new Error("Invalid pokemon template");
		this.template = template;
		this.name = this.template.species;
		this.species = this.template.species;
		this.gender = false;
		this.item = null;
		this.stats = {};
		this.evs = {};
		this.ivs = {};
		this.dvs = {};
		this.nature = null;
		this.ability = null;
		this.level = 100;
		this.shiny = false;
		this.happiness = 255;
		this.status = false;
		this.hp = 100;
		for (var i in properties) {
			if (typeof this[i] === "undefined" || typeof this[i] === "function") continue;
			if (i === "template") continue;
			this[i] = properties[i];
		}
	}

	Pokemon.prototype.getEV = function (ev) {
		return this.evs[ev] || 0;
	};

	Pokemon.prototype.getIV = function (iv) {
		return this.ivs[iv] || 31;
	};

	Pokemon.prototype.getDV = function (dv) {
		return this.dvs[dv] || 15;
	};

	Pokemon.prototype.getBaseStat = function (stat) {
		if (this.template && this.template.baseStats)
			return this.template.baseStats[stat] || 0;
		else
			return 0;
	};

	Pokemon.prototype.getStats = function (gen) {
		if (!gen) gen = 6;
		var stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
		var res = {};
		for (var i = 0; i < stats.length; i++) {
			if (this.stats[stats[i]]) {
				res[stats[i]] = this.stats[stats[i]];
				continue;
			}
			if (gen <= 2) {
				if (stats[i] === 'hp') {
					res[stats[i]] = Math.floor(((this.getBaseStat(stats[i]) + this.getDV(stats[i])) * 2 + Math.floor((Math.sqrt(65024) + 1) / 4)) * this.level / 100) + 10 + this.level;
				} else {
					res[stats[i]] = Math.floor(((this.getBaseStat(stats[i]) + this.getDV(stats[i])) * 2 + Math.floor((Math.sqrt(65024) + 1) / 4)) * this.level / 100) + 5;
				}
			} else {
				if (stats[i] === 'hp') {
					res[stats[i]] = Math.floor((2 * this.getBaseStat(stats[i]) + this.getIV(stats[i]) + this.getEV(stats[i])) * this.level / 100 + this.level + 10);
				} else {
					res[stats[i]] = Math.floor(Math.floor((2 * this.getBaseStat(stats[i]) + this.getIV(stats[i]) + this.getEV(stats[i])) * this.level / 100 + 5) * (this.nature ? (this.nature.value || 1) : 1));
				}
			}
		}
		return res;
	};

	return Pokemon;
})();

var Conditions = exports.Conditions = (function () {
	function Conditions (data) {
		if (typeof data !== "object") throw new Error("Invalid conditions data");
		this.volatiles = {};
		this.boosts = {};
		this.side = {};
		this.inmediate = {};
		for (var i in data) {
			if (typeof this[i] === "undefined" || typeof this[i] === "function") continue;
			this[i] = data[i];
		}
	}

	return Conditions;
})();

var getRolls = exports.getRolls = function (n, p) {
	if (!p) p = 0.85;
	var r = [];
	for (var m = n * p; m <= n; m++) {
		r.push(m);
	}
	return r;
};

var Damage = exports.Damage = (function () {
	function Damage (hp, rolls) {
		this.rolls = rolls || [];
		this.hp = hp || 0;
		this.percents = [];
		for (var i = 0; i < this.rolls.length; i++) {
			if (hp === 0) {
				this.percents.push(100);
				continue;
			}
			this.percents.push(this.rolls[i] * 100 / hp);
		}
	}

	Damage.prototype.getChance = function (p) {
		if (!this.percents || this.percents.length) return 0;
		if (!this.hp || this.hp <= 0) return 100;
		var s = 0;
		for (var i = 0; i < this.percents.length; i++) {
			if (this.percents[i] >= p) s++;
		}
		return (s * 100 / this.percents.length);
	};

	Damage.prototype.getMax = function () {
		if (!this.percents.length) return 0;
		return this.percents[this.percents.length - 1];
	};

	Damage.prototype.getMin = function () {
		if (!this.percents.length) return 0;
		return this.percents[0];
	};

	return Damage;
})();

exports.getHazardsDamage = function (poke, conditions, gen, inverse) {
	var dmg = 0;
	var side = conditions.side;
	if (gen >= 3 && poke.ability && poke.ability.id === "magicguard") return 0;
	if (side["stealthrock"]) {
		dmg += (100 / 8) * typechart.getMultipleEff("Rock", poke.template.types, gen, inverse);
	}
	if (side["spikes"]) {
		if (typechart.getMultipleEff("Ground", poke.template.types, gen, inverse) !== 0 && (gen < 3 || !poke.ability || poke.ability.id !== "levitate")) {
			dmg += (100 / 24) * (side["spikes"] || 1);
		}
	}
	return dmg;
};

/*
 * Damage calculator function
 *
 * Arguments:
 *
 *  - pokeA, pokeB (Pokemon)
 *  - move (move template)
 *
 * Optional arguments:
 *
 *  - conditionsA, conditionsB (Conditions)
 *  - gconditions (Global conditions)
 *  - gen (6 by default)
*/

exports.calculate = function (pokeA, pokeB, move, conditionsA, conditionsB, gconditions, gen) {
	if (!gen) gen = 6;
	if (!gconditions) gconditions = {};
	if (!conditionsA) conditionsA = {};
	if (!conditionsB) conditionsB = {};

	var statsA = pokeA.getStats(gen), statsB = pokeB.getStats(gen);

	var atk, def, bp, atkStat, defStat;
	var cat, defcat;

	/******************************
	* Attack and Defense Stats
	*******************************/
	if (gen > 3) {
		if (move.category === "Special") {
			atk = statsA.spa;
			atkStat = "spa";
		} else if (move.category === "Physical") {
			atk = statsA.atk;
			atkStat = "atk";
		} else {
			return new Damage(statsB.hp);
		}
		cat = defcat = move.category;
		if (move.defensiveCategory) defcat = move.defensiveCategory;
		if (defcat === "Special") {
			def = statsA.spd;
			defStat = "spd";
		} else {
			def = statsA.def;
			defStat = "def";
		}
	} else {
		var specialTypes = {Fire: 1, Water: 1, Grass: 1, Ice: 1, Electric: 1, Dark: 1, Psychic: 1, Dragon: 1};
		if (move.type && move.type in specialTypes) {
			cat = defcat = "Special";
			atk = statsA.spa;
			atkStat = "spa";
		} else {
			cat = defcat = "Physical";
			atk = statsA.atk;
			atkStat = "atk";
		}
		if (move.defensiveCategory) defcat = move.defensiveCategory;
		if (defcat === "Special") {
			def = statsA.spd;
			defStat = "spd";
		} else {
			def = statsA.def;
			defStat = "def";
		}
	}

	if (atkStat === "atk" && pokeA.status === "brn") {
		if (gen < 3 || !pokeA.ability || pokeA.ability.id !== "guts") atk = Math.floor(atk * 0.5);
	}

	/******************************
	* Inmunity (0 damage)
	* Types (effectiveness)
	*******************************/

	var typesMux = 1;
	var moveType = move.type;
	var inmune = false;

	switch (move.id) {
		case "naturalgift":
			if (pokeA.item && pokeA.item.naturalGift && pokeA.item.naturalGift.type) moveType = pokeA.item.naturalGift.type;
			else moveType = "Normal";
			break;
		case "judgment":
			if (pokeA.item && pokeA.item.onPlate) moveType = pokeA.item.onPlate;
			else moveType = "Normal";
			break;
		case "weatherball":
			if (gconditions.weather === "primordialsea" || gconditions.weather === "raindance") moveType = "Water";
			else if (gconditions.weather === "desolateland" || gconditions.weather === "sunnyday") moveType = "Fire";
			else if (gconditions.weather === "sandstorm") moveType = "Rock";
			else if (gconditions.weather === "hail") moveType = "Ice";
			else moveType = "Normal";
			break;
	}

	if (gen >= 3 && pokeA.ability) {
		switch (pokeA.ability.id) {
			case "aerilate":
				if (moveType === "Normal") moveType = "Flying";
				break;
			case "pixilate":
				if (moveType === "Normal") moveType = "Fairy";
				break;
			case "refrigerate":
				if (moveType === "Normal") moveType = "Ice";
				break;
			case "blaze":
				if (moveType === "Fire" && pokeA.hp <= (100 / 3)) atk = Math.floor(atk * 1.5);
				break;
			case "defeatist":
				if (pokeA.hp < 50 && cat === "Physical") atk = Math.floor(atk * 0.5);
				break;
			case "guts":
				if (pokeA.status && cat === "Physical") atk = Math.floor(atk * 1.5);
				break;
			case "hugepower":
			case "purepower":
				if (cat === "Physical") atk = Math.floor(atk * 2);
				break;
			case "hustle":
				if (cat === "Physical") atk = Math.floor(atk * 1.5);
				break;
			case "overgrow":
				if (moveType === "Grass" && pokeA.hp <= (100 / 3)) atk = Math.floor(atk * 1.5);
				break;
			case "swarm":
				if (moveType === "Bug" && pokeA.hp <= (100 / 3)) atk = Math.floor(atk * 1.5);
				break;
			case "torrent":
				if (moveType === "Water" && pokeA.hp <= (100 / 3)) atk = Math.floor(atk * 1.5);
				break;
		}
	}

	var eff;
	var defTypes = pokeB.template.types.slice();
	if (conditionsB.volatiles["typechange"] && conditionsB.volatiles["typechange"].length) defTypes = conditionsB.volatiles["typechange"].slice();
	if (conditionsB.volatiles["typeadd"]) defTypes.push(conditionsB.volatiles["typeadd"]);
	//debug(defTypes);
	for (var t = 0; t < defTypes.length; t++) {
		eff = typechart.getEffectiveness(moveType, defTypes[t], gen);
		//debug("EFF [" + moveType + ", " + defTypes[t] + "] = " + eff);
		if (!eff && defTypes[t] === "Ghost") {
			if (conditionsB.volatiles["foresight"]) eff = 1;
			if (gen >= 3 && pokeA.ability && pokeA.ability.id === "scrappy") eff = 1;
		}
		if (move.id === "freezedry" && defTypes[t] === "Water") eff = 2;
		if (gconditions["inversebattle"]) {
			if (eff === 0) eff = 2;
			else eff = 1 / eff;
		}
		typesMux *= eff;
	}

	if (gen >= 3 && pokeB.ability && (!pokeA.ability || !(pokeA.ability.id in {"moldbreaker": 1, "turboblaze": 1, "teravolt": 1}))) {
		switch (pokeB.ability.id) {
			case "dryskin":
			case "stormdrain":
			case "waterabsorb":
				if (moveType === "Water") inmune = true;
				break;
			case "flashfire":
				if (moveType === "Fire") inmune = true;
				break;
			case "levitate":
				if (moveType === "Ground") inmune = true;
				break;
			case "lightningrod":
			case "motordrive":
			case "voltabsorb":
				if (moveType === "Electric") inmune = true;
				break;
			case "sapsipper":
				if (moveType === "Grass") inmune = true;
				break;
			case "thickfat":
				if (moveType === "Ice" || moveType === "Fire") atk = Math.floor(atk * 0.5);
				break;
			case "wonderguard":
				if (typesMux < 2) typesMux = 0;
				break;
		}
	}

	if (inmune || typesMux === 0) return new Damage(statsB.hp);

	/******************************
	* Base power
	*******************************/

	bp = move.basePower || 0;

	switch (move.id) {
		case "frustration":
			bp = Math.floor(((255 - pokeA.happiness) * 10) / 25) || 1;
			break;
		case "return":
			bp = Math.floor((pokeA.happiness * 10) / 25) || 1;
			break;
		case "fling":
			if (pokeA.item && pokeA.item.fling) bp = pokeA.item.fling.basePower || 0;
			else bp = 0;
			break;
		case "naturalgift":
			if (pokeA.item && pokeA.item.naturalGift && pokeA.item.naturalGift.basePower) bp = pokeA.item.naturalGift.basePower;
			else bp = 0;
			break;
		case "grassknot":
			if (pokeB.template.weightkg) {
				if (pokeB.template.weightkg >= 200) {
					bp = 120;
				} else if (pokeB.template.weightkg >= 100) {
					bp = 100;
				} else if (pokeB.template.weightkg >= 50) {
					bp = 80;
				} else if (pokeB.template.weightkg >= 25) {
					bp = 60;
				} else if (pokeB.template.weightkg >= 10) {
					bp = 40;
				} else {
					bp = 20;
				}
			}
			break;
		case "gyroball":
			bp = (Math.floor(25 * statsB.spe / statsA.spe) || 1);
			if (bp > 150) bp = 150;
			break;
	}

	if (!bp) {
		if (move.damage === "level") return new Damage(statsB.hp, [pokeA.level]);
		if (typeof move.damage === "number") return new Damage(statsB.hp, [move.damage]);
		return new Damage(statsB.hp);
	}

	switch (move.id) {
		case "venoshock":
			if (pokeB.status === 'psn' || pokeB.status === 'tox') bp = Math.floor(bp * 2);
			break;
		case "brine":
			if (pokeB.hp < 50) bp = Math.floor(bp * 2);
			break;
		case "facade":
			if (pokeA.status && pokeA.status !== 'slp') bp = Math.floor(bp * 2);
			break;
		case "knockoff":
			if (pokeB.item && !pokeB.onTakeItem) bp = Math.floor(bp * 1.5);
			break;
		case "retaliate":
			if (conditionsA.side.faintedLastTurn) bp = Math.floor(bp * 2);
			break;
		case "solarbeam":
			if (gconditions.weather === "primordialsea" || gconditions.weather === "raindance" || gconditions.weather === "sandstorm" || gconditions.weather === "hail") bp = Math.floor(bp * 0.5);
			break;
		case "hyperspacefury":
			if (pokeA.template.species !== "Hoopa-Unbound") bp = 0;
			break;
		case "waterspout":
		case "eruption":
			bp *= pokeA.hp / 100;
			break;
	}

	if (gen >= 3 && pokeA.ability) {
		switch (pokeA.ability.id) {
			case "technician":
				if (bp <= 60) bp = Math.floor(bp * 1.5);
				break;
			case "toxicboost":
				if (cat === "Physical" && (pokeA.status === "psn" || pokeA.status === "tox")) bp = Math.floor(bp * 1.5);
				break;
			case "toughclaws":
				if (move.flags && move.flags['contact']) bp = Math.floor(bp * 1.3);
				break;
			case "aerilate":
			case "pixilate":
			case "refrigerate":
				if (move.type === "Normal") bp = Math.floor(bp * 1.3);
				break;
			case "flareboost":
				if (cat === "Special" && pokeA.status === "brn") bp = Math.floor(bp * 1.5);
				break;
			case "ironfist":
				if (move.flags && move.flags['punch']) bp = Math.floor(bp * 1.2);
				break;
			case "megalauncher":
				if (move.flags && move.flags['pulse']) bp = Math.floor(bp * 1.5);
				break;
			case "parentalbond":
				if (!move.selfdestruct && !move.multihit && (!move.flags || !move.flags['charge']) && !move.spreadHit)
					bp = Math.floor(bp * 1.5); //Multi Hit
				break;
			case "reckless":
				if (move.recoil || move.hasCustomRecoil) bp = Math.floor(bp * 1.2);
				break;
			case "rivalry":
				if (pokeA.gender && pokeB.gender) {
					if (pokeA.gender === pokeB.gender) {
						bp = Math.floor(bp * 1.25);
					} else {
						bp = Math.floor(bp * 0.75);
					}
				}
				break;
			case "sandforce":
				if (gconditions.weather === "sandstorm") {
					if (moveType === 'Rock' || moveType === 'Ground' || moveType === 'Steel')
						bp = Math.floor(bp * 1.3);
				}
				break;
			case "sheerforce":
				if (move.secondaries) bp = Math.floor(bp * 1.5);
				break;
			case "strongjaw":
				if (move.flags && move.flags['bite']) bp = Math.floor(bp * 1.5);
				break;
		}
	}

	if (gen >= 3 && pokeB.ability && (!pokeA.ability || !(pokeA.ability.id in {"moldbreaker": 1, "turboblaze": 1, "teravolt": 1}))) {
		switch (pokeB.ability.id) {
			case "dryskin":
				if (moveType === "Fire") bp = Math.floor(bp * 1.3);
				break;
			case "heatproof":
				if (moveType === "Fire") bp = Math.floor(bp * 0.5);
				break;
		}
	}

	if (pokeA.item) {
		switch (pokeA.item.id) {
			case "choiceband":
				if (atkStat === "atk") atk = Math.floor(atk * 1.5);
				break;
			case "choicespecs":
				if (atkStat === "spa") atk = Math.floor(atk * 1.5);
				break;
		}
	}

	if (pokeB.item) {
		switch (pokeB.item.id) {
			case "airballoon":
				if (moveType === "Ground") bp = 0;
				break;
		}
	}

	/******************************
	* Modifiers
	*******************************/

	var modifier = 1;

	if (pokeA.item && pokeA.item.id === "lifeorb") modifier *= 1.3;

	/* STAB */
	if (pokeA.template.types.indexOf(moveType) >= 0) {
		if (gen >= 3 && pokeA.ability && pokeA.ability.id === "adaptability") modifier *= 2;
		else modifier *= 1.5;
	}

	/* Weather */
	if (gen < 3 || !pokeA.ability || pokeA.supressedAbility || !(pokeA.ability.id in {'airlock': 1, 'cloudnine': 1})) {
		if (move.type === "Water" && (gconditions.weather === "primordialsea" || gconditions.weather === "raindance")) modifier *= 2;

		if (move.type === "Fire" && (gconditions.weather === "desolateland" || gconditions.weather === "sunnyday")) modifier *= 2;

		if (gconditions.weather === "desolateland" && move.type === "Water") modifier = 0;
		if (gconditions.weather === "primordialsea" && move.type === "Fire") modifier = 0;
	}

	if (gen >= 4 && defTypes.indexOf("Rock") >= 0 && gconditions.weather === "sandstorm") {
		if (defStat === "spd") def = Math.floor(def * 1.5);
	}

	/* Boosting */

	if (conditionsA.boosts[atkStat]) {
		if (!pokeB.ability || pokeB.ability.id !== "unaware") {
			var muxOff = 1 + (0.5) * Math.abs(conditionsA.boosts[atkStat]);
			if (conditionsA.boosts[atkStat] < 0) muxOff = 1 / muxOff;
			atk = Math.floor(atk * muxOff);
		}
	}

	if (conditionsB.boosts[defStat]) {
		if (!conditionsA.inmediate["crit"] && !move.willCrit && !move.ignoreDefensive && (!pokeA.ability || pokeA.ability.id !== "unaware")) {
			var muxDef = 1 + (0.5) * Math.abs(conditionsB.boosts[defStat]);
			if (conditionsB.boosts[defStat] < 0) muxDef = 1 / muxDef;
			def = Math.floor(def * muxDef);
		}
	}

	/* Inmediate */

	if (conditionsA.inmediate["crit"] || move.willCrit) {
		if (gen > 5) modifier *= 1.5;
		else modifier *= 2;
	}

	if (conditionsA.inmediate["helpinghand"]) modifier *= 1.5;

	/* Side */

	if (conditionsB.side["reflect"] && cat === "Physical") modifier *= 0.5;
	if (conditionsB.volatiles["reflect"] && cat === "Physical") modifier *= 0.5; // Gen 1

	if (conditionsB.side["lightscreen"] && cat === "Special") modifier *= 0.5;

	if (conditionsB.volatiles["magnetrise"] && moveType === "Ground") modifier = 0;

	/* Field */

	if (gconditions["electricterrain"] && moveType === "Electric") bp = Math.floor(bp * 1.5);
	if (gconditions["grassyterrain"] && moveType === "Grass") bp = Math.floor(bp * 1.5);

	if (gconditions["gametype"] === "doubles" || gconditions["gametype"] === "triples") {
		if (move.target === "allAdjacentFoes") modifier *= 0.75;
	}

	/******************************
	* Damage
	*******************************/

	var dmg = (((((2 * pokeA.level / 5) + 2) * atk * bp / def) / 50) + 2) * typesMux * modifier;
	if (bp === 0) dmg = 0;

	return new Damage(statsB.hp, getRolls(dmg));
};

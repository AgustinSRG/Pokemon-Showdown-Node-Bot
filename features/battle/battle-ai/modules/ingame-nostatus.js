/*
 * Ingame (No Status)
 *
 * Simple algorithm, just choose the move that causes more damage
 * No switchs, No status moves
 *
 * Recommended: 1v1, Challenge Cup 1v1
 *
 * System:
 *
 *  - Priority 100000 - Moves that causes > 0
 *	- Priority 1000 - Status moves
 *  - Priority 0 - Team
 *  - Priority -1000 - Switch / Shift / Pass
 *	- Priority -100000 - Moves 0 damage
 */

var Calc = require('./../calc.js');
var Pokemon = Calc.Pokemon;
var Conditions = Calc.Conditions;

var Data = require('./../battle-data.js');

exports.id = "ingame-nostatus";

/*
 * Bad moves for 1v1
 */
const BadMoves = ['focuspunch', 'explosion', 'selfdestruct', 'lastresort', 'dreameater', 'snore'];

/*
 * Moves which require 2 turs without any protection
 */
const DoubleTurnMoves = ['solarbeam'];

/*
 * Team and Switch Decisions
 */

function getPokemonAverage (battle, s) {
	if (!battle.foe.teamPv.length) return 0;

	var p = battle.request.side.pokemon[s];
	var pokeA = battle.getCalcRequestPokemon(s, true);
	if (toId(battle.tier || "").indexOf("challengecup") >= 0) pokeA.happiness = 100;

	var final = 0;
	var conditions = new Conditions({});
	for (var i = 0; i < battle.foe.teamPv.length; i++) {
		var pokeView = battle.foe.teamPv[i];
		var template = Data.getPokemon(pokeView.species, battle.gen);
		var poke = new Pokemon(template, {
			level: pokeView.level,
			gender: pokeView.gender,
			evs: {hp: 192, def: 124, spd: 124}
		});
		if (toId(battle.tier || "").indexOf("challengecup") >= 0) poke.happiness = 100;
		if (template.abilities) poke.ability = Data.getAbility(template.abilities[0], battle.gen);
		var calcVal = 0;
		for (var j = 0; j < p.moves.length; j++) {
			var move = Data.getMove(p.moves[j], battle.gen);
			if (move.category === "Status") continue;
			if (BadMoves.indexOf(move.id) >= 0) continue;
			var dmg = Calc.calculate(pokeA, poke, move, conditions, conditions, battle.conditions, battle.gen);
			//debug("DMG [" + pokeA.species + ", " + poke.species + ", " + move.name + "] = " + dmg.getMax());
			if (DoubleTurnMoves.indexOf(move.id) >= 0) calcVal += dmg.getMax() * 0.5;
			else calcVal += dmg.getMax();
		}
		final += (calcVal / 4);
	}
	return 0 + final;
}

function evaluateTeamDecision (battle, des) {
	var final = 0;
	for (var i = 0; i < des.team.length; i++) {
		final += getPokemonAverage(battle, des.team[i]);
	}
	return final;
}

/*
 * Switch Decisions
 */

function getSwitchAverage (battle, s) {
	var final = 0;
	var p = battle.request.side.pokemon[s];
	var pokeA = battle.getCalcRequestPokemon(s, true);
	if (toId(battle.tier || "").indexOf("challengecup") >= 0) pokeA.happiness = 100;
	var conditionsA = new Conditions({
		side: battle.self.side,
		volatiles: {},
		boosts: {}
	});
	for (var i = 0; i < p.moves.length; i++) {
		var move = Data.getMove(p.moves[i], battle.gen);
		var targets = battle.foe.active;
		for (var j = 0; j < targets.length; j++) {
			if (!targets[j]) continue;
			var conditionsB = new Conditions({
				side: battle.foe.side,
				volatiles: targets[j].volatiles,
				boosts: targets[j].boosts
			});
			var pokeB = new Pokemon(targets[j].template, {
				level: targets[j].level,
				gender: targets[j].gender,
				shiny: targets[j].shiny,
				evs: {hp: 192, def: 124, spd: 124}
			});
			pokeB.hp = targets[j].hp;
			pokeB.status = targets[j].status;
			if (targets[j].item === "&unknown") {
				pokeB.item = null;
			} else {
				pokeB.item = targets[j].item;
			}
			if (!targets[j].supressedAbility) {
				if (targets[j].ability === "&unknown") {
					pokeB.ability = pokeB.template.abilities ? pokeB.template.abilities[0] : null;
				} else {
					pokeB.ability = targets[j].ability;
				}
			}
			var dmg = Calc.calculate(pokeA, pokeB, move, conditionsA, conditionsB, battle.conditions, battle.gen);
			//debug("DMG [" + pokeA.species + ", " + pokeB.species + ", " + move.name + "] = " + dmg.getMax());
			if (DoubleTurnMoves.indexOf(move.id) >= 0) final += dmg.getMax() * 0.5;
			else final += dmg.getMax();
		}
	}
	if (!p.moves.length) return 0;
	return final / p.moves.length;
}

function evaluateSwitchDecision (battle, des) {
	var final = -1000;
	final += getSwitchAverage(battle, des.pokeId);
	return final;
}

/*
 * Move Decisions
 */

function evaluateMoveDecision (battle, desEnv, des, act) {
	var final = 0;
	var p = battle.request.side.pokemon[act];
	var a = battle.request.active[act];
	var move = Data.getMove(p.moves[des.moveId]);

	if (move.category === "Status") return 0;
	if (BadMoves.indexOf(move.id) >= 0) return 0;
	if (des.target < 0) return 0; // Do not kill your own allies

	if (a.canMegaEvo || p.canMegaEvo) {
		if (!des.mega) return 0; // Mega evolve by default
	}

	var pokeA = battle.getCalcRequestPokemon(act, true);
	if (toId(battle.tier || "").indexOf("challengecup") >= 0) pokeA.happiness = 100; // Random
	var conditionsA = new Conditions({
		side: battle.self.side,
		volatiles: battle.self.active[act].volatiles,
		boosts: battle.self.active[act].boosts
	});

	var targets = [];
	if (typeof des.target === "number") {
		targets = [battle.foe.active[des.target]];
	} else {
		targets = battle.foe.active;
	}

	for (var i = 0; i < targets.length; i++) {
		if (!targets[i]) continue;
		var conditionsB = new Conditions({
			side: battle.foe.side,
			volatiles: targets[i].volatiles,
			boosts: targets[i].boosts
		});
		var pokeB = new Pokemon(targets[i].template, {
			level: targets[i].level,
			gender: targets[i].gender,
			shiny: targets[i].shiny,
			evs: {hp: 192, def: 124, spd: 124}
		});
		pokeB.hp = targets[i].hp;
		pokeB.status = targets[i].status;
		if (targets[i].item === "&unknown") {
			pokeB.item = null;
		} else {
			pokeB.item = targets[i].item;
		}
		if (!targets[i].supressedAbility) {
			if (targets[i].ability === "&unknown") {
				pokeB.ability = pokeB.template.abilities ? pokeB.template.abilities[0] : null;
			} else {
				pokeB.ability = targets[i].ability;
			}
		}
		var dmg = Calc.calculate(pokeA, pokeB, move, conditionsA, conditionsB, battle.conditions, battle.gen);
		//debug("DMG [" + pokeA.species + ", " + pokeB.species + ", " + move.name + "] = " + dmg.getMax());
		if (DoubleTurnMoves.indexOf(move.id) >= 0) final += dmg.getMax() * 0.5;
		else final += dmg.getMax();
	}
	if (!final) return -100000; // Inmmune
	return 100000 + final;
}

/*
 * Swapper
 */

function getDecisionValue (battle, decisions, desEnv, des, act) {
	if (des.type === "team") {
		return evaluateTeamDecision(battle, des);
	} else if (des.type === "move") {
		return evaluateMoveDecision(battle, desEnv, des, act);
	} else if (des.type === "switch") {
		return evaluateSwitchDecision(battle, des);
	} else {
		return -1000; // Pass, Shift
	}
}

exports.decide = function (battle, decisions) {
	var dTable = [];
	var p, maxP;
	maxP = null;
	for (var d = 0; d < decisions.length; d++) {
		p = 0;
		for (var i = 0; i < decisions[d].length; i++) {
			p += getDecisionValue(battle, decisions, decisions[d], decisions[d][i], i);
		}
		dTable.push({des: d, val: p});
		if (maxP === null || maxP < p) maxP = p;
	}
	var chosen = [];
	for (var j = 0; j < dTable.length; j++) {
		if (dTable[j].val === maxP && decisions[dTable[j].des])
			chosen.push(decisions[dTable[j].des]);
	}
	return chosen[Math.floor(Math.random() * chosen.length)];
};


/*
* Decision maker
*/

var MoveDecision = exports.MoveDecision = (function () {
	function MoveDecision (moveId, target, mega, move) {
		this.type = "move";
		this.move = move || "struggle";
		this.moveId = moveId || 0;
		this.mega = mega || false;
		this.target = target;
	}

	return MoveDecision;
})();

var SwitchDecision = exports.SwitchDecision = (function () {
	function SwitchDecision (pokeId, poke) {
		this.type = "switch";
		this.poke = poke || "pikachu";
		this.pokeId = pokeId || 0;
	}

	return SwitchDecision;
})();

var TeamDecision = exports.TeamDecision = (function () {
	function TeamDecision (team) {
		this.type = "team";
		this.team = team || [0, 1, 2, 3, 4, 5];
	}

	return TeamDecision;
})();

var PassDecision = exports.PassDecision = (function () {
	function PassDecision () {
		this.type = "pass";
	}

	return PassDecision;
})();

var ShiftDecision = exports.ShiftDecision = (function () {
	function ShiftDecision () {
		this.type = "shift";
	}

	return ShiftDecision;
})();

function isTooFar(battle, a, b) {
	if (battle.gametype === 'triples') {
		return ((a === 0 && b === 0) || (a === 2 && b === 2));
	} else {
		return false;
	}
}

function combinateTeamPreview (array, i, values, solutions) {
	if (i >= array.length) {
		solutions.push(array.slice());
		return;
	}
	for (var j = 0; j < values.length; j++) {
		if (array.indexOf(values[j]) >= 0) continue; //Repeated
		array[i] = values[j];
		combinateTeamPreview(array, i + 1, values, solutions);
		array[i] = -1;
	}
}

function generateTeamCombinations (sideLength, requiredLength) {
	var comb = [];
	var values = [];
	var array = [];
	for (var i = 0; i < sideLength; i++)
		values.push(i);
	for (var i = 0; i < requiredLength; i++)
		array.push(-1);
	combinateTeamPreview(array, 0, values, comb);
	return comb;
}

function validateDecision (des) {
	var megaConsumed = false;
	var shiftConsumed = false;
	var passed = true;
	var switched = [];
	for (var i = 0; i < des.length; i++) {
		if (des[i].mega) {
			if (megaConsumed) return false; // 2 mega evolutions at the same time
			megaConsumed = true;
		}
		if (des[i].type === "switch") {
			if (switched.indexOf(des[i].pokeId) >= 0) return false; // Switch to the same pokemon
			switched.push(des[i].pokeId);
		} else if (des[i].type === "shift") {
			if (shiftConsumed) return false; // 2 shifts at the same time
			shiftConsumed = true;
		}
		if (des[i].type !== "pass") passed = false;
	}
	if (passed) return false; // You can't pass the turn
	return true;
}

function nextCombinationDecision (array, i, tables, solutions) {
	if (i >= array.length) {
		//validate combinational decision
		if (!validateDecision(array)) return;
		//add it
		solutions.push(array.slice());
		return;
	}
	for (var j = 0; j < tables[i].length; j++) {
		array[i] = tables[i][j];
		nextCombinationDecision(array, i + 1, tables, solutions);
	}
}

function cartesianProduct (tables) {
	var array = [];
	var comb = [];
	for (var i = 0; i < tables.length; i++) array.push(null);
	nextCombinationDecision(array, 0, tables, comb);
	return comb;
}

exports.getDecisions = function (battle) {
	var res = [];
	var req = battle.request;
	if (!req) return null;
	if (req.wait) return null; // Nothing to do
	if (req.teamPreview) {
		/* Team required */
		var n = 1;
		if (battle.gametype === 'doubles') n = 2;
		else if (battle.gametype === 'triples') n = 3;
		var comb = generateTeamCombinations(req.side.pokemon.length, n);
		for (var i = 0; i < comb.length; i++) {
			res.push([new TeamDecision(comb[i])]);
		}
	} else if (req.forceSwitch) {
		var fw = req.forceSwitch;
		var tables = [];
		var toSw, canSw;
		toSw = 0;
		for (var i = 0; i < fw.length; i++) if (fw[i]) toSw++;
		for (var i = 0; i < fw.length; i++) {
			tables.push([]);
			if (!fw[i]) {
				tables[i].push(new PassDecision());
			} else {
				canSw = 0;
				for (var k = 0; k < req.side.pokemon.length; k++) {
					if (req.side.pokemon[k].condition === "0 fnt") continue; // Fainted
					if (req.side.pokemon[k].active) continue; // Active
					canSw++;
					tables[i].push(new SwitchDecision(k, req.side.pokemon[k].ident));
				}
				if (canSw < toSw) {
					tables[i].push(new PassDecision());
				}
			}
		}
		res = cartesianProduct(tables);
	} else if (req.active) {
		var tables = [];
		for (var i = 0; i < req.active.length; i++) {
			tables.push([]);
			if (req.side.pokemon[i].condition === "0 fnt") {
				//fainted, pass
				tables[i].push(new PassDecision());
				continue;
			}
			var active = req.active[i];
			var auxHasTarget;
			//moves
			for (var j = 0; j < active.moves.length; j++) {
				if (active.moves[j].disabled || active.moves[j].pp === 0) continue; // No more moves
				var mega = false;
				if (active.canMegaEvo || (req.side.pokemon[i] && req.side.pokemon[i].canMegaEvo)) mega = true;
				if (!active.moves[j].target) {
					// No need to set the target
					if (mega) tables[i].push(new MoveDecision(j, null, true, active.moves[j].move));
					tables[i].push(new MoveDecision(j, null, false, active.moves[j].move));
				} else if (active.moves[j].target in {'any': 1, 'normal': 1}) {
					auxHasTarget = false;
					for (var tar = 0; tar < battle.foe.active.length; tar++) {
						if (!battle.foe.active[tar] || battle.foe.active[tar].fainted) continue; // Target not found
						if (active.moves[j].target === 'normal' && isTooFar(battle, tar, i)) continue; // Target too far
						auxHasTarget = true;
					}
					for (var tar = 0; tar < battle.foe.active.length; tar++) {
						if (auxHasTarget && (!battle.foe.active[tar] || battle.foe.active[tar].fainted)) continue; // Target not found
						if (active.moves[j].target === 'normal' && isTooFar(battle, tar, i)) continue; // Target too far
						if (mega) tables[i].push(new MoveDecision(j, tar, true, active.moves[j].move));
						tables[i].push(new MoveDecision(j, tar, false, active.moves[j].move));
					}
					for (var tar = 0; tar < battle.self.active.length; tar++) {
						if (tar === i) continue; // Not self target allowed
						if (!battle.self.active[tar] || battle.self.active[tar].fainted) continue; // Target not found
						if (active.moves[j].target === 'normal' && isTooFar(battle, tar, i)) continue; // Target too far
						if (mega) tables[i].push(new MoveDecision(j, (-1) * (tar + 1), true, active.moves[j].move));
						tables[i].push(new MoveDecision(j, (-1) * (tar + 1), false, active.moves[j].move));
					}
				} else if (active.moves[j].target in {'adjacentAlly': 1}) {
					for (var tar = 0; tar < battle.self.active.length; tar++) {
						if (tar === i) continue; // Not self target allowed
						if (!battle.self.active[tar] || battle.self.active[tar].fainted) continue; // Target not found
						if (active.moves[j].target === 'normal' && isTooFar(battle, tar, i)) continue; // Target too far
						if (mega) tables[i].push(new MoveDecision(j, (-1) * (tar + 1), true, active.moves[j].move));
						tables[i].push(new MoveDecision(j, (-1) * (tar + 1), false, active.moves[j].move));
					}
				} else {
					// No need to set the target
					if (mega) tables[i].push(new MoveDecision(j, null, true, active.moves[j].move));
					tables[i].push(new MoveDecision(j, null, false, active.moves[j].move));
				}
			}
			//switchs
			if (!active.trapped) {
				for (var k = 0; k < req.side.pokemon.length; k++) {
					if (req.side.pokemon[k].condition === "0 fnt") continue; // Fainted
					if (req.side.pokemon[k].active) continue; // Active
					tables[i].push(new SwitchDecision(k, req.side.pokemon[k].ident));
				}
			}
			//shifts
			if (req.active.length === 3) {
				if ((i === 0 || i === 2)) tables[i].push(new ShiftDecision());
			}
		}
		res = cartesianProduct(tables);
	}
	return res;
};

const POKEDEX_FILE = './../../data/pokedex.js';
const MOVEDEX_FILE = './../../data/moves.js';

var blacklistedMoves = {
	/* These moves are bad in 1v1, with a false high base power */
	"Focus Punch": 1,
	"Explosion": 1,
	"Self-Destruct": 1,
	"Last Resort": 1,
	"Dream Eater": 1
};

module.exports = {
	gen6_get_mux: function (typeA, typesB, not_inmune, inverse) {
		var mux = 1;
		if (inverse) {
			for (var i = 0; i < typesB.length; i++) {
				if (this.TypeChartGen6[typesB[i]].damageTaken[typeA] === 1) {
					mux /= 2;
				} else if (this.TypeChartGen6[typesB[i]].damageTaken[typeA] === 2) {
					mux *= 2;
				} else if (this.TypeChartGen6[typesB[i]].damageTaken[typeA] === 3) {
					mux *= 2;
				}
			}
			return mux;
		}
		for (var i = 0; i < typesB.length; i++) {
			if (this.TypeChartGen6[typesB[i]].damageTaken[typeA] === 1) {
				mux *= 2;
			} else if (this.TypeChartGen6[typesB[i]].damageTaken[typeA] === 2) {
				mux /= 2;
			} else if (this.TypeChartGen6[typesB[i]].damageTaken[typeA] === 3) {
				if (!not_inmune) mux = 0;
			}
		}
		return mux;
	},
	has_ability: function (pokemonA, abilities) {
		var pokedex = require(POKEDEX_FILE).BattlePokedex;
		var data1 = pokedex[toId(pokemonA)];
		if (!data1) return false;
		for (var j = 0; j < abilities.length; j++) {
			var ability = abilities[j];
			for (var i in data1.abilities) {
				if (data1.abilities[i] === ability) return true;
			}
		}
		return false;
	},
	inmune: function (moveData, pokemonA) {
		var pokedex = require(POKEDEX_FILE).BattlePokedex;
		var data1 = pokedex[toId(pokemonA)];
		if (moveData.type === "Ground" && this.has_ability(pokemonA, ["Levitate"])) return true;
		if (moveData.type === "Water" && this.has_ability(pokemonA, ["Water Absorb", "Dry Skin", "Storm Drain"])) return true;
		if (moveData.type === "Fire" && this.has_ability(pokemonA, ["Flash Fire"])) return true;
		if (moveData.type === "Electric" && this.has_ability(pokemonA, ["Volt Absorb", "Lightning Rod"])) return true;
		if ((moveData.category in {"Physical": 1, "Special": 1}) && this.gen6_get_mux(moveData.type, data1.types) <= 1 && this.has_ability(pokemonA, ["Wonder Guard"])) return true;
		return false;
	},
	getBestLead: function (data) {
		if (!data) return 0; // no data
		var req = data.request;
		if (!req) return 0; //no request
		var pokedex = require(POKEDEX_FILE).BattlePokedex;
		var movedex = require(MOVEDEX_FILE).BattleMovedex;
		var viablePokemon = [];
		var aux, poke, actPoke, dataPoke;
		var pokeValue, moveValue, basePower;
		var auxDataPoke, dataMove;
		for (var i = 0; i < req.side.pokemon.length; i++) {
			//discard pokemon without good moves
			aux = [];
			pokeValue = 0;
			actPoke = req.side.pokemon[i];
			if (req.side.pokemon[i].details.indexOf(",") > -1) poke = req.side.pokemon[i].details.substr(0, req.side.pokemon[i].details.indexOf(","));
			else poke = req.side.pokemon[i].details;
			var dataPoke = pokedex[toId(poke)];
			if (!dataPoke) continue;
			for (var j = 0; j < actPoke.moves.length; j++) {
				moveValue = 0;
				dataMove = movedex[toId(actPoke.moves[j])];
				if (!dataMove) continue;
				if (dataMove.name in {"Return": 1, "Frustration": 1}) {
					if (!Formats[toId(data.tier)] || !Formats[toId(data.tier)].team) dataMove.basePower = 60;
					else dataMove.basePower = 102;
				}
				if (typeof dataMove.basePower !== "number" || !dataMove.basePower) continue;
				if (dataMove.name in blacklistedMoves) continue;
				if (dataMove.name === "Hyperspace Fury" && dataPoke.name !== 'Hoopa-Unbound') continue;
				if (dataMove.category === "Special") {
					basePower = dataMove.basePower * actPoke.stats['spa'];
				} else {
					basePower = dataMove.basePower * actPoke.stats['atk'];
				}
				for (var l = 0; l < dataPoke.types.length; l++) {
					if (dataPoke.types[l] === dataMove.type) {
						basePower *= 1.5;
						break;
					}
				}
				for (var l = 0; l < data.oppTeam.length; l++) {
					auxDataPoke = pokedex[toId(data.oppTeam[l].species)];
					if (!auxDataPoke) continue;
					if (this.inmune(dataMove, data.oppTeam[l].species) && !(toId(actPoke.baseAbility) in {'moldbreaker': 1, 'teravolt': 1, 'turboblaze': 1})) continue;
					moveValue += (basePower * this.gen6_get_mux(dataMove.type, auxDataPoke.types));
				}
				if (!pokeValue || moveValue > pokeValue) pokeValue = moveValue;
			}
			viablePokemon.push({id: i + 1, value: pokeValue});
		}
		if (!viablePokemon.length) return null;
		viablePokemon = viablePokemon.randomize();
		debug("Pokes: " + JSON.stringify(viablePokemon));
		var chosen = -1;
		for (var i = 0; i < viablePokemon.length; i++) {
			if (chosen === -1 || viablePokemon[i].value > viablePokemon[chosen].value) {
				chosen = i;
			}
		}
		return viablePokemon[chosen].id;
	},
	getBestMove: function (data) {
		var viableMoves = [];
		var req = data.request;
		var pokemonA = data.statusData.self.pokemon[0].species;
		var pokemonB = data.statusData.foe.pokemon[0].species;
		var dataMove, basePower;
		var pokedex = require(POKEDEX_FILE).BattlePokedex;
		var movedex = require(MOVEDEX_FILE).BattleMovedex;
		var data1 = pokedex[toId(pokemonA)];
		var data2 = pokedex[toId(pokemonB)];
		if (!data1 || !data2) {
			debug("Error - NO DATA -> " + pokemonA + " / " + pokemonB);
			return null;
		}
		var actPoke = req.side.pokemon[0];
		for (var i = 0; i < req.active[0].moves.length; i++) {
			if (req.active[0].moves[i].disabled) continue;
			dataMove = movedex[toId(actPoke.moves[i])];
			if (!dataMove) continue;
			if (dataMove.name in {"Return": 1, "Frustration": 1}) {
				if (!Formats[toId(data.tier)] || !Formats[toId(data.tier)].team) dataMove.basePower = 60;
				else dataMove.basePower = 102;
			}
			if (typeof dataMove.basePower !== "number" || !dataMove.basePower) continue;
			if (dataMove.name in blacklistedMoves) continue;
			switch (req.active[0].baseAbility) {
				case 'Aerilate':
					if (dataMove.type === "Normal") dataMove.type = "Flying";
					break;
				case 'Pixilate':
					if (dataMove.type === "Normal") dataMove.type = "Fairy";
					break;
				case 'Refrigerate':
					if (dataMove.type === "Normal") dataMove.type = "Ice";
					break;
			}
			if (dataMove.name === "Judgment") dataMove.type = data1.types[0];
			if (dataMove.name === "Hyperspace Fury" && data1.name !== 'Hoopa-Unbound') continue;
			var not_inmune = false;
			if (req.active[0].baseAbility === "Scrappy" && dataMove.type in {"Normal": 1, "Fighting": 1}) not_inmune = true;
			if (dataMove.category === "Special") {
				basePower = dataMove.basePower * actPoke.stats['spa'];
			} else {
				basePower = dataMove.basePower * actPoke.stats['atk'];
			}
			for (var l = 0; l < data1.types.length; l++) {
				if (data1.types[l] === dataMove.type) {
					basePower *= 1.5;
					break;
				}
			}
			if (dataMove.type === "Grass" && data.statusData.foe.pokemon[0].ability && data.statusData.foe.pokemon[0].ability === "Sap Sipper") continue;
			if (dataMove.name === "Fake Out" && data.statusData.self.pokemon[0]['lastMove']) continue;
			if (dataMove.type === "Ground" && data.statusData.foe.pokemon[0]['item'] && data.statusData.foe.pokemon[0]['item'] === "Air Balloon") continue;
			if (dataMove.type === "Ground" && data.statusData.foe.pokemon[0]['volatiles'] && data.statusData.foe.pokemon[0]['volatiles']['Magnet Rise']) continue;
			if (this.inmune(dataMove, pokemonB) && !(toId(actPoke.baseAbility) in {'moldbreaker': 1, 'teravolt': 1, 'turboblaze': 1})) basePower = 0;
			basePower *= this.gen6_get_mux(dataMove.type, data2.types, not_inmune);
			if (data.statusData.self.pokemon[0]['boost']) {
				if (dataMove.category === "Special" && data.statusData.self.pokemon[0]['boost']['spa']) {
					if (data.statusData.self.pokemon[0]['boost']['spa'] > 0) basePower *= (1 + data.statusData.self.pokemon[0]['boost']['spa'] * 0.5);
					else basePower /= (1 - data.statusData.self.pokemon[0]['boost']['spa'] * 0.5);
				}
				if (dataMove.category === "Physical" && data.statusData.self.pokemon[0]['boost']['atk']) {
					if (data.statusData.self.pokemon[0]['boost']['atk'] > 0) basePower *= (1 + data.statusData.self.pokemon[0]['boost']['atk'] * 0.5);
					else basePower /= (1 - data.statusData.self.pokemon[0]['boost']['atk'] * 0.5);
				}
			}
			if (data.statusData.foe.pokemon[0]['boost']) {
				if (dataMove.category === "Special" && data.statusData.foe.pokemon[0]['boost']['spd']) {
					if (data.statusData.foe.pokemon[0]['boost']['spd'] > 0) basePower /= (1 + data.statusData.foe.pokemon[0]['boost']['spd'] * 0.5);
					else basePower *= (1 - data.statusData.foe.pokemon[0]['boost']['spd'] * 0.5);
				}
				if (dataMove.category === "Physical" && data.statusData.foe.pokemon[0]['boost']['def']) {
					if (data.statusData.foe.pokemon[0]['boost']['def'] > 0) basePower /= (1 + data.statusData.foe.pokemon[0]['boost']['def'] * 0.5);
					else basePower *= (1 - data.statusData.foe.pokemon[0]['boost']['def'] * 0.5);
				}
			}
			if (dataMove.category === "Special" && data.statusData.foe.side['Light Screen']) basePower *= 0.5;
			if (dataMove.category === "Physical" && data.statusData.foe.side['Reflect']) basePower *= 0.5;
			if (data.weather === 'raindance' || data.weather === 'primordialsea') {
				if (dataMove.type === "Fire") basePower *= 0.5;
				if (dataMove.type === "Water") basePower *= 1.5;
			}
			if (data.weather === 'sunnyday' || data.weather === 'desolateland') {
				if (dataMove.type === "Fire") basePower *= 1.5;
				if (dataMove.type === "Water") basePower *= 0.5;
			}
			if (!basePower || basePower < 0) continue;
			viableMoves.push({id: i + 1, power: basePower});
		}
		viableMoves = viableMoves.randomize();
		debug("Moves: " + JSON.stringify(viableMoves));
		var chosenMove = -1;
		for (var i = 0; i < viableMoves.length; i++) {
			if (chosenMove === -1 || viableMoves[i].power > viableMoves[chosenMove].power) {
				chosenMove = i;
			}
		}
		if (chosenMove < 0) return null;
		return viableMoves[chosenMove].id;
	},
	getDecision: function (room, data, callback) {
		if (!data) return []; // no data
		var req = data.request;
		if (!req) return []; //no request

		var trapped = false;
		if (callback) {
			if (callback === "trapped") trapped = true;
		}

		if (req.forceSwitch) {
			var desSwitch = [];
			var switchChosen = {};
			for (var i = 0; i < req.forceSwitch.length; i++) {
				if (!req.forceSwitch[i]) {
					desSwitch.push({type: 'pass'});
				} else {
					var posibbles = [];
					for (var j = 0; j < req.side.pokemon.length; j++) {
						if (!switchChosen[j + 1] && req.side.pokemon[j].condition !== '0 fnt' && !req.side.pokemon[j].active) posibbles.push(j + 1);
					}
					var swChosen = posibbles[Math.floor(posibbles.length * Math.random())];
					switchChosen[swChosen] = true;
					desSwitch.push({type: 'switch', switchIn: swChosen});
				}
			}
			return desSwitch;
		} else if (req.active) {
			var actualDes = {};
			var moves = [];
			if (req.side.pokemon[0].canMegaEvo) {
				actualDes.mega = true;
				var dataNewMega = require(POKEDEX_FILE).BattlePokedex[toId(data.statusData.self.pokemon[0].species + "-Mega")];
				if (dataNewMega) {
					data.statusData.self.pokemon[0].species = data.statusData.self.pokemon[0].species + "-Mega";
					data.request.active[0].baseAbility = dataNewMega.abilities[0];
				}
			}
			var chosenMove = this.getBestMove(data);
			if (chosenMove) {
				actualDes.move = chosenMove;
			} else {
				for (var j = 0; j < req.active[0].moves.length; j++) {
					if (!req.active[0].moves[j].disabled) moves.push(j + 1);
				}
				actualDes.move = moves[Math.floor(Math.random() * moves.length)];
			}
			return [{type: 'move', mega: actualDes.mega, move: actualDes.move}];
		} else if (req.teamPreview) {
			if (data.tier && toId(data.tier).indexOf('1v1') >= 0) {
				debug("Using getBestLead function...");
				var lead = this.getBestLead(data);
				if (lead) {
					return [
						{type: 'team', team: lead}
					];
				}
			}
			debug("Using randomlead function...");
			var teamPreData = [];
			for (var i = 0; i < req.side.pokemon.length; i++) teamPreData.push(i + 1);
			teamPreData = teamPreData.randomize().join("");
			return [
				{type: 'team', team: teamPreData.substr(0, 1)}
			];
		}
		return [];
	},
	receive: function (room, args, kwargs) {
		return; //do nothing, data is suffient
	},
	TypeChartGen6: {
		"Bug": {
			damageTaken: {
				"Bug": 0,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 0,
				"Fighting": 2,
				"Fire": 1,
				"Flying": 1,
				"Ghost": 0,
				"Grass": 2,
				"Ground": 2,
				"Ice": 0,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 0,
				"Rock": 1,
				"Steel": 0,
				"Water": 0
			},
			HPivs: {"atk":30, "def":30, "spd":30}
		},
		"Dark": {
			damageTaken: {
				"Bug": 1,
				"Dark": 2,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 1,
				"Fighting": 1,
				"Fire": 0,
				"Flying": 0,
				"Ghost": 2,
				"Grass": 0,
				"Ground": 0,
				"Ice": 0,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 3,
				"Rock": 0,
				"Steel": 0,
				"Water": 0
			},
			HPivs: {}
		},
		"Dragon": {
			damageTaken: {
				"Bug": 0,
				"Dark": 0,
				"Dragon": 1,
				"Electric": 2,
				"Fairy": 1,
				"Fighting": 0,
				"Fire": 2,
				"Flying": 0,
				"Ghost": 0,
				"Grass": 2,
				"Ground": 0,
				"Ice": 1,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 0,
				"Rock": 0,
				"Steel": 0,
				"Water": 2
			},
			HPivs: {"atk":30}
		},
		"Electric": {
			damageTaken: {
				par: 3,
				"Bug": 0,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 2,
				"Fairy": 0,
				"Fighting": 0,
				"Fire": 0,
				"Flying": 2,
				"Ghost": 0,
				"Grass": 0,
				"Ground": 1,
				"Ice": 0,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 0,
				"Rock": 0,
				"Steel": 2,
				"Water": 0
			},
			HPivs: {"spa":30}
		},
		"Fairy": {
			damageTaken: {
				"Bug": 2,
				"Dark": 2,
				"Dragon": 3,
				"Electric": 0,
				"Fairy": 0,
				"Fighting": 2,
				"Fire": 0,
				"Flying": 0,
				"Ghost": 0,
				"Grass": 0,
				"Ground": 0,
				"Ice": 0,
				"Normal": 0,
				"Poison": 1,
				"Psychic": 0,
				"Rock": 0,
				"Steel": 1,
				"Water": 0
			}
		},
		"Fighting": {
			damageTaken: {
				"Bug": 2,
				"Dark": 2,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 1,
				"Fighting": 0,
				"Fire": 0,
				"Flying": 1,
				"Ghost": 0,
				"Grass": 0,
				"Ground": 0,
				"Ice": 0,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 1,
				"Rock": 2,
				"Steel": 0,
				"Water": 0
			},
			HPivs: {"def":30, "spa":30, "spd":30, "spe":30}
		},
		"Fire": {
			damageTaken: {
				brn: 3,
				"Bug": 2,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 2,
				"Fighting": 0,
				"Fire": 2,
				"Flying": 0,
				"Ghost": 0,
				"Grass": 2,
				"Ground": 1,
				"Ice": 2,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 0,
				"Rock": 1,
				"Steel": 2,
				"Water": 1
			},
			HPivs: {"atk":30, "spa":30, "spe":30}
		},
		"Flying": {
			damageTaken: {
				"Bug": 2,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 1,
				"Fairy": 0,
				"Fighting": 2,
				"Fire": 0,
				"Flying": 0,
				"Ghost": 0,
				"Grass": 2,
				"Ground": 3,
				"Ice": 1,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 0,
				"Rock": 1,
				"Steel": 0,
				"Water": 0
			},
			HPivs: {"hp":30, "atk":30, "def":30, "spa":30, "spd":30}
		},
		"Ghost": {
			damageTaken: {
				trapped: 3,
				"Bug": 2,
				"Dark": 1,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 0,
				"Fighting": 3,
				"Fire": 0,
				"Flying": 0,
				"Ghost": 1,
				"Grass": 0,
				"Ground": 0,
				"Ice": 0,
				"Normal": 3,
				"Poison": 2,
				"Psychic": 0,
				"Rock": 0,
				"Steel": 0,
				"Water": 0
			},
			HPivs: {"def":30, "spd":30}
		},
		"Grass": {
			damageTaken: {
				powder: 3,
				"Bug": 1,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 2,
				"Fairy": 0,
				"Fighting": 0,
				"Fire": 1,
				"Flying": 1,
				"Ghost": 0,
				"Grass": 2,
				"Ground": 2,
				"Ice": 1,
				"Normal": 0,
				"Poison": 1,
				"Psychic": 0,
				"Rock": 0,
				"Steel": 0,
				"Water": 2
			},
			HPivs: {"atk":30, "spa":30}
		},
		"Ground": {
			damageTaken: {
				sandstorm: 3,
				"Bug": 0,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 3,
				"Fairy": 0,
				"Fighting": 0,
				"Fire": 0,
				"Flying": 0,
				"Ghost": 0,
				"Grass": 1,
				"Ground": 0,
				"Ice": 1,
				"Normal": 0,
				"Poison": 2,
				"Psychic": 0,
				"Rock": 2,
				"Steel": 0,
				"Water": 1
			},
			HPivs: {"spa":30, "spd":30}
		},
		"Ice": {
			damageTaken: {
				hail: 3,
				frz: 3,
				"Bug": 0,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 0,
				"Fighting": 1,
				"Fire": 1,
				"Flying": 0,
				"Ghost": 0,
				"Grass": 0,
				"Ground": 0,
				"Ice": 2,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 0,
				"Rock": 1,
				"Steel": 1,
				"Water": 0
			},
			HPivs: {"atk":30, "def":30}
		},
		"Normal": {
			damageTaken: {
				"Bug": 0,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 0,
				"Fighting": 1,
				"Fire": 0,
				"Flying": 0,
				"Ghost": 3,
				"Grass": 0,
				"Ground": 0,
				"Ice": 0,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 0,
				"Rock": 0,
				"Steel": 0,
				"Water": 0
			}
		},
		"Poison": {
			damageTaken: {
				psn: 3,
				tox: 3,
				"Bug": 2,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 2,
				"Fighting": 2,
				"Fire": 0,
				"Flying": 0,
				"Ghost": 0,
				"Grass": 2,
				"Ground": 1,
				"Ice": 0,
				"Normal": 0,
				"Poison": 2,
				"Psychic": 1,
				"Rock": 0,
				"Steel": 0,
				"Water": 0
			},
			HPivs: {"def":30, "spa":30, "spd":30}
		},
		"Psychic": {
			damageTaken: {
				"Bug": 1,
				"Dark": 1,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 0,
				"Fighting": 2,
				"Fire": 0,
				"Flying": 0,
				"Ghost": 1,
				"Grass": 0,
				"Ground": 0,
				"Ice": 0,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 2,
				"Rock": 0,
				"Steel": 0,
				"Water": 0
			},
			HPivs: {"atk":30, "spe":30}
		},
		"Rock": {
			damageTaken: {
				sandstorm: 3,
				"Bug": 0,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 0,
				"Fairy": 0,
				"Fighting": 1,
				"Fire": 2,
				"Flying": 2,
				"Ghost": 0,
				"Grass": 1,
				"Ground": 1,
				"Ice": 0,
				"Normal": 2,
				"Poison": 2,
				"Psychic": 0,
				"Rock": 0,
				"Steel": 1,
				"Water": 1
			},
			HPivs: {"def":30, "spd":30, "spe":30}
		},
		"Steel": {
			damageTaken: {
				psn: 3,
				tox: 3,
				sandstorm: 3,
				"Bug": 2,
				"Dark": 0,
				"Dragon": 2,
				"Electric": 0,
				"Fairy": 2,
				"Fighting": 1,
				"Fire": 1,
				"Flying": 2,
				"Ghost": 0,
				"Grass": 2,
				"Ground": 1,
				"Ice": 2,
				"Normal": 2,
				"Poison": 3,
				"Psychic": 2,
				"Rock": 2,
				"Steel": 2,
				"Water": 0
			},
			HPivs: {"spd":30}
		},
		"Water": {
			damageTaken: {
				"Bug": 0,
				"Dark": 0,
				"Dragon": 0,
				"Electric": 1,
				"Fairy": 0,
				"Fighting": 0,
				"Fire": 2,
				"Flying": 0,
				"Ghost": 0,
				"Grass": 1,
				"Ground": 0,
				"Ice": 2,
				"Normal": 0,
				"Poison": 0,
				"Psychic": 0,
				"Rock": 0,
				"Steel": 2,
				"Water": 2
			},
			HPivs: {"atk":30, "def":30, "spa":30}
		}
	}
};

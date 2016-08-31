/*
 * Battle data parsing system
 * Battle Bot 2.0
 */

const MAX_RECURSIVE = 5;
const MIN_TIME_LOCK = 3 * 1000; // 3 secods to avoid send spam

var majors = exports.majors = require("./battle-majors.js");
var minors = exports.minors = require("./battle-minors.js");

var modules = require("./modules.js");
var decisionMaker = require("./decision.js");

var battleData = require("./battle-data.js");
var Player = battleData.Player;

var Calc = require('./calc.js');

var Battle = exports.Battle = (function () {
	function Battle (id) {
		this.id = id;
		this.title = "";
		this.players = {
			p1: new Player("p1"),
			p2: new Player("p2")
		};
		this.users = {};

		this.self = null;
		this.foe = null;

		this.gametype = "singles";
		this.gen = 6;
		this.tier = "ou";
		this.rules = [];
		this.variations = [];

		this.started = false;
		this.timer = false;
		this.sentTimerReq = 0;
		this.turn = 0;
		this.request = null;
		this.rqid = 0;
		this.teamPreview = 1;

		this.conditions = {};

		this.file = null;
		this.stream = null;
		this.lastSend = {
			rqid: -1,
			time: 0,
			decision: null
		};
		this.lock = false;
		this.leaveInterval = null;
	}

	Battle.prototype.createLogStream = function (file) {
		fs.writeFileSync(file, ""); // Clear File
		this.stream = fs.createWriteStream(file, {flags: 'a+'});
		this.file = file;
	};

	Battle.prototype.send = function (data) {
		Bot.sendRoom(this.id, data, 2000);
	};

	Battle.prototype.eval = function (str) {
		return eval(str);
	};

	Battle.prototype.sendDecision = function (decision) {
		if (!decision || !decision.length) return;
		debug("Send Decision: ".cyan + JSON.stringify(decision));
		var str = "/choose ";
		for (var i = 0; i < decision.length; i++) {
			switch (decision[i].type) {
				case "team":
					var team = [];
					for (var j = 0; j < decision[i].team.length; j++) team.push(decision[i].team[j] + 1);
					var first = team[0] || 1;
					for (var j = first - 1; j > 0; j--) {
						if (team.indexOf(j) === -1) {
							team.push(j);
						}
					}
					if (this.request && this.request.side && this.request.side.pokemon) {
						for (var j = 1; j <= this.request.side.pokemon.length; j++) {
							if (team.indexOf(j) === -1) {
								team.push(j);
							}
						}
					}
					str += "team " + team.join("");
					break;
				case "move":
					str += "move " + (decision[i].moveId + 1);
					if (decision[i].mega) str += " mega";
					if (decision[i].target !== null) {
						if (decision[i].target >= 0) str += " " + (decision[i].target + 1);
						else str += " " + (decision[i].target);
					}
					break;
				case "switch":
					str += "switch " + (decision[i].pokeId + 1);
					break;
				case "pass":
					str += "pass";
					break;
				case "shift":
					str += "shift";
					break;
			}
			if (i < decision.length - 1) str += ", ";
		}
		this.lastSend = {
			rqid: this.rqid,
			time: Date.now(),
			decision: decision
		};
		this.send(str + "|" + this.rqid);
	};

	Battle.prototype.checkTimer = function () {
		if (!this.self || !this.request) return; // Not playing
		if (!this.timer) {
			if (this.sentTimerReq && Date.now() - this.sentTimerReq < MIN_TIME_LOCK) return; // Do not spam timer commands
			this.sentTimerReq = Date.now();
			this.send("/timer on");
		}
	};

	Battle.prototype.leave = function () {
		if (!this.leaveInterval) {
			this.leaveInterval = setInterval(function () {
				this.send("/leave");
			}.bind(this), 5000);
		}
		this.send('/leave');
	};

	Battle.prototype.start = function () {
		if (!this.self || !this.request) return; // Not playing
		var wmsg = Config.initBattleMsg;
		if (wmsg && wmsg.length) this.send(wmsg[Math.floor(Math.random() * wmsg.length)]);
	};

	Battle.prototype.win = function (winner) {
		if (!this.self) return; // Not playing
		var win = (toId(winner) === toId(Bot.status.nickName));
		if (win) {
			var winmsg = Config.winmsg;
			if (winmsg && winmsg.length) this.send(winmsg[Math.floor(Math.random() * winmsg.length)]);
		} else {
			var losemsg = Config.losemsg;
			if (losemsg && losemsg.length) this.send(losemsg[Math.floor(Math.random() * losemsg.length)]);
		}
	};

	Battle.prototype.message = function (type, player, poke) {
		if (!this.self) return; // Not playing
		if (!Config.battleMessages || !Config.battleMessages[type]) return;
		if (!player) {
			if (Config.battleMessages[type]["self"]) {
				this.send(Config.battleMessages[type]["self"][Math.floor(Math.random() * Config.battleMessages[type]["self"].length)]);
				return;
			}
			this.send(Config.battleMessages[type][Math.floor(Math.random() * Config.battleMessages[type].length)]);
			return;
		}
		var side = (player === this.self.id) ? "self" : "foe";
		if (Config.battleMessages[type][side]) {
			var msg = Config.battleMessages[type][side][Math.floor(Math.random() * Config.battleMessages[type][side].length)];
			if (poke) msg = msg.replace(/#poke/g, poke);
			this.send(msg);
		}
	};

	Battle.prototype.makeDecision = function (forced) {
		if (!this.self) return; // Not playing
		debug(this.id + "->MakeDecision");
		if (!forced && this.lastSend.rqid >= 0 && this.lastSend.rqid === this.rqid) {
			if (Date.now() - this.lastSend.time < MIN_TIME_LOCK) return;
			if (this.lastSend.decision) {
				this.sendDecision(this.lastSend.decision);
				return;
			}
		}
		if (this.lock) return;
		this.lock = true;
		debug("Making decisions - " + this.id);
		var decisions, mod;
		try {
			decisions = decisionMaker.getDecisions(this);
		} catch (e) {
			debug(e.stack);
			debug("Decision maker crashed: " + sys.inspect(e));
			SecurityLog.log("BATTLE D.M. CRASH: " + e.message + "\n" + e.stack);
			this.lock = false;
			return;
		}
		if (!decisions || !decisions.length) {
			debug("Nothing to do: " + this.id);
			this.lock = false;
			return;
		}
		try {
			mod = modules.choose(this);
			if (mod) {
				var decision = mod.decide(this, decisions);
				if (decision instanceof Array) {
					this.lock = false;
					this.sendDecision(decision);
					return;
				}
			}
		} catch (ex) {
			debug(ex.stack);
			debug("Module failed: " + mod.id + " | " + sys.inspect(ex));
			SecurityLog.log("BATTLE MODULE FAILED: " + ex.message + "\nmodule: " + mod.id + "\n" + ex.stack);
		}
		this.lock = false;
		this.sendDecision(decisions[Math.floor(Math.random() * decisions.length)]);
	};

	Battle.prototype.log = function (line) {
		if (this.stream) {
			this.stream.write(line + "\n");
		}
	};

	Battle.prototype.add = function (line, isIntro) {
		this.run(line, isIntro);
		this.log(line);
	};

	Battle.prototype.run = function (str, isIntro) {
		if (!str) return;
		if (str.charAt(0) !== '|' || str.substr(0, 2) === '||') {
			return;
		} else {
			var args = ['done'], kwargs = {};
			if (str !== '|') {
				args = str.substr(1).split('|');
			}
			while (args[args.length - 1] && args[args.length - 1].substr(0, 1) === '[') {
				var bracketPos = args[args.length - 1].indexOf(']');
				if (bracketPos <= 0) break;
				var argstr = args.pop();
				// default to '.' so it evaluates to boolean true
				kwargs[argstr.substr(1, bracketPos - 1)] = ((argstr.substr(bracketPos + 1)).trim() || '.');
			}
			if (args[0].substr(0, 1) === '-') {
				this.runMinor(args, kwargs, isIntro);
			} else {
				this.runMajor(args, kwargs, isIntro);
			}
		}
	};

	Battle.prototype.runMinor = function (args, kwargs, isIntro) {
		if (args) {
			if (args[2] === 'Sturdy' && args[0] === '-activate') args[2] = 'ability: Sturdy';
		}
		if (minors[args[0]]) {
			var minor = minors[args[0]];
			var r = 0;
			while (typeof minor === "string" && r <= MAX_RECURSIVE) {
				minor = minors[minor];
			}
			if (typeof minor !== "function") {
				error("Unknown minor type: " + args[0] + " - " + sys.inspect(minor) + "");
			} else {
				try {
					minor.call(this, args, kwargs, isIntro);
				} catch (e) {
					errlog(e.message);
					errlog(e.stack);
					error("Minor failed | Battle id: " + this.id + " | Minor: " + args[0]);
					SecurityLog.log("MINOR FAILED: " + e.message + "\nargs: " + args.join("|") + "\nkwargs: " + JSON.stringify(kwargs) + "\nroom: " + this.id + "\n" + e.stack);
				}
			}
		}
	};

	Battle.prototype.runMajor = function (args, kwargs, isIntro) {
		if (majors[args[0]]) {
			var major = majors[args[0]];
			var r = 0;
			while (typeof major === "string" && r <= MAX_RECURSIVE) {
				major = majors[major];
			}
			if (typeof major !== "function") {
				error("Unknown major type: " + args[0] + " - " + sys.inspect(major) + "");
			} else {
				try {
					major.call(this, args, kwargs, isIntro);
				} catch (e) {
					errlog(e.message);
					errlog(e.stack);
					error("Major failed | Battle id: " + this.id + " | Major: " + args[0]);
					SecurityLog.log("MAJOR FAILED: " + e.message + "\nargs: " + args.join("|") + "\nkwargs: " + JSON.stringify(kwargs) + "\nroom: " + this.id + "\n" + e.stack);
				}
			}
		}
	};

	Battle.prototype.parseDetails = function (str) {
		if (!str) return null;
		var details = str.split(",");
		for (var d = 0; d < details.length; d++)
			details[d] = details[d].trim();
		var poke = {
			species: "",
			level: 100,
			shiny: false,
			gender: false
		};
		if (details[details.length - 1] === "shiny") {
			poke.shiny = true;
			details.pop();
		}
		if (details[details.length - 1] === "M" || details[details.length - 1] === "F") {
			poke.gender = details[details.length - 1];
			details.pop();
		}
		if (details[1]) {
			poke.level = parseInt(details[1].substr(1), 10) || 100;
		}
		if (details[0]) {
			poke.species = details[0];
		}
		return poke;
	};

	Battle.prototype.parseSlot = function (id) {
		var slots = {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5};
		return slots[id] || 0;
	};

	Battle.prototype.parseStatus = function (str) {
		var status = {
			hp: 100,
			status: false
		};
		var sp = str.split(" ");
		if (sp[1]) status.status = toId(sp[1]);
		sp = sp[0].split("/");
		if (sp.length === 2) {
			var d = parseInt(sp[1]);
			if (d) {
				status.hp = parseInt(sp[0]) * 100 / d;
			}
		} else {
			status.hp = parseInt(sp[0]) || 0;
		}
		return status;
	};

	Battle.prototype.parseHealth = function (str) {
		var hp = 100;
		var sp = str.split(" ");
		sp = sp[0].split("/");
		if (sp.length === 2) {
			var d = parseInt(sp[1]);
			if (d) {
				hp = parseInt(sp[0]) * 100 / d;
			}
		} else {
			hp = parseInt(sp[0]) || 0;
		}
		return hp;
	};

	Battle.prototype.getSide = function (str) {
		if (!str) return null;
		str = str.split(":")[0];
		return this.players[str];
	};

	Battle.prototype.getActive = function (str) {
		if (!str) return null;
		var side = str.substr(0, 2);
		str = str.substr(2);
		var pokeId = str.substr(0, 1);
		var slot = this.parseSlot(pokeId);
		str = str.substr(1);
		var name = Tools.toName(str.substr(1));
		if (this.players[side] && this.players[side].active[slot]) {
			this.players[side].active[slot].name = name;
			return this.players[side].active[slot];
		}
		return null;
	};

	Battle.prototype.parsePokemonIdent = function (str) {
		if (!str) return null;
		var side = str.substr(0, 2);
		str = str.substr(2);
		var pokeId = str.substr(0, 1);
		var slot = this.parseSlot(pokeId);
		str = str.substr(1);
		var name = Tools.toName(str.substr(1));
		return {
			side: side,
			slot: slot,
			name: name
		};
	};

	Battle.prototype.getCalcRequestPokemon = function (sideId, forceMega) {
		var p = this.request.side.pokemon[sideId];
		var details = this.parseDetails(p.details);
		var condition = this.parseStatus(p.condition);
		var pokeA = new Calc.Pokemon(battleData.getPokemon(details.species, this.gen),
			{level: details.level, shiny: details.shiny, gender: details.gender});
		pokeA.item = battleData.getItem(p.item, this.gen);
		pokeA.ability = battleData.getAbility(p.baseAbility, this.gen);
		pokeA.status = condition.status;
		pokeA.hp = condition.hp;
		pokeA.stats = p.stats;
		if (forceMega && (p.canMegaEvo || (this.request.active && this.request.active[sideId] && this.request.active[sideId].canMegaEvo))) {
			if (pokeA.item.megaStone) {
				pokeA.template = battleData.getPokemon(pokeA.item.megaStone, this.gen);
				pokeA.species = pokeA.template.species;
				pokeA.ability = battleData.getAbility(pokeA.template.abilities[0]);
			}
		}
		return pokeA;
	};

	Battle.prototype.destroy = function () {
		if (this.stream) {
			this.stream.close();
			this.stream = null;
		}
		if (this.leaveInterval) {
			clearInterval(this.leaveInterval);
			this.leaveInterval = null;
		}
	};

	return Battle;
})();


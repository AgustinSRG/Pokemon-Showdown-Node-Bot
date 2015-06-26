module.exports = {
	/* Data and modules */
	battlesCount: 0,
	data: {},
	aiModules: {},

	aiModList: {
		'6gsinglesdefault': './gen6-singles-default.js',
		'oldsinglesdefault': './oldgen-singles-default.js',
		'1v1mod': './1v1-offense.js'
	},

	/* Config - Edit this */
	aiConfig: {
		/* Exceptions */
		'challengecup1v1': '1v1mod',
		'1v1': '1v1mod'
	},

	aiDefaultConfig: {
		/* Default */
		'singles-6': '6gsinglesdefault',
		'singles-5': 'oldsinglesdefault',
		'singles-4': 'oldsinglesdefault',
		'singles-3': 'oldsinglesdefault',
		'singles-2': 'oldsinglesdefault',
		'singles-1': 'oldsinglesdefault'
	},

	/* Functions */
	init: function () {
		for (var k in this.data) delete this.data[k];
		for (var i in this.aiModList) {
			try {
				this.aiModules[i] = require(this.aiModList[i]);
			} catch (e) {error(e.stack);}
		}
		return;
	},

	clearData: function () {
		for (var i in this.data)
			delete this.data[i];
	},

	send: function (room, text) {
		Bot.send(room + "|" + text);
	},

	sendBattleMessage: function (room, type, side, poke) {
		if (!poke) poke = '';
		if (Config.battleMessages && Config.battleMessages[type] && Config.battleMessages[type][side] && Config.battleMessages[type][side].length) {
			var text = Config.battleMessages[type][side][Math.floor(Math.random() * Config.battleMessages[type][side].length)];
			this.send(room, text.replace('#poke', poke.trim()));
		}
	},

	sendDecision: function (room, decision, rqid) {
		debug("Send Decision: ".cyan + JSON.stringify(decision));
		var str = '/choose ';
		if (!decision || !decision.length) return;
		for (var i = 0; i < decision.length; i++) {
			if (decision[i].type === 'switch') {
				if (decision[i].switchIn) str += 'switch ' + decision[i].switchIn;
				else str += 'pass';
			} else if (decision[i].type === 'team') {
				str += 'team ' + decision[i].team;
			} else if (decision[i].type === 'pass') {
				str += 'pass';
			} else {
				str += 'move ' + decision[i].move;
				if (decision[i].mega) str += ' mega';
				if (decision[i].target) str += ' ' + decision[i].target;
			}
			if (i !== (decision.length - 1)) str += ', ';
		}
		if (rqid)  str += '|' + rqid;
		this.send(room, str);
	},

	getRandomMove: function (room) {
		/*	Random decison: This function always returns a valid decision.
				Decision: Random Lead, Random Move, No Switch             */
		if (!this.data[room]) return []; // no data
		var req = this.data[room].request;
		if (!req) return []; //no request
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
			var desMoves = [];
			for (var i = 0; i < req.active.length; i++) {
				var actualDes = {};
				var moves = [];
				actualDes.type = 'move';
				if (req.side.pokemon[i].canMegaEvo) actualDes.mega = true;
				for (var j = 0; j < req.active[i].moves.length; j++) {
					if (!req.active[i].moves[j].disabled) moves.push(j + 1);
				}
				actualDes.move = moves[Math.floor(Math.random() * moves.length)];
				if (req.active.length === 2) {
					var tarPos = [1, 2];
					actualDes.target = tarPos[Math.floor(Math.random() * tarPos.length)];
				} else if (req.active.length === 3) {
					var tarPos = [];
					if (i === 0) tarPos = [1, 2];
					else if (i === 1) tarPos = [1, 2, 3];
					else if (i === 2) tarPos = [2, 3];
					actualDes.target = tarPos[Math.floor(Math.random() * tarPos.length)];
				}
				desMoves.push(actualDes);
			}
			return desMoves;
		} else if (req.teamPreview) {
			var teamPreData = [];
			for (var i = 0; i < req.side.pokemon.length; i++) teamPreData.push(i + 1);
			teamPreData = teamPreData.randomize().join("");
			if (this.data[room].teampreview) {
				var nTeam = parseInt(this.data[room].teampreview);
				if (nTeam) {
					return [
						{type: 'team', team: teamPreData.substr(0, nTeam)}
					];
				}
			}
			switch (this.data[room].gametype) {
				case 'triples':
					return [
						{type: 'team', team: teamPreData.substr(0, 3)}
					];
				case 'doubles':
					return [
						{type: 'team', team: teamPreData.substr(0, 2)}
					];
				default:
					return [
						{type: 'team', team: teamPreData.substr(0, 1)}
					];
			}
		}
		return [];
	},

	makeDecision: function (room, forceRandom, callback) {
		var decision = {};
		if (!this.data[room]) return;
		var rqid = 0;
		if (this.data[room] && this.data[room].request) rqid = parseInt(this.data[room].request.rqid);

		//avoid duplicated decisions
		if (!callback && this.data[room].lastMake && this.data[room].lastReq === rqid && (Date.now() - this.data[room].lastMake) < 5000) return;

		this.data[room].lastMake = Date.now();
		this.data[room].lastReq = rqid;
		if (!forceRandom) {
			if (this.data[room].tier) {
				var tier = toId(this.data[room].tier);
				if (this.aiConfig[tier]) {
					if (this.aiModules[this.aiConfig[tier]] && this.aiModules[this.aiConfig[tier]].getDecision) {
						try {
							debug("[" + room + "] " + "Make Decision: Using module " + this.aiConfig[tier]);
							decision = this.aiModules[this.aiConfig[tier]].getDecision(room, this.data[room], callback);
							this.sendDecision(room, decision, rqid);
							return;
						} catch (e) {
							errlog(e.stack);
						}
					}
				}
			}

			var defaultId = this.data[room].gametype + "-" + this.data[room].gen;
			if (this.aiDefaultConfig[defaultId] && this.aiModules[this.aiDefaultConfig[defaultId]] && this.aiModules[this.aiDefaultConfig[defaultId]].getDecision) {
				try {
					debug("[" + room + "] " + "Make Decision: Using default module: " + this.aiDefaultConfig[defaultId]);
					decision = this.aiModules[this.aiDefaultConfig[defaultId]].getDecision(room, this.data[room], callback);
					this.sendDecision(room, decision, rqid);
					return;
				} catch (e) {
					errlog(e.stack);
				}
			}
		}
		try {
			debug("[" + room + "] " + "Make Decision: Using generic function");
			decision = this.getRandomMove(room);
			this.sendDecision(room, decision, rqid);
		} catch (e) {
			errlog(e.stack);
			this.send(room, "Fatal Error parsing room [" + room + "] - " + sys.inspect(e));
			Bot.send([room + "|/forfeit", room + "|/leave"]); //forfeit and leave on fatal error
		}
	},

	finishBattle: function (room, win) {
		if (win) {
			var winmsg = Config.winmsg;
			this.send(room, winmsg[Math.floor(Math.random() * winmsg.length)]);
		} else {
			var losemsg = Config.losemsg;
			this.send(room, losemsg[Math.floor(Math.random() * losemsg.length)]);
		}
		this.send(room, '/leave');
		if (this.data[room]) delete this.data[room];
	},

	getPokemonId: function (data) {
		var nameDT = data.split(":");
		var pokeId = nameDT[1];
		var sideId = toId(nameDT[0]);
		var pokeIndex = 0;
		switch (sideId.charAt(2)) {
			case 'a':
				pokeIndex = 0;
				break;
			case 'b':
				pokeIndex = 1;
				break;
			case 'c':
				pokeIndex = 2;
				break;
		}
		sideId = sideId.substr(0, 2);
		return {
			pokeId: pokeId,
			sideId: sideId,
			pokeIndex: pokeIndex
		};
	},

	receive: function (room, data) {
		/* IMPORTANT !
			This funtion gets all battle datas.
		*/
		var args = ['done'], kwargs = {};
		data = data.substr(1).trim();
		if (data !== '') {
			args = data.split('|');
			for (var i = 0, len = args.length; i < len; i++) args[i] = args[i].trim();
		}
		while (args[args.length - 1] && args[args.length - 1].substr(0, 1) === '[') {
			var bracketPos = args[args.length - 1].indexOf(']');
			if (bracketPos <= 0) break;
			var argstr = args.pop();
			// default to '.' so it evaluates to boolean true
			kwargs[argstr.substr(1, bracketPos - 1)] = (argstr.substr(bracketPos + 1).trim() || '.');
		}
		if (!this.data[room]) this.data[room] = {};
		//send data to AI module
		if (this.data[room].tier) {
			var tier = toId(this.data[room].tier);
			if (this.aiConfig[tier]) {
				if (this.aiModules[this.aiConfig[tier]] && this.aiModules[this.aiConfig[tier]].receive) {
					try {
						var dataFromAI = this.aiModules[this.aiConfig[tier]].receive(room, args, kwargs);
						if (dataFromAI) this.send(room, dataFromAI);
					} catch (e) {
						errlog(e.stack);
					}
				}
			}
		}
		//Battle messages
		if (this.data[room].opponent && this.data[room].self) {
			if (args.length >= 2) {
				var argIdent = this.getPokemonId(args[1]);
				this.sendBattleMessage(room, args[0], (this.data[room].opponent.id === argIdent.sideId) ? 'foe' : 'self', argIdent.pokeId);
			} else {
				this.sendBattleMessage(room, args[0], 'self');
			}
		}
		//DATA = args, kwargs
		//run minors and majors
		switch (args[0]) {
			/*----------------------------------
				Run majors
			--------------------------------------*/
			case 'init':
				this.battlesCount++;
				break;
			case 'title':
				if (!this.data[room]) this.data[room] = {};
				this.data[room].title = args[1];
				//welcome message if needed
				break;
			case 'deinit':
				//deallocate
				if (this.data[room]) delete this.data[room];
				this.battlesCount--;
				if (this.battlesCount < 0) this.battlesCount = 0;
				break;
			case 'player':
				if (!args[1] || !args[2]) return;
				if (toId(args[2]) === toId(Bot.status.nickName)) {
					//self
					this.data[room].self = {id: args[1], name: args[2], avatar: args[3]};
				} else {
					//opponent
					this.data[room].opponent = {id: args[1], name: args[2], avatar: args[3]};
				}
				break;
			case 'rated':
				this.data[room].rated = true;
				break;
			case 'gametype':
				this.data[room].gametype = args[1];
				if (args[1] === 'doubles') {
					this.data[room].statusData = {
						self: {
							side: {},
							pokemon: [
								{},
								{}
							]
						},
						foe: {
							side: {},
							pokemon: [
								{},
								{}
							]
						}
					};
				} else if (args[1] === 'triples') {
					this.data[room].statusData = {
						self: {
							side: {},
							pokemon: [
								{},
								{},
								{}
							]
						},
						foe: {
							side: {},
							pokemon: [
								{},
								{},
								{}
							]
						}
					};
				} else {
					this.data[room].statusData = {
						self: {
							side: {},
							pokemon: [
								{}
							]
						},
						foe: {
							side: {},
							pokemon: [
								{}
							]
						}
					};
				}
				break;
			case 'gen':
				this.data[room].gen = args[1];
				break;
			case 'tier':
				this.data[room].tier = args[1];
				break;
			case 'rule':
				if (!this.data[room].rules) this.data[room].rules = {};
				var ruleArgs = args[1].split(': ');
				this.data[room].rules[ruleArgs[0]] = ruleArgs[1] || true;
				break;
			case 'variation':
				if (!this.data[room].variations) this.data[room].variations = [];
				this.data[room].variations.push(args[1]);
				break;
			case 'request':
				var request = data.substr(8);
				try {
					this.data[room].request = JSON.parse(request);
				} catch (e) {
					error("(REQUEST ISSUE)\n" + e.stack);
				}
				//request received
				break;
			case 'start':
				this.data[room].started = true;
				this.send(room, '/timer on');
				break;
			case 'teampreview':
				this.data[room].teampreview = args[1];
				this.send(room, '/timer on');
				this.makeDecision(room, false);
				break;
			case 'turn':
				this.data[room].turn = args[1];
				this.makeDecision(room, false);
				break;
			case 'inactive':
				this.makeDecision(room, false);
				break;
			case 'forcemove':
				this.makeDecision(room, false, 'forced');
				break;
			case 'forcemoverandom':
				this.makeDecision(room, true, 'forced');
				break;
			case 'callback':
				if (args[1] === 'cant') {
					var ident = this.getPokemonId(args[2]);
					var moveDisabled = args[4];
					if (moveDisabled) {
						try {
							for (var k = 0; k < this.data[room].request.active[ident.pokeIndex].moves.length; k++) {
								if (this.data[room].request.active[ident.pokeIndex].moves[k].id === moveDisabled) {
									this.data[room].request.active[ident.pokeIndex].moves[k].disabled = true;
								}
							}
						} catch (e) {}
					}
				}
				this.makeDecision(room, false, args[1]);
				break;
			case 'win':
				this.finishBattle(room, (args[1] && toId(args[1]) === toId(Bot.status.nickName)));
				break;
			case 'join':
			case 'j':
				break;
			case 'leave':
			case 'l':
				break;
			case 'tie':
				this.send(room, '/leave');
				break;
			case 'clearpoke':
				this.data[room].oppTeam = [];
				if (!this.data[room].statusData) return;
				for (var i = 0; i < this.data[room].statusData.self.pokemon.length; i++) {
					this.data[room].statusData.self.pokemon[i] = {};
				}
				for (var i = 0; i < this.data[room].statusData.foe.pokemon.length; i++) {
					this.data[room].statusData.foe.pokemon[i] = {};
				}
				break;
			case 'poke':
				if (args[2] && this.data[room].opponent && this.data[room].opponent.id === args[1]) {
					if (!this.data[room].oppTeam) this.data[room].oppTeam = [];
					var poke = {};
					var dataPoke = args[2].split(',');
					poke.species = dataPoke[0].trim();
					var argPoke = '';
					for (var i = 1; i < dataPoke.length; i++) {
						argPoke = dataPoke[i].trim();
						if (argPoke.charAt(0) === 'L') poke.level = parseInt(argPoke.substr(1));
						else poke.gender = argPoke;
					}
					this.data[room].oppTeam.push(poke);
				}
				break;
			case 'switch':
			case 'drag':
			case 'replace':
				if (!this.data[room].statusData) return; //no gametype (bug)
				if (args.length < 4) return;
				var ident = this.getPokemonId(args[1]);
				var pokeId = ident.pokeId;
				var sideId = ident.sideId;
				var pokeIndex = ident.pokeIndex;
				//get pokemon  basicdata
				var poke = {};
				poke.name = pokeId;
				var dataPoke = args[2].split(',');
				poke.species = dataPoke[0].trim();
				var argPoke = '';
				for (var i = 1; i < dataPoke.length; i++) {
					argPoke = dataPoke[i].trim();
					if (argPoke.charAt(0) === 'L') poke.level = parseInt(argPoke.substr(1));
					else if (argPoke === "M" || argPoke === "F") poke.gender = argPoke;
					else poke[argPoke] = true;
				}
				//get status and hp
				dataPoke = args[3].split(' ');
				var hpAux = dataPoke[0].split('/');
				if (!hpAux[1]) {
					poke.hp = 0;
				} else {
					poke.hp = (parseFloat(hpAux[0]) * 100) / parseFloat(hpAux[1]);
				}
				if (dataPoke[1]) {
					poke.status = dataPoke[1];
				} else {
					poke.status = false;
				}
				//set data
				if (this.data[room].opponent.id === sideId) {
					//offset
					if (!this.data[room].oppTeamOffSet) this.data[room].oppTeamOffSet = {};
					if (!this.data[room].oppTeamOffSet[pokeId]) this.data[room].oppTeamOffSet[pokeId] = {};
					for (var i in poke)
						this.data[room].oppTeamOffSet[pokeId][i] = poke[i];
					//active
					if (this.data[room].statusData.foe.pokemon[pokeIndex].batonPassing) {
						poke['boost'] = this.data[room].statusData.foe.pokemon[pokeIndex]['boost'];
						poke['volatiles'] = this.data[room].statusData.foe.pokemon[pokeIndex]['volatiles'];
					}
					this.data[room].statusData.foe.pokemon[pokeIndex] = poke;
				} else {
					//active
					if (this.data[room].statusData.self.pokemon[pokeIndex].batonPassing) {
						poke['boost'] = this.data[room].statusData.self.pokemon[pokeIndex]['boost'];
						poke['volatiles'] = this.data[room].statusData.self.pokemon[pokeIndex]['volatiles'];
					}
					this.data[room].statusData.self.pokemon[pokeIndex] = poke;
				}
				break;
			case 'detailschange':
				if (!this.data[room].statusData) return; //no gametype (bug)
				if (args.length < 3) return;
				var ident = this.getPokemonId(args[1]);
				var pokeId = ident.pokeId;
				var sideId = ident.sideId;
				var pokeIndex = ident.pokeIndex;
				//get pokemon  basicdata
				var poke = {};
				var dataPoke = args[2].split(',');
				poke.species = dataPoke[0].trim();
				var argPoke = '';
				for (var i = 1; i < dataPoke.length; i++) {
					argPoke = dataPoke[i].trim();
					if (argPoke.charAt(0) === 'L') poke.level = parseInt(argPoke.substr(1));
					else if (argPoke === "M" || argPoke === "F") poke.gender = argPoke;
					else poke[argPoke] = true;
				}
				//save
				if (this.data[room].opponent.id === sideId) {
					if (!this.data[room].oppTeamOffSet) this.data[room].oppTeamOffSet = {};
					if (!this.data[room].oppTeamOffSet[pokeId]) this.data[room].oppTeamOffSet[pokeId] = {};
					for (var i in poke) {
						this.data[room].oppTeamOffSet[pokeId][i] = poke[i];
						this.data[room].statusData.foe.pokemon[pokeIndex][i] = poke[i];
					}
				} else {
					for (var i in poke)
						this.data[room].statusData.self.pokemon[pokeIndex][i] = poke[i];
				}
				break;
			case 'faint':
				if (!this.data[room].statusData) return; //no gametype (bug)
				if (args.length < 2) return;
				var ident = this.getPokemonId(args[1]);
				var pokeId = ident.pokeId;
				var sideId = ident.sideId;
				var pokeIndex = ident.pokeIndex;
				if (this.data[room].opponent.id === sideId) {
					if (!this.data[room].oppTeamOffSet) this.data[room].oppTeamOffSet = {};
					if (!this.data[room].oppTeamOffSet[pokeId]) this.data[room].oppTeamOffSet[pokeId] = {};
					this.data[room].oppTeamOffSet[pokeId].fainted = true;
					this.data[room].statusData.foe.pokemon[pokeIndex] = {};
				} else {
					this.data[room].statusData.self.pokemon[pokeIndex] = {};
				}
				break;
			case 'swap':
				if (!this.data[room].statusData) return; //no gametype (bug)
				if (args.length < 3) return;
				var ident = this.getPokemonId(args[1]);
				var pokeId = ident.pokeId;
				var sideId = ident.sideId;
				var pokeIndex = ident.pokeIndex;
				var swapPos = parseInt(args[2]);
				if (this.data[room].opponent.id === sideId) {
					var aux = this.data[room].statusData.foe.pokemon[pokeIndex];
					this.data[room].statusData.foe.pokemon[pokeIndex] = this.data[room].statusData.foe.pokemon[swapPos];
					this.data[room].statusData.foe.pokemon[swapPos] = aux;
				} else {
					var aux = this.data[room].statusData.self.pokemon[pokeIndex];
					this.data[room].statusData.self.pokemon[pokeIndex] = this.data[room].statusData.self.pokemon[swapPos];
					this.data[room].statusData.self.pokemon[swapPos] = aux;
				}
				break;
			case 'move':
				if (!this.data[room].statusData) return; //no gametype (bug)
				if (args.length < 3) return;
				var ident = this.getPokemonId(args[1]);
				var pokeId = ident.pokeId;
				var sideId = ident.sideId;
				var pokeIndex = ident.pokeIndex;
				if (this.data[room].opponent.id === sideId) {
					if (!this.data[room].oppTeamOffSet) this.data[room].oppTeamOffSet = {};
					if (!this.data[room].oppTeamOffSet[pokeId]) this.data[room].oppTeamOffSet[pokeId] = {};
					if (!this.data[room].oppTeamOffSet[pokeId].moves) this.data[room].oppTeamOffSet[pokeId].moves = {};
					if (!this.data[room].oppTeamOffSet[pokeId].moves[args[2]]) this.data[room].oppTeamOffSet[pokeId].moves[args[2]] = 0;
					++this.data[room].oppTeamOffSet[pokeId].moves[args[2]]; //register move usage
					this.data[room].statusData.foe.pokemon[pokeIndex].lastMove = args[2];
					if (args[2] === 'Baton Pass') this.data[room].statusData.foe.pokemon[pokeIndex].batonPassing = true;
				} else {
					this.data[room].statusData.self.pokemon[pokeIndex].lastMove = args[2];
					if (args[2] === 'Baton Pass') this.data[room].statusData.self.pokemon[pokeIndex].batonPassing = true;
				}
				break;

			/*----------------------------------
				Run minors
			--------------------------------------*/

			case '-damage':
			case '-heal':
			case '-sethp':
				var ident = this.getPokemonId(args[1]);
				var poke = {};
				dataPoke = args[2].split(' ');
				var hpAux = dataPoke[0].split('/');
				if (!hpAux[1]) {
					poke.hp = 0;
				} else {
					poke.hp = (parseFloat(hpAux[0]) * 100) / parseFloat(hpAux[1]);
				}
				if (dataPoke[1]) {
					poke.status = dataPoke[1];
				} else {
					poke.status = false;
				}
				//save data
				if (this.data[room].opponent.id === ident.sideId) {
					for (var i in poke) {
						this.data[room].oppTeamOffSet[ident.pokeId][i] = poke[i];
						this.data[room].statusData.foe.pokemon[ident.pokeIndex][i] = poke[i];
					}
					if (kwargs.from) {
						//get item or ability
						var offData = kwargs.from.split(": ");
						if (offData[1]) {
							var targetData = offData[1];
							var typeData = toId(offData[0]);
							switch (typeData) {
								case 'item':
									this.data[room].oppTeamOffSet[ident.pokeId]['item'] = targetData;
									this.data[room].statusData.foe.pokemon[ident.pokeIndex]['item'] = targetData;
									break;
								case 'ability':
									this.data[room].oppTeamOffSet[ident.pokeId]['ability'] = targetData;
									this.data[room].statusData.foe.pokemon[ident.pokeIndex]['ability'] = targetData;
									break;
							}
						}
					}
				} else {
					for (var i in poke)
						this.data[room].statusData.self.pokemon[ident.pokeIndex][i] = poke[i];
				}
				break;

			case '-boost':
			case '-setboost':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					if (!this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost']) this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost'] = {};
					if (!this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost'][args[2]]) this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost'][args[2]] = 0;
					this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost'][args[2]] += parseInt(args[3]);
					if (kwargs.from) {
						//get item or ability
						var offData = kwargs.from.split(": ");
						if (offData[1]) {
							var targetData = offData[1];
							var typeData = toId(offData[0]);
							switch (typeData) {
								case 'item':
									this.data[room].oppTeamOffSet[ident.pokeId]['item'] = targetData;
									this.data[room].statusData.foe.pokemon[ident.pokeIndex]['item'] = targetData;
									break;
								case 'ability':
									this.data[room].oppTeamOffSet[ident.pokeId]['ability'] = targetData;
									this.data[room].statusData.foe.pokemon[ident.pokeIndex]['ability'] = targetData;
									break;
							}
						}
					}
				} else {
					if (!this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost']) this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost'] = {};
					if (!this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost'][args[2]]) this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost'][args[2]] = 0;
					this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost'][args[2]] += parseInt(args[3]);
				}
				break;
			case '-unboost':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					if (!this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost']) this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost'] = {};
					if (!this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost'][args[2]]) this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost'][args[2]] = 0;
					this.data[room].statusData.foe.pokemon[ident.pokeIndex]['boost'][args[2]] -= parseInt(args[3]);
				} else {
					if (!this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost']) this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost'] = {};
					if (!this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost'][args[2]]) this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost'][args[2]] = 0;
					this.data[room].statusData.self.pokemon[ident.pokeIndex]['boost'][args[2]] -= parseInt(args[3]);
				}
				break;
			case '-swapboost':
				var identA = this.getPokemonId(args[1]);
				var sideA = (this.data[room].opponent.id === identA.sideId) ? 'foe' : 'self';
				var identB = this.getPokemonId(args[2]);
				var sideB = (this.data[room].opponent.id === identB.sideId) ? 'foe' : 'self';
				var stats = args[3];
				if (!stats) {
					var aux = this.data[room].statusData[sideB].pokemon[identB.pokeIndex]['boost'];
					this.data[room].statusData[sideB].pokemon[identB.pokeIndex]['boost'] = this.data[room].statusData[sideA].pokemon[identA.pokeIndex]['boost'];
					this.data[room].statusData[sideA].pokemon[identA.pokeIndex]['boost'] = aux;
				} else {
					if (!this.data[room].statusData[sideB].pokemon[identB.pokeIndex]['boost']) this.data[room].statusData[sideB].pokemon[identB.pokeIndex]['boost'] = {};
					if (!this.data[room].statusData[sideA].pokemon[identA.pokeIndex]['boost']) this.data[room].statusData[sideA].pokemon[identA.pokeIndex]['boost'] = {};
					stats = stats.split(",");
					var aux;
					for (var i = 0; i < stats.length; i++) {
						var actStat = stats[i].trim();
						aux = this.data[room].statusData[sideA].pokemon[identA.pokeIndex]['boost'][actStat];
						this.data[room].statusData[sideA].pokemon[identA.pokeIndex]['boost'][actStat] = this.data[room].statusData[sideB].pokemon[identB.pokeIndex]['boost'][actStat];
						this.data[room].statusData[sideB].pokemon[identB.pokeIndex]['boost'][actStat] = aux;
					}
				}
				break;
			case '-restoreboost':
				var ident = this.getPokemonId(args[1]);
				var side = (this.data[room].opponent.id === ident.sideId) ? 'foe' : 'self';
				if (!this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost']) return;
				for (var i in this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost']) {
					if (this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost'] < 0) this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost'] = 0;
				}
				break;
			case '-copyboost':
				var identA = this.getPokemonId(args[1]);
				var sideA = (this.data[room].opponent.id === identA.sideId) ? 'foe' : 'self';
				var identB = this.getPokemonId(args[2]);
				var sideB = (this.data[room].opponent.id === identB.sideId) ? 'foe' : 'self';
				this.data[room].statusData[sideA].pokemon[identA.pokeIndex]['boost'] = this.data[room].statusData[sideB].pokemon[identB.pokeIndex]['boost'];
				break;
			case '-clearboost':
				var ident = this.getPokemonId(args[1]);
				var side = (this.data[room].opponent.id === ident.sideId) ? 'foe' : 'self';
				if (!this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost']) return;
				for (var i in this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost']) {
					this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost'] = 0;
				}
				break;
			case '-invertboost':
				var ident = this.getPokemonId(args[1]);
				var side = (this.data[room].opponent.id === ident.sideId) ? 'foe' : 'self';
				if (!this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost']) return;
				for (var i in this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost']) {
					this.data[room].statusData[side].pokemon[ident.pokeIndex]['boost'] *= (-1);
				}
				break;
			case '-clearallboost':
				for (var i = 0; i < this.data[room].statusData.foe.pokemon.length; i++)
					this.data[room].statusData.foe.pokemon[i]['boost'] = {};
				for (var i = 0; i < this.data[room].statusData.self.pokemon.length; i++)
					this.data[room].statusData.self.pokemon[i]['boost'] = {};
				break;

			case '-status':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					this.data[room].oppTeamOffSet[ident.pokeId]['status'] = args[2];
					this.data[room].statusData.foe.pokemon[ident.pokeIndex]['status'] = args[2];
				} else {
					this.data[room].statusData.self.pokemon[ident.pokeIndex]['status'] = args[2];
				}
				break;
			case '-curestatus':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					this.data[room].oppTeamOffSet[ident.pokeId]['status'] = false;
					this.data[room].statusData.foe.pokemon[ident.pokeIndex]['status'] = false;
				} else {
					this.data[room].statusData.self.pokemon[ident.pokeIndex]['status'] = false;
				}
				break;
			case '-cureteam':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					for (var i in this.data[room].oppTeamOffSet)
						this.data[room].oppTeamOffSet[i]['status'] = false;
					for (var i = 0; i < this.data[room].statusData.foe.pokemon.length; i++)
						this.data[room].statusData.foe.pokemon[i]['status'] = false;
				} else {
					for (var i = 0; i < this.data[room].statusData.self.pokemon.length; i++)
						this.data[room].statusData.self.pokemon[i]['status'] = false;
				}
				break;

			case '-item':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					this.data[room].oppTeamOffSet[ident.pokeId]['item'] = args[2];
					this.data[room].statusData.foe.pokemon[ident.pokeIndex]['item'] = args[2];
				} else {
					this.data[room].statusData.self.pokemon[ident.pokeIndex]['item'] = args[2];
				}
				break;
			case '-enditem':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					this.data[room].oppTeamOffSet[ident.pokeId]['item'] = false;
					this.data[room].statusData.foe.pokemon[ident.pokeIndex]['item'] = false;
				} else {
					this.data[room].statusData.self.pokemon[ident.pokeIndex]['item'] = false;
				}
				break;

			case '-ability':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					this.data[room].oppTeamOffSet[ident.pokeId]['ability'] = args[2];
					this.data[room].statusData.foe.pokemon[ident.pokeIndex]['ability'] = args[2];
				} else {
					this.data[room].statusData.self.pokemon[ident.pokeIndex]['ability'] = args[2];
				}
				break;
			case '-endability':
				var ident = this.getPokemonId(args[1]);
				if (this.data[room].opponent.id === ident.sideId) {
					this.data[room].oppTeamOffSet[ident.pokeId]['ability'] = false;
					this.data[room].statusData.foe.pokemon[ident.pokeIndex]['ability'] = false;
				} else {
					this.data[room].statusData.self.pokemon[ident.pokeIndex]['ability'] = false;
				}
				break;

			case '-transform':
				var identA = this.getPokemonId(args[1]);
				var sideA = (this.data[room].opponent.id === identA.sideId) ? 'foe' : 'self';
				var identB = this.getPokemonId(args[2]);
				var sideB = (this.data[room].opponent.id === identB.sideId) ? 'foe' : 'self';
				this.data[room].statusData[sideA].pokemon[identA.pokeIndex] = this.data[room].statusData[sideB].pokemon[identB.pokeIndex];
				this.data[room].statusData[sideA].pokemon[identA.pokeIndex].name = identA.pokeId;
				break;

			case '-start':
				var ident = this.getPokemonId(args[1]);
				var side = (this.data[room].opponent.id === ident.sideId) ? 'foe' : 'self';
				var volTarget = args[2].split(":");
				if (volTarget[1]) volTarget = volTarget[1].trim();
				else volTarget = args[2];
				if (!this.data[room].statusData[side].pokemon[ident.pokeIndex]['volatiles']) this.data[room].statusData[side].pokemon[ident.pokeIndex]['volatiles'] = {};
				this.data[room].statusData[side].pokemon[ident.pokeIndex]['volatiles'][volTarget] = true;
				break;
			case '-end':
				var ident = this.getPokemonId(args[1]);
				var side = (this.data[room].opponent.id === ident.sideId) ? 'foe' : 'self';
				var volTarget = args[2].split(":");
				if (volTarget[1]) volTarget = volTarget[1].trim();
				else volTarget = args[2];
				if (!this.data[room].statusData[side].pokemon[ident.pokeIndex]['volatiles']) this.data[room].statusData[side].pokemon[ident.pokeIndex]['volatiles'] = {};
				this.data[room].statusData[side].pokemon[ident.pokeIndex]['volatiles'][volTarget] = false;
				break;

			case '-sidestart':
				var sideId = args[1].split(":")[0];
				var hazardId = args[2].split(": ");
				if (hazardId[1]) hazardId = hazardId[1];
				else hazardId = hazardId[0];
				if (this.data[room].opponent.id === sideId) {
					if (!this.data[room].statusData.foe.side[hazardId]) this.data[room].statusData.foe.side[hazardId] = 0;
					++this.data[room].statusData.foe.side[hazardId];
				} else {
					if (!this.data[room].statusData.self.side[hazardId]) this.data[room].statusData.self.side[hazardId] = 0;
					++this.data[room].statusData.self.side[hazardId];
				}
				break;
			case '-sideend':
				var sideId = args[1].split(":")[0];
				var hazardId = args[2];
				if (this.data[room].opponent.id === sideId) {
					this.data[room].statusData.foe.side[hazardId] = false;
				} else {
					this.data[room].statusData.self.side[hazardId] = false;
				}
				break;

			case '-weather':
				this.data[room].weather = args[1];
				break;
			case '-fieldstart':
				if (!this.data[room].fields) this.data[room].fields = {};
				var fieldId = args[1].split(": ");
				if (fieldId[1]) fieldId = fieldId[1];
				else fieldId = fieldId[0];
				this.data[room].fields[fieldId] = true;
				break;
			case '-fieldend':
				if (!this.data[room].fields) this.data[room].fields = {};
				var fieldId = args[1].split(": ");
				if (fieldId[1]) fieldId = fieldId[1];
				else fieldId = fieldId[0];
				this.data[room].fields[fieldId] = false;
				break;
		}
	}
};

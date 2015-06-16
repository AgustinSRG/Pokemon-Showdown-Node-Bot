const teamsDataFile = './data/teams.json';

module.exports = {
	teams: {},
	staticTeams: {},
	dynTeams: {},

	loadTeamList: function (reloading) {
		try {
			if (reloading) Tools.uncacheTree('./features/battle/teams.js');
			this.staticTeams = require('./teams.js').teams;
			if (!fs.existsSync(teamsDataFile)) {
				this.dynTeams = {};
			} else {
				this.dynTeams = JSON.parse(fs.readFileSync(teamsDataFile).toString());
			}
			this.mergeTeams();
			return true;
		} catch (e) {
			error('failed to load teams: ' + sys.inspect(e));
			return false;
		}
	},

	mergeTeams: function () {
		if (this.teams) delete this.teams;
		this.teams = {};
		Object.merge(this.teams, this.staticTeams);
		for (var i in this.dynTeams) {
			var team = this.dynTeams[i];
			if (!this.teams[team.format]) this.teams[team.format] = [];
			this.teams[team.format].push(team.packed);
		}
	},

	addTeam: function (name, format, packed) {
		if (this.dynTeams[name]) return false;
		this.dynTeams[name] = {
			format: format,
			packed: packed
		};
		this.mergeTeams();
		this.saveTeams();
		return true;
	},

	removeTeam: function (name) {
		if (!this.dynTeams[name]) return false;
		delete this.dynTeams[name];
		this.mergeTeams();
		this.saveTeams();
		return true;
	},

	writing: false,
	writePending: false,
	saveTeams: function () {
		var data = JSON.stringify(this.dynTeams);
		var finishWriting = function () {
			this.writing = false;
			if (this.writePending) {
				this.writePending = false;
				this.saveTeams();
			}
		};
		if (this.writing) {
			this.writePending = true;
			return;
		}
		fs.writeFile(teamsDataFile + '.0', data, function () {
			// rename is atomic on POSIX, but will throw an error on Windows
			fs.rename(teamsDataFile + '.0', teamsDataFile, function (err) {
				if (err) {
					// This should only happen on Windows.
					fs.writeFile(teamsDataFile, data, finishWriting);
					return;
				}
				finishWriting();
			});
		});
	},

	getTeam: function (format) {
		var formatId = toId(format);
		var teamStuff = this.teams[formatId];
		if (!teamStuff || !teamStuff.length) return false;
		var teamChosen = teamStuff[Math.floor(Math.random() * teamStuff.length)]; //choose team
		var teamStr = '';
		try {
			if (typeof teamChosen === 'string') {
				//already parsed
				teamStr = teamChosen;
			} else if (typeof teamChosen === 'object') {
				if (teamChosen.maxPokemon && teamChosen.pokemon) {
					//generate random team
					var team = [];
					var pokes = teamChosen.pokemon.randomize();
					var k = 0;
					for (var i = 0; i < pokes.length; i++) {
						if (k++ >= teamChosen.maxPokemon) break;
						team.push(pokes[i]);
					}
					if (Config.debug.debug) debug("Packed Team: " + JSON.stringify(team));
					teamStr = this.packTeam(team);
				} else if (teamChosen.length){
					//parse team
					teamStr = this.packTeam(teamChosen);
				} else {
					error("invalid team data type: " + JSON.stringify(teamChosen));
					return false;
				}
			} else {
				error("invalid team data type: " + JSON.stringify(teamChosen));
				return false;
			}
			return teamStr;
		} catch (e) {
			error(e.stack);
		}
	},

	hasTeam: function (format) {
		var formatId = toId(format);
		if (this.teams[formatId]) return true;
		return false;
	},

	/* Pack Team function - from Pokemon-Showdown-Client */

	packTeam: function (team) {
		var buf = '';
		if (!team) return '';

		for (var i = 0; i < team.length; i++) {
			var set = team[i];
			if (buf) buf += ']';

			// name
			buf += (set.name || set.species);

			// species
			var id = toId(set.species || set.name);
			buf += '|' + (toId(set.name || set.species) === id ? '' : id);

			// item
			buf += '|' + toId(set.item);

			// ability
			var template = set.species || set.name;
			try {
				template = require('./../../data/pokedex.js').BattlePokedex[toId(template)];
			} catch (e) {
				errlog(e.stack);
				template = null;
			}
			if (!template) return '';
			var abilities = template.abilities;
			id = toId(set.ability);
			if (abilities) {
				if (abilities['0'] && id === toId(abilities['0'])) {
					buf += '|';
				} else if (abilities['1'] && id === toId(abilities['1'])) {
					buf += '|1';
				} else if (abilities['H'] && id === toId(abilities['H'])) {
					buf += '|H';
				} else {
					buf += '|' + id;
				}
			} else {
				buf += '|' + id;
			}

			// moves
			buf += '|' + set.moves.map(toId).join(',');

			// nature
			buf += '|' + set.nature;

			// evs
			var evs = '|';
			if (set.evs) {
				evs = '|' + (set.evs['hp'] || '') + ',' + (set.evs['atk'] || '') + ',' + (set.evs['def'] || '') + ',' + (set.evs['spa'] || '') + ',' + (set.evs['spd'] || '') + ',' + (set.evs['spe'] || '');
			}
			if (evs === '|,,,,,') {
				buf += '|';
			} else {
				buf += evs;
			}

			// gender
			if (set.gender && set.gender !== template.gender) {
				buf += '|' + set.gender;
			} else {
				buf += '|';
			}

			// ivs
			var ivs = '|';
			if (set.ivs) {
				ivs = '|' + (set.ivs['hp'] === 31 || set.ivs['hp'] === undefined ? '' : set.ivs['hp']) + ',' + (set.ivs['atk'] === 31 || set.ivs['atk'] === undefined ? '' : set.ivs['atk']) + ',' + (set.ivs['def'] === 31 || set.ivs['def'] === undefined ? '' : set.ivs['def']) + ',' + (set.ivs['spa'] === 31 || set.ivs['spa'] === undefined ? '' : set.ivs['spa']) + ',' + (set.ivs['spd'] === 31 || set.ivs['spd'] === undefined ? '' : set.ivs['spd']) + ',' + (set.ivs['spe'] === 31 || set.ivs['spe'] === undefined ? '' : set.ivs['spe']);
			}
			if (ivs === '|,,,,,') {
				buf += '|';
			} else {
				buf += ivs;
			}

			// shiny
			if (set.shiny) {
				buf += '|S';
			} else {
				buf += '|';
			}

			// level
			if (set.level && set.level !== 100) {
				buf += '|' + set.level;
			} else {
				buf += '|';
			}

			// happiness
			if (set.happiness !== undefined && set.happiness !== 255) {
				buf += '|' + set.happiness;
			} else {
				buf += '|';
			}
		}

		return buf;
	}
};

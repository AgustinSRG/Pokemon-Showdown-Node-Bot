const teamsDataFile = AppOptions.data + 'teams.json';

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
		return Tools.packTeam(team);
	}
};

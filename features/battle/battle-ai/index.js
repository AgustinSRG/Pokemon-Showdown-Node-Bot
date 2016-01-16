/*
 * Battle manager
 */

const battleAutojoinFile = AppOptions.data + "_temp/" + "battle-autojoin-tmp.json";

var Battle = require('./battle.js').Battle;

var BattleLogger = require('./battle-log.js');

module.exports = {
	battles: {},
	battlesCount: 0,

	init: function () {
		for (var room in this.battles) {
			try {
				this.battles[room].destroy();
			} catch (e) {}
			delete this.battles[room];
		}
		this.battlesCount = 0;
	},

	autojoinFFM: new Settings.FlatFileManager(battleAutojoinFile),
	autoJoinData: {},

	tryJoinAbandonedBattles: function () {
		if (!Config.abandonedBattleAutojoin) return;
		try {
			this.autoJoinData = this.autojoinFFM.readObj();
		} catch (e) {error(e.stack);}
		debug(JSON.stringify(this.autoJoinData));
		var cmds = [];
		for (var i in this.autoJoinData) {
			if (!this.battles[i]) {
				cmds.push('|/join ' + i);
				cmds.push(i + '|/joinbattle');
			}
			delete this.autoJoinData[i];
		}
		this.autojoinFFM.writeObj(this.autoJoinData);
		return cmds;
	},

	updateBattleAutojoin: function () {
		if (!Config.abandonedBattleAutojoin) return;
		for (var i in this.autoJoinData) {
			delete this.autoJoinData[i];
		}
		for (var room in this.battles) {
			this.autoJoinData[room] = 1;
		}
		this.autojoinFFM.writeObj(this.autoJoinData);
	},

	receive: function (room, data, isIntro) {
		if (data.charAt(0) === ">") return;
		var spl = data.substr(1).split("|");
		if (spl[0] === 'init') {
			if (this.battles[room]) {
				try {
					this.battles[room].destroy();
				} catch (e) {}
			}
			this.battles[room] = new Battle(room);
			BattleLogger.createStream(this.battles[room]);
			this.battlesCount++;
			this.updateBattleAutojoin();
		}
		if (this.battles[room]) {
			this.battles[room].add(data, isIntro);
		}
		if (spl[0] === 'deinit' || spl[0] === 'expire') {
			if (this.battles[room]) {
				try {
					this.battles[room].destroy();
				} catch (e) {}
				delete this.battles[room];
				this.battlesCount--;
				this.updateBattleAutojoin();
			}
		}
	},

	destroy: function () {
		for (var room in this.battles) {
			try {
				this.battles[room].destroy();
			} catch (e) {}
			delete this.battles[room];
			this.battlesCount--;
		}
	}
};

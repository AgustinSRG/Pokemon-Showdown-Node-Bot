/*
	Dynamic Commands
*/

Settings.addPermissions(['info', 'wall']);

exports.commands = {

	infowall: 'dyn',
	dynwall: 'dyn',
	wall: 'dyn',
	info: 'dyn',
	dyn: function (arg, by, room, cmd) {
		var perm = (cmd in {'wall': 1, 'dynwall': 1, 'infowall': 1}) ? 'wall' : 'info';
		if (!this.can(perm) || this.roomType === 'pm') {
			if (!arg) {
				var list = Object.keys(CommandParser.dynCommands).sort().join(", ");
				if (!list) return this.pmReply('No commands');
				return this.pmReply('Dynamic cmds: ' + list);
			}
			var dcmd = toId(arg);
			if (CommandParser.dynCommands[dcmd]) {
				return this.pmReply(CommandParser.dynCommands[dcmd]);
			} else {
				return this.pmReply('Command "' + dcmd + '" does not exists');
			}
		} else {
			if (!arg) {
				var list = Object.keys(CommandParser.dynCommands).sort().join(", ");
				if (!list) return this.reply('No commands');
				return this.reply('Dynamic cmds: ' + list);
			}
			var dcmd = toId(arg);
			if (CommandParser.dynCommands[dcmd]) {
				if (perm === 'wall') return this.reply('/announce ' + CommandParser.dynCommands[dcmd]);
				return this.reply(CommandParser.dynCommands[dcmd]);
			} else {
				return this.reply('Command "' + dcmd + '" does not exists');
			}
		}
	},

	deletecommand: 'delcmd',
	delcmd: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var dcmd = toId(arg);
		if (CommandParser.dynCommands[dcmd]) {
			delete CommandParser.dynCommands[dcmd];
			CommandParser.saveDinCmds();
			this.reply('Command "' + dcmd + '" has been successfully deleted');
		} else {
			this.reply('Command "' + dcmd + '" does not exists');
		}
	},

	setcommand: 'setcmd',
	setcmd: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (!CommandParser.tempVar) {
			this.reply('There is no temp string to set, use **stemp** before doing this');
		}
		var dcmd = toId(arg);
		var text = '';
		if (CommandParser.dynCommands[dcmd]) {
			text = 'Command "' + dcmd + '" has been successfully modified';
		} else {
			text = 'Command "' + dcmd + '" has been successfully created';
		}
		CommandParser.dynCommands[dcmd] = CommandParser.tempVar;
		CommandParser.saveDinCmds();
		this.reply(text);
	},

	stemp: 'temp',
	temp: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (arg) CommandParser.tempVar = Tools.stripCommands(arg);
		this.reply('Temp: ' + CommandParser.tempVar);
	}
};

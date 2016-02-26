/*
	Dynamic Commands
*/

Settings.addPermissions(['info', 'wall']);

function getCmdList (head) {
	var cmdArr = Object.keys(CommandParser.dynCommands).sort();
	var newCmdArr = [];
	for (var i = 0; i < cmdArr.length; i++) {
		if (CommandParser.dynCommands[cmdArr[i]] && CommandParser.dynCommands[cmdArr[i]].substr(0, 4) === "/ref") continue;
		newCmdArr.push(cmdArr[i]);
	}
	if (!newCmdArr.length) return null;
	var buf = head, cmds = [];
	for (var i = 0; i < newCmdArr.length; i++) {
		if (buf.length + newCmdArr[i].length + (i < newCmdArr.length - 1 ? 2 : 0) > 300) {
			cmds.push(buf);
			buf = "";
		}
		buf += newCmdArr[i];
		if (i < newCmdArr.length - 1) buf += ", ";
	}
	cmds.push(buf);
	return cmds;
}

exports.commands = {
	infowall: 'dyn',
	dynwall: 'dyn',
	wall: 'dyn',
	info: 'dyn',
	dyn: function (arg, by, room, cmd) {
		var dcmd = toId(arg);
		if (dcmd && CommandParser.dynCommands[dcmd] && CommandParser.dynCommands[dcmd].substr(0, 4) === "/ref") {
			var basicCmd = toId(CommandParser.dynCommands[dcmd].substr(5));
			if (CommandParser.dynCommands[basicCmd] && CommandParser.dynCommands[basicCmd].substr(0, 4) !== "/ref") {
				this.parse(this.cmdToken + cmd + ' ' + basicCmd);
			} else {
				if (CommandParser.dynCommands[basicCmd]) error('Recursive dynamic command "' + dcmd + '"');
				else error('Invalid reference for dynamic command "' + dcmd + '" -> "' + basicCmd + '"');
			}
			return;
		}
		var perm = (cmd in {'wall': 1, 'dynwall': 1, 'infowall': 1}) ? 'wall' : 'info';
		if (!this.can(perm) || this.roomType === 'pm') {
			if (!arg) {
				var list = getCmdList(this.trad('list') + ': ');
				if (!list) return this.pmReply(this.trad('nocmds'));
				return this.pmReply(list);
			}
			if (CommandParser.dynCommands[dcmd]) {
				return this.pmReply(CommandParser.dynCommands[dcmd]);
			} else {
				return this.pmReply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('notexist'));
			}
		} else {
			if (!arg) {
				var list = getCmdList(this.trad('list') + ': ');
				if (!list) return this.reply(this.trad('nocmds'));
				return this.reply(list);
			}
			if (CommandParser.dynCommands[dcmd]) {
				if (perm === 'wall') return this.reply('/announce ' + CommandParser.dynCommands[dcmd]);
				return this.reply(CommandParser.dynCommands[dcmd]);
			} else {
				return this.reply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('notexist'));
			}
		}
	},

	deletecommand: 'delcmd',
	delcmd: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
		var dcmd = toId(arg);
		if (CommandParser.dynCommands[dcmd]) {
			delete CommandParser.dynCommands[dcmd];
			CommandParser.saveDynCmds();
			this.sclog();
			this.reply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('d'));
		} else {
			this.reply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('n'));
		}
	},

	setcommand: 'setcmd',
	setcmd: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
		if (!CommandParser.tempVar) {
			return this.reply(this.trad('notemp'));
		}
		var dcmd = toId(arg);
		var text = '';
		if (CommandParser.dynCommands[dcmd]) {
			text = this.trad('c') + ' "' + dcmd + '" ' + this.trad('modified');
		} else {
			text = this.trad('c') + ' "' + dcmd + '" ' + this.trad('created');
		}
		CommandParser.dynCommands[dcmd] = CommandParser.tempVar;
		CommandParser.saveDynCmds();
		this.sclog();
		this.reply(text);
	},

	setalias: 'setcmdalias',
	setcmdalias: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
		var args = arg.split(',');
		if (args.length !== 2) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u2'));
		var alias = toId(args[0]);
		var dcmd = toId(args[1]);
		if (!alias || !dcmd || alias === dcmd) return this.reply(this.trad('u1') + ': ' + this.cmdToken + cmd + ' ' + this.trad('u2'));
		if (!CommandParser.dynCommands[dcmd]) return this.reply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('n'));
		if (CommandParser.dynCommands[dcmd].substr(0, 4) === "/ref") return this.reply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('already'));
		CommandParser.dynCommands[alias] = '/ref ' + dcmd;
		CommandParser.saveDynCmds();
		this.sclog();
		this.reply(this.trad('c') + ' "' + alias + '" ' + this.trad('alias') + ' "' + dcmd + '"');
	},

	dyncmdlist: 'getdyncmdlist',
	getdyncmdlist: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
		var list = Object.keys(CommandParser.dynCommands).sort();
		if (!list.length) return this.pmReply(this.trad('nocmds'));
		var text = this.trad('list') + ':\n\n';
		for (var i in CommandParser.dynCommands) {
			if (CommandParser.dynCommands[i].substr(0, 4) === "/ref") {
				text += i + ' ~ ' + toId(CommandParser.dynCommands[i].substr(5)) + '\n';
				continue;
			}
			text += i + ' -> "' + CommandParser.dynCommands[i] + '"' + '\n';
		}
		Tools.uploadToHastebin(text, function (r, link) {
			if (r) return this.pmReply(this.trad('list') + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	},

	stemp: 'temp',
	temp: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
		if (arg) CommandParser.tempVar = Tools.stripCommands(arg);
		this.sclog("Temp command-parser var changed");
		this.reply('Temp: ' + CommandParser.tempVar);
	}
};

/*
	Commands for youtube feature
*/

exports.commands = {
	youtubelinks: 'youtube',
	youtube: function (arg, user, room, cmd) {
		if (!this.isRanked(Tools.getGroup('roomowner'))) return false;
		var tarRoom = room;
		var targetObj = Tools.getTargetRoom(arg);
		var textHelper = '';
		if (targetObj && this.isExcepted) {
			arg = targetObj.arg;
			tarRoom = targetObj.room;
			textHelper = ' (' + tarRoom + ')';
		}
		if (!Bot.rooms[tarRoom] || Bot.rooms[tarRoom].type !== 'chat') return this.reply(this.trad('notchat') + textHelper);
		arg = toId(arg);
		if (!Settings.settings['ytlinks']) Settings.settings['ytlinks'] = {};
		switch (arg) {
			case 'on':
			case 'enable':
				if (Settings.settings['ytlinks'][tarRoom]) return this.reply(this.trad('ae') + ' ' + tarRoom);
				Settings.settings['ytlinks'][tarRoom] = 1;
				Settings.save();
				this.sclog();
				this.reply(this.trad('e') + textHelper);
				break;
			case 'off':
			case 'disable':
				if (Settings.settings['ytlinks'][tarRoom] === 0) return this.reply(this.trad('ad') + ' ' + tarRoom);
				Settings.settings['ytlinks'][tarRoom] = 0;
				Settings.save();
				this.sclog();
				this.reply(this.trad('d') + textHelper);
				break;
			default:
				this.reply(this.trad('u') + ': ' + this.cmdToken + cmd + ' [on/off]');
		}
	}
};

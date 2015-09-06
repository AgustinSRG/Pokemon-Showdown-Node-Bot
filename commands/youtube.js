/*
	Commands for youtube feature
*/

exports.commands = {
	youtubelinks: 'youtube',
	youtube: function (arg, user, room, cmd) {
		if (!this.isRanked(Tools.getGroup('roomowner'))) return false;
		if (this.roomType !== 'chat') return this.reply(this.trad('notchat'));
		arg = toId(arg);
		if (!Settings.settings['ytlinks']) Settings.settings['ytlinks'] = {};
		switch (arg) {
			case 'on':
			case 'enable':
				if (Settings.settings['ytlinks'][room]) return this.reply(this.trad('ae') + ' ' + room);
				Settings.settings['ytlinks'][room] = 1;
				Settings.save();
				this.reply(this.trad('e'));
				break;
			case 'off':
			case 'disable':
				if (Settings.settings['ytlinks'][room] === 0) return this.reply(this.trad('ad') + ' ' + room);
				Settings.settings['ytlinks'][room] = 0;
				Settings.save();
				this.reply(this.trad('d'));
				break;
			default:
				this.reply(this.trad('u') + ': ' + this.cmdToken + cmd + ' [on/off]');
		}
	}
};

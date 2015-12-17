/*
	Commands for autoinvite feature
*/

exports.commands = {
	reloadroomauth: 'getroomauth',
	useroomauth: 'getroomauth',
	getroomauth: function (arg, user, room, cmd) {
		if (!this.isExcepted) return false;
		var tarRoom = toRoomid(arg) || room;
		if (!Features['autoinvite']) return false;
		if (!Bot.rooms || !Bot.rooms[tarRoom]) return false;
		this.sclog();
		if (cmd === 'reloadroomauth') {
			Features['autoinvite'].roomAuthChanges[tarRoom] = 1;
			Features['autoinvite'].checkAuth();
			this.reply('Room auth from room __' + tarRoom + '__ has been reloaded');
		} else if (cmd === 'getroomauth') {
			if (!Features['autoinvite'].roomAuth[tarRoom]) return this.reply('Room auth for room __' + tarRoom + '__ is empty. Try ' + this.cmdToken + 'reloadroomauth');
			Tools.uploadToHastebin('Room auth (' + tarRoom + ')\n\n' + JSON.stringify(Features['autoinvite'].roomAuth[tarRoom]), function (r, link) {
				if (r) return this.reply('Room auth of __' + tarRoom + '__: ' + link);
				else this.reply('Error connecting to hastebin');
			}.bind(this));
		} else if (cmd === 'useroomauth') {
			if (!Features['autoinvite'].roomAuth[tarRoom]) return this.reply('Room auth for room __' + tarRoom + '__ is empty. Try ' + this.cmdToken + 'reloadroomauth');
			var auth = Features['autoinvite'].roomAuth[tarRoom];
			for (var i in auth) {
				if (Tools.equalOrHigherRank(i, '&')) continue; //Global auth and excepted users
				Config.exceptions[i] = auth[i];
			}
			monitor('Auth exceptions changed temporarily\n' + JSON.stringify(Config.exceptions));
			this.reply('Using room auth of room __' + tarRoom + '__ as global auth. Use ' + this.cmdToken + 'reload config to revert it.');
		}
	}
};

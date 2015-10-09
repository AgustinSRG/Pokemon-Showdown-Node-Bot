/*
	Commands for groupchats feature
*/

exports.commands = {
	igc: 'ignoregroupchat',
	ignoregroupchat: function (arg, user, room, cmd) {
		if (!this.isExcepted) return false;
		var tarRoom = toRoomid(arg) || room;
		if (!Features['groupchats']) return false;
		if (Features['groupchats'].ignored[tarRoom]) return this.reply("Group Chat __" + tarRoom + "__ already ignored");
		Features['groupchats'].ignored[tarRoom] = true;
		this.reply("Group Chat __" + tarRoom + "__ was temporarily ignored");
	},

	unigc: 'unignoregroupchat',
	unignoregroupchat: function (arg, user, room, cmd) {
		if (!this.isExcepted) return false;
		var tarRoom = toRoomid(arg) || room;
		if (!Features['groupchats']) return false;
		if (!Features['groupchats'].ignored[tarRoom]) return this.reply("Group Chat __" + tarRoom + "__ is not being ignored");
		delete Features['groupchats'].ignored[tarRoom];
		this.reply("Group Chat __" + tarRoom + "__ is no longer ignored");
	}
};

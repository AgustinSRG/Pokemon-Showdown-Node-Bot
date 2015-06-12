
exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		time: {'time': 'Bot Time'},
		uptime: {
			'week': 'week',
			'day': 'day',
			'hour': 'hour',
			'minute': 'minute',
			'second': 'second',
			'and': 'and'
		},
		seen: {
			'inv': 'Invalid username',
			'bot': 'You might be either blind or illiterate. Might want to get that checked out.',
			'self': 'Have you looked in the mirror lately?',
			's1': 'was last seen',
			's2': 'ago',
			'n1': 'The user',
			'n2': 'has never been seen, at least since the last bot reset',
			'j': 'joining',
			'l': 'leaving',
			'c': 'chatting in',
			'n': 'changing nick to'
		},
		language: {
			'notchat': 'This command is only avaliable for chat rooms',
			'nolang': 'You must specify a language',
			'v': 'Valid languages are',
			'l': 'Language for this room is now English'
		},
		set: {
			'notchat': 'This command is only avaliable for chat rooms',
			'u1': 'Usage',
			'u2': '[permission], [rank]',
			'ps': 'Permissions',
			'p': 'Permission',
			'd': 'in this room is now disabled',
			'a': 'in this room is now avaliable for all users',
			'r': 'in this room is now avaliable for users with rank',
			'r2': 'or highter',
			'not1': 'Rank',
			'not2': 'not found'
		}
	},

	/*
	* Features
	*/

	'moderation': {
		'automod': 'Automated moderation',
		//mods
		'fs': 'Flooding / Spamming',
		'sl': 'Spamming links',
		's': 'Spamming',
		'f': 'Flooding',
		'possible': 'Possible spammer detected',
		'caps': 'Excessive capitalization',
		'stretch': 'Stretching',
		'spoiler': 'Spoilers are not allowed in this room',
		'youtube': 'Youtube channels are not allowed in this room',
		'server': 'Pokemon Showdown private servers are not allowed in this room',
		'inapword': 'Your message contained an inapropiate phrase',
		'banword': 'Your message contained a banned phrase',
		'mult': 'Multiple infraction',
		'0tol': '(zero tolerance)',
		//avb
		'caps-0': 'Caps',
		'rep-0': 'Repeating',
		'stretch-0': 'Stretching',
		'flood-0': 'Flooding',
		'spoiler-0': 'Spoiler',
		'youtube-0': 'Youtube channel',
		'server-0': 'Private Servers',
		'inapword-0': 'Inapropiate',
		'banword-0': 'Bannedwords',
		//autoban
		'ab': 'Blacklisted user'
	}
};

exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		about: {
			'about': 'I\'m a **Pokemon Showdown Bot** written in JavaScript for Node',
			'author': 'Author'
		},
		help: {
			'guide': 'Bot commands guide'
		},
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
		alts: {
			'inv': 'Invalid username',
			'n': 'No alts found for user',
			'alts': 'Known alts of',
			'more': 'more'
		},
		/*
		* Admin Commands
		*/
		language: {
			'notchat': 'This command is only available for chat rooms',
			'nolang': 'You must specify a language',
			'v': 'Valid languages are',
			'l': 'Language for this room is now English'
		},
		set: {
			'notchat': 'This command is only available for chat rooms',
			'denied': 'Access denied',
			'u1': 'Usage',
			'u2': '[permission], [rank]',
			'ps': 'Permissions',
			'p': 'Permission',
			'd': 'in this room is now disabled',
			'a': 'in this room is now available for all users',
			'r': 'in this room is now available for users with rank',
			'r2': 'or higher',
			'not1': 'Rank',
			'not2': 'not found'
		},
		battleset: {
			'u1': 'Usage',
			'u2': '[permission], [rank]',
			'ps': 'Permissions',
			'p': 'Permission',
			'd': 'in battles is now disabled',
			'a': 'in battles is now available for all users',
			'r': 'in battles is now available for users with rank',
			'r2': 'or higher',
			'not1': 'Rank',
			'not2': 'not found'
		},
		/*
		* Dyn Commands
		*/
		dyn: {
			'nocmds': 'No commands',
			'list': 'Dynamic cmds',
			'c': 'Command',
			'notexist': 'does not exist'
		},
		delcmd: {
			'c': 'Command',
			'd': 'has been successfully deleted',
			'n': 'does not exist'
		},
		setcmd: {
			'notemp': 'There is no temp string to set, use **stemp** before doing this',
			'c': 'Command',
			'modified': 'has been successfully modified',
			'created': 'has been successfully created'
		},
		setcmdalias: {
			'u1': 'Usage',
			'u2': '[alias], [cmd]',
			'n': 'is not a dynamic command',
			'c': 'Command',
			'alias': 'is now an alias of',
			'already': 'is an alias. You can\'t set an alias of another alias'
		},
		getdyncmdlist: {
			'nocmds': 'No commands',
			'list': 'Dynamic cmds',
			'err': 'Error: failed to upload commands to Hastebin'
		}
	},

	time: {
		'second': 'second',
		'seconds': 'seconds',
		'minute': 'minute',
		'minutes': 'minutes',
		'hour': 'hour',
		'hours': 'hours',
		'day': 'day',
		'days': 'days'
	}
};

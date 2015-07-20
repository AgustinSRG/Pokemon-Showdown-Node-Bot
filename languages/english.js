exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		about: {
			'about': 'I\'m a **Pokemon Showdown Bot** written in JavaScript for Node. By: Ecuacion'
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
		},
		/*
		* Misc Commands
		*/
		pick: {'err': 'You must give at least 2 valid choices'},
		randomanswer: {
			'answers': [
				'Signs point to yes.',
				'Yes.',
				'Reply hazy, try again.',
				'Without a doubt.',
				'My sources say no.',
				'As I see it, yes.',
				'You may rely on it.',
				'Concentrate and ask again.',
				'Outlook not so good.',
				'It is decidedly so.',
				'Better not tell you now.',
				'Very doubtful.',
				'Yes - definitely.',
				'It is certain.',
				'Cannot predict now.',
				'Most likely.',
				'Ask again later.',
				'My reply is no.',
				'Outlook good.',
				'Don\'t count on it.'
			]
		},
		usage: {
			'stats': 'Usage stats'
		},
		help: {
			'guide': 'Bot commands guide'
		},
		youtube: {
			'notchat': 'This command is only available for chat rooms',
			'u': 'Usage',
			'ae': 'YouTube link recognition is already enabled for room',
			'e': 'YouTube link recognition is now enabled for this room',
			'ad': 'YouTube link recognition is already disabled for room',
			'd': 'YouTube link recognition is now disabled for this room'
		},
		/*
		* Quotes
		*/
		quote: {
			'nodata': 'Database is empty'
		},
		setquote: {
			'notemp': 'There is no temp string to set, use **stemp** before doing this',
			'q': 'Quote',
			'modified': 'has been successfully modified',
			'created': 'has been successfully created'
		},
		delquote: {
			'q': 'Quote',
			'n': 'does not exist',
			'd': 'has been successfully deleted'
		},
		viewquotes: {
			'q': 'Quote',
			'n': 'does not exist',
			'empty': 'List of quotes is empty',
			'list': 'List of quotes',
			'err': 'Error: failed to upload quotes to Hastebin'
		},
		addquotes: {
			'notfound': 'Error: Document not found',
			'd': 'Downloading Hastebin document',
			'add': 'Added',
			'q': 'quotes',
			'err': 'Error: failed to get quotes from Hastebin'
		},
		/*
		* Pokemon Commands
		*/
		randompokemon: {'err': 'An error ocurred, try again later'},
		gen: {
			'err': 'An error ocurred, try again later',
			'err2': 'You must specify a pokemon, move, item or ability',
			'nfound': 'Pokemon, item, move or ability not found',
			'g': 'Generation of'
		},
		randommoves: {
			'err': 'An error ocurred, try again later',
			'err2': 'You must specify a pokemon',
			'r': 'Random singles moves',
			'rd': 'Random doubles/triples moves',
			'nfound': 'Pokemon not found'
		},
		heavyslam: {
			'err': 'An error ocurred, try again later',
			'err2': 'You must specify 2 pokemon',
			'n1': 'Attacker Pokemon not found',
			'n2': 'Defender Pokemon not found',
			's': 'Heavy slam/Heat crash base power'
		},
		prevo: {
			'err': 'An error ocurred, try again later',
			'p1': 'Pokemon',
			'p2': 'has no pre-evo',
			'nfound': 'Pokemon not found'
		},
		priority: {
			'err': 'An error ocurred, try again later',
			'err2': 'Pokemon not found',
			'err3': 'No moves found'
		},
		boosting: {
			'err': 'An error ocurred, try again later',
			'err2': 'Pokemon not found',
			'err3': 'No moves found'
		},
		recovery: {
			'err': 'An error ocurred, try again later',
			'err2': 'Pokemon not found',
			'err3': 'No moves found'
		},
		hazard: {
			'err': 'An error ocurred, try again later',
			'err2': 'Pokemon not found',
			'err3': 'No moves found'
		},
		/*
		* Battle Commands
		*/
		reloadteams: {'s': 'Teams reloaded', 'e': 'An error ocurred, could not reload teams'},
		blockchallenges: {
			'b': 'Challenges blocked',
			'nb': 'Challenges no longer blocked'
		},
		move: {'notbattle': 'This command is only available for battle rooms'},
		jointours: {
			'notchat': 'This command is only available for chat rooms',
			'ad': 'Mode "tour autojoin" already disabled for room',
			'd': 'Mode "tour autojoin" disabled for room',
			'ae': 'Mode "tour autojoin" already enabled for room',
			'e': 'Mode "tour autojoin" enabled for room'
		},
		searchbattle: {
			'e1': 'You must specify a format',
			'e21': 'Format',
			'e22': 'is not valid for searching battle',
			'e31': 'I do not have teams for searching battle in format',
			'e32': 'Use "team add" command to add more bot teams'
		},
		ladderstart: {
			'stop': 'Laddering stopped',
			'start': 'Now laddering in format',
			'e1': 'You must specify a format',
			'e21': 'Format',
			'e22': 'is not valid for searching battle',
			'e31': 'I do not have teams for searching battle in format',
			'e32': 'Use "team add" command to add more bot teams'
		},
		challenge: {
			'e11': 'Usage',
			'e12': '[user], [format]',
			'e21': 'Format',
			'e22': 'is not valid for challenging',
			'e31': 'I do not have teams for challenging in format',
			'e32': 'Use "team add" command to add more bot teams'
		},
		jointour: {
			'notchat': 'This command is only available for chat rooms',
			'e1': 'There is not a tournament in this room',
			'e2': 'Error: Already joined',
			'e3': 'Error: Tournament has already started',
			'e41': 'I do not have teams for joining a tornament in format',
			'e42': 'Use "team add" command to add more bot teams'
		},
		leavetour: {
			'notchat': 'This command is only available for chat rooms',
			'e1': 'There is no tournament in this room',
			'e2': 'Error: Not joined'
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
		team: {
			'u1': 'Usage',
			'u2': '[add/delete/get/check]',
			'u3': 'add, [name], [format], [Exportable in Hastebin]',
			'u4': 'delete, [name]',
			'u5': 'get, [name]',
			'u6': 'check, [name], (user)',
			'format': 'Format',
			'notexists': 'does not exists',
			'download': 'Dowloading and parsing team',
			'team': 'Team',
			'added': 'added successfully to bot teams list',
			'err': 'Error: failed to upload team to Hastebin',
			'err1': 'Error: Hastebin document not found',
			'err2': 'Error: Invalid team data',
			'err3': 'Error: There was already a team with that name, use another name or delete the other team',
			'err4': 'Error: Failed to get data from Hastebin',
			'removed': 'removed successfully from teams list'
		},
		teamlist: {
			'list': 'Bot teams list',
			'empty': 'Bot teams list is empty',
			'id': 'Id',
			'format': 'Format',
			'pokemon': 'Pokemon',
			'err': 'Error: failed to upload teams list to Hastebin'
		},
		/*
		* Moderation Commands
		*/
		autoban: {
			'notchat': 'This command is only available for chat rooms',
			'notmod': 'requires moderator rank (@) or higher to ban users',
			'notarg': 'You must specify at least one user to blacklist',
			'bu': 'Blacklisted user',
			'u': 'User(s)',
			'added': 'added to blacklist successfully.',
			'already': 'already present in blacklist.',
			'all': 'All',
			'other': 'other',
			'illegal': 'users had illegal nicks and were not blacklisted.'
		},
		unautoban: {
			'notchat': 'This command is only available for chat rooms',
			'notmod': 'requires moderator rank (@) or higher to ban users',
			'notarg': 'You must specify at least one user to unblacklist.',
			'u': 'User(s)',
			'r': 'removed from blacklist successfully.',
			'noother': 'No other',
			'no': 'No',
			'nopresent': 'specified users were present in the blacklist.'
		},
		regexautoban: {
			'notchat': 'This command is only available for chat rooms',
			'notmod': 'requires moderator rank (@) or higher to ban users',
			'notarg': 'You must specify a regular expression to (un)blacklist.',
			're': 'Regular expression',
			'notadd': 'cannot be added to the blacklist. Don\'t be Machiavellian!',
			'already': 'is already present in the blacklist.',
			'addby': 'was added to the blacklist by user',
			'add': 'was added to the blacklist.'
		},
		unregexautoban: {
			'notchat': 'This command is only available for chat rooms',
			'notmod': 'requires moderator rank (@) or higher to ban users',
			'norarg': 'You must specify a regular expression to (un)blacklist.',
			'notpresent': 'is not present in the blacklist.',
			're': 'Regular expression',
			'rby': 'was removed from the blacklist user by',
			'r': 'was removed from the blacklist.'
		},
		viewblacklist: {
			'notchat': 'This command is only available for chat rooms',
			'iu': 'Invalid nickname',
			'u': 'User',
			'currently': 'is currently',
			'not': 'not',
			'b': 'blacklisted in',
			'nousers': 'No users are blacklisted in',
			'listab': 'The following users are banned in',
			'listrab': 'The following regexes are banned in',
			'err': 'upload failure, could not upload blacklist to hastebin'
		},
		zerotol: {
			'nolevels': 'There are not any zero tolerance levels',
			'user': 'User',
			'level': 'Level',
			'ztl': 'Zero tolerance list',
			'empty': 'Zero tolerance list is empty',
			'is': 'is',
			'n': 'NOT',
			'y': '',
			'in': 'in the zero tolerance list',
			'u1': 'Usage',
			'u2': '[add/delete], [User1:level]...',
			'users': 'User(s)',
			'add': 'added to the zero tolerance list',
			'illegal': 'users had illegal nicks',
			'invalid': 'had invalid levels',
			'already': 'were already present in the list',
			'removed': 'removed from the zero tolerance list',
			'not': 'users were not present in the list',
			'err': 'upload failure, could not upload zero tolerance list to hastebin'
		},
		banword: {
			'notchat': 'This command is only available for chat rooms',
			'phrase': 'Phrase',
			'already': 'is already banned.',
			'ban': 'is now banned.'
		},
		unbanword: {
			'notchat': 'This command is only available for chat rooms',
			'phrase': 'Phrase',
			'not': 'is not currently banned.',
			'unban': 'is no longer banned.'
		},
		viewbannedwords: {
			'notchat': 'This command is only available for chat rooms',
			'in': 'in',
			'globally': 'globally',
			'phrase': 'Phrase',
			'nowords': 'No phrases are banned in this room.',
			'curr': 'is currently',
			'not': 'not',
			'banned': 'banned',
			'list': 'The following phrases are banned',
			'link': 'Banned phrases',
			'err': 'upload failure, could not upload banwords to hastebin'
		},
		inapword: {
			'notchat': 'This command is only available for chat rooms',
			'phrase': 'Phrase',
			'already': 'is already inappropriate.',
			'ban': 'is now inappropriate.'
		},
		uninapword: {
			'notchat': 'This command is only available for chat rooms',
			'phrase': 'Phrase',
			'not': 'is not currently inappropriate.',
			'unban': 'is no longer inappropriate.'
		},
		viewinapwords: {
			'notchat': 'This command is only available for chat rooms',
			'in': 'in',
			'globally': 'globally',
			'phrase': 'Phrase',
			'nowords': 'No phrases are inappropriate in this room.',
			'curr': 'is currently',
			'not': 'not',
			'banned': 'inappropriate',
			'list': 'The following phrases are inappropriate',
			'link': 'Inappropriate phrases',
			'err': 'upload failure, could not upload inappropriate phrases to hastebin'
		},
		joinphrase: {
			'notchat': 'This command is only available for chat rooms',
			'ae': 'Join phrases already enabled for this room',
			'e': 'Join phrases are now enabled for this room"',
			'ad': 'Join phrases already disabled for this room"',
			'd': 'Join phrases are now disabled for this room',
			'u1': 'Usage',
			'u2': '[set/delete], [user], [phrase]',
			'dis': 'Join phrases are disabled in this room',
			'jpfor': 'Join Phrase for user',
			'modified': 'has been modified',
			'globally': 'globally.',
			'forthis': 'for this room.',
			'del': 'has been deleted',
			'not': 'does not exists'
		},
		viewjoinphrases: {
			'notchat': 'This command is only available for chat rooms',
			'iu': 'Invalid username.',
			'not': 'No Joinphrase set for',
			'empty': 'There are not JoinPhrases in this room.',
			'jp': 'Join Phrases set',
			'globally': 'globally',
			'in': 'in',
			'err': 'upload failure, could not upload joinphrases to hastebin'
		},
		mod: {
			'notchat': 'This command is only available for chat rooms',
			'u1': 'Usage',
			'u2': '(room - optional), [mod], [on/off]',
			'valid': 'Valid moderations are',
			'mod': 'Moderation for',
			'ae': 'already ON for room',
			'e': 'is now ON for room',
			'ad': 'already OFF for room',
			'd': 'is now OFF for room'
		},
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (format), (seconds to start or off), (minutes autodq or off), (max Users or off), (elimination or roundrobin). All arguments are optional.'},
		tournament: {
			'e1': 'requires moderator rank (@) or higher to create tornaments',
			'e2': 'There is already a tournament in this room',
			'e31': 'Format',
			'e32': 'is not valid for tournaments',
			'e4': 'Time to start is not a valid time',
			'e5': 'Autodq is not a valid time',
			'e6': 'Max users number is not valid',
			'e7': 'Tour type is not valid. Valid types are: elimination, roundrobin',
			'notstarted': 'Error: the tournament did not start, probably because I have not permission to create tournaments or commands got changed.'
		}
	},

	/*
	* Features
	*/

	time: {
		'second': 'second',
		'seconds': 'seconds',
		'minute': 'minute',
		'minutes': 'minutes',
		'hour': 'hour',
		'hours': 'hours',
		'day': 'day',
		'days': 'days'
	},

	youtube: {
		'before': '',
		'after': '\'s link'
	},

	battle: {
		'battlefound': 'Battle found in ladder'
	},

	moderation: {
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
		'inapword': 'Your message contained an inappropriate phrase',
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
		'inapword-0': 'Inappropriate',
		'banword-0': 'Bannedwords',
		//autoban
		'ab': 'Blacklisted user'
	}
};

exports.translations = {
	commands: {
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
		modexception: {
			'notchat': 'This command is only available for chat rooms',
			'all': 'regular users',
			'rank': 'rank',
			'modex-inf1': 'Moderation exception is enabled for',
			'modex-inf2': 'or higher in this room',
			'modex-set1': 'Moderation exception was enabled for',
			'modex-set2': 'or higher in this room',
			'not1': 'Rank',
			'not2': 'not found'
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
		}
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
		'replays': 'Replays are not allowed in this room',
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
		'replays-0': 'Replay',
		'server-0': 'Private Servers',
		'inapword-0': 'Inappropriate',
		'banword-0': 'Bannedwords',
		//autoban
		'ab': 'Blacklisted user'
	}
};

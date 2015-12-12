exports.translations = {
	commands: {
		/*
		* Misc Commands
		*/
		pick: {'pick': 'Random pick', 'err': 'You must give at least 2 valid choices'},
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
		regdate: {
			'inv': 'Invalid username',
			'busy': 'Currently downloading the data, try again in a few seconds',
			'err': 'Could not get data from',
			'user': 'User',
			'not': 'is not registered',
			'regtime1': 'was registered',
			'regtime2': 'ago',
			'regdate': 'was registered on'
		},
		/*
		* Smogon
		*/
		usage: {
			'in': 'in',
			'stats': 'Usage stats',
			'data': 'Usage data',
			'usage': 'Usage',
			'tiererr1': 'Tier or format',
			'tiererr2': 'not found',
			'tiererr3': 'not available',
			'err': 'Could not get usage data from',
			'busy': 'Downloading the usage data. Try again in a few seconds',
			'pokeerr1': 'Pokemon',
			'pokeerr2': 'not available in',
			'pokeerr3': 'usage data',
			'pokeerr4': 'usage stats',
			'notfound': 'Data not found for',
			'usagedata1': '',
			'usagedata2': '\'s #NAME',
			'pokeusage': 'Usage',
			'pokeraw': 'Raw',
			'abilities': 'Abilities',
			'items': 'Items',
			'moves': 'Moves',
			'spreads': 'Spreads',
			'teammates': 'Teammates'
		},
		suspect: {
			'tiererr1': 'Tier',
			'tiererr2': 'not found',
			'in': 'in',
			'nosuspect': 'No suspect test data found for tier',
			'aux1': 'Use',
			'aux2': 'to set the suspect data'
		},
		setsuspect: {
			'usage': 'Usage',
			'tier': 'Tier',
			'notfound': 'not found',
			'd1': 'Suspect test data for tier',
			'd2': 'has been removed'
		},
		deftier: {
			'usage': 'Usage',
			'notchat': 'This command is only available for chat rooms',
			'tiererr1': 'Tier',
			'tiererr2': 'not found',
			'set': 'Default tier for this room is now'
		},
		/*
		* Quotes & Jokes
		*/
		quote: {
			'u1': 'Usage',
			'u2': '[id], [quote]',
			'empty': 'Database is empty',
			'noid': 'You must specify a valid id',
			'quote': 'Quote',
			'n': 'does not exist',
			'd': 'has been successfully deleted',
			'already': 'already exists',
			'modified': 'has been successfully modified',
			'created': 'has been successfully created'
		},
		listquotes: {
			'empty': 'List of quotes is empty',
			'list': 'List of quotes',
			'err': 'Error: failed to upload quotes to Hastebin'
		},
		joke: {
			'u1': 'Usage',
			'u2': '[id], [joke]',
			'empty': 'Database is empty',
			'noid': 'You must specify a valid id',
			'joke': 'Joke',
			'n': 'does not exist',
			'd': 'has been successfully deleted',
			'already': 'already exists',
			'modified': 'has been successfully modified',
			'created': 'has been successfully created'
		},
		listjokes: {
			'empty': 'List of jokes is empty',
			'list': 'List of jokes',
			'err': 'Error: failed to upload jokes to Hastebin'
		},
		/*
		* Pokemon Commands
		*/
		translate: {
			'u1': 'Usage',
			'u2': '[word], (source language), (target language)',
			'lnot1': 'Language',
			'lnot2': 'not available. Available languages',
			'not1': 'Pokemon, ability, item, move or nature called',
			'not2': 'not found or not available in translations',
			'not3': 'not found',
			'tra': 'Translations of',
			'pokemon': 'Pokemon',
			'abilities': 'Ability',
			'items': 'Item',
			'moves': 'Move',
			'natures': 'Nature'
		},
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
		}
	}
};

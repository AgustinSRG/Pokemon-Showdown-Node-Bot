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
		usage: {
			'stats': 'Usage stats'
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

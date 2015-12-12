exports.translations = {
	commands: {
		/*
		* Misc Commands
		*/
		pick: {'pick': 'Scelta a caso', 'err': 'Devi impostare almeno due opzioni valide'},
		randomanswer: {
			'answers': [
				'Assegna punti a sì',
				'Sì.',
				'Risposta dubbia, ritenta.',
				'Senza dubbio.',
				'Le mie fonti dicono no',
				'Per come la vedo io, sì.',
				'Puoi contarci.',
				'Concentrati e riprova.',
				'Non il massimo.',
				'Decisamente.',
				'Meglio non dirtelo, per ora.',
				'Molto incerto.',
				'Sì - sicuramente.',
				'È evidente.',
				'Non si può sapere al momento.',
				'Molto probabilmente.',
				'Richiedi più tardi.',
				'La mia risposta è no.',
				'Non male.',
				'Non contarci.'
			]
		},
		regdate: {
			'inv': 'Nome utente non valido',
			'busy': 'Al momento di scaricare i dati, provare di nuovo in pochi secondi',
			'err': 'Impossibile ottenere i dati da',
			'user': 'Utente',
			'not': 'non è registrato',
			'regtime1': 'è stato registrato',
			'regtime2': 'fa',
			'regdate': 'è stato registrato su'
		},
		/*
		* Smogon
		*/
		usage: {
			'in': 'in',
			'stats': 'Statistiche di utilizzo',
			'data': 'Dati di utilizzo',
			'usage': 'Uso corretto',
			'tiererr1': 'Tier o formato',
			'tiererr2': 'non trovato',
			'tiererr3': 'non disponibile',
			'err': 'Impossibile ottenere i dati di utilizzo di',
			'busy': 'Download dei dati di utilizzo. Riprovare in pochi secondi',
			'pokeerr1': 'Pokemon',
			'pokeerr2': 'non disponibile in',
			'pokeerr3': 'dati di utilizzo',
			'pokeerr4': 'statistiche di utilizzo',
			'notfound': 'I dati non trovato per',
			'usagedata1': '#NAME di ',
			'usagedata2': '',
			'pokeusage': 'Uso',
			'pokeraw': 'Raw',
			'abilities': 'Abilità',
			'items': 'Strumenti',
			'moves': 'Mosse',
			'spreads': 'Spreads',
			'teammates': 'Compagne'
		},
		suspect: {
			'tiererr1': 'Tier',
			'tiererr2': 'non trovato',
			'in': 'in',
			'nosuspect': 'Non ci sono dati suspect test data trovato per tier',
			'aux1': 'Usa',
			'aux2': 'per impostare i dati sospetti'
		},
		setsuspect: {
			'usage': 'Uso corretto',
			'tier': 'Tier',
			'notfound': 'non trovato',
			'd1': 'Suspect test i dati di secondo tier',
			'd2': 'è stato rimosso'
		},
		deftier: {
			'usage': 'Uso corretto',
			'notchat': 'Questo comando è solo disponibile nelle chat room',
			'tiererr1': 'Tier',
			'tiererr2': 'non trovato',
			'set': 'Tier di default per questa room è ora'
		},
		/*
		* Quotes & Jokes
		*/
		quote: {
			'u1': 'Usage',
			'u2': '[id], [citazione]',
			'empty': 'Database è vuoto',
			'noid': 'È necessario specificare un documento d\'identità valido',
			'quote': 'Citazione',
			'n': 'non esiste',
			'd': 'è stato eliminato con successo',
			'already': 'esiste già',
			'modified': 'è stato modificato con successo',
			'created': 'è stato creato con successo'
		},
		listquotes: {
			'empty': 'Elenco di citazioni è vuota',
			'list': 'Lista di citazioni',
			'err': 'Errore: non è riuscito a caricare le virgolette per Hastebin'
		},
		joke: {
			'u1': 'Usage',
			'u2': '[id], [battuta]',
			'empty': 'Database è vuoto',
			'noid': 'È necessario specificare un documento d\'identità valido',
			'joke': 'Battuta',
			'n': 'non esiste',
			'd': 'è stato eliminato con successo',
			'already': 'esiste già',
			'modified': 'è stato modificato con successo',
			'created': 'è stato creato con successo'
		},
		listjokes: {
			'empty': 'Elenco di battute è vuota',
			'list': 'Elenco di battute',
			'err': 'Errore: non è riuscito a caricare scherzi a Hastebin'
		},
		/*
		* Pokemon Commands
		*/
		translate: {
			'u1': 'Usage',
			'u2': '[parola], (lingua di partenza), (lingua di arrivo)',
			'lnot1': 'Lingua',
			'lnot2': 'non disponibile. Lingue disponibili',
			'not1': 'Pokemon, ability, item, move o nature chiamato',
			'not2': 'non trovato o non disponibile in traduzioni',
			'not3': 'non trovato',
			'tra': 'Traduzioni di',
			'pokemon': 'Pokemon',
			'abilities': 'Ability',
			'items': 'Item',
			'moves': 'Move',
			'natures': 'Nature'
		},
		randompokemon: {'err': 'C\'è stato un errore, riprova più tardi'},
		gen: {
			'err': 'C\'è stato un errore, riprova più tardi',
			'err2': 'Devi specificare un pokemon, una mossa, uno strumento, o un\' abilità',
			'nfound': 'Pokemon, mossa, strumento, o abilità non trovata',
			'g': 'Generazione di'
		},
		randommoves: {
			'err': 'C\'è stato un errore, riprova più tardi',
			'err2': 'Devi specificare un Pokemon',
			'r': 'Mosse in Random Singles',
			'rd': 'Mosse in Random Doubles / Triples',
			'nfound': 'Pokemon non trovato'
		},
		heavyslam: {
			'err': 'C\'è stato un errore, riprova più tardi',
			'err2': 'Devi specificare 2 Pokemon',
			'n1': 'Pokemon Attaccante non trovato',
			'n2': 'Pokemon Difensore non trovato',
			's': 'Heavy slam/Heat crash base power'
		},
		prevo: {
			'err': 'C\'è stato un errore, riprova più tardi',
			'p1': 'Pokemon',
			'p2': 'non ha pre-evo',
			'nfound': 'Pokemon non trovato'
		},
		priority: {
			'err': 'C\'è stato un errore, riprova più tardi',
			'err2': 'Pokemon non trovato',
			'err3': 'Nessuna mossa trovata'
		},
		boosting: {
			'err': 'C\'è stato un errore, riprova più tardi',
			'err2': 'Pokemon non trovato',
			'err3': 'Nessuna mossa trovata'
		},
		recovery: {
			'err': 'C\'è stato un errore, riprova più tardi',
			'err2': 'Pokemon non trovato',
			'err3': 'Nessuna mossa trovata'
		},
		hazard: {
			'err': 'C\'è stato un errore, riprova più tardi',
			'err2': 'Pokemon non trovato',
			'err3': 'Nessuna mossa trovata'
		}
	}
};

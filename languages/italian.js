exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		about: {
			'about': '**Pokemon Showdown Bot** scritto in Javascript per Node. da Ecuacion.'
		},
		time: {'time': 'Bot Time'},
		uptime: {
			'week': 'settimana',
			'day': 'giorno',
			'hour': 'ora',
			'minute': 'minuto',
			'second': 'secondo',
			'and': 'e'
		},
		seen: {
			'inv': 'username non valido',
			'bot': 'Ma sai leggere? Ripigliati.',
			'self': 'Ti sei guardato allo specchio recentemente??',
			's1': 'è stato visto l\'ultima volta',
			's2': 'fa',
			'n1': 'l\'user',
			'n2': 'non è ancora stato visto, dall\'ultimo reset',
			'j': 'entrare',
			'l': 'uscire',
			'c': 'chatto in',
			'n': 'il nuovo nick è'
		},
		language: {
			'notchat': 'Questo comando è solo disponibile nelle chat room',
			'nolang': 'Devi specificare una lingua',
			'v': 'Le lingue supportate sono',
			'l': 'Il linguaggio di questa room è: Italiano'
		},
		set: {
			'notchat': 'TQuesto comando è solo disponibile nelle chat room',
			'denied': 'Accesso negato',
			'u1': 'Usage',
			'u2': '[permission], [rank]',
			'ps': 'Permessi',
			'p': 'Permessi',
			'd': 'ora è disabilitato in questa room',
			'a': 'disponibile a tutti gli user della room',
			'r': 'disponibile a tutti gli user della room di grado',
			'r2': 'o superiore',
			'not1': 'Rank',
			'not2': 'non trovato'
		},
		/*
		* Dyn Commands
		*/
		dyn: {
			'nocmds': 'Nessun comando',
			'list': 'Comandi dinamici',
			'c': 'Comando',
			'notexist': 'non esiste'
		},
		delcmd: {
			'c': 'Comando',
			'd': 'rimosso con successo',
			'n': 'non esiste'
		},
		setcmd: {
			'notemp': 'Non ci sono string temporanee da settare, usa **stemp** prima di ciò',
			'c': 'Comando',
			'modified': 'modificato con successo',
			'created': 'creato con successo'
		},
		setcmdalias: {
			'u1': 'Usage',
			'u2': '[alias], [cmd]',
			'n': 'non è un comando dinamico',
			'c': 'Comando',
			'alias': 'è ora un alias di',
			'already': 'è un alias. Non puoi impostare un alias di un alias.'
		},
		getdyncmdlist: {
			'nocmds': 'Nessun comando',
			'list': 'Comandi dinamici',
			'err': 'upload fallito, impossibile caricare su hastebin'
		},
		/*
		* Misc Commands
		*/
		pick: {'err': 'Devi impostare almeno due opzioni valide'},
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
		usage: {
			'stats': 'Usage stats'
		},
		help: {
			'guide': 'Guida ai comandi del bot'
		},
		youtube: {
			'notchat': 'Questo comando è disponibile solo nelle chat rooms',
			'u': 'Usage',
			'ae': 'Il riconoscimento dei link YouTube è già abilitato',
			'e': 'Il riconoscimento dei link YouTube è ora abilitato',
			'ad': 'Il riconoscimento dei link YouTube è già disabilitato',
			'd': 'Il riconoscimento dei link YouTube è ora disabilitato'
		},
		/*
		* Quotes
		*/
		quote: {
			'nodata': 'Database vuoto'
		},
		setquote: {
			'notemp': 'Non ci sono string temporanee da settare, usa **stemp** prima di ciò',
			'q': 'Citazione',
			'modified': 'has been successfully modified',
			'created': 'has been successfully created'
		},
		delquote: {
			'q': 'Citazione',
			'd': 'rimosso con successo',
			'n': 'non esiste'
		},
		viewquotes: {
			'q': 'Citazione',
			'n': 'non esiste',
			'empty': 'Elenco di citazioni è vuoto',
			'list': 'Elenco di citazioni',
			'err': 'upload fallito, impossibile caricare su hastebin'
		},
		addquotes: {
			'notfound': 'Error: Document not found',
			'd': 'Il download del documento Hastebin',
			'add': 'aggiunti',
			'q': 'citaziones',
			'err': 'Error: impossibile caricare su hastebin'
		},
		/*
		* Pokemon Commands
		*/
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
		},
		/*
		* Battle Commands
		*/
		reloadteams: {'s': 'Team ricaricati', 'e': 'C\'è stato un errore, impossibile ricaricare i team-'},
		blockchallenges: {
			'b': 'Challenges bloccate',
			'nb': 'Challenges non più bloccate'
		},
		move: {'notbattle': 'Questo comando è disponibile solo nelle battle.'},
		jointours: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'ad': 'Modalità "tour autojoin" è già disabilitata in questa room',
			'd': 'Modalità "tour autojoin" disabilitata in questa room',
			'ae': 'Modalità "tour autojoin" è già abilitata in questa room',
			'e': 'Modalità "tour autojoin" abilitata in questa room'
		},
		searchbattle: {
			'e1': 'Devi specificare un formato',
			'e21': 'Il formato',
			'e22': 'non è valido per cercare una battle',
			'e31': 'Non ho team per cercare una battle in questo formato',
			'e32': 'Usa "team add" per aggiungere più team'
		},
		ladderstart: {
			'stop': 'Laddering interrotto',
			'start': 'Ladderando nel formato',
			'e1': 'Devi specificare un formato',
			'e21': 'Il formato',
			'e22': 'non è valido per cercare una battle',
			'e31': 'Non ho team per cercare una battle in questo formato',
			'e32': 'Usa "team add" per aggiungere più team'
		},
		challenge: {
			'e11': 'Usage',
			'e12': '[user], [format]',
			'e21': 'Il formato',
			'e22': 'non è valido per le challenges',
			'e31': 'Non ho team per accettare challenges in questo formato',
			'e32': 'Usa "team add" per aggiungere più team'
		},
		jointour: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'e1': 'Nessun torneo nella room',
			'e2': 'Error: Già joinato',
			'e3': 'Error: Torneo già iniziato',
			'e41': 'Non ho team per joinare un torneo in questo formato',
			'e42': 'Usa "team add" per aggiungere più team'
		},
		leavetour: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'e1': 'Nessun torneo nella room',
			'e2': 'Error: Non joinato'
		},
		battleset: {
			'u1': 'Usage',
			'u2': '[permission], [rank]',
			'ps': 'Permissions',
			'p': 'Permessi',
			'd': 'in battle sono disabilitati',
			'a': 'in battle disponibili a tutti gli user',
			'r': 'disponibili a tutti gli user della room di grado (+) o superiore',
			'r2': 'o superiore',
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
			'format': 'Il formato',
			'notexists': 'non esiste',
			'download': 'Importando il team',
			'team': 'Team',
			'added': 'aggiunto con successo all\'elenco',
			'err': 'Error: Impossibile caricare i team su Hastebin',
			'err1': 'Error: Hastebin non valido',
			'err2': 'Error: Team non valido',
			'err3': 'Error: Un team con lo stesso nome è già presente, si prega di sceglierne uno diverso',
			'err4': 'Error: Impossibile ottenere dati da Hastebin',
			'removed': 'rimosso dall\' elenco con successo'
		},
		teamlist: {
			'list': 'Lista di team del bot',
			'empty': 'La lista di team del bot è vuota',
			'id': 'Id',
			'format': 'Formato',
			'pokemon': 'Pokemon',
			'err': 'Error: Impossibile caricare i team su Hastebin'
		},
		/*
		* Moderation Commands
		*/
		autoban: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'notmod': 'richiede grado di mod (@) o superiore per bannare utenti',
			'notarg': 'Devi specificare almeno un user per la banlist',
			'bu': 'Blacklisted user',
			'u': 'User',
			'added': 'aggiunti alla blacklist con successo.',
			'already': 'già nella blacklist.',
			'all': 'Tutti',
			'other': 'Altri',
			'illegal': 'users avevano nick non validi quindi non aggiunti.'
		},
		unautoban: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'notmod': 'richiede grado di mod (@) o superiore per bannare utenti',
			'notarg': 'Devi specificare almeno un user da rimuovere dalla banlist',
			'u': 'User',
			'r': 'rimosso con successo dalla blacklist.',
			'noother': 'Nessun altro',
			'no': 'No',
			'nopresent': 'user specificati non presenti.'
		},
		regexautoban: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'notmod': 'richiede grado di mod (@) o superiore per bannare utenti',
			'notarg': 'Devi specificare almeno una regex per la banlist',
			're': 'Regular expression',
			'notadd': 'impossibile da aggiungere. Non essere troppo complicato!',
			'already': 'già presente nella blacklist.',
			'addby': 'aggiunto alla blacklist da',
			'add': 'aggiunto alla blacklist.'
		},
		unregexautoban: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'notmod': 'richiede grado di mod (@) o superiore per bannare utenti',
			'notarg': 'Devi specificare almeno una regex da rimuovere dalla banlist',
			'notpresent': 'non presente nella blacklist.',
			're': 'Regular expression',
			'rby': 'rimosso dalla blacklist da',
			'r': 'rimosso dalla blacklist.'
		},
		viewblacklist: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'iu': 'Nickname non valido',
			'u': 'User',
			'currently': 'è al momento',
			'not': 'non',
			'b': 'nella blacklist.',
			'nousers': 'Nessun user nella blacklist',
			'listab': 'I seguenti sono bannati in',
			'listrab': 'Le seguenti regex sono bannate in',
			'err': 'upload fallito, impossibile caricare su hastebin'
		},
		zerotol: {
			'nolevels': 'Non ci sono livelli di tolleranza zero',
			'user': 'User',
			'level': 'Livello',
			'ztl': 'Lista di tolleranza zero',
			'empty': 'Lista di tolleranza zero è vuoto',
			'is': '',
			'n': 'NON',
			'y': '',
			'in': 'nella lista di tolleranza zero',
			'u1': 'Usage',
			'u2': '[add/delete], [User:livello]...',
			'users': 'User(s)',
			'add': 'aggiunti alla lista di tolleranza zero',
			'illegal': 'users aveva nick illegali',
			'invalid': 'avevano livelli non validi',
			'already': 'erano già nell\'elenco',
			'removed': 'rimosso dalla lista di tolleranza zero',
			'not': 'users non erano presenti nella lista',
			'err': 'upload fallito, impossibile caricare su hastebin'
		},
		banword: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'phrase': 'La frase',
			'already': 'è già bannata.',
			'ban': 'è ora banned.'
		},
		unbanword: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'phrase': 'La frase',
			'not': 'non è bannata.',
			'unban': 'non è più bannata.'
		},
		viewbannedwords: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'in': 'in',
			'globally': 'globalmente',
			'phrase': 'La frase',
			'nowords': 'Alcuna frase è bannata nella room.',
			'curr': 'è al momento',
			'not': 'non',
			'banned': 'bannata',
			'list': 'Le seguenti frasi sono bannate',
			'link': 'Frasi bannate',
			'err': 'upload fallito, impossibile caricare su hastebin'
		},
		inapword: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'phrase': 'La frase',
			'already': 'è già inappropriata.',
			'ban': 'è ora inappropriata.'
		},
		uninapword: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'phrase': 'La frase',
			'not': 'è al momento non inappropriata.',
			'unban': 'non è più inappropriata.'
		},
		viewinapwords: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'in': 'in',
			'globally': 'globalmente',
			'phrase': 'La frase',
			'nowords': 'Alcuna frase è inappropriata nella room.',
			'curr': 'è al momento',
			'not': 'non',
			'banned': 'inappropriata',
			'list': 'Le seguenti frasi sono inappropriata',
			'link': 'Frasi inappropriate',
			'err': 'upload fallito, impossibile caricare su hastebin'
		},
		joinphrase: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'ae': 'Greetings già abilitate',
			'e': 'Greeting ora abilitate',
			'ad': 'Greetings già disabilitate',
			'd': 'Greetings ora disabilitate',
			'u1': 'Usage',
			'u2': '[set/delete], [user], [phrase]',
			'dis': 'Greetings disabilitate',
			'jpfor': 'Greeting dell\'user',
			'modified': 'è stata modificata',
			'globally': 'per tutte le room.',
			'forthis': 'per questa room.',
			'del': 'è stata cancellata',
			'not': 'non esiste'
		},
		viewjoinphrases: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'iu': 'Nickname non valido.',
			'not': 'Nessun greeting per',
			'empty': 'Nessuna greet in questa room.',
			'jp': 'Greeting impostate',
			'globally': 'in tutte le room',
			'in': 'in',
			'err': 'upload fallito, impossibile caricare su hastebin'
		},
		mod: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'u1': 'Usage',
			'u2': '(room - optional), [mod], [on/off]',
			'valid': 'Moderazioni abilitate',
			'mod': 'Moderazione per',
			'ae': 'già ON per la room',
			'e': 'ora ON per la room',
			'ad': 'già OFF per la room',
			'd': 'ora OFF per la room'
		},
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (formato), (secondi prima dell\'avvio), (minuti di autodq oppure off), (numero massimo di users oppure off), (elimination o roundrobin). tutte le impostazioni sono opzionali.'},
		tourend: {'err': 'Nessun torneo nella room'},
		tournament: {
			'e1': 'richiede rank moderatore (@) o superiore per creare il torneo',
			'e2': 'C\'è già un torneo nella room',
			'e31': 'Il formato',
			'e32': 'non è valido per i tornei',
			'e4': 'Il tempo di inizio non è valido',
			'e5': 'Autodq non valida',
			'e6': 'Numero massimo di user non valido',
			'e7': 'Tipo di tour non valido. Scegliere tra elimination e roundrobin',
			'notstarted': 'Error: il torneo non è iniziato, non hai i permessi o i comandi sono cambiati.',
			'param': 'Parametro',
			'paramhelp': 'non trovato, parametro valido sono'
		}
	},

	/*
	* Features
	*/

	time: {
		'second': 'secondo',
		'seconds': 'secondi',
		'minute': 'minuto',
		'minutes': 'minuti',
		'hour': 'ora',
		'hours': 'ore',
		'day': 'giorno',
		'days': 'giorni'
	},

	youtube: {
		'before': '',
		'after': 'link di'
	},

	battle: {
		'battlefound': 'Battaglia trovato in ladder'
	},

	moderation: {
		'automod': 'Moderazione automatica',
		//mods
		'fs': 'Flooding / Spamming',
		'sl': 'Spamming links',
		's': 'Spamming',
		'f': 'Flooding',
		'possible': 'Possibile spammer',
		'caps': 'TROPPO CAPS',
		'stretch': 'Stretching',
		'spoiler': 'Spoiler vietati',
		'youtube': 'Youtube advertisement vietato',
		'server': 'Server privati vietati',
		'inapword': 'Messaggio inappropriato',
		'banword': 'Frase bannata',
		'mult': 'Infrazioni multiple',
		'0tol': '(NESSUNA TOLLERANZA)',
		//avb
		'caps-0': 'Caps',
		'rep-0': 'Di nuovo',
		'stretch-0': 'Stretching',
		'flood-0': 'Flooding',
		'spoiler-0': 'Spoiler',
		'youtube-0': 'canale Youtube',
		'server-0': 'server privati',
		'inapword-0': 'Inappropiato',
		'banword-0': 'Parole Bannate',
		//autoban
		'ab': 'User nella blacklist'
	}
};

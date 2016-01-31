exports.translations = {
	commands: {
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
		modexception: {
			'notchat': 'Questo comando è disponibile solo nelle chat',
			'all': 'utenti regolari',
			'rank': 'rank',
			'modex-inf1': 'Moderazione eccezione è abilitato per',
			'modex-inf2': 'o superiore in questa room',
			'modex-set1': 'Moderazione eccezione è stata attivata per',
			'modex-set2': 'o superiore in questa room',
			'not1': 'Rank',
			'not2': 'non trovato'
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
		}
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
		'replays': 'replay distacco non sono ammessi in questa stanza',
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
		'replays-0': 'Replay',
		'server-0': 'server privati',
		'inapword-0': 'Inappropiato',
		'banword-0': 'Parole Bannate',
		//autoban
		'ab': 'User nella blacklist'
	}
};

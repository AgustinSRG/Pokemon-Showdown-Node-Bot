exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		about: {
			'about': '**Pokemon Showdown Bot** scritto in Javascript per Node.',
			'author': 'Autore'
		},
		help: {
			'guide': 'Guida ai comandi del bot'
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
		alts: {
			'inv': 'username non valido',
			'n': 'Nessun alts trovato per l\'utente',
			'alts': 'Alts note del',
			'more': 'di Più'
		},
		/*
		* Admin Commands
		*/
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
		}
	},

	time: {
		'second': 'secondo',
		'seconds': 'secondi',
		'minute': 'minuto',
		'minutes': 'minuti',
		'hour': 'ora',
		'hours': 'ore',
		'day': 'giorno',
		'days': 'giorni'
	}
};

exports.translations = {
	commands: {
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
		}
	},

	battle: {
		'battlefound': 'Battaglia trovato in ladder'
	}
};

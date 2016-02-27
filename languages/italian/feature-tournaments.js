exports.translations = {
	commands: {
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (formato), (secondi prima dell\'avvio), (minuti di autodq oppure off), (numero massimo di users oppure off), (elimination o roundrobin). tutte le impostazioni sono opzionali.'},
		tourend: {'err': 'Nessun torneo nella room', 'err2': 'Error: Torneo già iniziato'},
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
		},
		official: {
			'not': 'Classifiche non è abilitato per la room',
			'notour': 'Nessun torneo nella room',
			'already': 'Il torneo era già ufficiale',
			'already-not': 'Il torneo era già ufficioso',
			'official': 'Questo torneo è ormai ufficiale e conterà per le classifiche',
			'unofficial': 'Questo torneo non è ufficiale'
		},
		leaderboard: {
			'usage': 'Usage',
			'invuser': 'Nome utente non valido',
			'rank': 'Ranking di',
			'in': 'in',
			'points': 'Punti',
			'w': 'Vincitore',
			'f': 'Finalista',
			'sf': 'Semifinalista',
			'times': 'volte',
			'total': 'Totale',
			'tours': 'tour giocati',
			'bwon': 'battaglie vinte',
			'not': 'Classifiche non è abilitato per la room',
			'empty': 'Non ci sono ancora i tornei registrati per room',
			'table': 'Tavolo classifiche',
			'err': 'Errore caricamento di tabella classifiche per Hastebin',
			'use': 'Utilizzare',
			'confirm': 'per confermare resettare i dati leaderboars per room',
			'invhash': 'Codice hash non valido',
			'data': 'Dati leaderboard per la room',
			'del': 'è stato resettato',
			'wasset': 'Configurazione Leaderboards è stato fissato per room',
			'wasdisabled': 'Classifiche è stato disattivato per room',
			'alrdisabled': 'Classifiche è già disabilitato per room',
			'unknown': 'Opzione sconosciuta'
		}
	}
};

exports.translations = {
	commands: {
		/*
		* Battle Commands
		*/
		reloadteams: {'s': 'Teams neu geladen', 'e': 'Ein Fehler ist aufgetreten, Teams konnten nicht neu geladen werden'},
		blockchallenges: {
			'b': 'Challenges werden ab jetzt blockiert',
			'nb': 'Challenges werden nicht mehr blockiert'
		},
		move: {'notbattle': 'Dieser Befehl kann nur in Chaträumen verwendet werden'},
		jointours: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'ad': 'Modus "tour autojoin" ist für diesen Raum bereits deaktiviert',
			'd': 'Modus "tour autojoin" für diesen Raum deaktivert',
			'ae': 'Modus "tour autojoin" ist für diesen Raum bereits aktiviert',
			'e': 'Modus "tour autojoin" ist für diesen Raum aktiviert'
		},
		searchbattle: {
			'e1': 'Du musst ein Format nennen',
			'e21': 'Format',
			'e22': 'ist kein Modus, in dem ich nach Kämpfen suchen kann',
			'e31': 'Ich kann nicht nach einem Kampf suchen, denn ich habe keine Teams im Format',
			'e32': 'Verwende den "team add"-Befehl um diesem Bot Teams hinzuzufügen'
		},
		ladderstart: {
			'stop': 'Laddern gestoppt',
			'start': 'Laddere jetzt im Format',
			'e1': 'Du musst ein Format nennen',
			'e21': 'Format',
			'e22': 'ist kein Modus, in dem ich nach Kämpfen suchen kann',
			'e31': 'Ich kann nicht laddern, denn ich habe keine Teams im Format',
			'e32': 'Verwende den "team add"-Befehl um diesem Bot Teams hinzuzufügen'
		},
		challenge: {
			'e11': 'Verwendung',
			'e12': '[user], [Format]',
			'e21': 'Format',
			'e22': 'ist kein Modus, in dem ich herausfordern kann',
			'e31': 'Ich kann nicht herausfordern, denn ich habe keine Teams im Format',
			'e32': 'Verwende den "team add"-Befehl um diesem Bot Teams hinzuzufügen'
		},
		jointour: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'e1': 'Es gibt kein Turnier in diesem Raum',
			'e2': 'Fehler: Bereits dem Turnier beigetreten',
			'e3': 'Fehler: Turnier ist bereits gestartet',
			'e41': 'Ich kann dem Turnier nicht beitreiten, denn ich habe keine Teams im Format',
			'e42': 'Verwende den "team add"-Befehl um diesem Bot Teams hinzuzufügen'
		},
		leavetour: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'e1': 'Es gibt kein Tournier in diesem Raum',
			'e2': 'Fehler: Bot ist keinem Turnier beigetreten'
		},
		team: {
			'u1': 'Verwendung',
			'u2': '[add (hinzufügen)/delete (löschen)/get (ansehen)/check (bestimmten user mit bestimmten Team herausfordern)]',
			'u3': 'add, [Name], [Format], [Hastebin vom Team]',
			'u4': 'delete, [Name]',
			'u5': 'get, [Name]',
			'u6': 'check, [Name], (user)',
			'format': 'Format',
			'notexists': 'existiert nicht',
			'download': 'Herunterladen und Verarbeiten des Teams',
			'team': 'Team',
			'added': 'erfolgreich zur Bot-Teamliste hinzugefügt',
			'err': 'Fehler: konnte Team nicht auf Hastebin hochladen',
			'err1': 'Fehler: Hastebin-Dokument nicht gefunden',
			'err2': 'Fehler: Ungültige Teamdaten',
			'err3': 'Fehler: Es gibt bereits ein Team mit diesem Namen, benutze einen anderen Namen oder lösche das bereits bestehende Team',
			'err4': 'Fehler: Laden der Daten aus Hastebin fehlgeschlagen',
			'removed': 'erfolgreich aus der Teamliste gelöscht'
		},
		teamlist: {
			'list': 'Teamliste dieses Bots',
			'empty': 'Teamliste dieses Bots ist leer',
			'id': 'Id',
			'format': 'Format',
			'pokemon': 'Pokemon',
			'err': 'Fehler: Hochladen der Teamliste zu Hastebin fehlgeschlagen'
		}
	},

	battle: {
		'battlefound': 'Kampf gefunden im Ladder'
	}
};

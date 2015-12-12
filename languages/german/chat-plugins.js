exports.translations = {
	commands: {
		/*
		* Misc Commands
		*/
		pick: {'pick': 'Zufällige Pick', 'err': 'Du must mindestens zwei gültige Auswahlmöglichkeiten geben'},
		randomanswer: {
			'answers': [
				'Alle Zeichen stehen auf Ja.',
				'Ja.',
				'Die Antwort ist verschwommen, versuch es nochmal.',
				'Ohne jeden Zweifel.',
				'Meine Quellen sagen Nein.',
				'So wie ich es sehe, Ja.',
				'Darauf kannst du dich verlassen.',
				'Konzentrier dich und frag nochmal.',
				'Das sieht nicht gut aus.',
				'So ist es entschieden.',
				'Das sage ich jetzt besser nicht.',
				'Sehr zweifelhaft.',
				'Ja - definitiv.',
				'Das ist sicher.',
				'Kann ich jetzt nicht vorraussehen.',
				'So ziemlich.',
				'Frag später nochmal.',
				'Meine Antwort ist Nein.',
				'Das sieht gut aus.',
				'Darauf solltest du dich nicht verlassen.'
			]
		},
		regdate: {
			'inv': 'Ungültiger Benutzername',
			'busy': 'Derzeit Herunterladen der Daten, versuchen Sie es erneut in ein paar Sekunden',
			'err': 'Daten konnten nicht abgerufen werden',
			'user': 'Benutzer',
			'not': 'ist nicht registriert',
			'regtime1': 'wurde vor',
			'regtime2': 'registered',
			'regdate': 'wurde am eingetragenen'
		},
		/*
		* Smogon
		*/
		usage: {
			'in': 'im',
			'stats': 'Nutzungsstatistiken',
			'data': 'Nutzungsdaten',
			'usage': 'Verwendung',
			'tiererr1': 'Tier oder Format',
			'tiererr2': 'nicht gefunden',
			'tiererr3': 'nicht verfügbar',
			'err': 'Nutzungsdaten von konnte nicht abgerufen werden',
			'busy': 'Herunterladen der Nutzungsdaten. Versuchen Sie es erneut in ein paar Sekunden',
			'pokeerr1': 'Pokemon',
			'pokeerr2': 'in nicht verfügbar',
			'pokeerr3': 'nutzungsdaten',
			'pokeerr4': 'nutzungsstatistiken',
			'notfound': 'Daten nicht gefunden',
			'usagedata1': '',
			'usagedata2': ' #NAME',
			'pokeusage': 'Verwendung',
			'pokeraw': 'Raw',
			'abilities': 'Abilities',
			'items': 'Items',
			'moves': 'Moves',
			'spreads': 'Spreads',
			'teammates': 'Teammates'
		},
		suspect: {
			'tiererr1': 'Tier',
			'tiererr2': 'nicht gefunden',
			'in': 'im',
			'nosuspect': 'Keine suspect test daten gefunden',
			'aux1': 'Verwenden',
			'aux2': 'ir die suspect datensatz'
		},
		setsuspect: {
			'usage': 'Verwendung',
			'tier': 'Tier',
			'notfound': 'nicht gefunden',
			'd1': 'Suspect test daten für tier',
			'd2': 'wurde entfernt'
		},
		deftier: {
			'usage': 'Verwendung',
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'tiererr1': 'Tier',
			'tiererr2': 'nicht gefunden',
			'set': 'Standard tier für dieses Chaträumen ist jetzt'
		},
		/*
		* Quotes & Jokes
		*/
		quote: {
			'u1': 'Usage',
			'u2': '[id], [zitat]',
			'empty': 'Datenbank ist leer',
			'noid': 'müssen Sie eine gültige ID angeben',
			'quote': 'Zitat',
			'n': 'existiert nicht',
			'd': 'wurde erfolgreich gelöscht',
			'already': 'ist bereits vorhanden',
			'modified': 'wurde erfolgreich geändert',
			'created': 'erfolgreich erstellt wurde'
		},
		listquotes: {
			'empty': 'Liste der Zitate ist leer',
			'list': 'Liste der Zitate',
			'err': 'Fehler: Fehler beim Anführungszeichen hochladen, um Hastebin'
		},
		joke: {
			'u1': 'Usage',
			'u2': '[id], [witz]',
			'empty': 'Datenbank ist leer',
			'noid': 'müssen Sie eine gültige ID angeben',
			'joke': 'Witz',
			'n': 'existiert nicht',
			'd': 'wurde erfolgreich gelöscht',
			'already': 'ist bereits vorhanden',
			'modified': 'wurde erfolgreich geändert',
			'created': 'erfolgreich erstellt wurde'
		},
		listjokes: {
			'empty': 'Liste von Witzen ist leer',
			'list': 'Liste von Witzen',
			'err': 'Fehler: Fehler beim Witze hochladen, um Hastebin'
		},
		/*
		* Pokemon Commands
		*/
		translate: {
			'u1': 'Verwendung',
			'u2': '[Wort], (Ausgangssprache), (Zielsprache)',
			'lnot1': 'Sprache',
			'lnot2': 'nicht verfügbar. Verfügbare Sprachen',
			'not1': 'Pokemon, ability, item, move or nature namens',
			'not2': 'nicht gefunden oder in Übersetzungen nicht verfügbar',
			'not3': 'nicht gefunden',
			'tra': 'Übersetzungen von',
			'pokemon': 'Pokemon',
			'abilities': 'Ability',
			'items': 'Item',
			'moves': 'Move',
			'natures': 'Nature'
		},
		randompokemon: {'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal'},
		gen: {
			'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal',
			'err2': 'Du must ein Pokemon, eine Attacke, eine Fähigkeit oder ein Item nennen',
			'nfound': 'Pokemon, Item, Attacke oder Fähigkeit nicht gefunden',
			'g': 'Generation von'
		},
		randommoves: {
			'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal',
			'err2': 'Du musst ein Pokemon nennen',
			'r': 'Zufällige singles Attacken',
			'rd': 'Zufällige doubles/triples Attacken',
			'nfound': 'Pokemon nicht gefunden'
		},
		heavyslam: {
			'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal',
			'err2': 'Du musst zwei Pokemon nennen',
			'n1': 'Angreifendes Pokemon nicht gefunden',
			'n2': 'Verteidigendes Pokemon nicht gefunden',
			's': 'Heavy slam/Heat crash Basisstärke'
		},
		prevo: {
			'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal',
			'p1': 'Pokemon',
			'p2': 'hat keine Vorentwicklung',
			'nfound': 'Pokemon nicht gefunden'
		},
		priority: {
			'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal',
			'err2': 'Pokemon nicht gefunden',
			'err3': 'Keine Attacken gefunden'
		},
		boosting: {
			'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal',
			'err2': 'Pokemon nicht gefunden',
			'err3': 'Keine Attacken gefunden'
		},
		recovery: {
			'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal',
			'err2': 'Pokemon nicht gefunden',
			'err3': 'Keine Attacken gefunden'
		},
		hazard: {
			'err': 'Ein Fehler ist aufgetreten. Versuche es später nochmal',
			'err2': 'Pokemon nicht gefunden',
			'err3': 'Keine Attacken gefunden'
		}
	}
};

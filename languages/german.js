exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		about: {
			'about': 'Ich bin ein **Pokemon Showdown Bot** geschrieben in JavaScript für Node. Von: Spudling.'
		},
		time: {'time': 'Zeit dieses Bots'},
		uptime: {
			'week': 'Woche',
			'day': 'Tag',
			'hour': 'Stunden',
			'minute': 'Minuten',
			'second': 'Sekunden',
			'and': 'und'
		},
		seen: {
			'inv': 'Wer?',
			'bot': 'Das bin ich! :DD',
			'self': 'Das bist du! :DD',
			's1': 'war zuletzt online vor',
			's2': ' ',
			'n1': 'Der user',
			'n2': 'war nicht online, jedenfalls seitdem dieser Bot zuletzt zurückgesetzt wurde',
			'j': 'beim Betreten des Raums',
			'l': 'beim Verlassen des Raums',
			'c': 'beim chatten in',
			'n': 'beim Ändern des Namens in'
		},
		language: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'nolang': 'Du musst eine Sprache festlegen',
			'v': 'Mögliche Sprachen sind',
			'l': 'Die Sprache für diesen Raum ist jetzt Deutsch'
		},
		set: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'denied': 'Zugriff verweigert',
			'u1': 'Verwendung',
			'u2': '[Berechtigung], [Rang]',
			'ps': 'Berechtigungen',
			'p': 'Berechtigung',
			'd': 'ist in diesem Raum jetzt deaktiviert',
			'a': 'ist in diesem Raum jetzt für alle user verfügbar',
			'r': 'ist in diesem Raum jetzt für alle user mit Rang ',
			'r2': 'oder höher verfügbar',
			'not1': 'Rang',
			'not2': 'nicht gefunden'
		},
		/*
		* Dyn Commands
		*/
		dyn: {
			'nocmds': 'Keine Befehle',
			'list': 'Dynamische Befehle',
			'c': 'Befehl',
			'notexist': 'existiert nicht'
		},
		delcmd: {
			'c': 'Befehl',
			'd': 'wurde erfolgreich gelöscht',
			'n': 'existiert nicht'
		},
		setcmd: {
			'notemp': 'Es gibt keinen temporären Ausdruck zum setzen, verwende **stemp** bevor du das hier machst',
			'c': 'Befehl',
			'modified': 'wurde erfolgreich geändert',
			'created': 'wurde erfolgreich erstellt'
		},
		setcmdalias: {
			'u1': 'Verwendung',
			'u2': '[alias], [Befehl]',
			'n': 'ist kein dynamischer Befehl',
			'c': 'Befehl',
			'alias': 'ist jetzt Alias von',
			'already': 'ist ein Alias. Du kannst keinen Alias zu einem Alias machen'
		},
		getdyncmdlist: {
			'nocmds': 'Keine Befehle',
			'list': 'Dynamische Befehle',
			'err': 'Fehler: Hochladen der Befehle zu Hastebin fehlgeschlagen'
		},
		/*
		* Misc Commands
		*/
		pick: {'err': 'Du must mindestens zwei gültige Auswahlmöglichkeiten geben'},
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
		usage: {
			'stats': 'Verwendungsstatisiken'
		},
		help: {
			'guide': 'Anleitung für die Befehle dieses Bots'
		},
		youtube: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'u': 'Verwendung',
			'ae': 'YouTube-Linkerkennung ist für diesen Raum bereits aktiviert',
			'e': 'YouTube-Linkerkennung ist jetzt für diesen Raum aktiviert',
			'ad': 'YouTube-Linkerkennung ist für diesen Raum bereits deaktiviert',
			'd': 'YouTube-Linkerkennung ist jetzt für diesen Raum deaktiviert'
		},
		/*
		* Quotes
		*/
		quote: {
			'nodata': 'Datenbank ist leer'
		},
		setquote: {
			'notemp': 'Es gibt keinen temporären Ausdruck zum setzen, verwende **stemp** bevor du das hier machst',
			'q': 'Zitat',
			'modified': 'wurde erfolgreich geändert',
			'created': 'wurde erfolgreich erstellt'
		},
		delquote: {
			'q': 'Zitat',
			'n': 'existiert nicht',
			'd': 'wurde erfolgreich gelöscht'
		},
		viewquotes: {
			'q': 'Zitat',
			'n': 'existiert nicht',
			'empty': 'Zitatliste ist leer',
			'list': 'Zitatliste',
			'err': 'Fehler: Hochladen der Zitate zu Hastebin fehlgeschlagen'
		},
		addquotes: {
			'notfound': 'Fehler: Dokument nicht gefunden',
			'd': 'Lade Hastebin-Dokument herunter',
			'add': 'hinzugefügt',
			'q': 'Zitate',
			'err': 'Fehler: Laden der Zitate von Hastebin fehlgeschlagen'
		},
		/*
		* Pokemon Commands
		*/
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
		},
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
		battleset: {
			'u1': 'Verwendung',
			'u2': '[Berechtigung], [Rang]',
			'ps': 'Berechtigungen',
			'p': 'Berechtigung',
			'd': 'ist in diesem Raum jetzt deaktiviert',
			'a': 'ist in diesem Raum jetzt für alle user verfügbar',
			'r': 'ist in diesem Raum jetzt für alle user mit Rang ',
			'r2': 'oder höher verfügbar',
			'not1': 'Rang',
			'not2': 'nicht gefunden'
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
		},
		/*
		* Moderation Commands
		*/
		autoban: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'notmod': 'Rang Moderator (@) oder Höher benötigt um user zu bannen',
			'notarg': 'Du musst mindestens einen user angeben, der zur Blacklist hinzugefügt werden soll',
			'bu': 'user ist auf der Blacklist',
			'u': 'user',
			'added': 'wurde erfolgreich zur Blacklist hinzugefügt.',
			'already': 'ist bereits auf der Blacklist.',
			'all': 'All',
			'other': 'other',
			'illegal': 'user hat illegalen Namen und wurde nicht der Blacklist hinzugefügt.'
		},
		unautoban: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'notmod': 'Rang Moderator (@) oder Höher benötigt um user zu bannen',
			'notarg': 'Du musst mindestens einen user angeben, der von der Blacklist entfernt werden soll',
			'u': 'user',
			'r': 'wurde erfolgreich von der Blacklist entfernt.',
			'noother': 'Kein anderer',
			'no': 'Kein',
			'nopresent': 'genannter user befindet sich auf der Blacklist.'
		},
		regexautoban: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'notmod': 'Rang Moderator (@) oder Höher benötigt um user zu bannen',
			'notarg': 'Du must einen regülaren Ausdruck zum blacklisten nennen.',
			're': 'Regulrer Ausdruck',
			'notadd': 'kann nicht zu der Blacklist hinzugefügt werden. Sei nicht machiavellistisch!',
			'already': 'befindet sich bereits auf der Blacklist.',
			'addby': 'wurde zur Blacklist hinzugefügt von',
			'add': 'wurde zur Blacklist hinzugefügt.'
		},
		unregexautoban: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'notmod': 'Rang Moderator (@) oder Höher benötigt um user zu bannen',
			'notarg': 'Du must einen regülaren Ausdruck zum unblacklisten nennen.',
			'notpresent': 'befindet sich nicht auf der Blacklist.',
			're': 'Regulärer Ausdruck',
			'rby': 'wurde von der Blacklist entfernt von',
			'r': 'wurde von der Blacklist entfernt.'
		},
		viewblacklist: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'iu': 'Ungültiger username',
			'u': 'user',
			'currently': 'ist zurzeit',
			'not': 'nicht',
			'b': 'auf der Blacklist in',
			'nousers': 'Keine user sind auf der Blacklist in',
			'listab': 'Die folgenden user sind gebannt in',
			'listrab': 'Die folgenden regülären Ausdrücke sind gebannt in',
			'err': 'Fehler beim Hochladen, konnte Blacklist nicht zu Hastebin hochladen'
		},
		zerotol: {
			'nolevels': 'Es gibt keine Nulltolleranz-Level',
			'user': 'user',
			'level': 'Level',
			'ztl': 'Nulltolleranz-Liste',
			'empty': 'Nulltolleranz-Liste ist leer',
			'is': 'ist',
			'n': 'NICHT',
			'y': '',
			'in': 'in der Nulltolleranz-Liste',
			'u1': 'Verwendung',
			'u2': '[add (hinzufügen)/delete (löschen)], [user1:Level]...',
			'users': 'user',
			'add': 'wurde der Nulltolleranz-Liste hinzugefügt',
			'illegal': 'user hat illegalen namen',
			'invalid': 'hatte ungültige Levels',
			'already': 'befand sich bereits in der Liste',
			'removed': 'wurde von der Nulltolleranz-Liste entfernt',
			'not': 'user befindet sich nicht in der Liste',
			'err': 'Fehler beim Hochladen, konnte Nulltolleranz-Liste nicht zu Hastebin hochladen'
		},
		banword: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'phrase': 'Ausdruck',
			'already': 'ist bereits verboten.',
			'ban': 'ist jetzt verboten.'
		},
		unbanword: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'phrase': 'Ausdruck',
			'not': 'ist noch nicht verboten.',
			'unban': 'ist nicht mehr verboten.'
		},
		viewbannedwords: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'in': 'in',
			'globally': 'global',
			'phrase': 'Ausdruck',
			'nowords': 'In diesem Raum sind keine Ausdrücke verboten.',
			'curr': 'ist zurzeit',
			'not': 'nicht',
			'banned': 'verboten',
			'list': 'Die folgenden Ausdrücke sind verboten',
			'link': 'Verbotene Ausdrücke',
			'err': 'Fehler beim Hochladen, konnte Liste verbotener Ausdrücke nicht zu Hastebin hochladen'
		},
		inapword: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'phrase': 'Ausdruck',
			'already': 'ist bereits unangebracht.',
			'ban': 'ist jetzt unangebracht.'
		},
		uninapword: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'phrase': 'Ausdruck',
			'not': 'ist zurzeit nicht unangebracht.',
			'unban': 'ist nicht mehr unangebracht.'
		},
		viewinapwords: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'in': 'in',
			'globally': 'global',
			'phrase': 'Ausdruck',
			'nowords': 'In diesem Raum sind keine Ausdrücke unangebracht.',
			'curr': 'ist zurzeit',
			'not': 'nicht',
			'banned': 'unangebracht',
			'list': 'Die folgenden Ausdrücke sind unangebracht',
			'link': 'Unangebrachte Ausdrücke',
			'err': 'Fehler beim Hochladen, konnte Liste unangebrachter Ausdrücke nicht zu Hastebin hochladen'
		},
		joinphrase: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'ae': 'Beitrittsnachrichten sind bereits in diesem Raum aktiviert',
			'e': 'Beitrittsnachrichten sind jetzt in diesem Raum aktiviert"',
			'ad': 'Beitrittsnachrichten sind bereits fin diesem Raum deaktiviert"',
			'd': 'Beitrittsnachrichten sind jetzt in diesem Raum deaktiviert',
			'u1': 'Verwendung',
			'u2': '[set (erstellen)/delete (löschen)], [User], [Beitrittsnachricht]',
			'dis': 'Beitrittsnachrichten sind für diesen Raum deaktiviert',
			'jpfor': 'Beitrittsnachricht für User',
			'modified': 'wurde verändert',
			'globally': 'global.',
			'forthis': 'für diesen Raum.',
			'del': 'wurde gelöscht',
			'not': 'existiert nicht'

		},
		viewjoinphrases: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'iu': 'Ungültiger username.',
			'not': 'Keine Betrittsnachicht bestimmt für',
			'empty': 'Es gibt keine Beitrittsnachrichten für diesen Raum.',
			'jp': 'Betrittsnachicht gesetzt',
			'globally': 'global',
			'in': 'in',
			'err': 'Fehler beim Hochladen, konnte Beitrittsnachrichtenliste nicht zu Hastebin hochladen'
		},
		mod: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'u1': 'Verwendung',
			'u2': '(Raum - optional), [Mod], [on (an)/off (aus)]',
			'valid': 'Gültige Moderationen sind',
			'mod': 'Moderation für',
			'ae': 'bereits für diesen Raum aktiviert',
			'e': 'ist jetzt für diesen Raum aktiviert',
			'ad': 'bereits für diesen Raum deaktiviert',
			'd': 'ist jetzt für diesen Raum aktiviert'
		},
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (Format), (Sekunden bis zum Start oder off), (Minuten Inaktivität für automatische Disqualifikation oder off), (maximale Anzahl an Teilnemern oder off), (elimination oder roundrobin). Alle Argumente sind optional.'},
		tourend: {'err': 'Es gibt kein Turnier in diesem Raum'},
		tournament: {
			'e1': 'benötigt Moderator-Rang (@) oder höher, um Turniere zu erstellen',
			'e2': 'Es findet bereits ein Turnier in diesem Raum statt',
			'e31': 'Format',
			'e32': 'ist nicht gültig für Turniere',
			'e4': 'Zeit bis zum Start ist keine gültige Zeit',
			'e5': 'Zeit bis zum Autodq ist keine gültige Zeit',
			'e6': 'Maximale Anzahl an Teilnehmern ist nicht gültig',
			'e7': 'Turniertyp ist ungültig. Gültige Typen sind: elimination, roundrobin',
			'notstarted': 'Fehler: Das Turnier ist nicht gestartet, wahrscheinlich weil ich nicht die Berechtigung habe, ein Turnier zu erstellen oder der Befehl wurde geändert.',
			'param': 'Parameter',
			'paramhelp': 'nicht gefunden, gelten parameter'
		}
	},

	/*
	* Features
	*/

	time: {
		'second': 'Sekunde',
		'seconds': 'Sekunden',
		'minute': 'Minute',
		'minutes': 'Minuten',
		'hour': 'Stunde',
		'hours': 'Stunden',
		'day': 'Tag',
		'days': 'Tage'
	},

	youtube: {
		'before': '',
		'after': 's Link'
	},

	battle: {
		'battlefound': 'Kampf gefunden im Ladder'
	},

	moderation: {
		'automod': 'Automatische Moderation',
		//mods
		'fs': 'Flood / Spam',
		'sl': 'Linkspam',
		's': 'Spam',
		'f': 'Flood',
		'possible': 'Möglicher Spam erkannt',
		'caps': 'Exzessive Großschreibung',
		'stretch': 'Wortdehnung',
		'spoiler': 'Spoiler sind in diesem Raum nicht erlaubt',
		'youtube': 'Youtube-Channel sind in diesem Raum nicht erlaubt',
		'server': 'Private Pokemon Showdown Server sind in diesem Raum nicht erlaubt',
		'inapword': 'Deine Nachicht enthält einen unangebrachten Ausdruck',
		'banword': 'Deine Nachicht enthält einen verbotenen Ausdruck',
		'mult': 'Wiederholter Regelverstoß',
		'0tol': '(Nulltolleranz)',
		//avb
		'caps-0': 'Großschreibung',
		'rep-0': 'Wiederholung',
		'stretch-0': 'Wortdehnung',
		'flood-0': 'Flood',
		'spoiler-0': 'Spoiler',
		'youtube-0': 'Youtube-Channel',
		'server-0': 'Private Server',
		'inapword-0': 'Unangebracht',
		'banword-0': 'Verbotene Ausdrücke',
		//autoban
		'ab': 'user steht auf der Blacklist'
	}
};

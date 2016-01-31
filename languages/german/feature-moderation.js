exports.translations = {
	commands: {
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
		modexception: {
			'notchat': 'Dieser Befehl kann nur in Chaträumen verwendet werden',
			'all': 'normale Benutzer',
			'rank': 'rang',
			'modex-inf1': 'Moderation ausgenommen sind aktiviert',
			'modex-inf2': 'oder höher in diesem Raum',
			'modex-set1': 'Moderation Ausnahme wurde aktiviert',
			'modex-set2': 'oder höher in diesem Raum',
			'not1': 'Rang',
			'not2': 'nicht gefunden'
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
		}
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
		'replays': 'Replays schicken ist nicht erlaubt in diesem Raum',
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
		'replays-0': 'Replay',
		'server-0': 'Private Server',
		'inapword-0': 'Unangebracht',
		'banword-0': 'Verbotene Ausdrücke',
		//autoban
		'ab': 'user steht auf der Blacklist'
	}
};

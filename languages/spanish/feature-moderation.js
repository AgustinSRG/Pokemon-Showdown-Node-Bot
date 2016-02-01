exports.translations = {
	commands: {
		/*
		* Moderation Commands
		*/
		autoban: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'notmod': 'requiere rango de moderador (@) o superior para banear usuarios',
			'notarg': 'Debes especificar al menos un usuario',
			'bu': 'Usuario de la lista negra',
			'u': 'Usuario(s)',
			'added': 'agregado(s) correctamente a la lista negra',
			'already': 'ya estaban presentes en la lista negra.',
			'all': 'Todos los',
			'other': 'demás',
			'illegal': 'usuarios tenían nombres ilegales y no fueron agregados.'
		},
		unautoban: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'notmod': 'requiere rango de moderador (@) o superior para banear usuarios',
			'notarg': 'Debes especificar al menos un usuario',
			'u': 'Usuario(s)',
			'r': 'eliminado(s) de la lista negra correctamente.',
			'noother': 'Ningun otro',
			'no': 'Ningun',
			'nopresent': 'usuario especificado estaba en la lista negra.'
		},
		regexautoban: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'notmod': 'requiere rango de moderador (@) o superior para banear usuarios',
			'notarg': 'Debes especificar una expresión regular',
			're': 'Expresión regular',
			'notadd': 'no puede ser agregada a la lista negra, no seas malvado!',
			'already': 'ya estaba presente en la lista negra',
			'addby': 'fue agregada a la lista negra por',
			'add': 'fue agregada a la lista negra.'
		},
		unregexautoban: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'notmod': 'requiere rango de moderador (@) o superior para banear usuarioss',
			'norarg': 'Debes especificar una expresión regular',
			'notpresent': 'no estaba presente en la lista negra.',
			're': 'Expresión regular',
			'rby': 'fue eliminada de la lista negra por',
			'r': 'fue eliminada de la lista negra.'
		},
		viewblacklist: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'iu': 'Nombre de usuario no válido',
			'u': 'Usuario',
			'currently': '',
			'not': 'No',
			'b': 'está en la lista degra de la sala',
			'nousers': 'No hay usuarios en la lista negra de la sala',
			'listab': 'Los siguientes usuarios están en la lista negra de la sala',
			'listrab': 'Las siguientes expresiones regulares están en la lista negra de la sala',
			'err': 'Error: No se puede subir la lista negra a hastebin'
		},
		zerotol: {
			'nolevels': 'No hay niveles de tolerancia cero disponibles',
			'user': 'Usuario',
			'level': 'Nivel',
			'ztl': 'Lista de tolerancia cero',
			'empty': 'La lista de tolerancia zero está vacía',
			'is': '',
			'n': 'NO ESTA',
			'y': 'Sí ESTA',
			'in': 'presente en la lista de tolerancia cero',
			'u1': 'Uso correcto',
			'u2': '[add/delete], [Usuario:nivel]...',
			'users': 'Usuario(s)',
			'add': 'agregado(s) a la lista de tolerancia cero',
			'illegal': 'usuarios tenían nicks ilegales',
			'invalid': 'tenían niveles no válidos',
			'already': 'ya estaban presentes en la lista',
			'removed': 'eliminado(s) correctamente de la lista de tolerancia cero',
			'not': 'usuarios no etaban en la lista',
			'err': 'Error: no se puede subir la lista de tolerancia cero a hastebin'
		},
		banword: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'phrase': 'La frase',
			'already': 'ya estaba prohibida.',
			'ban': 'está prohibida a partir de ahora.'
		},
		unbanword: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'phrase': 'La frase',
			'not': 'no estaba prohibida.',
			'unban': 'ha dejado de estar prohibida.'
		},
		viewbannedwords: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'in': 'en',
			'globally': 'globalmente',
			'phrase': 'La frase',
			'nowords': 'No hay frases prohibidas en esta sala',
			'curr': '',
			'not': 'No',
			'banned': 'está prohibida',
			'list': 'Las siguietes frases están prohibidas',
			'link': 'Frases prohibidas',
			'err': 'Error: no se puede subir la lista de frases prohibidas a hastebin'
		},
		inapword: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'phrase': 'La frase',
			'already': 'ya era inapropiada.',
			'ban': 'es inapropiada a partir de ahora.'
		},
		uninapword: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'phrase': 'La frase',
			'not': 'no era inapropiada.',
			'unban': 'ha dejado de ser inapropiada.'
		},
		viewinapwords: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'in': 'en',
			'globally': 'globalmente',
			'phrase': 'La frase',
			'nowords': 'No había frases inapropiadas en estasala.',
			'curr': '',
			'not': 'No',
			'banned': 'es inapropiada',
			'list': 'Las siguientes frases son inapropiadas',
			'link': 'Frases inapropiadas',
			'err': 'Error: no se puede subir la lista de frases inapropiadas a hastebin'
		},
		joinphrase: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'ae': 'Ls frases de entrada ya estaban activadas en esta sala',
			'e': 'Las frases de entrada han sido habilitadas para esta sala"',
			'ad': 'Las frases de entrada ya estaban deshabilitadas para esta sala"',
			'd': 'Se han desactivado las frases de entrada para esta sala',
			'u1': 'Uso correcto:',
			'u2': '[set/delete], [usuario], [frase]',
			'dis': 'Las frases de entrada están desactivadas para esta sala',
			'jpfor': 'La frase de entrada para el usuario',
			'modified': 'ha sido modificada',
			'globally': 'globalmente.',
			'forthis': 'para esta sala.',
			'del': 'ha sido eliminada',
			'not': 'no existe'
		},
		viewjoinphrases: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'iu': 'Nombre de usuario incorrecto.',
			'not': 'No hay frase de entrada para',
			'empty': 'No hay frases de entrada en esta sala.',
			'jp': 'Frases de entrada establecidas',
			'globally': 'globalmente',
			'in': 'en',
			'err': 'Error: no se puede subir la lista de frases de entrada a hastebin'
		},
		modexception: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'all': 'usuarios regulares',
			'rank': 'el rango',
			'modex-inf1': 'La exención de la moderación está activada para',
			'modex-inf2': 'y superiores en esta sala',
			'modex-set1': 'La exención de la moderación ha sido activada para',
			'modex-set2': 'y superiores en esta sala',
			'not1': 'Rango',
			'not2': 'no encontrado'
		},
		mod: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'u1': 'Uso correcto',
			'u2': '(room - opcional), [mod], [on/off]',
			'valid': 'Mods válidas son',
			'mod': 'Moderación para',
			'ae': 'ya estaba activada en la sala',
			'e': 'ha sido activada para la sala',
			'ad': 'ya estaba desactivada para la sala',
			'd': 'ha sido desactivada para la sala'
		}
	},

	moderation: {
		'automod': 'Moderación Automática',
		//mods
		'fs': 'Flood / Spam',
		'sl': 'Spam de links',
		's': 'Spam',
		'f': 'Flood',
		'possible': 'Detectado posible spammer',
		'caps': 'Uso excesivo de las mayúsculas',
		'stretch': 'Alargar demasiado las palabras',
		'spoiler': 'Los Spoilers no están permitidos en esta sala',
		'youtube': 'Los canales de Youtube no están permitidos en esta sala',
		'replays': 'No se permiten replays en esta sala',
		'server': 'Los servidores privados de Pokemon Showdown no están permitidos en esta sala',
		'inapword': 'Su mensaje contiene una frase inapropiada',
		'banword': 'Su mensaje contiene una frase prohibida',
		'mult': 'Múltiple infracción',
		'0tol': '(tolerancia cero)',
		//avb
		'caps-0': 'Mayúsculas',
		'rep-0': 'Repetir',
		'stretch-0': 'Alargar',
		'flood-0': 'Flood',
		'spoiler-0': 'Spoiler',
		'youtube-0': 'Canal de Youtube',
		'replays-0': 'Replay',
		'server-0': 'Servidores de PS',
		'inapword-0': 'Inapropiado',
		'banword-0': 'Frases Prohibidas',
		//autoban
		'ab': 'Usuario de la lista negra'
	}
};

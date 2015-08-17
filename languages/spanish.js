exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		about: {
			'about': 'Soy un **Bot para Pokemon Showdown** escrito en JavaScript para Node. Por: Ecuacion'
		},
		time: {'time': 'Hora del Bot'},
		uptime: {
			'week': 'semana',
			'day': 'día',
			'hour': 'hora',
			'minute': 'minuto',
			'second': 'segundo',
			'and': 'y'
		},
		seen: {
			'inv': 'Nombre no válido',
			'bot': 'Debes estar ciego o algo, estoy aquí mismo.',
			'self': 'Te has mirado en el espejo últimamente?',
			's1': 'fue visto hace',
			's2': '',
			'n1': 'El usuario',
			'n2': 'no ha sido visto, al menos desde el último reinicio del bot',
			'j': 'entrando en',
			'l': 'abandonando',
			'c': 'chateando en',
			'n': 'cambiándose el nick a'
		},
		language: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'nolang': 'Debes especificar un idioma',
			'v': 'Idiomas válidos son',
			'l': 'El idioma para esta sala es ahora el Español'
		},
		set: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'denied': 'Acceso denegado',
			'u1': 'Uso Correcto',
			'u2': '[permiso], [rango]',
			'ps': 'Permisos',
			'p': 'Permiso',
			'd': 'ha sido deshabilitado para esta sala',
			'a': 'ha sido habilitado para todos los usuarios de esta sala',
			'r': 'en esta sala está disponible para los usuarios de rango',
			'r2': 'o superior',
			'not1': 'Rango',
			'not2': 'no encontrado'
		},
		/*
		* Dyn Commands
		*/
		dyn: {
			'nocmds': 'No hay ningún comando',
			'list': 'Comandos Dinámicos',
			'c': 'El comando',
			'notexist': 'no existe'
		},
		delcmd: {
			'c': 'El comando',
			'd': 'ha sido eliminado',
			'n': 'no existe'
		},
		setcmd: {
			'notemp': 'No hay datos en temp, usa el comando **stemp** antes de hacer esto',
			'c': 'El comando',
			'modified': 'ha sido modificado',
			'created': 'ha sido creado'
		},
		setcmdalias: {
			'u1': 'Uso correcto',
			'u2': '[alias], [comando]',
			'n': 'no es un comando dinámico',
			'c': 'El comando',
			'alias': 'es ahora alias de',
			'already': 'es un alias. No se puede establecer un alias de otro alias'
		},
		getdyncmdlist: {
			'nocmds': 'No hay ningún comando',
			'list': 'Comandos Dinámicos',
			'err': 'Error: No se han podido subir los comandos a Hastebin'
		},
		/*
		* Misc Commands
		*/
		pick: {'err': 'Debes dar al menos 2 opciones válidas'},
		randomanswer: {
			'answers': [
				'Todo apunta a que sí.',
				'Sí.',
				'Respuesta poco clara, pregunta de nuevo.',
				'Sin ninguna duda.',
				'Mis fuentes dicen que no.',
				'Tal y como lo veo, sí.',
				'Cuenta con ello.',
				'Concéntrate y pregunta de nuevo.',
				'No parece buena idea.',
				'No entiendo la pregunta.',
				'Mejor no decírtelo ahora.',
				'Muy dudable.',
				'Sí - definitivamente.',
				'Es cierto.',
				'No puedo predecir eso.',
				'Más o menos.',
				'Pregunta más tarde.',
				'Mi respuesta es no.',
				'Parece buena idea.',
				'No cuentes con ello.'
			]
		},
		usage: {
			'stats': 'Estadísticas de uso'
		},
		help: {
			'guide': 'Guía de comandos del bot'
		},
		youtube: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'u': 'Uso correcto',
			'ae': 'Reconocimiento automático de links de YouTube ya estaba activado para la sala',
			'e': 'Reconocimiento automático de links de YouTube ha sido activado en esta sala',
			'ad': 'Reconocimiento automático de links de YouTube no estaba activado para la sala',
			'd': 'Reconocimiento automático de links de YouTube ha sido desactivado en esta sala'
		},
		/*
		* Quotes
		*/
		quote: {
			'nodata': 'La base de datos está vacía'
		},
		setquote: {
			'notemp': 'No hay datos en temp, usa el comando **stemp** antes de hacer esto',
			'q': 'Cita',
			'modified': 'ha sido modificada',
			'created': 'ha sido creada'
		},
		delquote: {
			'q': 'Cita',
			'd': 'ha sido eliminada',
			'n': 'no existe'
		},
		viewquotes: {
			'q': 'Cita',
			'n': 'no existe',
			'empty': 'La lista de citas está vacía',
			'list': 'Lista de citas',
			'err': 'Error: No se han podido subir las citas a Hastebin'
		},
		addquotes: {
			'notfound': 'Error: Documento no encontrado',
			'd': 'Descargando documento de Hastebin',
			'add': 'Agregadas',
			'q': 'citas',
			'err': 'Error: no se ha podido establecer la conexión con hastebin'
		},
		/*
		* Pokemon Commands
		*/
		randompokemon: {'err': 'Hay un problema, intenta este comando en unos minutos'},
		gen: {
			'err': 'Hay un problema, intenta este comando en unos minutos',
			'err2': 'Debes especificar un pokemon, movimiento, objeto o habilidad',
			'nfound': 'Pokemon, movimiento, objeto o habilidad no encontrado',
			'g': 'Generación de'
		},
		randommoves: {
			'err': 'Hay un problema, intenta este comando en unos minutos',
			'err2': 'Debes especificar un Pokemon',
			'r': 'Movimientos para RandomBattle',
			'rd': 'Movimientos para doubles/triples RandomBattle',
			'nfound': 'Pokemon no encontrado'
		},
		heavyslam: {
			'err': 'Hay un problema, intenta este comando en unos minutos',
			'err2': 'Debes especificar 2 pokemon',
			'n1': 'Pokemon atacante no encontrado',
			'n2': 'Pokemon defensor no encontrado',
			's': 'Poder base de Heavy slam/Heat crash'
		},
		prevo: {
			'err': 'Hay un problema, intenta este comando en unos minutos',
			'p1': 'Pokemon',
			'p2': 'no tiene pre-evolución',
			'nfound': 'Pokemon no encontrado'
		},
		priority: {
			'err': 'Hay un problema, intenta este comando en unos minutos',
			'err2': 'Pokemon not found',
			'err3': 'No se encontraron movimientos'
		},
		boosting: {
			'err': 'Hay un problema, intenta este comando en unos minutos',
			'err2': 'Pokemon no encontrado',
			'err3': 'No se encontraron movimientos'
		},
		recovery: {
			'err': 'Hay un problema, intenta este comando en unos minutos',
			'err2': 'Pokemon no encontrado',
			'err3': 'No se encontraron movimientos'
		},
		hazard: {
			'err': 'Hay un problema, intenta este comando en unos minutos',
			'err2': 'Pokemon no encontrado',
			'err3': 'No se encontraron movimientos'
		},
		/*
		* Battle Commands
		*/
		reloadteams: {'s': 'Equipos actualizados', 'e': 'Un error ha hecho que sea imposble la lectura de los equipos'},
		blockchallenges: {
			'b': 'Retos bloqueados',
			'nb': 'Retos desbloqueados'
		},
		move: {'notbattle': 'Esto solo puede ser usado en batallas'},
		jointours: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'ad': 'Modo "tour autojoin" ya estaba deshabilitado para la sala',
			'd': 'Modo "tour autojoin" deshabilitado para la sala',
			'ae': 'Modo "tour autojoin" ya estaba habilitado para la sala',
			'e': 'Modo "tour autojoin" habilitado para la sala'
		},
		searchbattle: {
			'e1': 'Debes especificar un formato',
			'e21': 'El formato',
			'e22': 'no es válido para buscar batallas en ladder',
			'e31': 'No tengo equipos para buscar batalla en el formato',
			'e32': 'Use el comando "team add" para agregar más equipos'
		},
		ladderstart: {
			'stop': 'La búsqueda de batallas se ha detenido',
			'start': 'Buscando batallas en formato',
			'e1': 'Debes especificar un formato',
			'e21': 'El formato',
			'e22': 'no es válido para buscar batallas en ladder',
			'e31': 'No tengo equipos para buscar batalla en el formato',
			'e32': 'Use el comando "team add" para agregar más equipos'
		},
		challenge: {
			'e11': 'Uso Correcto:',
			'e12': '[usuario], [formato]',
			'e21': 'El formato',
			'e22': 'no es válido para retos',
			'e31': 'No tengo equipos para retar en el formato',
			'e32': 'Use el comando "team add" para agregar más equipos'
		},
		jointour: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'e1': 'No hay ningún torneo en esta sala',
			'e2': 'Ya estaba participando en el torneo',
			'e3': 'El torneo ya ha empezado',
			'e41': 'No tengo equipos para unirme a un torneo en formato',
			'e42': 'Use el comando "team add" para agregar más equipos'
		},
		leavetour: {
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'e1': 'No hay ningún torneo en esta sala',
			'e2': 'No estaba participando en el torneo'
		},
		battleset: {
			'u1': 'Uso Correcto:',
			'u2': '[permiso], [rango]',
			'ps': 'Permisos',
			'p': 'Permiso',
			'd': 'ha sido deshabilitado para las salas de batalla',
			'a': 'ha sido habilitado para todos los usuarios en las salas de batalla',
			'r': 'en las salas de batalla está disponible para los usuarios de rango',
			'r2': 'o superior',
			'not1': 'Rango',
			'not2': 'no encontrado'
		},
		team: {
			'u1': 'Uso correcto',
			'u2': '[add/delete/get/check]',
			'u3': 'add, [nombre], [formato], [Exportable en Hastebin]',
			'u4': 'delete, [nombre]',
			'u5': 'get, [nombre]',
			'u6': 'check, [nombre], (usuario)',
			'format': 'El formato',
			'notexists': 'no existe',
			'download': 'Descargando y procesando equipo',
			'team': 'El equipo',
			'added': 'ha sido agregado correctamente a la lista de equipos',
			'err': 'Error: no se ha podido subir el equipo a hastebin',
			'err1': 'Error: No se ha encontrado el documento de Hastebin',
			'err2': 'Error: El formato encontrado no era válido',
			'err3': 'Error: Ya existe otro equipo con el mismo nombre, use otro nombre o elimine dicho equipo',
			'err4': 'Error: Error en la conexión con Hastebin',
			'removed': 'ha sido eliminado correctamente de la lista de equipos'
		},
		teamlist: {
			'list': 'Lista de equipos',
			'empty': 'La lista de equipos está vacía',
			'id': 'Id',
			'format': 'Formato',
			'pokemon': 'Pokemon',
			'err': 'Error: no se ha podido subir la lista de equipos a hastebin'
		},
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
		},
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (formato), (segundos para iniciar u off), (minutos para el autodq u off), (máximo número de users u off), (elimination u roundrobin). Todos los argumentos son opcionales.'},
		tourend: {'err': 'No hay ningún torneo en esta sala'},
		tournament: {
			'e1': 'requiere rango de moderador (@) o superior para crear torneos',
			'e2': 'Ya hay un torneo en esta sala',
			'e31': 'El formato',
			'e32': 'no es válido para torneos',
			'e4': 'El tiempo para iniciar o es válido',
			'e5': 'El AutoDq no es válido',
			'e6': 'El máximo numero de users no es válido',
			'e7': 'El tipo de torneo no es válido. Usa alguno de estos: elimination, roundrobin',
			'notstarted': 'Error: El torneo no ha empezado, probablemente por un cambio en los permisos o en los comandos',
			'param': 'Parámetro',
			'paramhelp': 'no encontrado, Los parámetros correctos son'
		}
	},

	/*
	* Features
	*/

	time: {
		'second': 'segundo',
		'seconds': 'segundos',
		'minute': 'minuto',
		'minutes': 'minutos',
		'hour': 'hora',
		'hours': 'horas',
		'day': 'día',
		'days': 'días'
	},

	youtube: {
		'before': 'Link de',
		'after': ''
	},

	battle: {
		'battlefound': 'Batalla encontrada en ladder'
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
		'server-0': 'Servidores de PS',
		'inapword-0': 'Inapropiado',
		'banword-0': 'Frases Prohibidas',
		//autoban
		'ab': 'Usuario de la lista negra'
	}
};

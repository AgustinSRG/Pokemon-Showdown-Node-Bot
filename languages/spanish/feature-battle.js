exports.translations = {
	commands: {
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
		}
	},

	battle: {
		'battlefound': 'Batalla encontrada en ladder'
	}
};

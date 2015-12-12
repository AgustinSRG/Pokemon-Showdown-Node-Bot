exports.translations = {
	commands: {
		/*
		* Misc Commands
		*/
		pick: {'pick': 'Selección aleatoria', 'err': 'Debes dar al menos 2 opciones válidas'},
		randomanswer: {
			'answers': [
				'Todo apunta a que sí.',
				'Sí.',
				'Hay mucha niebla. Inténtalo de nuevo.',
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
				'No es cierto.',
				'No puedo predecir eso.',
				'Más o menos.',
				'Pregunta más tarde.',
				'Mi respuesta es no.',
				'Parece buena idea.',
				'Quizás.',
				'No cuentes con ello.'
			]
		},
		regdate: {
			'inv': 'Nombre de usuario no válido',
			'busy': 'Ahora mismo estoy descargando los datos, inténtalo de nuevo en unos segundos',
			'err': 'No se pudieron obtener los datos desde',
			'user': 'El usuario',
			'not': 'no está registrado',
			'regtime1': 'está regsitrado desde hace',
			'regtime2': '',
			'regdate': 'se registró en la fecha'
		},
		/*
		* Smogon
		*/
		usage: {
			'in': 'en',
			'stats': 'Estadísticas de uso',
			'data': 'Datos de uso',
			'usage': 'Uso correcto',
			'tiererr1': 'Tier o formato',
			'tiererr2': 'no encontrado',
			'tiererr3': 'no disponible',
			'err': 'No se pudieron descargar datos desde',
			'busy': 'Descargando los datos. Intenta este comando de nuevo en unos minutos',
			'pokeerr1': 'Pokemon',
			'pokeerr2': 'no disponible en',
			'pokeerr3': ' (estadísticas de uso)',
			'pokeerr4': ' (datos de uso)',
			'notfound': 'No se encontraron datos para',
			'usagedata1': '#NAME de ',
			'usagedata2': '',
			'pokeusage': 'Uso',
			'pokeraw': 'Raw',
			'abilities': 'Habilidades',
			'items': 'Objetos',
			'moves': 'Movimientos',
			'spreads': 'Spreads',
			'teammates': 'Compañeros'
		},
		suspect: {
			'tiererr1': 'Tier',
			'tiererr2': 'no encontrada',
			'in': 'en',
			'nosuspect': 'No se han encontrado datos de un suspect test para la tier',
			'aux1': 'Usa',
			'aux2': 'para establecer los datos del suspect'
		},
		setsuspect: {
			'usage': 'Uso correcto',
			'tier': 'Tier',
			'notfound': 'no encontrada',
			'd1': 'Información del suspect test de la tier',
			'd2': 'eliminada'
		},
		deftier: {
			'usage': 'Uso correcto',
			'notchat': 'Este comando solo está disponible para las salas de chat',
			'tiererr1': 'Tier',
			'tiererr2': 'no encontrada',
			'set': 'La tier por defecto de esta sala es ahora'
		},
		/*
		* Quotes & Jokes
		*/
		quote: {
			'u1': 'Uso correcto',
			'u2': '[id], [cita]',
			'empty': 'La base de datos está vacía',
			'noid': 'Debes especificar un id correcto',
			'quote': 'Cita',
			'n': 'no existe',
			'd': 'ha sido eliminado',
			'already': 'ya existe',
			'modified': 'ha sido modificado',
			'created': 'ha sido creado'
		},
		listquotes: {
			'empty': 'La base de datos está vacía',
			'list': 'Lista de citas',
			'err': 'Error: no se pudo subir la lista de citas a Hastebin'
		},
		joke: {
			'u1': 'Uso correcto',
			'u2': '[id], [joke]',
			'empty': 'La base de datos está vacía',
			'noid': 'Debes especificar un id correcto',
			'joke': 'El chiste',
			'n': 'no existe',
			'd': 'ha sido eliminado',
			'already': 'ya existe',
			'modified': 'ha sido modificado',
			'created': 'ha sido creado'
		},
		listjokes: {
			'empty': 'La base de datos está vacía',
			'list': 'Lista de chistes',
			'err': 'Error: no se pudo subir la lista de chistes a Hastebin'
		},
		/*
		* Pokemon Commands
		*/
		translate: {
			'u1': 'Uso correcto',
			'u2': '[palabra], (idioma origen), (idioma destino)',
			'lnot1': 'El idioma',
			'lnot2': 'no está disponible. Los idiomas disponibles son',
			'not1': 'Pokemon, habilidad, objeto, movimiento o naturaleza con nombre',
			'not2': 'no existe o no está disponible entre las traducciones',
			'not3': 'no ha sido encontrado',
			'tra': 'Traducciones de',
			'pokemon': 'Pokemon',
			'abilities': 'Habilidad',
			'items': 'Objeto',
			'moves': 'Movimiento',
			'natures': 'Naturaleza'
		},
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
		}
	}
};

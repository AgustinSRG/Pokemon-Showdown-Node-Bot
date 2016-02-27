exports.translations = {
	commands: {
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (formato), (segundos para iniciar u off), (minutos para el autodq u off), (máximo número de users u off), (elimination u roundrobin). Todos los argumentos son opcionales.'},
		tourend: {'err': 'No hay ningún torneo en esta sala', 'err2': 'El torneo ya ha empezado'},
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
		},
		official: {
			'not': 'La funcion Leaderboards no esta disponibe para la sala',
			'notour': 'No hay ningún torneo en esta sala',
			'already': 'El torneo ya era oficial',
			'already-not': 'El torneo no es oficial',
			'official': 'Este torneo es ahora oficial y contará para el Leaderboards',
			'unofficial': 'Este torneo ha dejado de ser oficial'
		},
		leaderboard: {
			'usage': 'Uso correcto',
			'invuser': 'Nombre de usuario no válido',
			'rank': 'Ranking de',
			'in': 'en',
			'points': 'Puntos',
			'w': 'Ganador',
			'f': 'Finalista',
			'sf': 'Semifinalista',
			'times': 'veces',
			'total': 'Total',
			'tours': 'torneos jugados',
			'bwon': 'batlalas ganadas',
			'not': 'La funcion Leaderboards no esta disponibe para la sala',
			'empty': 'No hay ningún torneo registrado aún para la sala',
			'table': 'Tabla del leaderboards',
			'err': 'Error subiendo la tabla del leaderboards a Hastebin',
			'use': 'Usa',
			'confirm': 'para confirmar el borrado de los datos de leaderboards en la sala',
			'invhash': 'Código no válido',
			'data': 'Datos del Leaderboars de la sala',
			'del': 'borrados',
			'wasset': 'La configuracion del sistema de Leaderboards ha sido establecida para la sala',
			'wasdisabled': 'La funcion Leaderboards ha sido desactivada para la sala',
			'alrdisabled': 'La funcion Leaderboards ya estaba desactivada en la sala',
			'unknown': 'Opción desconocida'
		}
	}
};

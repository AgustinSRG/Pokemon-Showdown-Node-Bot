exports.translations = {
	commands: {
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (format), (secondes pour démarrer ou DÉSACTIVÉE), (minutes autodq ou DÉSACTIVÉE) (Utilisateurs max ou DÉSACTIVÉE), (elimination ou roundrobin). Tous les arguments sont optionnels.'},
		tourend: {'err': 'Il n\'y a pas un tournoi dans cette salle', 'err2': 'Erreur: Le tournoi a déjà commencé'},
		tournament: {
			'e1': 'exige modérateur (@) ou plus pour créer tournois',
			'e2': 'Il y\'a déjà un tournoi dans cette salle',
			'e31': 'Format',
			'e32': 'est pas valide pour les tournois',
			'e4': 'Le temps de commencer n\'est pas une heure valide',
			'e5': 'Autodq est pas une heure valide',
			'e6': 'Nombre d\'utilisateurs max est pas disponible',
			'e7': 'Le type de tour n\est pas valide. Les types valides sont: elimination, roundrobin',
			'notstarted': 'Erreur: le tournoi n\'a pas commencé, probablement parce que je n\'ai pas la permission de créer des tournois ou des commandes ont été changées.',
			'param': 'Paramètre',
			'paramhelp': 'introuvable, paramètre valide sont'
		},
		official: {
			'not': 'Classements est pas activé pour la salle',
			'notour': 'Il n\'y a pas un tournoi dans cette salle',
			'already': 'Le tournoi était déjà officielle',
			'already-not': 'Le tournoi était déjà non officielle',
			'official': 'Ce tournoi est maintenant officiel et comptera pour les classements',
			'unofficial': 'Ce tournoi est plus officielle'
		},
		leaderboard: {
			'usage': 'Usage',
			'invuser': 'Nom d\'utilisateur invalide',
			'rank': 'Classement des',
			'in': 'dans',
			'points': 'Points',
			'w': 'Gagnant',
			'f': 'Finaliste',
			'sf': 'Demi-finaliste',
			'times': 'fois',
			'total': 'Total',
			'tours': 'tours joués',
			'bwon': 'batailles gagnées',
			'not': 'Classements est pas activé pour la salle',
			'empty': 'Il n\'y a pas encore inscrit tournois salle',
			'table': 'Table Leaderboards',
			'err': 'Erreur téléchargement table classements à Hastebin',
			'use': 'Utilisez',
			'confirm': 'pour confirmer les données de leaderboars réinitialisés salle',
			'invhash': 'Code de hachage non valide',
			'data': 'Données Leaderboard pour la salle',
			'del': 'a été remis à zéro',
			'wasset': 'Configuration Leaderboards a été fixé pour la salle',
			'wasdisabled': 'Leaderboards a été désactivée pour la chambre',
			'alrdisabled': 'Leaderboards est déjà désactivé pour la chambre',
			'unknown': 'Option inconnue'
		}
	}
};

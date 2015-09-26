exports.translations = {
	commands: {
		/*
		* Battle Commands
		*/
		reloadteams: {'s': 'Équipes rechargés', 'e': 'Une erreur est survenue, ne pouvait pas recharger équipes'},
		blockchallenges: {
			'b': 'Défis bloqués',
			'nb': 'Défis débloqués'
		},
		move: {'notbattle': 'Cette commande est disponible uniquement pour les salles de bataille'},
		jointours: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'ad': 'Mode "tour autojoin" est déjà désactivé pour la salle',
			'd': 'Mode "tour autojoin" est déjà activé pour la salle',
			'ae': 'Mode "tour autojoin" est déjà activé pour la salle',
			'e': 'Mode "tour autojoin" est activé pour la salle'
		},
		searchbattle: {
			'e1': 'Vous devez spécifier un format',
			'e21': 'Format',
			'e22': 'est pas valable pour la recherche de bataille',
			'e31': 'Je ne dois pas faire d\'équipes pour la recherche de batailles en format',
			'e32': 'Utiliser "team add" pour ajouter d\'autres équipes de bot'
		},
		ladderstart: {
			'stop': 'Laddering a arrêté',
			'start': 'Laddering en format',
			'e1': 'Vous devez spécifier un format',
			'e21': 'Format',
			'e22': 'est pas valable pour la recherche de bataille',
			'e31': 'Je ne dois pas faire d\'équipes pour la recherche bataille en format',
			'e32': 'Utiliser "team add" pour ajouter d\'autres équipes sur le bot'
		},
		challenge: {
			'e11': 'Usage',
			'e12': '[user], [format]',
			'e21': 'Format',
			'e22': 'est pas valable pour refuser',
			'e31': 'Je ne dois pas faire d\'équipes pour contester en format',
			'e32': 'Utiliser "team add" pour ajouter d\'autres équipes sur bot'
		},
		jointour: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'e1': 'Il n\'y a pas un tournoi dans cette salle',
			'e2': 'Erreur: Déjà dans le tournoi',
			'e3': 'Erreur: Le tournoi a déjà commencé',
			'e41': 'Je ne dois pas faire d\'équipes pour rejoindre un tournoi en format',
			'e42': 'Utiliser "team add" pour ajouter d\'autres équipes sur bot'
		},
		leavetour: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'e1': 'Il n\'y a pas de tournoi dans cette salle',
			'e2': 'Erreur: Pas encore dans le tournoi'
		},
		team: {
			'u1': 'Usage',
			'u2': '[add/delete/get/check]',
			'u3': 'add, [nom], [format], [Exportable dans un Hastebin]',
			'u4': 'delete, [nom]',
			'u5': 'get, [nom]',
			'u6': 'check, [nom], (user)',
			'format': 'Format',
			'notexists': 'n\'existe existe',
			'download': 'Le téléchargement et l\'analyse de l\'équipe',
			'team': 'Équipe',
			'added': 'ajouté à la liste des équipes de bots',
			'err': 'Erreur: échec de téléchargement de équipe sur Hastebin',
			'err1': 'Erreur: le document Hastebin est introuvable',
			'err2': 'Erreur: les données de l\'équipe ne sont pas valides',
			'err3': 'Erreur: Il y avait déjà une équipe avec ce nom, utiliser un autre nom ou supprimer l\'autre équipe',
			'err4': 'Erreur: Impossible d\'obtenir des données à partir d\'Hastebin',
			'removed': 'supprimé avec succès de la liste des équipes'
		},
		teamlist: {
			'list': 'La liste des équipes du Bot',
			'empty': 'La siste des équipes du Bot est vide',
			'id': 'Id',
			'format': 'Format',
			'pokémon': 'Pokémon',
			'err': 'Erreur: échec de téléchargement des équipes listés sur Hastebin'
		}
	},

	battle: {
		'battlefound': 'Bataille trouve dans la ladder'
	}
};

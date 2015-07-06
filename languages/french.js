exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		time: {'time': 'Temps de Bot'},
		uptime: {
			'week': 'semaine',
			'day': 'jour',
			'hour': 'heure',
			'minute': 'minute',
			'second': 'seconde',
			'and': 'et'
		},
		seen: {
			'inv': 'Nom d\'utilisateur invalide',
			'bot': 'Vous pourriez être aveugle ou analphabètes. Peut-être envie d\'obtenir ce check-out.',
			'self': 'Avez-vous regardé dans le miroir dernièrement? ',
			's1': 'a été vu la dernière fois il ya',
			's2': '',
			'n1': 'L\'utilisateur',
			'n2': 'n\'a jamais été vu, au moins depuis la dernière réinitialisation de bo',
			'j': 'joindre',
			'l': 'laissant',
			'c': 'chat in',
			'n': 'changer de nick à'
		},
		language: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'nolang': 'Vous devez spécifier une langue',
			'v': 'Les langues possibles sont',
			'l': 'Langue de la salle est maintenant Français'
		},
		set: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'denied': 'Accès refusé',
			'u1': 'Usage',
			'u2': '[permission], [rank]',
			'ps': 'Permissions',
			'p': 'Permission',
			'd': 'dans cette salle est maintenant handicapé',
			'a': 'dans cette salle est maintenant avaliable pour tous les utilisateurs',
			'r': 'dans cette salle est maintenant avaliable pour les utilisateurs ayant rang',
			'r2': 'ou haut',
			'not1': 'Rank',
			'not2': 'non trouvé'
		},
		/*
		* Dyn Commands
		*/
		dyn: {
			'nocmds': 'Il n\'y à pas de commandes',
			'list': 'Commandes dynamiques',
			'c': 'Commande',
			'notexist': 'ne pas existe'
		},
		delcmd: {
			'c': 'Commande',
			'd': 'a été supprimé',
			'n': 'ne pas existe'
		},
		setcmd: {
			'notemp': 'Il n\'y a aucune chaîne temporaire pour définir, utiliser **stemp** avant de faire cela',
			'c': 'Commande',
			'modified': 'a été modifié',
			'created': 'a été créé'
		},
		setcmdalias: {
			'u1': 'Usage',
			'u2': '[alias], [cmd]',
			'n': 'est pas une commande dynamique',
			'c': 'Commande',
			'alias': 'est maintenant un alias de',
			'already': 'est un alias. Vous ne pouvez pas définir des alias d\'un autre alias'
		},
		/*
		* Misc Commands
		*/
		pick: {'err': 'Vous devez donner au moins 2 choix valides'},
		randomanswer: {
			'answers': [
				'Signes soulignent oui.',
				'Oui.',
				'Réponse floue, essayez à nouveau. ',
				'Sans aucun doute.',
				'Mes sources disent pas.',
				'Comme je le vois, oui.',
				'Vous pouvez compter sur elle.',
				'Concentrez-vous et demander à nouveau.',
				'Perspectives pas si bon.',
				'Il est donc décidément. ',
				'Mieux vaut ne pas vous dire maintenant.',
				'Très douteux.',
				'Oui définitivement.',
				'Il est certain.',
				'Vous ne pouvez pas prévoir maintenant. ',
				'Probablement.',
				'Demandez à nouveau plus tard. ',
				'Ma réponse est non.',
				'Perspectives bonne.',
				'Ne pas compter sur elle.'
			]
		},
		usage: {
			'stats': 'Statistiques d\'utilisation'
		},
		help: {
			'guide': 'Guide des commandes de bot'
		},
		youtube: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'u': 'Usage',
			'ae': 'YouTube reconnaissance du lien est déjà disponible pour la salle',
			'e': 'YouTube reconnaissance de lien est maintenant disponible pour cette salle',
			'ad': 'YouTube reconnaissance du lien est déjà désactivé pour la salle',
			'd': 'YouTube reconnaissance de lien est maintenant désactivée pour cette salle'
		},
		/*
		* Pokemon Commands
		*/
		randompokemon: {'err': 'Une erreur est survenue, essayez à nouveau plus tard'},
		gen: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Vous devez spécifier un pokemon, mouvement, objet ou capacité',
			'nfound': 'Pokemon, mouvement, objet ou capacité introuvable',
			'g': 'Génération de'
		},
		randommoves: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Vous devez spécifier un pokemon',
			'r': 'Random singles moves',
			'rd': 'Random doubles/triples moves',
			'nfound': 'Pokemon introuvable'
		},
		heavyslam: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Vous devez spécifier 2 pokemon',
			'n1': 'L\'attaquant Pokemon introuvable',
			'n2': 'Defender Pokemon introuvable',
			's': 'Heavy slam/Heat crash base power'
		},
		prevo: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'p1': 'Pokemon',
			'p2': 'n\'a pas preevo',
			'nfound': 'Pokemon introuvable'
		},
		priority: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Pokemon introuvable',
			'err3': 'Aucun mouvement trouvés'
		},
		boosting: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Pokemon introuvable',
			'err3': 'Aucun mouvement trouvés'
		},
		recovery: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Pokemon introuvable',
			'err3': 'Aucun mouvement trouvés'
		},
		hazard: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Pokemon introuvable',
			'err3': 'Aucun mouvement trouvés'
		},
		/*
		* Battle Commands
		*/
		reloadteams: {'s': 'Équipes rechargés', 'e': 'Une erreur est survenue, ne pouvait pas recharger équipes'},
		blockchallenges: {
			'b': 'Défis bloquée',
			'nb': 'Défis débloqués'
		},
		move: {'notbattle': 'Cette commande est disponible uniquement pour les salles de bataille'},
		jointours: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'ad': 'Mode "tour autojoin" est déjà désactivé pour la salle',
			'd': 'Mode "tour autojoin" est déjà activé pour la salle',
			'ae': 'Mode "tour autojoin" est déjà activé pour la salle',
			'e': 'Mode "tour autojoin" est activé pour la salle'
		},
		searchbattle: {
			'e1': 'Vous devez spécifier un format',
			'e21': 'Format',
			'e22': 'est pas valable pour la recherche bataille',
			'e31': 'Je ne dois équipes pour la recherche bataille en format',
			'e32': 'Utiliser "team add" commande pour ajouter d\'autres équipes de bot'
		},
		ladderstart: {
			'stop': 'Laddering arrêté',
			'start': 'Maintenant laddering en format',
			'e1': 'Vous devez spécifier un format',
			'e21': 'Format',
			'e22': 'est pas valable pour la recherche bataille',
			'e31': 'Je ne dois équipes pour la recherche bataille en format',
			'e32': 'Utiliser "team add" commande pour ajouter d\'autres équipes de bot'
		},
		challenge: {
			'e11': 'Usage',
			'e12': '[user], [format]',
			'e21': 'Format',
			'e22': 'est pas valable pour contester',
			'e31': 'Je ne dois équipes pour contester en format',
			'e32': 'Utiliser "team add" commande pour ajouter d\'autres équipes de bot'
		},
		jointour: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'e1': 'Il n\'y a pas un tournoi dans cette salle',
			'e2': 'Erreur: Déjà rejoint',
			'e3': 'Erreur: tournoi a déjà commencé',
			'e41': 'Je ne dois équipes pour rejoindre un tournoi en format',
			'e42': 'Utiliser "team add" commande pour ajouter d\'autres équipes de bot'
		},
		leavetour: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'e1': 'Il n\'y a pas un tournoi dans cette salle',
			'e2': 'Erreur: Pas encore adhérer'
		},
		battleset: {
			'u1': 'Usage',
			'u2': '[permission], [rang]',
			'ps': 'Permissions',
			'p': 'Permission',
			'd': 'dans des batailles est maintenant désactivé',
			'a': 'dans des batailles est maintenant disponible pour tous les utilisateurs',
			'r': 'dans des batailles est maintenant disponible pour les utilisateurs de rang',
			'r2': 'ou plus',
			'not1': 'Rang',
			'not2': 'pas trouvé'
		},
		team: {
			'u1': 'Usage',
			'u2': '[add/delete], [nom], [format], [Exportable dans Hastebin]',
			'format': 'Format',
			'notexists': 'ne pas existe',
			'download': 'Le téléchargement et l\'analyse de l\'équipe',
			'team': 'Équipe',
			'added': 'ajouté à la liste des équipes de bots',
			'err1': 'Erreur: le document Hastebin introuvable',
			'err2': 'Erreur: les données de l\'équipe non valide',
			'err3': 'Erreur: Il y avait déjà une équipe avec ce nom, utiliser un autre nom ou supprimer l\'autre équipe',
			'err4': 'Erreur: Impossible d\'obtenir des données à partir Hastebin',
			'removed': 'supprimé avec succès de la liste des équipes'
		},
		teamlist: {
			'list': 'Liste des équipes de Bot',
			'empty': 'Liste des équipes de Bot est vide',
			'id': 'Id',
			'format': 'Format',
			'pokemon': 'Pokemon',
			'err': 'Erreur: échec de télécharger équipes liste Hastebin'
		},
		/*
		* Moderation Commands
		*/
		autoban: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'notmod': 'exige modérateur rang (@) ou plus pour bannir des utilisateurs',
			'notarg': 'Vous devez spécifier au moins un utilisateur à la liste noire',
			'bu': 'Utilisateur sur la liste noire',
			'u': 'Utilisateur(s)',
			'added': 'ajouté à la liste noire avec succès.',
			'already': 'déjà présent dans la liste noire.',
			'all': 'Tous',
			'other': 'autre',
			'illegal': 'les utilisateurs devaient entailles illégales et ne sont pas mis à l\'index.'
		},
		unautoban: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'notmod': 'exige modérateur rang (@) ou plus pour bannir des utilisateurs',
			'notarg': 'Vous devez spécifier au moins un utilisateur de unblacklist.',
			'u': 'Utilisateur(s)',
			'r': 'retiré de la liste noire avec succès.',
			'noother': 'Aucun autre',
			'no': 'Aucun',
			'nopresent': 'utilisateurs spécifiés étaient présents dans la liste noire.'
		},
		regexautoban: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'notmod': 'exige modérateur rang (@) ou plus pour bannir des utilisateurs',
			'notarg': 'Vous devez spécifier une expression régulière à la liste noire.',
			're': 'Expression régulière',
			'notadd': 'ne peut pas être ajouté à la liste noire. Ne soyez pas machiavélique!',
			'already': 'est déjà présent dans la liste noire.',
			'addby': 'a été ajouté à la liste noire par l\'utilisateur',
			'add': 'a été ajouté à la liste noire.'
		},
		unregexautoban: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'notmod': 'exige modérateur rang (@) ou plus pour bannir des utilisateurs',
			'norarg': 'Vous devez spécifier une expression régulière à la liste noire.',
			'notpresent': 'est pas présent dans la liste noire.',
			're': 'Expression régulière',
			'rby': 'a été retiré de la liste noire par l\'utilisateur',
			'r': 'a été retiré de la liste noire.'
		},
		viewblacklist: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'iu': 'Nom d\'utilisateur invalide',
			'u': 'Utilisateur',
			'currently': 'est actuellement',
			'not': 'pas',
			'b': 'sur la liste noire',
			'nousers': 'Aucun utilisateur est sur la liste noire',
			'listab': 'Les utilisateurs suivants sont interdits dans',
			'listrab': 'Les expressions régulières suivantes sont interdites dans',
			'err': 'télécharger l\'échec, ne pouvait pas télécharger la liste noire à hastebin'
		},
		banword: {
			'phrase': 'Phrase',
			'already': 'est déjà interdit.',
			'ban': 'est désormais interdit.'
		},
		unbanword: {
			'phrase': 'Phrase',
			'not': 'est pas actuellement interdit.',
			'unban': 'a été débanni.'
		},
		viewbannedwords: {
			'in': 'dans',
			'globally': 'globalement',
			'phrase': 'Phrase',
			'nowords': 'Pas de phrase sont interdits dans cette salle.',
			'curr': 'est actuellement',
			'not': 'pas',
			'banned': 'interdit',
			'list': 'Les phrases suivantes sont interdites',
			'link': 'Phrases interdites',
			'err': 'télécharger l\'échec, ne pouvait pas télécharger banwords à hastebin'
		},
		inapword: {
			'phrase': 'Phrase',
			'already': 'est déjà inapproprié.',
			'ban': 'est maintenant inapproprié.'
		},
		uninapword: {
			'phrase': 'Phrase',
			'not': 'est pas actuellement inapproprié.',
			'unban': 'est pas maintenant inappropriée.'
		},
		viewinapwords: {
			'in': 'dans',
			'globally': 'globalement',
			'phrase': 'Phrase',
			'nowords': 'Pas de phrase sont inappropriées dans cette salle.',
			'curr': 'est actuellement',
			'not': 'pas',
			'banned': 'inapproprié',
			'list': 'Les phrases suivantes sont inappropriées',
			'link': 'Phrases inappropriés',
			'err': 'télécharger l\'échec, ne pouvait pas télécharger phrases inappropriés à hastebin'
		},
		joinphrase: {
			'ae': 'Rejoignez Phrases déjà permis pour cette salle',
			'e': 'Rejoignez Phrases sont maintenant permis pour cette salle"',
			'ad': 'Rejoignez Phrases déjà désactivé pour cette salle"',
			'd': 'Rejoignez Phrases sont maintenant désactivé pour cette salle',
			'u1': 'Usage',
			'u2': '[set/delete], [utilisateur], [phrase]',
			'dis': 'Rejoignez phrases sont désactivées dans cette salle',
			'jpfor': 'Rejoignez Phrase pour l\'utilisateur',
			'modified': 'a été modifié',
			'globally': 'globalement.',
			'forthis': 'pour cette salle.',
			'del': 'a été supprimé',
			'not': 'ne pas existe'
		},
		viewjoinphrases: {
			'iu': 'Nom d\'utilisateur invalide.',
			'not': 'Aucune Rejoignez Phrase fixé pour',
			'empty': 'Il ne sont pas de Rejoignez Phrases dans cette salle.',
			'jp': 'Rejoignez Phrases ensemble',
			'globally': 'globalement',
			'in': 'dans',
			'err': 'télécharger l\'échec, ne pourrait télécharger rejoindre phrases pour hastebin'
		},
		mod: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'u1': 'Usage',
			'u2': '(room - optional), [mod], [on/off]',
			'valid': 'Modérations valides sont',
			'mod': 'Modération pour',
			'ae': 'déjà sur ON pour la salle',
			'e': 'est maintenant ON pour la salle',
			'ad': 'déjà sur OFF pour la salle',
			'd': 'est maintenant OFF pour la salle'
		},
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (format), (secondes pour démarrer ou OFF), (minutes autodq ou OFF) (max Utilisateurs ou OFF), (elimination ou roundrobin). Tous les arguments sont optionnels.'},
		tournament: {
			'e1': 'exige modérateur rang (@) ou plus pour créer tournois',
			'e2': 'Il ya déjà un tournoi dans cette salle',
			'e31': 'Format',
			'e32': 'est pas valide pour les tournois',
			'e4': 'Temps de commencer est pas une heure valide',
			'e5': 'Autodq est pas une heure valide',
			'e6': 'Nombre d\'utilisateurs Max est pas valable',
			'e7': 'Type de tour est pas valide. Les types valides sont: elimination, roundrobin',
			'notstarted': 'Erreur: le tournoi n\'a pas commencé, probablement parce que je suis pas la permission de créer des tournois ou des commandes ont été changés.'
		}
	},

	/*
	* Features
	*/

	time: {
		'day': 'jour',
		'hour': 'heure',
		'minute': 'minute',
		'second': 'seconde',
		'days': 'jours',
		'hours': 'heures',
		'minutes': 'minutes',
		'seconds': 'secondes'
	},

	youtube: {
		'before': 'Le lien de',
		'after': ''
	},

	moderation: {
		'automod': 'Modération Automatique',
		//mods
		'fs': 'Flood / Spam',
		'sl': 'Link Spam',
		's': 'Spam',
		'f': 'Flood',
		'possible': 'Possible spammeur détecté',
		'caps': 'Capitalisation excessive',
		'stretch': 'Stretching',
		'spoiler': 'Spoilers ne sont pas admis dans cette chat',
		'youtube': 'Filières de Youtube ne sont pas admis dans cette chat',
		'server': 'Serveurs de PS ne sont pas admis dans cette chat',
		'inapword': 'Votre message contenait une phrase inapproprié',
		'banword': 'Votre message contenait une phrase interdit',
		'mult': 'Infarctus Multiples',
		'0tol': '(Tolérance zéro)',
		//avb
		'caps-0': 'Caps',
		'rep-0': 'Redoublement',
		'stretch-0': 'Stretching',
		'flood-0': 'Flood',
		'spoiler-0': 'Spoiler',
		'youtube-0': 'Filières de Youtube',
		'server-0': 'Serveur de PS',
		'inapword-0': 'Inapproprié',
		'banword-0': 'Mots Interdits',
		//autoban
		'ab': 'Utilisateur sur la liste noire'
	}
};

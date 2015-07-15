exports.translations = {
	commands: {
		/*
		* Basic Commands
		*/
		about: {
			'about': 'Je suis un **Robot de Pokémon Showdown** qui a été écrit en Javascript pour node. Par Ecuacion'
		},
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
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'nolang': 'Vous devez spécifier une langue',
			'v': 'Les langues possibles sont',
			'l': 'La langue de la salle est maintenant Français'
		},
		set: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'denied': 'Accès refusé',
			'u1': 'Usage',
			'u2': '[permission], [rank]',
			'ps': 'Permissions',
			'p': 'Permission',
			'd': 'Cette salle est maintenant handicapé',
			'a': 'Cette salle est maintenant disponible pour tous les utilisateurs',
			'r': 'Cette salle est maintenant disponible pour les utilisateurs ayant le rang',
			'r2': 'ou haut',
			'not1': 'Rank',
			'not2': 'non trouvé'
		},
		/*
		* Dyn Commands
		*/
		dyn: {
			'nocmds': 'Il n\'y a pas de commandes',
			'list': 'Commandes dynamiques',
			'c': 'Commande',
			'notexist': 'n\'existe pas'
		},
		delcmd: {
			'c': 'Commande',
			'd': 'a été supprimé',
			'n': 'n\'existe pas'
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
			'n': 'n\'est pas une commande dynamique',
			'c': 'Commande',
			'alias': 'est maintenant un alias de',
			'already': 'est un alias. Vous ne pouvez pas définir des alias d\'un autre alias'
		},
		getdyncmdlist: {
			'nocmds': 'Il n\'y a pas de commandes',
			'list': 'Commandes dynamiques',
			'err': 'Erreur : Je ne peux pas télécharger les commandes sur hastebin'
		},
		/*
		* Misc Commands
		*/
		pick: {'err': 'Vous devez donner au moins 2 choix valides'},
		randomanswer: {
			'answers': [
				'Les signes disent que oui.',
				'Oui.',
				'La réponse floue, essayez à nouveau. ',
				'Sans aucun doute.',
				'Mes sources disent non.',
				'Comme je le vois, oui.',
				'Vous pouvez compter sur elle.',
				'Concentrez-vous et demander à nouveau.',
				'Perspectives pas si bonnes.',
				'Il est donc décidément. ',
				'Mieux vaut ne pas vous dire maintenant.',
				'Très douteux.',
				'Oui définitivement.',
				'Il est certain.',
				'Vous ne pouvez pas prévoir maintenant. ',
				'Probablement.',
				'Demandez à nouveau plus tard. ',
				'Ma réponse est non.',
				'Perspectives bonnes.',
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
			'ae': 'La reconnaissance YouTube est déjà disponible pour la salle',
			'e': 'La reconnaissance de lien YouTube est  maintenant disponible pour cette salle',
			'ad': 'La reconnaissance de lien YouTube est  déjà désactivé pour la salle',
			'd': 'La reconnaissance de lien YouTube  est  maintenant désactivée pour cette salle'
		},
		/*
		* Quotes
		*/
		quote: {
			'nodata': 'Base de données est vide'
		},
		setquote: {
			'notemp': 'Il n\'y a aucune chaîne temporaire pour définir, utiliser **stemp** avant de faire cela',
			'q': 'Citation',
			'modified': 'a été modifié',
			'created': 'a été créé'
		},
		delquote: {
			'q': 'Citation',
			'n': 'n\'existe pas',
			'd': 'a été supprimé'
		},
		viewquotes: {
			'q': 'Citation',
			'n': 'n\'existe pas',
			'empty': 'Liste des citations est vide',
			'list': 'Liste des citations',
			'err': 'Erreur : Je ne peux pas télécharger les citations sur hastebin'
		},
		addquotes: {
			'notfound': 'Error: Document not found',
			'd': 'Télécharger le document Hastebin',
			'add': 'ajoutés',
			'q': 'citations',
			'err': 'Erreur : Je ne peux pas télécharger les citations sur hastebin'
		},
		/*
		* Pokemon Commands
		*/
		randompokemon: {'err': 'Une erreur est survenue, essayez à nouveau plus tard'},
		gen: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Vous devez spécifier un pokemon, mouvement, objet ou capacité',
			'nfound': 'Pokémon, mouvement, objet ou capacité introuvable',
			'g': 'Génération de'
		},
		randommoves: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Vous devez spécifier un pokémon',
			'r': 'Random singles moves',
			'rd': 'Random doubles/triples moves',
			'nfound': 'Pokémon introuvable'
		},
		heavyslam: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Vous devez spécifier 2 pokemon',
			'n1': 'L\'attaquant Pokémon introuvable',
			'n2': 'Le défenseur Pokémon est introuvable',
			's': 'Heavy slam/Heat crash base power'
		},
		prevo: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'p1': 'Pokémon',
			'p2': 'n\'a pas preevo',
			'nfound': 'Pokémon introuvable'
		},
		priority: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Pokémon introuvable',
			'err3': 'Aucun mouvement trouvé'
		},
		boosting: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Pokémon introuvable',
			'err3': 'Aucun mouvement trouvé'
		},
		recovery: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Pokemon introuvable',
			'err3': 'Aucun mouvement trouvé'
		},
		hazard: {
			'err': 'Une erreur est survenue, essayez à nouveau plus tard',
			'err2': 'Pokémon introuvable',
			'err3': 'Aucun mouvement trouvé'
		},
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
		battleset: {
			'u1': 'Usage',
			'u2': '[permission], [rang]',
			'ps': 'Permissions',
			'p': 'Permission',
			'd': 'dans des batailles est maintenant désactivé',
			'a': 'dans des batailles est maintenant disponible pour tous les utilisateurs',
			'r': 'dans des batailles est maintenant disponible pour les utilisateurs du rang',
			'r2': 'ou plus',
			'not1': 'Rang',
			'not2': 'pas trouvé'
		},
		team: {
			'u1': 'Usage',
			'u2': '[add/delete/get], [nom], [format], [Exportable dans un Hastebin]',
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
		},
		/*
		* Moderation Commands
		*/
		autoban: {
			'notchat': 'Cette commande est disponibles seulement pour les salles de chat',
			'notmod': 'exige modérateur (@) ou plus pour bannir des utilisateurs',
			'notarg': 'Vous devez spécifier au moins un utilisateur à la liste noire',
			'bu': 'Utilisateur sur la liste noire',
			'u': 'Utilisateur(s)',
			'added': 'ajouté à la liste noire avec succès.',
			'already': 'déjà présent dans la liste noire.',
			'all': 'Tous',
			'other': 'autre',
			'illegal': 'les utilisateurs devaient faire des entailles illégales et ne sont plus mis à l\'index.'
		},
		unautoban: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'notmod': 'exige modérateur (@) ou plus pour bannir des utilisateurs',
			'notarg': 'Vous devez spécifier au moins un utilisateur pour unblacklist.',
			'u': 'Utilisateur(s)',
			'r': 'retiré de la liste noire avec succès.',
			'noother': 'Aucun autre',
			'no': 'Aucun',
			'nopresent': 'Les utilisateurs spécifiés n\'étaient pas présents dans la liste noire.'
		},
		regexautoban: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'notmod': 'exige modérateur (@) ou plus pour bannir des utilisateurs',
			'notarg': 'Vous devez spécifier une expression régulière à la liste noire.',
			're': 'Expression régulière',
			'notadd': 'ne peut pas être ajouté à la liste noire. Ne soyez pas machiavélique!',
			'already': 'est déjà présent dans la liste noire.',
			'addby': 'a été ajouté à la liste noire par l\'utilisateur',
			'add': 'a été ajouté à la liste noire.'
		},
		unregexautoban: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'notmod': 'exige modérateur (@) ou plus pour bannir des utilisateurs',
			'norarg': 'Vous devez spécifier une expression régulière à la liste noire.',
			'notpresent': 'est pas présent dans la liste noire.',
			're': 'Expression régulière',
			'rby': 'a été retiré de la liste noire par l\'utilisateur',
			'r': 'a été retiré de la liste noire.'
		},
		viewblacklist: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'iu': 'Nom d\'utilisateur invalide',
			'u': 'Utilisateur',
			'currently': 'est actuellement',
			'not': 'pas',
			'b': 'sur la liste noire',
			'nousers': 'Aucun utilisateur est sur la liste noire',
			'listab': 'Les utilisateurs suivants sont interdits dans',
			'listrab': 'Les expressions régulières suivantes sont interdites dans',
			'err': 'Erreur : Je ne peux pas télécharger la liste noire sur hastebin'
		},
		zerotol: {
			'nolevels': 'Il n\'y a pas de niveaux de tolérance zéro',
			'user': 'Utilisateur',
			'level': 'Niveau',
			'ztl': 'Liste de tolérance zéro',
			'empty': 'Zero tolerance list is empty',
			'is': 'est actuellement',
			'n': 'pas',
			'y': '',
			'in': 'sur le liste de tolérance zéro',
			'u1': 'Usage',
			'u2': '[add/delete], [Utilisateur:niveau]...',
			'users': 'Utilisateur(s)',
			'add': 'ajouté à la liste de tolérance zéro',
			'illegal': 'utilisateurs avaient entailles illégales',
			'invalid': 'avaient des niveaux invalides',
			'already': 'étaient déjà présents dans la liste',
			'removed': 'retiré de la liste de tolérance zéro',
			'not': 'utilisateurs sont pas sur la liste',
			'err': 'Erreur : Je ne peux pas télécharger la liste de tolérance zéro sur hastebin'
		},
		banword: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'phrase': 'Phrase',
			'already': 'est déjà interdite.',
			'ban': 'est désormais interdite.'
		},
		unbanword: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'phrase': 'Phrase',
			'not': 'n\'est pas actuellement interdite.',
			'unban': 'a été débannie.'
		},
		viewbannedwords: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'in': 'dans',
			'globally': 'globalement',
			'phrase': 'Phrase',
			'nowords': 'Pas de phrases interdites dans cette salle.',
			'curr': 'est actuellement',
			'not': 'pas',
			'banned': 'interdite',
			'list': 'Les phrases suivantes sont interdites',
			'link': 'Phrases interdites',
			'err': 'Erreur: Je ne peux pas télécharger banwords à hastebin'
		},
		inapword: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'phrase': 'Phrase',
			'already': 'est déjà inappropriée.',
			'ban': 'est maintenant inappropriée.'
		},
		uninapword: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'phrase': 'Phrase',
			'not': 'est actuellement pas inappropriée.',
			'unban': 'est maintenant plus inappropriée.'
		},
		viewinapwords: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'in': 'dans',
			'globally': 'globalement',
			'phrase': 'Phrase',
			'nowords': 'Pas de phrase inappropriées dans cette salle.',
			'curr': 'est actuellement',
			'not': 'pas',
			'banned': 'inappropriée',
			'list': 'Les phrases suivantes sont inappropriées',
			'link': 'Phrases inappropriés',
			'err': 'Erreur : Je ne pouvais pas télécharger les phrases inappropriées sur hastebin'
		},
		joinphrase: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'ae': 'Ces phrases de connections sont déjà permis pour cette salle',
			'e': 'Ces phrases de connections sont maintenant permis pour cette salle"',
			'ad': 'Ces phrases de connections sont déjà désactivées pour cette salle"',
			'd': 'Ces phrases de connections sont maintenant désactivé pour cette salle',
			'u1': 'Usage',
			'u2': '[Mettre/supprimé], [utilisateur], [phrase]',
			'dis': 'Ces phrases de connection sont désactivées dans cette salle',
			'jpfor': 'Ces phrases de connection sont interdites pour l\'utilisateur',
			'modified': 'a été modifiée',
			'globally': 'globalement.',
			'forthis': 'pour cette salle.',
			'del': 'a été supprimée',
			'not': 'n\'existe pas'
		},
		viewjoinphrases: {
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'iu': 'Nom d\'utilisateur invalide.',
			'not': 'Aucune de ces phrases n\'est fixé pour',
			'empty': 'Ce n\'est pas des phrases de connection dans cette salle.',
			'jp': 'Phrase de connection ensemble',
			'globally': 'globalement',
			'in': 'dans',
			'err': 'Erreur: Je ne peux pas télécharger les phrases de connections sur hastebin'
		},
		mod: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'u1': 'Usage',
			'u2': '(room - optional), [mod], [on/off]',
			'valid': 'Modérations valides sont',
			'mod': 'Modération pour',
			'ae': 'déjà sur ACTIVÉE pour la salle',
			'e': 'est maintenant ACTIVÉE pour la salle',
			'ad': 'déjà sur DÉSACTIVÉE pour la salle',
			'd': 'est maintenant DÉSACTIVÉE pour la salle'
		},
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (format), (secondes pour démarrer ou DÉSACTIVÉE), (minutes autodq ou DÉSACTIVÉE) (Utilisateurs max ou DÉSACTIVÉE), (elimination ou roundrobin). Tous les arguments sont optionnels.'},
		tournament: {
			'e1': 'exige modérateur (@) ou plus pour créer tournois',
			'e2': 'Il y\'a déjà un tournoi dans cette salle',
			'e31': 'Format',
			'e32': 'est pas valide pour les tournois',
			'e4': 'Le temps de commencer n\'est pas une heure valide',
			'e5': 'Autodq est pas une heure valide',
			'e6': 'Nombre d\'utilisateurs max est pas disponible',
			'e7': 'Le type de tour n\est pas valide. Les types valides sont: elimination, roundrobin',
			'notstarted': 'Erreur: le tournoi n\'a pas commencé, probablement parce que je n\'ai pas la permission de créer des tournois ou des commandes ont été changées.'
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

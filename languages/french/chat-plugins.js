exports.translations = {
	commands: {
		/*
		* Misc Commands
		*/
		pick: {'pick': 'Choix aléatoire', 'err': 'Vous devez donner au moins 2 choix valides'},
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
		regdate: {
			'inv': 'Nom d\'utilisateur invalide',
			'busy': 'Actuellement télécharger les données, essayez de nouveau dans quelques secondes',
			'err': 'Impossible d\'obtenir les données de',
			'user': 'Utilisateur',
			'not': 'est pas enregistrée',
			'regtime1': 'a été enregistré il ya',
			'regtime2': '',
			'regdate': 'a été enregistrée le'
		},
		/*
		* Smogon
		*/
		usage: {
			'in': 'dans',
			'stats': 'Statistiques d\'utilisation',
			'data': 'Des données d\'utilisation',
			'usage': 'Usage',
			'tiererr1': 'Tier ou format',
			'tiererr2': 'pas trouvé',
			'tiererr3': 'indisponible',
			'err': 'Impossible d\'obtenir les données d\'utilisation de',
			'busy': 'Téléchargement des données d\'utilisation. Essayez à nouveau dans quelques secondes',
			'pokeerr1': 'Pokemon',
			'pokeerr2': 'pas disponible en',
			'pokeerr3': '(des données d\'utilisation)',
			'pokeerr4': '(statistiques d\'utilisation)',
			'notfound': 'Données non trouvé pour',
			'usagedata1': '#NAME de ',
			'usagedata2': '',
			'pokeusage': 'Usage',
			'pokeraw': 'Raw',
			'abilities': 'Talents',
			'items': 'Objets',
			'moves': 'Capacités',
			'spreads': 'Spreads',
			'teammates': 'Coéquipiers'
		},
		suspect: {
			'tiererr1': 'Tier',
			'tiererr2': 'pas trouvé',
			'in': 'dans',
			'nosuspect': 'Pas de données de suspect test trouvés pour tier',
			'aux1': 'Utiliser',
			'aux2': 'pour définir les données suspect'
		},
		setsuspect: {
			'usage': 'Usage',
			'tier': 'Tier',
			'notfound': 'pas trouvé',
			'd1': 'Suspect test données pour tier',
			'd2': 'a été retiré'
		},
		deftier: {
			'usage': 'Usage',
			'notchat': 'Cette commande est disponible seulement pour les salles de chat',
			'tiererr1': 'Tier',
			'tiererr2': 'pas trouvé',
			'set': 'Tier par défaut pour cette salle est maintenant'
		},
		/*
		* Quotes & Jokes
		*/
		quote: {
			'u1': 'Usage',
			'u2': '[id], [quote]',
			'empty': 'Base de données est vide',
			'noid': 'Vous devez spécifier un identifiant valide',
			'quote': 'Quote',
			'n': 'n\'existe pas',
			'd': 'a été supprimé avec succès',
			'already': 'existe déjà',
			'modified': 'a été modifié avec succès',
			'created': 'a été créé avec succès'
		},
		listquotes: {
			'empty': 'Liste des quotes est vide',
			'list': 'Liste des quotes',
			'err': 'Erreur : Je ne peux pas télécharger les quotes sur hastebin'
		},
		joke: {
			'u1': 'Usage',
			'u2': '[id], [blague]',
			'empty': 'Base de données est vide',
			'noid': 'Vous devez spécifier un identifiant valide',
			'joke': 'Blague',
			'n': 'n\'existe pas',
			'd': 'a été supprimé avec succès',
			'already': 'existe déjà',
			'modified': 'a été modifié avec succès',
			'created': 'a été créé avec succès'
		},
		listjokes: {
			'empty': 'Liste des blagues est vide',
			'list': 'Liste des blagues',
			'err': 'Erreur : Je ne peux pas télécharger les blagues sur hastebin'
		},
		/*
		* Pokemon Commands
		*/
		translate: {
			'u1': 'Usage',
			'u2': '[mot], (langue source), (langue cible)',
			'lnot1': 'Langue',
			'lnot2': 'pas disponibles. Langues disponibles',
			'not1': 'Pokemon, Ability, item, move ou nature appelé',
			'not2': 'introuvable ou non disponibles dans les traductions',
			'not3': 'introuvable',
			'tra': 'Traductions de',
			'pokemon': 'Pokemon',
			'abilities': 'Ability',
			'items': 'Item',
			'moves': 'Move',
			'natures': 'Nature'
		},
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
		}
	}
};

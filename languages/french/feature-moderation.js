exports.translations = {
	commands: {
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
		modexception: {
			'notchat': 'Cette commande est avaliable seulement pour les salles de chat',
			'all': 'utilisateurs réguliers',
			'rank': 'rank',
			'modex-inf1': 'Modération exception est activé pour',
			'modex-inf2': 'ou haut dans cette salle',
			'modex-set1': 'Modération exception a été activé pour',
			'modex-set2': 'ou haut dans cette salle',
			'not1': 'Rank',
			'not2': 'non trouvé'
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
		}
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
		'replays': 'Les replays sont interdit dans ce room',
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
		'replays-0': 'Replay',
		'server-0': 'Serveur de PS',
		'inapword-0': 'Inapproprié',
		'banword-0': 'Mots Interdits',
		//autoban
		'ab': 'Utilisateur sur la liste noire'
	}
};

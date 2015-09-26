exports.translations = {
	commands: {
		/*
		* Battle Commands
		*/
		reloadteams: {'s': 'Teams reloaded', 'e': 'An error ocurred, could not reload teams'},
		blockchallenges: {
			'b': 'Challenges blocked',
			'nb': 'Challenges no longer blocked'
		},
		move: {'notbattle': 'This command is only available for battle rooms'},
		jointours: {
			'notchat': 'This command is only available for chat rooms',
			'ad': 'Mode "tour autojoin" already disabled for room',
			'd': 'Mode "tour autojoin" disabled for room',
			'ae': 'Mode "tour autojoin" already enabled for room',
			'e': 'Mode "tour autojoin" enabled for room'
		},
		searchbattle: {
			'e1': 'You must specify a format',
			'e21': 'Format',
			'e22': 'is not valid for searching battle',
			'e31': 'I do not have teams for searching battle in format',
			'e32': 'Use "team add" command to add more bot teams'
		},
		ladderstart: {
			'stop': 'Laddering stopped',
			'start': 'Now laddering in format',
			'e1': 'You must specify a format',
			'e21': 'Format',
			'e22': 'is not valid for searching battle',
			'e31': 'I do not have teams for searching battle in format',
			'e32': 'Use "team add" command to add more bot teams'
		},
		challenge: {
			'e11': 'Usage',
			'e12': '[user], [format]',
			'e21': 'Format',
			'e22': 'is not valid for challenging',
			'e31': 'I do not have teams for challenging in format',
			'e32': 'Use "team add" command to add more bot teams'
		},
		jointour: {
			'notchat': 'This command is only available for chat rooms',
			'e1': 'There is not a tournament in this room',
			'e2': 'Error: Already joined',
			'e3': 'Error: Tournament has already started',
			'e41': 'I do not have teams for joining a tornament in format',
			'e42': 'Use "team add" command to add more bot teams'
		},
		leavetour: {
			'notchat': 'This command is only available for chat rooms',
			'e1': 'There is no tournament in this room',
			'e2': 'Error: Not joined'
		},
		team: {
			'u1': 'Usage',
			'u2': '[add/delete/get/check]',
			'u3': 'add, [name], [format], [Exportable in Hastebin]',
			'u4': 'delete, [name]',
			'u5': 'get, [name]',
			'u6': 'check, [name], (user)',
			'format': 'Format',
			'notexists': 'does not exists',
			'download': 'Dowloading and parsing team',
			'team': 'Team',
			'added': 'added successfully to bot teams list',
			'err': 'Error: failed to upload team to Hastebin',
			'err1': 'Error: Hastebin document not found',
			'err2': 'Error: Invalid team data',
			'err3': 'Error: There was already a team with that name, use another name or delete the other team',
			'err4': 'Error: Failed to get data from Hastebin',
			'removed': 'removed successfully from teams list'
		},
		teamlist: {
			'list': 'Bot teams list',
			'empty': 'Bot teams list is empty',
			'id': 'Id',
			'format': 'Format',
			'pokemon': 'Pokemon',
			'err': 'Error: failed to upload teams list to Hastebin'
		}
	},

	battle: {
		'battlefound': 'Battle found in ladder'
	}
};

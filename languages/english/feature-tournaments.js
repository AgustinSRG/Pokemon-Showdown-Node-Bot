exports.translations = {
	commands: {
		/*
		* Tour Commands
		*/
		tourhelp: {'h': 'tour (format), (seconds to start or off), (minutes autodq or off), (max Users or off), (elimination or roundrobin). All arguments are optional.'},
		tourend: {'err': 'There is not a tournament in this room', 'err2': 'Error: Tournament has already started'},
		tournament: {
			'e1': 'requires moderator rank (@) or higher to create tornaments',
			'e2': 'There is already a tournament in this room',
			'e31': 'Format',
			'e32': 'is not valid for tournaments',
			'e4': 'Time to start is not a valid time',
			'e5': 'Autodq is not a valid time',
			'e6': 'Max users number is not valid',
			'e7': 'Tour type is not valid. Valid types are: elimination, roundrobin',
			'notstarted': 'Error: the tournament did not start, probably because I have not permission to create tournaments or commands got changed.',
			'param': 'Parameter',
			'paramhelp': 'not found, valid parameter are'
		}
	}
};

/*
	config.js - Configuration File
*/

/****************************************
* Connection Details
****************************************/

exports.server = 'localhost';

exports.port = 8000;

exports.serverid = 'localhost';

exports.autoReconnectDelay = 10 * 1000;
exports.autoReloginDelay = 60 * 1000;
exports.connectionTimeout = 2 * 60 * 1000;

/****************************************
* Login Details
****************************************/

exports.nick = '';

exports.pass = null;

/****************************************
* Rooms
****************************************/

exports.rooms = ['lobby'];

exports.privateRooms = {
	//privateroomname: true
};

exports.initCmds = ['|/avatar 120']; // Other commands (avatar, blockchallenges, etc)

/****************************************
* Auth configuration
****************************************/

exports.exceptions = {
	//userid: 'rank' or userid: true for full access
};

exports.ranks = ['+', '%', '@', '#', '&', '~'];

/****************************************
* Commands configuration
****************************************/

exports.commandChar = '.';

exports.defaultPermission = '%';

exports.PermissionExceptions = {
	//command: 'rank'
	'say': '#',
	'info': '+',
	'wall': '%',
	'autoban': '#',
	'banword': '#',
	'joinphrase': '#',
	'searchbattle': '~'
};

/****************************************
* Configuration for console messages
*****************************************/

exports.debug = {
	/* Status Messages */
	info: true,
	error: true,
	ok: true,

	errlog: true,
	monitor: true,

	/* Internal Debug */
	debug: false,
	cmdr: false,

	/* Low Level */
	recv: false,
	sent: false
};


/****************************************
* Configuration for specific
* commands and features
*****************************************/

/***************************
* Moderation
****************************/

exports.moderation = {
	modException: '%', // Min rank for not receive moderation

	allowmute: true,

	modDefault: {
		//basic mods
		'caps': 1,
		'stretching': 1,
		'flooding': 1,
		'spam': 1,

		'bannedwords': 1,
		'inapropiate': 1,

		//specific mods
		'spoiler': 1,
		'youtube': 1,
		'psservers': 1,

		//multiple infraction
		'multiple': 1
	},

	punishments: [
		"warn",
		"mute",
		"hourmute",
		"roomban"
	],

	psServersExcepts: {
		"showdown": 1,
		"smogtours": 1
	}
};

/******************
* Battles
*******************/

exports.clientUrl = 'http://play.pokemonshowdown.com/';
exports.aceptAll = false;
exports.winmsg = ['GG', 'g_g'];
exports.losemsg = ['gg', 'wp'];

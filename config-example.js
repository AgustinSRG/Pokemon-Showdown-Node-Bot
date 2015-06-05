/*
	config.js - Configuration File
*/

/****************************************
* Connection Details 
****************************************/

exports.server = 'localhost';

exports.port = 8000;

exports.serverid = 'localhost';

exports.autoReconnectDelay = 60 * 1000;
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
	'ecuacion': true
};

exports.ranks = ['+', '%', '@', '#', '&', '~'];

/****************************************
* Commands configuration
****************************************/

exports.commandChar = '.';

exports.defaultPermission = '%';

exports.PermissionExceptions = {
	//command: 'rank'
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
	debug: true,
	cmdr: true,
	
	/* Low Level */
	recv: true,
	sent: true
};


/****************************************
* Configuration for specific 
* commands and features
*****************************************/


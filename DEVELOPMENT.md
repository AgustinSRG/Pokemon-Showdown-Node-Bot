Development documentation
====================

Commands
------------

Bot commands are in the folder `commands` separated in different files. A command file has the following structure:
```js

Settings.addPermissions(['permission1', 'permission2', 'permission3']); //Add command permission for 'can' method (optional)

exports.commands = {
	altcommand1: 'command1', //commands can be references to other commands
	command1: function (arg, by, room, cmd) { //command are functions
		//do stuff
	},
	
	command2: function (arg, by, room, cmd) {
		//do stuff
	}
};
```

Commands have 4 arguments:
 - **arg**: Command argument when you use for example `command [argument]`
 - **by**: User who executed the command
 - **room**: Room where the command has been executed
 - **cmd**: Original command before refrerences. For example if you use `altcommand1`, cmd is `altcommand1` but the function correspond to `command1`

Also, command have a context:
 - `this.arg` - Argument
 - `this.by` - Argument
 - `this.room` - Argument
 - `this.cmd` - Argument
 - `this.handler` - Command function name
 - `this.cmdToken` - Command character used. Example: `.say hi` means this.cmdToken = `.`
 - `this.roomType` - Can be 'chat', 'battle' or 'pm'
 - `this.botName` - Bot username
 - `this.reply (text)` - Replies in the same room (chat or pm)
 - `this.pmReply (text)` - Replies by pm
 - `this.restrictReply (text, permission)` - Replies by chat if user has permission, by pm otherwise
 - `this.say (room, text)` - Say something to other room
 - `this.isRanked (rank)` - True if ranked equal or above, false if not
 - `this.isRoomRanked (room, rank)` - True if ranked equal or above (in specified room), false if not
 - `this.botRanked (rank)` - True if the bot has this rank or above, false if not
 - `this.isExcepted` - True if the user is excepted, false if not
 - `this.can (permission)` - True if user has permission, false if not
 - `this.canSet (permission, rank)` - Checks if the user has permission to use `set` command
 - `this.hasRank (user, rank, room)` - Similar to `isRoomRanked` but more general
 - `this.getRoom (room)` - Get a room object or null (if the bot is not in that room)
 - `this.getRoomUsers (room)` - Get an array of users who are in a room or null (if the bot is not in that room)
 - `this.getUser (user, room)` - Get an user object or null (if the user or the bot are not in that room)
 - `this.language` - Current room language
 - `this.trad (textId)` - Returns a text from the corresponding languages file
 - `this.parse (cmd)` - Parse a message (to call other commands)

Features
------------

Bot features are complex modules hat fulfill secondary functions, located in the folder `features`. Each feature is a folder that must have an `index.js` main file. That file will be required of bot start and should have the following minimum structure:
```js
exports.id = 'featureid';
exports.desc = 'Simple Feature description';

exports.init = function () {
	//init function
};

exports.parse = function (room, message, isIntro, spl) {
	//data parse
};
```

Features must have and **unique id** and two essential functions:

 - **init** - Is called on connection to server, to delete residual data or start/restart feature timeouts.
 - **parse** - It will receive all server messages, already separated in lines, each parse call is a new line received.
Pokemon Showdown Bot for Node
====================

[![Build Status](https://travis-ci.org/Ecuacion/Pokemon-Showdown-Node-Bot.svg)](https://travis-ci.org/Ecuacion/Pokemon-Showdown-Node-Bot)
[![Dependency Status](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot.svg)](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot)
[![devDependency Status](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot/dev-status.svg)](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot#info=devDependencies)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://opensource.org/licenses/MIT)

This is a [Pokemon Showdown](https://github.com/Zarel/Pokemon-Showdown) bot written in JavaScript for [Node](http://nodejs.org/), based on [Pokemon Showdown Bot](https://github.com/TalkTakesTime/Pokemon-Showdown-Bot). 

This bot is based on commands and features, which are explained below. This is intended to ease bot configuration and customization, separating commands in multiple files, multiple features in different folders and merging functions in Global Objects like Bot, CommandParser or Settings.

Installation
------------

Pokémon Showdown Bot requires [node.js](http://nodejs.org/) to run. Install the last stable version if you do not have it.

The first step is cloning this repo, install [Git](https://git-scm.com/) if you have not it and use the following command on shell console:
```
$ git clone --branch=master git://github.com/Ecuacion/Pokemon-Showdown-Node-Bot.git Pokemon-Showdown-Node-Bot
```
You can also download a Zip of this repo and decompress it.

Then open a shell console, use `cd` to reach the directory of the bot and install dependencies:
```
$ npm install
```

Now, to start the bot use `node index.js`

To configure the bot, copy `config-example.js` to `config.js` and edit that file. You can specify bot login credentials among other things. If you don't specify credentials, the bot will log in a random username started by 'Bot'.

**NOTE:** If you don't know about `server`, `port` or `serverid` parameters you can run `node serverconfig.js` to set them.

Configuration
------------

Once copied `config.js` from `config-example.js` you can edit config options to customize the bot.

**Connection Details**
 - `Config.server`: Server url, for example main server url is `sim.smogon.com`
 - `Config.port`: Connection port, Pokemon Showdown default port is `8000`
 - `Config.serverid`: Server id, main server id is `showdown` for example
 - `Config.autoReconnectDelay`: If connection gets closed, how much time it is waiting before reconnect
 - `Config.connectionTimeout`: If connection hang up, the time to check for reconnect

**Login Details**
 - `Config.nick`: Bot Nickname, if you don't specify a nickname, it will log in a random nickname
 - `Config.pass`: Password, if needed
 - `Config.autoReloginDelay`: If it can't login because of server issues, how much time it is waiting before relogin

**Rooms**
 - `Config.rooms`: Array of rooms to join after login
 - `Config.privateRooms`: Specify which rooms are private
 - `Config.initCmds`: Array of commands to send after login

**Auth Config**
 - `Config.exceptions`: Specify rank exceptions. Use `userid: true` for full permissions
 - `Config.ranks`: Array of user groups ordered from lowest to highest auth

**Commands Config**
 - `Config.commandChar`: Command character. For example: `.` means `.command` usage
 - `Config.defaultPermission`: Default permision set for `this.can` in commands permissions
 - `Config.permissionExceptions`: Exceptions for commands permissions

**Console Config**
 - `Config.debug`: Specify which console messages are shown

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

Commands have 4 argumenents:
 - **arg**: Command argument when you use for example `command [argument]`
 - **by**: User who executed the command
 - **room**: Room where the command has been executed
 - **cmd**: Original command before refrerences. For example if you use `altcommand1`, cmd is `altcommand1` but the function correspond to `command1`

Also, command hace a context:
 - `this.reply (pm)` - Replies in the same room (chat or pm)
 - `this.pmReply (text)` - Replies by pm
 - `this.restrictReply (text, permission)` - Replies by chat if user has permission, by pm otherwise
 - `this.say (room, text)` - Say something to other room
 - `this.isRanked (rank)` - True if ranked equal or above, false if not
 - `this.botRanked (rank)` - True if the bot has this rank or above, false if not
 - `this.isExcepted` - True if the user is excepted, false if not
 - `this.roomType` - Can be 'chat', 'battle' or 'pm'
 - `this.can (permission)` - True if user has permission, false if not
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


Credits
-----------

 - [Ecuacion](https://github.com/Ecuacion/) (Owner)
 
Part of this code is imported from other developments, so credits to:
		
 - Quinella, [Morfent](https://github.com/Morfent) and [TalkTakesTime](https://github.com/TalkTakesTime) developers of [Pokemon-Showdown-Bot](https://github.com/TalkTakesTime/Pokemon-Showdown-Bot)
 - [Guangcong Luo](https://github.com/Zarel) and other contributors of [Pokemon Showdown](https://github.com/Zarel/Pokemon-Showdown)
 

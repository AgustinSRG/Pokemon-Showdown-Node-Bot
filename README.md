Pokemon Showdown Bot for Node
====================

[![Build Status](https://travis-ci.org/Ecuacion/Pokemon-Showdown-Node-Bot.svg)](https://travis-ci.org/Ecuacion/Pokemon-Showdown-Node-Bot)
[![Dependency Status](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot.svg)](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot)
[![devDependency Status](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot/dev-status.svg)](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot#info=devDependencies)
[![Version](https://img.shields.io/badge/version-0.7.2-orange.svg)](https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot#pokemon-showdown-bot-for-node)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://opensource.org/licenses/MIT)

This is a [Pokemon Showdown](https://github.com/Zarel/Pokemon-Showdown) bot written in JavaScript for [Node](http://nodejs.org/)

This bot is based on commands and features, which are explained [here](https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot/blob/master/DEVELOPMENT.md). This is intended to ease bot configuration and customization, separating commands in multiple files, multiple features in different folders and merging functions in Global Objects like Bot, CommandParser or Settings. This bot also works in multiple languages at the same time, useful for language rooms.

Features included in this package:
 - **Base:** Basic commands for getting basic information, manage command permissions, languages and dynamic commands (only-text commands useful for giving information).
 - **Chat-Plugins:** This includes a customizable database of jokes and quotes, pokemon informational commands, smogon-related commands and others like regdate or translate (to translate pokemon stuff into different languages).
 - **Moderation:** Automated chat moderation for infractions like spam, flood, caps, stretching, etc  This also includes a blacklist and welcome messages called join-phrases.
 - **Battle:** Automated battle bot for challenges, ladder and tournaments. This also includes teams management commands. Note that this is not an artificial intelligence, so it can't learn stuff and is usually easy to win it.
 - **Chat Logger:** Stores logs of chat rooms and/or pms. This also includes an optional logs server.
 - **Tournaments:** A single command for creating, starting and set auto-dq of a tournament automatically. This also includes an optional tournaments leaderboards system.
 - **Games:** A collection of chat games for your Pokemon Showdown Bot
 - **Auto Invite:** Automatically sends '/invite [room]' to room auth of a private room when they joins other room with a relation. For example if you have a secondary staff room and you want to get invited when you join lobby.
 - **Youtube link recognition:** If this feature is enabled in a room, when an user sends a youtube link, the bot sends a message with the title of the video.
 - **Group Chats:** Some tools for group chats (temporal rooms) such as automated joining and automated roomauth promotion.
 

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
$ npm install --production
```
If you want to use `npm test` for developement, install all dependencies with `npm install`

To configure your bot, copy `config-example.js` to `config.js` and edit that file. You can specify bot login credentials among other things. If you don't specify credentials, the bot will log in a random username started by 'Bot'. Read the [Configuration Guide](https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot/blob/master/CONFIGGUIDE.md) for more information

Now, to start the bot use:
```
$ node bot
```

if you have an old version of `Pokemon Showdown Node Bot` and you want to update it, you can use: 
```
git pull https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot.git
```
Don't forget to use `npm install --production` after each update to re-install the outdated dependencies.

Configuration
------------

Check the [configuration guide](https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot/blob/master/CONFIGGUIDE.md) for more information.

**Connection Details**
 - `Config.server`: Server url, for example main server url is `sim.smogon.com`
 - `Config.port`: Connection port, Pokemon Showdown default port is `8000`
 - `Config.serverid`: Server id, main server id is `showdown` for example
 - `Config.autoReconnectDelay`: If connection gets closed, how much time it is waiting before reconnect
 - `Config.connectionTimeout`: If connection hang up, the time to check for reconnect

**Crashguard**
 - `Config.crashguard`: If true, write errors to console instead of crashing

**Watchconfig**
 - `Config.watchconfig`: If true, config.js is automatically reloaded when it is changed

**Login Details**
 - `Config.nick`: Bot Nickname, if you don't specify a nickname, it will log in a random nickname
 - `Config.pass`: Password, if needed
 - `Config.autoReloginDelay`: If it can't login because of server issues, how much time it is waiting before relogin

**Rooms**
 - `Config.rooms`: Array of rooms to join after login. You can specify a string value: `all` for joining all rooms, `official` for official rooms and `public` for not official rooms 
 - `Config.privateRooms`: Specify which rooms are private
 - `Config.initCmds`: Array of commands to send after login

**Auth Config**
 - `Config.exceptions`: Specify rank exceptions. Use `userid: true` for full permissions
 - `Config.ranks`: Array of user groups ordered from lowest to highest auth
 - `Config.globalPermissions`: Global permissions that cannot be changed with `set`

**Commands Config**
 - `Config.commandTokens`: Array of valid command characters. A command character, for example, `.` means `.command` usage
 - `Config.defaultPermission`: Default permision set for `this.can` in commands permissions
 - `Config.permissionExceptions`: Exceptions for commands permissions
 - `Config.botguide`: Bot commands guide link
 - `Config.pmhelp`: Help message said when users pm the bot with no commands
 - `Config.ignoreRooms:` Room that will be ignored by CommandParser you you can use commands on those rooms. For example if you want to log the room without interfering with other bots commands. 

**Language Config**
 - `Config.language`: Set default language

**Console Config**
 - `Config.debug`: Specify which console messages are shown

Credits
-----------

 - [Ecuacion](https://github.com/Ecuacion/) (Owner)
 
Contributors:

 - [Freigeist](https://github.com/Freigeist) (Languages/Translation feature and bug fixes)
 - [Irraquated](https://github.com/Irraquated) (Languages and bug fixes)
 - [panpawn](https://github.com/panpawn) (YouTube feature, fixes)
 - [Spudling](https://github.com/Spudling) (German translation)

Part of this code is imported from other developments, so credits to:
		
 - Quinella, [Morfent](https://github.com/Morfent) and [TalkTakesTime](https://github.com/TalkTakesTime) developers of [Pokemon-Showdown-Bot](https://github.com/TalkTakesTime/Pokemon-Showdown-Bot)
 - [Guangcong Luo](https://github.com/Zarel) and other contributors of [Pokemon Showdown](https://github.com/Zarel/Pokemon-Showdown)

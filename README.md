Pokemon Showdown Bot for Node
====================

[![Build Status](https://travis-ci.org/Ecuacion/Pokemon-Showdown-Node-Bot.svg)](https://travis-ci.org/Ecuacion/Pokemon-Showdown-Node-Bot)
[![Dependency Status](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot.svg)](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot)
[![devDependency Status](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot/dev-status.svg)](https://david-dm.org/Ecuacion/Pokemon-Showdown-Node-Bot#info=devDependencies)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://opensource.org/licenses/MIT)

This is a [Pokemon Showdown](https://github.com/Zarel/Pokemon-Showdown) bot written in JavaScript for [Node](http://nodejs.org/), based on [Pokemon Showdown Bot](https://github.com/TalkTakesTime/Pokemon-Showdown-Bot). 

This bot is based on commands and features, which are explained [here](https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot/blob/master/DEVELOPMENT.md). This is intended to ease bot configuration and customization, separating commands in multiple files, multiple features in different folders and merging functions in Global Objects like Bot, CommandParser or Settings. This bot also works in multiple languages at the same time, useful for language rooms.

[![Version](https://img.shields.io/badge/version-0.1.5--beta-blue.svg)](https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot#pokemon-showdown-bot-for-node)

Features included in this package:
 - **Base:** Basic commands for getting basic information, manage command permissions, languages and dynamic commands (only-text commands useful for giving information).
 - **Chat-Plugins:** This includes a customizable 'quote' command, random answer and pokemon informational commands.
 - **Moderation:** Automated chat moderation for infractions like spam, flood, caps, stretching, etc  This also includes a blacklist and welcome messages called join-phrases.
 - **Battle:** Automated battle bot for challenges, ladder and tournaments. This also includes teams management commands. Note that this is not an artificial intelligence, just an improvised algorithm that simulates in-game players (just for fun).
 - **Chat Logger:** Stores logs of chat rooms and/or pms. This also includes an optional logs server.
 - **Tournaments:** A single command for creating, starting and set auto-dq of a tournament automatically.
 - **Games:** A collection of chat games for your Pokemon Showdown Bot
 - **Auto Invite:** Automatically sends '/invite [room]' to room auth of a private room when they joins other room with a relation. For example if you have a secondary staff room and you want to get invited when you join lobby.
 - **Youtube link recognition:** If this feature is enabled in a room, when an user send a youtube link, the bot send a message with the title of the video.
 - **Group Chats:** Some tools for group chats (temporal rooms) suth as automated joining and automated roomauth promotion.
 

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
If you want to use `Gulp` test, install all dependencies with `npm install`

Now, to start the bot use:
```
$ node index.js
```

To configure your bot, copy `config-example.js` to `config.js` and edit that file. You can specify bot login credentials among other things. If you don't specify credentials, the bot will log in a random username started by 'Bot'. Read the [Configuration Guide](https://gist.github.com/Ecuacion/351a0a467bc5b057e86f) for more information

Keeping your bot updated
------------

If you know all about [Git](https://git-scm.com/book/en/v1/Getting-Started) you don't need to read this. This is just for people who want to make changes in their bots, but still want to keep them updated regarding this repo.

First, fork this repo. You can do it with the button `Fork`

Second, clone your repo in your computer, you can do it with GitHub desktop Client for [Windows](https://windows.github.com/) or [Mac](https://mac.github.com/) or with a shell console:
```
$ git clone <your own fork> <My-Bot-Example-Folder>
```

Third, create a remote to get the updates (first use `cd` to reach the directory of your bot):
```
$ git remote add upstream https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot.git
```

Now, you can make changes, and commit them.

When you want to update, you can follow these steps:
 - Open a shell console and use `cd` to reach the directory of your bot
 - If you have uncommited changes use `git add --all` and `git commit -m "Your commit message"`
 - Use `git fetch upstream` to update your base version of Pokemon-Showdown-Node-Bot
 - Use `git checkout master` an then `git merge remotes/upstream/master`
 - If you get conflicts, solve them and use `git commit -a`
 - Once merged, your bot is updated

Configuration
------------

Once copied `config.js` from `config-example.js` you can edit config options to customize the bot.

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
 

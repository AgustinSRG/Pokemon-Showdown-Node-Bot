Pokemon Showdown Node Bot - Configuration Guide
====================

This guide is a explanation of how to configure [Pokemon-Showdown-Node-Bot](https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot) once installed.

First of all, copy `config-example.js` to `config.js`

**NOTE:** You can use `node bot-setup.js` to configure the fundamental values without editing / copying the file.

Server configuration
------------

You must choose the Pokemon Showdown server to use. There are 3 options:
 - You might want to use [Smogon Official Server (Main Server)](http://play.pokemonshowdown.com/). In that case use these parameters:
```js
exports.server = 'sim.psim.us';

exports.port = 8000;

exports.serverid = 'showdown';
```
 - Maybe you want to use a [Registered Server](http://pokemonshowdown.com/servers/), then open a shell console, use cd to reach the directory of your bot and run `node getserver.js` to get the **server**, **port** and **serverid** paramenters.
 - Or, you want to use an unregistered server, then you must edit manually the parameters.


Crash Guard
------------

Keep `exports.crashguard = true;`. If this is enabled, the bot will never exit because of an error. Instead it will report the error to the console.

Watch Config
------------

Keep `exports.watchconfig = true;` if you want `config.js` to be automatically reloaded on changes (recommended)

Login Deatails
------------

Choose Bot's nickname and, if it is registered, specify the password. If you do not specify a nickname or the password is wrong, the bot will log in a random username started by `bot`

Example:
```js
exports.nick = 'Example Bot name';

exports.pass = 'ExamplePassword';
```

Rooms
------------

Choose the rooms to join after bot log in. You have 4 options:
 - Join some rooms (recomended)
```js
exports.rooms = ['room1', 'room2', 'room3'];
```
 - Join all public rooms
```js
exports.rooms = 'public';
```
 - Join all official rooms
```js
exports.rooms = 'official';
```
 - Join all rooms (official and public rooms)
```js
exports.rooms = 'all';
```

You can use `exports.initCmds` to send other commands to the server after joining the rooms. For example setting the bot avatar, blocking challenges or anything else.

Auth Configuration (Important)
------------

Giving yourself full access is a crucial step, because only if you have full access you can access all bot commands without rank restriction.
To do this, in `exports.exceptions` you must add your user id (Your PS name without any character except numbers and lowercase letters), like in this example:
```js
exports.exceptions = {
	'ecuacion': true,
	'excepteduser': true
};
```

If the Pokemon Showdown server for your bot has custom ranks, edit `exports.ranks` adding them. If a symbol is not in that array, it is interpreted as regular user.

Edit `exports.globalPermissions` if the server has custom symbols for basic groups (Administrator, Room Owner, Moderator, Driver, Voice)

Commands configuration
------------

`exports.commandTokens` is an array of possible command tokens. Example: if `.` is a command token you can use a bot command with `.command`.

`exports.defaultPermission` is the default rank for configurable commands permissions.

You can configure that permissions adding exceptions for each command in `exports.permissionExceptions`

You can use a custom botguide (for `guide` command) editting `exports.botguide` option

When you pm the bot but don't use a command, it replies you the string `exports.pmhelp`, useful for moderation bots because the users may not know that it's a bot. Example:
```js
exports.pmhelp = "Hi, I'm a bot. Use .help to view a command guide. Contact other staff member for any request";
```

Language
------------

You can change bot language changing `exports.language`. Note that the language folder in `./languages/` must exist.

Configuration for console messages
------------

With `exports.debug` you can choose which console messages are shown and which are not.
```js
exports.debug = {
	/* Basic messages - Production Mode */
	error: true,
	ok: true,
	errlog: true,
	info: true,
	room: true,

	/* Monitoring */
	monitor: false,
	battle: false,
	status: false,

	/* Debug Mode */
	debug: false,
	cmdr: false,

	/* Low Level */
	recv: false,
	sent: false
};
```

Moderation (Optional)
------------

With `exports.moderation` you can configure the moderation feature
- **modException**: Choose with is the minimum rank to be excepted from bot moderation. For example if you don't want drivers being muted use '%' value.
- **allowmute**: Enable or disable automated moderation feature
- **disableModNote**: Disable `/modnote` for autoban commands
- **MOD_CONSTS**: Constants for caps, flodding and stretching
- **values**: Mod values for each infraction (corresponding to punishments levels)
- **modDefault**: Default config for moderation options. `true` or `1` to enable and `false` or `0` to disable them.
- **punishments**: Array of punishments commands, for example `warn`, `mute`, `hourmute` and `roomban`.
- **psServersExcepts**: Servers ids excepted from Pokemon showdown private servers moderation. Include your server id if you are uning the bot in other server.
- **zeroToleranceLevels**: Levels for Zero Tolerance Moderation. For each one you can specify the name and the value to apply the punishment.
- **zeroToleranceDefaultLevel**: Default zero tolerance level.

Battles (Optional)
------------

`exports.aceptAll` if true, the bot will acept all battle, without limits. It is not recommended, keep it to false, so you can specify max number of battles at the same time in `exports.maxBattles`.

Specify in `exports.winmsg` all possible phrases for saying when bot wins, same with `exports.losemsg` but when bot loses, the same with `exports.initBattleMsg` but when the bot joins the battle. You can also specify other messages in `exports.battleMessages`.

Set `exports.abandonedBattleAutojoin = true;` if you want to store battle ids in a JSON file to rejoin them in case of crash or forced restart.

Configure the ladder feature with `exports.ladderCheckInterval` (the time to check for battles) and `exports.ladderNumberOfBattles` (Max number of ladder battles at the same time when you use `ladderstart` command).

**Important!** You can configure format aliases in `exports.formatAliases` for all battle and tournaments commands.

Tournaments (Optional)
------------

You can specify tournament values by default, so if you don't specify them in `tour` command, it will be taken from this values.

```js
exports.tourDefault = {
	format: 'ou',
	type: 'elimination',
	maxUsers: null,
	timeToStart: 30 * 1000,
	autodq: 1.5
};
```

Optionally you can enable the leaderboards system for one or more rooms.

```js
exports.leaderboards['tournaments'] = {
	winnerPoints: 5,
	finalistPoints: 3,
	semiFinalistPoints: 1,
	battlePoints: 0,
	onlyOfficial: true // If true, only official tours (must use .official command) will be counted
};
```

Youtube (Optional)
------------

Simply you can enable or disable it by default:

Enabled in all rooms by default:
```js
exports.youtube = {
	enableByDefault: true
};
```

Disabled by default (use `youtube` command to enable it in a single room):
```js
exports.youtube = {
	enableByDefault: false
};
```

Chat Logger (Optional)
------------

This feature take logs from chat rooms and store them in `./logs/` path. You can configure it in `exports.chatLogger`:
 - **rooms**: Array of rooms to be logged. Note thet if you want to logs pms, add `pm` room. Also if you want to log global messages add `lobby` room.
 - **ignore**: Select what kind of messages should be ignored. For example tournamets updates, query responses or similar messages.
 - **logIntroMessages**: When you join a room in Pokemon Showdown, you receive a log and the roomintro. Choose if you want to log this.
 - **ageOfLogs**: Servers have limits, so log age may also has limits. Use `0` value to keep logs infinitely.

Example:
```js
exports.chatLogger = {
	rooms: [],
	ignore: {'tournament': ['update', 'updateEnd'], 'formats': true, 'challstr': true, 'updateuser': true, 'queryresponse': true},
	logIntroMessages: true,
	ageOfLogs: 7 //in days (max age of logs, 0 to keep logs infinitely)
};
```

Auto-Invite (Optional)
------------

This feature is rarely useful, just an example:
```js
exports.autoInvite = [
	{linked: 'lobby', private: 'adminsroom', rank: '#'}
];
```
In this example, in a server there is a private room with modjoin called `Admins Room` where all admins are room owners. With that feature if the bot is in both rooms, when an admin join lobby, it is automatically invited to Admins Room.

GoupChats (Optional)
------------

You can use this feature to set events (arrays of commands to be sent on certain circunstances). For example:

```js
exports.groupchats['groupchat-ecuacion-test'] = {
	toJoin: ['/join groupchat-ecuacion-test'],
	onJoin: ['Hi guys!'],
	onLeave: []
};
```

**toJoin:** This is sent every 60 seconds if the bot is not in the room. You can use it to create a groupchat with `/makegroupchat` or joining an existing one after it expires.

**onJoin:** This is sent when the bot joins the room. For example for setting the modchat, roomintro, etc or just a greeting.

**toJoin:** This is sent when the bot leaves the room. For example for recreating the groupchat after it expires.

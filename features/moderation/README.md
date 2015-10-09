Pokemon Showdown Bot - Moderation Feature
====================

This feature deals with caps, stretching, flooding, spam and other usual infractions. Note that the bot can't think, so it will probably make mistakes. Also, this feature has Join Phrases, which consists of a kind of greeting that the bot says when an user joins a room.

Moderation Commands
------------

**Mod Settings:** Use `mod (room - optional), [moderation], [on/off]` to enable or disable moderations.

**Moderation Exception:** Use `modex [rank/all]` to change moderation exception for a room.

**Autoban**
 - `ab [user], [user]...` - Add users to blacklist
 - `unab [user], [user]...` - Remove users from blacklist
 - `rab [regex]` - Regex ban
 - `unrab [regex]` - Remove a regex ban
 - `vab` - View blacklist

**Zero Tolerance**
 - `0tol [user]` - Checks if an user is in the zero tolerance list
 - `0tol add, [user1]:[level1], [user2]:[level2]...` - Add users to zero tolerance list
 - `0tol delete, [user1], [user2]...` - Removeusers from zero tolerance list
 - `vzt` - Upload zero tolerance list to hastebin

**Banwords and InapropiateWords:** Saying this words means automute. InapropiateWords requires that words are separated.
 - `banword [phrase]` - Add a banword
 - `unbanword [phrase]` - Remove a banword
 - `vbw` - View banword list
 - `inapword [phrase]` - Add an inapropiate word
 - `uninapword [phrase]` - Remove an inapropiate word
 - `viw` - View inapropiate words list

**Joinphrases:** Configure what phrase Bot says when certain user joins a room. This can be spammable, much caution!
 - `joinphrase [enable/disable]` - Enable or disable joinphrases for a room
 - `joinphrase set, [user], [phrase]` - Set a joinphrase
 - `joinphrase delete, [user]` - Remove a joinphrase
 - `vjf` - View joinphrases list
 
**Note:** Excepted users can use moderation commands in format `command [roomid]Arguments` to set moderation through PM or other room. Example: `ab [lobby]spammer1, spammer2`

Configuration
------------

 - `modException`- Minimum rank to avoid bot moderation
 - `allowmute` - Enable or disable moderation
 - `disableModNote` - True for disabling the modnote on autoban command
 - `values` - Moderation values, correspoding to punishments
 - `MOD_CONSTS` - Constants for flood, caps and stretching
 - `modDefault` - Default config for moderation (0 to disable, 1 to enable)
 - `punishments` - Punishments list (warn, mute, hormute, roomban)
 - `zeroToleranceDefaultLevel` - Default level for Zero Tolerance feature
 - `zeroToleranceLevels` - Levels for Zero Tolerance feature

```js
exports.moderation = {
	modException: '%', // Min rank for not receive moderation

	allowmute: true,
	disableModNote: false,

	values: {
		'spam-p': 3,
		'spam': 4,
		'spam-link': 4,
		'flood-hard': 3,
		'flood': 2,
		'caps': 1,
		'stretch': 1,
		'banwords': 2,
		'inapwords': 2,
		'servers': 2,
		'youtube': 2,
		'spoiler': 2
	},

	MOD_CONSTS: {
		FLOOD_MESSAGE_NUM: 5,
		FLOOD_PER_MSG_MIN: 500, // this is the minimum time between messages for legitimate spam. It's used to determine what "flooding" is caused by lag
		FLOOD_MESSAGE_TIME: 6 * 1000,

		MIN_CAPS_LENGTH: 18,
		MIN_CAPS_PROPORTION: 0.8,

		MAX_STRETCH: 7,
		MAX_REPEAT: 4
	},

	modDefault: {
		//basic mods
		'caps': 1,
		'stretching': 1,
		'flooding': 1,
		'spam': 1,

		'bannedwords': 1,
		'inapropiate': 1,

		//specific mods
		'spoiler': 0,
		'youtube': 0,
		'psservers': 1,

		//multiple infraction
		'multiple': 1,

		//zero tolerance
		'zerotol': 1
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
	},

	zeroToleranceDefaultLevel: 'h',
	zeroToleranceLevels: {
		'l': {name: 'Low', value: 1},
		'n': {name: 'Normal', value: 2},
		'h': {name: 'High', value: 3}
	}
};
```

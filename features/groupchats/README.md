Groupchats feature
====================

This feature is optional, to deal with Group Chats (temporal rooms that must be created with a command). Anyway this feature works for all rooms, so you can use it with regular chat rooms if you want.

You can configure 2 things with this feature: Events (arrays of commands to be sent on room joining, on leaving the room or regularly, to join the room) and Room Auth (to roompromote automatically).

**Commands (development)**
 - `ignoregroupchat [groupchat]` - temporarily ignore a groupchat (to leave a groupchat). Then you must edit the config to make it permanent
 - `unignoregroupchat [groupchat]` - unignore a groupchat

**Configuration Example** (in `config.js`)
 - `Config.groupChatTryJoinInterval` - Time interval for sending `toJoin` commands.
 - `Config.groupchats['groupchat-id'].toJoin` - Commands to join the room or create the groupchat (they will be sent regularly is the bot is not in the groupchat.
 - `Config.groupchats['groupchat-id'].onJoin` - Commmands that will be sent on room joining.
 - `Config.groupchats['groupchat-id'].onLeave` - Commmands that will be sent on room leaving or expiring.
 - `Config.groupchats['groupchat-id'].roomAuth` - Group chat roomauth to be roompromoted automatically if they don't have the rank or higher. You can specify for each group names or regular expresions (for example `/^.*$/` for all users). Note that if the bot is not room owner, it won't be able to promote to room driver or room moderator.

**NOTE:** Commands must start with `/`, not with `|/` like in `Config.initCmds`, the separator is automatically added.

```js
exports.groupchats = {};

exports.groupChatTryJoinInterval = 60 * 1000;

exports.groupchats['groupchat-ecuacion-test'] = {
	toJoin: ['/join groupchat-ecuacion-test'],
	onJoin: ['Hi guys!'],
	onLeave: [],
	roomAuth: {
		'%': ['exampledriver1', 'exampledriver1'],
		'+': [/^.*$/]
	}
};
```

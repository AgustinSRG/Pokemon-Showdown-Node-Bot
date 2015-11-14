Groupchats feature
====================

This feature is optional, to deal with Group Chats (temporal rooms that must be created with a command). Anyway this feature works for all rooms, so you can use it with regular chat rooms if you want.

You can configure some events: Arrays of commands to be sent on room joining, on leaving the room or regularly, to join the room

 - `Config.groupChatTryJoinInterval` - Time interval for sending `toJoin` commands.
 - `Config.groupchats['groupchat-id'].toJoin` - Commands to join the room or create the groupchat (they will be sent regularly is the bot is not in the groupchat.
 - `Config.groupchats['groupchat-id'].onJoin` - Commmands that will be sent on room joining.
 - `Config.groupchats['groupchat-id'].onLeave` - Commmands that will be sent on room leaving or expiring.

**NOTE:** Commands must start with `/`, not with `|/` like in `Config.initCmds`, the separator is automatically added.

```js
exports.groupchats = {};

exports.groupChatTryJoinInterval = 60 * 1000;

exports.groupchats['groupchat-ecuacion-test'] = {
	toJoin: ['/join groupchat-ecuacion-test'],
	onJoin: ['Hi guys!'],
	onLeave: []
};
```

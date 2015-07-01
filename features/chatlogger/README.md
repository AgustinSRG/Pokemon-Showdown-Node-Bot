Chat logger feature
====================

This feature stores logs of Pokemon Showdown chat rooms, storing them in `./logs/` path. Logs have the same format as received from Pokemon Showdown server.

**Configuration** (in `config.js`):
 - `rooms` - Array of rooms to log
 - `ignore` - What kind of messages should be ignored? For example tournaments updates and query responses
 - `logIntroMessages` - Log roomintros, intro-logs, initial messages?
 - `ageOfLogs` - Max age of logs before being removed (in days)

```js
/*
* Chat Logger
*/

exports.chatLogger = {
	rooms: [],
	ignore: {'tournament': ['update', 'updateEnd'], 'formats': true, 'challstr': true, 'updateuser': true, 'queryresponse': true},
	logIntroMessages: true,
	ageOfLogs: 7 //in days (max age of logs, 0 to keep logs infinitely)
};
```

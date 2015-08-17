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

**Logs Server**: Simple html servers for an easy access to chat logs.
 - `port` - Server listening port 
 - `rooms` - Add chatrooms whose logs can be requested, set private attribute if you want that only a few users can access room logs. 
 - `users` - Add users credential in order to accessing private logs (useful for staff)
 
```js
exports.logServer = {
	port: 5400,
	bindaddress: null,
	users: {
		'admin': {
			name: 'Administrator',
			pass: 'password',
			access: {'room1': 1, 'room2': 1}
		}
	},
	rooms: {
		'room1': {private: true},
		'room2': {private: true}
	}
};
```

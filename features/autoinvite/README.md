Auto-Invite feature
====================

This feature is optional and usually unnecessary. It's developed for an specific aim, so keep it disabled unless you want to use it.

**Commands (development)**
 - `reloadroomauth [room]` - reload room auth and store it
 - `getroomauth` - upload room auth object to hastebin
 - `useroomauth` - Use room auth as Config.excepts temporarily ('true', '~' and '&' are not replaced)

**Configuration** (in `config.js`): Array of autoinvite configurations
 - `private` - Private room to check for room auth 
 - `linked` - Public room. When an user with room auth in the private room joins it, the bot send an /invite to him/her. 
 - `rank` - minimum room rank (in the private room) to receive the /invite

```js
/*
* Auto-Invite
*/

exports.autoInvite = [
	//{linked: 'public room linked', private: 'private room', rank: '+'}
];
```

Tournaments feature
====================

This feature allows Bot to create and start tournaments. Basically it's a support for the `tour` command

**Configuration for this feature** (in `config.js`): Configure your default values for a tournament. If you don't specify some arguments when use `tour` command, they will get these default values

```js
/*
* Tournaments
*/

exports.tourDefault = {
	format: 'ou',
	type: 'elimination',
	maxUsers: null,
	timeToStart: 30 * 1000,
	autodq: 1.5
};
```

This feature also includes a leaderboards system. You can enable it for a room adding in `config.js` the following:

```js
exports.leaderboards['Room Id here'] = {
	winnerPoints: 5,
	finalistPoints: 3,
	semiFinalistPoints: 1,
	battlePoints: 0,
	onlyOfficial: true // If true, only official tours (must use .official command) will be counted
};
```

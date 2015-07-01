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

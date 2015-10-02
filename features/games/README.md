Games
====================

A collection of games for Pokemon Showdown! chat rooms. 

 - **Poke-Hangman** - Simplified hangman game with pokemon, moves, abilities, items and natures randomly chosen.
 - **Poke-Anagrams** - Random and pokemon-related disordered words to reorder.

In order to add new games: create a module with **id**, **title**, **aliases** and **commands** properties and **newGame(room, options)** method.

Then add the file to `gamesList` in games `index.js`

Example:
```js
exports.id = 'pokehangman';

exports.title = 'Poke-Hangman';

exports.aliases = ['ph', 'pokehang', 'pokemonhangman'];

exports.newGame = function (room, opts) {
	/*	Generator related code
		...
		...
		...
	*/
};

exports.commands = {
	guess: 'g',
	g: function (arg, by, room, cmd, game) {
		game.guess(by.substr(1), arg);
	},
	v: 'view',
	view: function (arg, by, room, cmd, game) {
		this.restrictReply("**Poke-Hangman:** " + generateHang(game.status) + " | **" + game.clue + "** | " + game.said.sort().join(' '), 'games');
	},
	end: 'endhangman',
	endhangman: function (arg, by, room, cmd, game) {
		if (!this.can('games')) return;
		game.end();
	}
};

```

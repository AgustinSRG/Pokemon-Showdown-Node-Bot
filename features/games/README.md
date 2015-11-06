Games
====================

A collection of games for Pokemon Showdown! chat rooms. 

 - **Hangman** - Simplified hangman game.
 - **Anagrams** - Random and disordered words to reorder.
 - **Poke-Hangman** - Simplified hangman game with pokemon, moves, abilities, items and natures randomly chosen.
 - **Poke-Anagrams** - Random and pokemon-related disordered words to reorder.
 - **Trivia** - Classic game of questions and answers
 - **BlackJack** - Cards game. You play against dealer, your goal is to get a value higher than the dealer but less or equal to 21.
 - **Kunc** - A game from IRC. Guess the pokemon given the moveset.
 - **Ambush** - A shooting game where there can only be one winner
 - **Pass-The-Bomb** - Pass the bomb until it explodes

Hangaman and Anagrams data: `/data/games-words.js`
Kunc data: `/data/kunc-sets.js`
Trivia data: `/data/trivia-data.js`

Development
------------

In order to add new games: create a module with **id**, **title**, **aliases** and **commands** properties and **newGame(room, options)** method. newGame should return an object with a method called **init**, which is called when the game is created.

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

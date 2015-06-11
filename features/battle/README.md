Pokemon Showdown Bot - Automated Battle Feature
====================

First of all, this feature is not an artificial intelligence, is not developed to win all battles or learn and improve game playing. The objective of this feature is entertainment, just a Battle Bot like in-game characters, so its game is also random.

This feature handle with challenges, tournaments and ladder. Once in a battle, it also make random decisions discarting useless moves (with the default modules, now there is only for ORAS singles).


Bot teams
------------

You can give teams to your Bot editing the file `teams.js` adding teams in 3 different avaliable formats.

**Teams.js structure**
```js
exports.teams = {
	"tier1": [
			  'packed team',
			  [unpacked team],
			  {random team}
			  ],
	"tier2": [
			  ]
};
```

**Packed teams:** You can get it with your bowser console and [Pokemon Showdown Client](http://play.pokemonshowdown.com/). Make a challenge and you will get the packed team by console log.
```js
'Bisharp||leftovers||ironhead,knockoff,suckerpunch,swordsdance|Adamant|232,252,,,4,20|||||]Chansey||eviolite||healbell,seismictoss,softboiled,thunderwave|Bold|248,,252,,8,|||||]Venusaur-Mega||venusaurite||gigadrain,hiddenpowerfire,leechseed,synthesis|Bold|240,,224,44,,||,30,,30,,30|||]Heatran||airballoon||stealthrock,fireblast,toxic,taunt|undefined|224,,,16,48,220|||||]Skarmory||rockyhelmet|1|roost,defog,spikes,bravebird|Impish|248,,232,,,28|||||]Keldeo||leftovers||scald,secretsword,substitute,calmmind|Timid|,,,252,4,252|||||'
```

**JSON teams:** Just fill the fields of the following example
```js
[
	{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
	{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
	{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
	{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
	{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
	{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255}
]
```

**Random generators:** Add 6 or more pokemon and they will be random chosen on each use.
```js
{
	maxPokemon: 6,
	pokemon: [
		{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
		{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
		{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
		{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
		{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255},
		{name: "", species: "", item: "", ability: "", moves: ['', '', '', ''], nature: '', evs: {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0}, gender: '', ivs: {}, shiny: false, level: 100, happiness: 255}
	]
}
```

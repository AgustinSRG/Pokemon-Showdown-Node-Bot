Pokemon Showdown Bot - Automated Battle Feature
====================

This feature handle with challenges, tournaments and ladder. Once in a battle, it also make decisions based on algorithms like `ingame-nostatus` for emulate in-game players for example or `showdown-eff` to emulate linear play for singles gametype.

Battle Commands
------------

**Developing**
 - `reloadteams` - Hotpatch teams
 - `reloadbattle` - Hotpatch battle modules
 - `move` - Force a custom move

**Challeges**
 - `blockchallenges` - Block Challenges
 - `unblockchallenges` - Stop blocking challenges
 - `chall [user], [format]` - Send a challenge
 - `challme [format]` - Send a challenge to yourself

**Tournaments Joining**
 - `jointours [on/off]` - Enable or disable tour joining
 - `jointour` - Join a tournament
 - `leavetour` - Leave a tournament
 - `checktour` - Check the tournament (If the bot does not challenge or something)

**Ladder**
 - `searchbattle [format]` - Search a battle and returns the link
 - `ladderstart [format]` - Start laddering (checks every 10 seconds)
 - `ladderstop` - Stop laddering

**Teams**
 - `team add, [name], [format], [http://hastebin.com/raw/example]` - Add a team to Bot teams list
 - `team delete, [name]` - Remove a team from Bot teams list
 - `team get, [id]` - Get a team in exportable format
 - `team check, [id], (user)` - Challenge with a specific team
 - `teamslist` - Upload teams list to Hastebin to view it.

**Permissions in Battle Rooms**
 - `battlesettings [permission], [rank]` - Change permissions for battle rooms

Bot teams
------------

You can give teams to your Bot editing the file `teams.js` adding teams in 3 different avaliable formats.

**NOTE:** Also you can give team to your Bot by command `team` in PS exportable format (you can get it from teambuilder) by a Hastebin link. For example using `team add, [name], [format], [http://hastebin.com/raw/example]`. This teams are stored in `./data/teams.json`

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


Battle Modules
------------

Battle modules are scripts whose function is improve battle decision, for example discarding useless moves or using the most powerfull move.

You can create and use your own battle modules if you want. Battle modules only require two atributes:

```js
/* Battle Module Example */

exports.id = "random"; //Module id (must be unique)

exports.decide = function (battle, decisions) {
	/* Code here to decide the best decision */
	return decisions[Math.floor(Math.random() * decisions.length)]; // For example, random decision
};
```

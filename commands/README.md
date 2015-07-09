Bot Commands
====================

Bot commands are in files of this path. If you want to add more commands just add more files with the specifications mentioned in main README. Commands included in this repository are explained below.

Basic Commands
------------

Some commands are basic (info, command settings, etc) referring to basic features.

 - `about` - Basic bot info, with the link to this repo.
 - `time` - Current time for Bot
 - `uptime` - Time since the last bot restart
 - `seen [user]` - Latest data from an user
 - `say [text]` - Force to say something
 - `lang [lang]` - Set the language of the room
 - `settings [cmd], [rank]` - Configure command permissions

Dynamic Commands
------------

Dynanic commads are commands saved in a JSON, used for commands that are continuously changing, like forum links or usage stats. Commands for using, creating, modifying and deleting dynamic commands are the following:

 - `dyn [cmd]` - To call a dynamic command
 - `wall [cmd]` - To call a dynamic command (with announce / wall)
 - `temp [text]` - Set temp var, to create a command
 - `setcmd [cmd]` - Create or modify a command, with `temp` data previosly set
 - `setalias [alias], [cmd]` - Set an alias of an existent dynamic command
 - `delcmd [cmd]` - Delete a command

Developing Commands
------------

Commands for developing (some of these are dangerous)

 - `eval` or `js` - Execute arbitrary JavaScript
 - `send` - Send anything to the server
 - `custom` - Send anything to current room
 - `join [room1], [room2]...` - Join chat rooms
 - `leave` - Leave chat rooms
 - `joinrooms [official/public/all]` - Join all rooms
 - `ignore [user]` - Bot will ignore an user
 - `unignore [user]` - Stop ignoring an user
 - `reload [commands/config/features/laguages]` - Hotpatch source files
 - `updategit` - Fast forward from git repo
 - `kill` - End the process

Misc Commands
------------

Other commands for multiple features

 - `pick [option1], [option2], ...` - Choose between multiple options
 - `randomanswer` - Get a random answer
 - `usage` - Get a link to Smogon official usage stats
 - `help` - Get a link to this guide
 - `youtube [on/off]` - Enable / Disable YouTube link recognition

Pokemon Commands
------------

Commands for getting pokemon info.

 - `poke` or `randompokemon` - Get a random pokemon
 - `gen [poke]` - Get pokemon, item, etc generation
 - `viablemoves [poke]` - Get viable moves from a Pokemon
 - `heavyslam [poke], [poke]` - Get heavyslam base power
 - `priority [poke]` - Get priority moves
 - `boosting [poke]` - Get boosting moves
 - `recovery [poke]` - Get recovery moves
 - `hazards [poke]` - Get hazards moves

Moderation Commands
------------

**Mod Settings:** Use `mod (room - optional), [moderation], [on/off]` to enable or disable moderations.

**Autoban**
 - `ab [user], [user]...` - Add users to blacklist
 - `unab [user], [user]...` - Remove users from blacklist
 - `rab [regex]` - Regex ban
 - `unrab [regex]` - Remove a regex ban
 - `vab` - View blacklist

**Zero Tolerance**
 - `0tol [user]` - Checks if an user is in the zero tolerance list
 - `0tol add, [user1]:[level1], [user2]:[level2]...` - Add users to zero tolerance list
 - `0tol delete, [user1], [user2]...` - Removeusers from zero tolerance list
 - `vzt` - Upload zero tolerance list to hastebin

**Banwords and InapropiateWords:** Saying this words means automute. InapropiateWords requires that words are separated.
 - `banword [phrase]` - Add a banword
 - `unbanword [phrase]` - Remove a banword
 - `vbw` - View banword list
 - `inapword [phrase]` - Add an inapropiate word
 - `uninapword [phrase]` - Remove an inapropiate word
 - `viw` - View inapropiate words list

**Joinphrases:** Configure what phrase Bot says when certain user joins a room. This can be spammable, much caution!
 - `joinphrase [enable/disable]` - Enable or disable joinphrases for a room
 - `joinphrase set, [user], [phrase]` - Set a joinphrase
 - `joinphrase delete, [user]` - Remove a joinphrase
 - `vjf` - View joinphrases list
 
**Note:** Excepted users can use moderation commands in format `command [roomid]Arguments` to set moderation through PM or other room. Example: `ab [lobby]spammer1, spammer2`

Battle Commands
------------

Commands for battle feature

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
 - `teamslist` - Upload teams list to Hastebin to view it.

**Permissions in Battle Rooms**
 - `battlesettings [permission], [rank]` - Change permissions for battle rooms

Tournaments Commands
------------

Commands for Tournaments feature

 - `tour` - Start a tournament
 - `tourhelp` - Help for `tour command`

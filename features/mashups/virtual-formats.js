'use strict';

// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

/**@type {(FormatsData | {section: string, column?: number})[]} */
let Formats = [

	// Ex-OMs
	///////////////////////////////////////////////////////////////////
    {
        name: "[Gen 7] Inverse",
        desc: [
          "The effectiveness of each attack is inverted.",
          "&bullet; <a href=\"https://www.smogon.com/forums/threads/3590154/\">Inverse</a>",
        ],

        mod: 'gen7',
        searchShow: false,
        ruleset: ['[Gen 7] OU', 'Inverse Mod'],
        banlist: ['Hoopa-Unbound', 'Kyurem-Black', 'Serperior'],
        unbanlist: ['Aegislash', 'Dialga', 'Giratina', 'Pheromosa', 'Solgaleo', 'Lucarionite'],
    },
    {
        name: "[Gen 7] Pure Hackmons",
        ruleset: ['Pokemon', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
    },
    {
        name: "[Gen 7] Middle Cup",
        desc: [
          `Only Pok&eacute;mon that are in the middle stage of an evolutionary line are allowed.`,
          `&bullet; <a href="http://www.smogon.com/forums/threads/3588047/">Middle Cup</a>`,
        ],

        mod: 'gen7',
        maxLevel: 50,
        defaultLevel: 50,
        ruleset: ['Pokemon', 'Standard', 'Team Preview'],
        banlist: [
            // Official MC ban list
            'Combusken', 'Eviolite', 'Light Ball', 'Shadow Tag', 'Conversion',
            // Added to make mashups work
            'Uber', 'OU', 'UU', 'UUBL', 'RU', 'RUBL', 'NU', 'NUBL', 'PU', 'PUBL', 'ZU', 'NFE', 'LC Uber', 'LC',
        ],
        unbanlist: [ // Added to make mashups work
            'Electabuzz', 'Kadabra', 'Magneton', 'Porygon2', 'Doublade', 'Fraxure', 'Frogadier',
            'Gabite', 'Gurdurr', 'Monferno', 'Piloswine', 'Rhydon', 'Servine', 'Chansey', 'Croconaw', 'Haunter',
            'Gloom', 'Golbat', 'Krokorok', 'Magmar', 'Marill', 'Marshtomp', 'Prinplup', 'Roselia', 'Trumbeak',
            'Dragonair', 'Duosion', 'Dusclops', 'Hakamo-o', 'Lampent', 'Machoke', 'Metang', 'Quilladin', 'Seadra',
            'Sliggoo', 'Togetic', 'Whirlipede', 'Fletchinder', 'Grovyle', 'Herdier', 'Ivysaur', 'Klang', 'Lombre',
            'Pignite', 'Staravia', 'Swadloon', 'Vigoroth', 'Zweilous', 'Charmeleon', 'Dartrix', 'Eelektrik',
            'Graveler-Alola', 'Lairon', 'Nuzleaf', 'Palpitoad', 'Poliwhirl', 'Sealeo', 'Vibrava', 'Weepinbell',
            'Charjabug', 'Clefairy', 'Floette', 'Grotle', 'Luxio', 'Nidorina', 'Nidorino', 'Pidgeotto', 'Shelgon',
            'Steenee', 'Vanillish', 'Wartortle', 'Bayleef', 'Braixen', 'Boldore', 'Brionne', 'Dewott', 'Flaaffy',
            'Gothorita', 'Graveler', 'Jigglypuff', 'Kirlia', 'Loudred', 'Pikachu', 'Pupitar', 'Quilava', 'Skiploom',
            'Torracat', 'Tranquill', 'Cascoon', 'Cosmoem', 'Kakuna', 'Metapod', 'Silcoon', 'Spewpa',
        ],
        // We can't execute this, so banlist has been modified instead
        /*onValidateSet: function (set) {
          let template = this.getTemplate(set.species);
          if (!template.prevo) return [`${set.species} is not an evolved Pokemon.`];
          if (!template.nfe) return [`${set.species} does not have an evolution.`];
        },*/
    },
];

exports.Formats = Formats;

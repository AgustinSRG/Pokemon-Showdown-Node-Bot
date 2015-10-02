const Pokedex_File = './../../data/pokedex.js';
const Movedex_File = './../../data/moves.js';
const Abilitydex_File = './../../data/abilities.js';
const Itemdex_File = './../../data/items.js';
const FormatData_File = './../../data/formats-data.js';

var Pokedex, Movedex, Itemdex, Abilitydex, Natures;
var FormatData = {};

Pokedex = Movedex = Itemdex = Abilitydex = {};

Natures = exports.Natures = ['Adamant', 'Bashful', 'Bold', 'Brave', 'Calm', 'Careful', 'Docile', 'Gentle', 'Hardy', 'Hasty', 'Impish', 'Jolly', 'Lax', 'Lonely', 'Mild', 'Modest', 'Naive', 'Naughty', 'Quiet', 'Quirky', 'Rash', 'Relaxed', 'Sassy', 'Serious', 'Timid'];

function getData () {
	try {
		Pokedex = exports.Pokedex = require(Pokedex_File).BattlePokedex;
		Movedex = exports.Movedex = require(Movedex_File).BattleMovedex;
		Itemdex = exports.Itemdex = require(Itemdex_File).BattleItems;
		Abilitydex = exports.Abilitydex = require(Abilitydex_File).BattleAbilities;
		FormatData = exports.FormatData = require(FormatData_File).BattleFormatsData;
	} catch (e) {
		return e;
	}
}

function rand (arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

var randomPoke = exports.randomPoke = function () {
	var pokeArr = Object.keys(Pokedex);
	if (!pokeArr.length) return null;
	var pokeId = rand(pokeArr);
	var clue = '';
	var chosen = Pokedex[pokeId];
	var clueType = rand(['type', 'color', 'gen', 'tier']);
	if (clueType === 'tier' && (!FormatData[pokeId] || !FormatData[pokeId].tier)) clueType = 'type'; //Undefined tier
	switch (clueType) {
		case 'type':
			clue = rand(chosen.types) + ' type';
			break;
		case 'color':
			clue = chosen.color + ' color';
			break;
		case 'gen':
			if (chosen.formeLetter === "M") {
				clue = 'Mega-Evo';
				break;
			}
			if (chosen.baseSpecies === "Pikachu") {
				clue = 'Gen 6';
				break;
			}
			if (chosen.num < 0) clue = 'CAP';
			else if (chosen.num <= 151) clue = 'Gen 1';
			else if (chosen.num <= 251) clue = 'Gen 2';
			else if (chosen.num <= 386) clue = 'Gen 3';
			else if (chosen.num <= 493) clue = 'Gen 4';
			else if (chosen.num <= 649) clue = 'Gen 5';
			else clue = 'Gen 6';
			break;
		case 'tier':
			clue = 'Tier ' + FormatData[pokeId].tier;
			break;
	}
	return {
		word: chosen.species,
		clue: 'Pokemon, ' + clue
	};
};

var randomMove = exports.randomMove = function () {
	var moveArr = Object.keys(Movedex);
	if (!moveArr.length) return null;
	var moveId = rand(moveArr);
	var chosen = Movedex[moveId];
	var clue = '';
	var clueType = rand(['type', 'category']);
	switch (clueType) {
		case 'type':
			clue = chosen.type + ' type';
			break;
		case 'category':
			clue = chosen.category + ' category';
			break;
	}
	return {
		word: chosen.name,
		clue: 'Move, ' + clue
	};
};

var randomItem = exports.randomItem = function () {
	var itemArr = Object.keys(Itemdex);
	if (!itemArr.length) return null;
	var itemId = rand(itemArr);
	var chosen = Itemdex[itemId];
	var clue = '';
	var clueType = rand(['gen', 'type']);
	switch (clueType) {
		case 'gen':
			clue = 'Gen ' + chosen.gen;
			break;
		case 'type':
			if (chosen.isBerry) {
				clue = 'Berry';
			} else if (chosen.megaStone) {
				clue = 'Mega Stone';
			} else if (chosen.fling) {
				clue = chosen.fling.basePower + ' Fling BP';
			} else {
				clue = 'Gen ' + chosen.gen;
			}
			break;
	}
	return {
		word: chosen.name,
		clue: 'Item, ' + clue
	};
};

var randomAbility = exports.randomAbility = function () {
	var abilityArr = Object.keys(Abilitydex);
	if (!abilityArr.length) return null;
	var abilityId = rand(abilityArr);
	var chosen = Abilitydex[abilityId];
	return {
		word: chosen.name,
		clue: 'Ability'
	};
};

var randomNature = exports.randomNature = function () {
	if (!Natures.length) return null;
	return {
		word: rand(Natures),
		clue: 'Nature'
	};
};

exports.random = function () {
	if (getData()) return null;
	var res = null;
	var r = Math.random() * 100;
	if (r <= 40) {
		res = randomPoke();
	} else if (r <= 60) {
		res = randomMove();
	} else if (r <= 80) {
		res = randomItem();
	} else if (r <= 90) {
		res = randomAbility();
	} else {
		res = randomNature();
	}
	return res;
};

exports.randomNoRepeat = function (arr) {
	if (!arr) return exports.random();
	var temp;
	do {
		temp = exports.random();
	} while (arr.indexOf(temp.word) >= 0);
	return temp;
};

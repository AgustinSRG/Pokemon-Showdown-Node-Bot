/*
	Mashups Room Feature
*/

exports.id = 'mashups';
exports.desc = 'Tools to manage mashups room features';

var aliases = exports.aliases = require("./../../data/aliases.js").BattleAliases;

var FormatDetailsArray = exports.FormatDetailsArray = require('./../../data/formats.js').Formats;
var VirtualFormatDetailsArray = exports.VirtualFormatDetailsArray = require('./virtual-formats.js').Formats;

var PokedexArray = exports.PokedexArray = require('./../../data/pokedex.js').BattlePokedex;
var MovesArray = exports.MovesArray = require('./../../data/moves.js').BattleMovedex;
var AbilitiesArray = exports.AbilitiesArray = require('./../../data/abilities.js').BattleAbilities;
var ItemsArray = exports.ItemsArray = require('./../../data/items.js').BattleItems;

var TourRatioTracker = exports.TourRatioTracker = require('./tour-ratio-tracker.js');

// Save data
const mashupsDataFile = AppOptions.data + 'mashups.json';

var mashupsFFM = exports.mashupsFFM = new Settings.FlatFileManager(mashupsDataFile);

var mashupsSavedData = exports.mashupsSavedData = {};

try {
	mashupsSavedData = exports.mashupsSavedData = mashupsFFM.readObj();
} catch (e) {
	errlog(e.stack);
	error("Could not import mashups data: " + sys.inspect(e));
}

var save = exports.save = function () {
	if (!mashupsSavedData['authType']) {
		mashupsSavedData['authType'] = {};
	}
	for (var nAuthTypeItr=0; nAuthTypeItr<MashupAuthType.Count; ++nAuthTypeItr) {
		mashupsSavedData['authType'][nAuthTypeItr] = completedTourAuthTypeArray[nAuthTypeItr];
	}

	mashupsFFM.writeObj(mashupsSavedData);
};

var tourMetaData = exports.tourMetaData = {};

var completedTourAuthTypeArray = exports.completedTourAuthTypeArray = [];

var spotlightTourNameArray = exports.spotlightTourNameArray = ['[Gen7] AAA Ubers'];
var spotlightTourNameIdArray = exports.spotlightTourNameIdArray = [];
var spotlightTourNameGenericIdArray = exports.spotlightTourNameGenericIdArray = [];

var string_of_enum = exports.string_of_enum = function string_of_enum(eEnum,value) 
{
  for (var k in eEnum) if (eEnum[k] == value) return k;
  return null;
}

//#region Tier

var Tier = exports.Tier = {
	'AG':0,
	'Ubers':1,
	'OU':2,
	'UUBL':3,
	'UU':4,
	'RUBL':5,
	'RU':6,
	'NUBL':7,
	'NU':8,
	'PUBL':9,
	'PU':10,
	'ZUBL':11,
	'ZU':12,
	'LCUbers':13,
	'LC':14,

    'Count':15,

    'Undefined':-1
};
Object.freeze(Tier);

var tierDataArray = exports.tierDataArray = [
	{ name: 'Anything Goes', 	parent: Tier.Undefined, isUbers: true },
	{ name: 'Ubers', 			parent: Tier.AG, 		isUbers: true },
	{ name: 'OU', 				parent: Tier.Ubers, 	isUbers: false },
	{ name: 'UUBL', 			parent: Tier.OU, 		isUbers: false },
	{ name: 'UU', 				parent: Tier.UUBL, 		isUbers: false },
	{ name: 'RUBL', 			parent: Tier.UU, 		isUbers: false },
	{ name: 'RU', 				parent: Tier.RUBL, 		isUbers: false },
	{ name: 'NUBL', 			parent: Tier.RU, 		isUbers: false },
	{ name: 'NU', 				parent: Tier.NUBL, 		isUbers: false },
	{ name: 'PUBL', 			parent: Tier.NU, 		isUbers: false },
	{ name: 'PU', 				parent: Tier.PUBL, 		isUbers: false },
	{ name: 'ZUBL', 			parent: Tier.PU, 		isUbers: false },
	{ name: 'ZU', 				parent: Tier.ZUBL, 		isUbers: false },
	{ name: 'LCUbers', 			parent: Tier.Undefined, isUbers: true },
	{ name: 'LC', 				parent: Tier.LCUbers, 	isUbers: false },
];
Object.freeze(tierDataArray);

// This determines only if a format actually defines a tier, not what its basis tier is
// E.g. [Gen 7] Underused will be UU, but [Gen 7] Mix and Mega is Undefined, not Ubers
var determineFormatDefinitionTierId = exports.determineFormatDefinitionTierId = function (sFormatName) {
	sFormatName = toId(sFormatName);

	var sLoopTierName;
	for(nTierItr=0; nTierItr<Tier.Count; ++nTierItr) {
		//if( Tier.AG === nTierItr ) continue; // Prevent AG form counting here

		sLoopTierName = toId('gen7' + tierDataArray[nTierItr].name); // FIXME: Multi-gen support
		//monitor(`DEBUG tier comparison: ${sLoopTierName} and ${sFormatName}`);
		if(sLoopTierName !== sFormatName) continue;
		// Found matching tier
		return nTierItr;
	}

	// Not a tier definition format
	return Tier.Undefined;
}

// Gets the tier id for a tier name, including BL tiers that have no formats
var tierNameToId = exports.tierNameToId = function (sTierName) {
	sTierName = toId(sTierName);

	var sLoopTierName;
	for(nTierItr=0; nTierItr<Tier.Count; ++nTierItr) {
		//if( Tier.AG === nTierItr ) continue; // Prevent AG form counting here

		sLoopTierName = toId(tierDataArray[nTierItr].name);
		if(sLoopTierName !== sTierName) continue;
		// Found matching tier
		return nTierItr;
	}

	// Doesn't match any defined tier
	return Tier.Undefined;
}

var isFormatTierDefinition = exports.isFormatTierDefinition = function (sFormatName) {
	return (Tier.Undefined !== determineFormatDefinitionTierId(sFormatName));
}

var isABannedInTierB = exports.isABannedInTierB = function(nCheckTier, nBasisTier) {
	return (nCheckTier < nBasisTier);
}

// This actually tries to deduce a format's intrinsic tier (used for bases primarily)
// E.g. [Gen 7] Mix and Mega is Ubers
var determineFormatBasisTierId = exports.determineFormatBasisTierId = function (formatDetails) {
	if(!formatDetails || !formatDetails.name) {
		monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return Tier.Undefined;
	}

	var sFormatName = formatDetails.name;

	// Prevent misclassification of tier definition formats, which may include a higher tier format name in their rules before adding bans, etc
	var nTierAsDefinitionFormat = determineFormatBasisTierId(sFormatName);
	if(Tier.Undefined !== nTierAsDefinitionFormat) {
		return nTierAsDefinitionFormat;
	}

	// If a tier has no ruleset, we can only assume AG (maybe Undefined?)
	if(!formatDetails.ruleset) {
		return Tier.AG;
	}

	// Use ruleset to determine the basis tier
	var ruleset = formatDetails.ruleset;
	var nRuleAsTier;
	for(var nRuleItr=0; nRuleItr<formatDetails.ruleset.length; ++nRuleItr) {
		nRuleAsTier = determineFormatDefinitionTierId(ruleset[nRuleItr]);
		if(Tier.Undefined !== nRuleAsTier) {
			return nRuleAsTier;
		}
	}

	// If not relevant rules are found, we have to assume AG as a basis tier
	return Tier.AG; // FIXME: Think about this, should it be Ubers?
}

var findTierFormatDetails = exports.findTierFormatDetails = function (nTierId, nGen=c_nCurrentGen) {
	var sTierName = tierDataArray[nTierId].name;

	// Extract rules if this tier has a format
	return findFormatDetails('gen' + nGen.toString() + sTierName);
}

//#endregion

//#region GameType

var GameType = exports.GameType = {
	'Singles':0,
	'Doubles':1,
	'Triples':2,

    'Count':3,

    'Undefined':-1
};
Object.freeze(GameType);

var GameTypeDataArray = exports.GameTypeDataArray = [
	{ name: 'Singles' },
	{ name: 'Doubles' },
	{ name: 'Triples' },
];
Object.freeze(tierDataArray);

var determineFormatGameTypeId = exports.determineFormatGameTypeId = function (formatDetails) {
	if(!formatDetails || !formatDetails.name) {
		monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return GameType.Undefined;
	}

	if(!formatDetails.gameType) { // Singles metas don't seem to supply gameType in general
		return GameType.Singles;
	}

	switch(formatDetails.gameType) {
		default: // Assume anything weird is singles
		case 'singles':
			return GameType.Singles;
		case 'doubles':
			return GameType.Doubles;
		case 'triples':
			return GameType.Triples;
	}
}

//#endregion

//#region Gen

var c_nCurrentGen = exports.c_nCurrentGen = 7;

var genStripName = exports.genStripName = function(sName) {
	for (var nGen=0; nGen<=c_nCurrentGen; ++nGen) {
		sName = sName.replace('gen'+nGen.toString(), '');
		sName = sName.replace('[Gen '+nGen.toString()+'] ', '');
	}
	return String(sName);
}

var isLegalGen = exports.isLegalGen = function(nGen) {
	if(!nGen) return false;
	if(NaN === nGen) return false;

	if(nGen <= 0) return false;
	if(nGen > c_nCurrentGen) return false;

	return true;
}

var determineFormatGen = exports.determineFormatGen = function (formatDetails) {
	if(!formatDetails || !formatDetails.name) {
		monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return -1;
	}

	var sStrippedName;
	var nParsedGen;
	if(formatDetails.mod) { // Try to get gen definition by mod if possible (most reliable method as it's based on function)
		sStrippedName = formatDetails.mod.replace('gen', '');
		nParsedGen = parseInt( sStrippedName, 10 );
		if(isLegalGen(nParsedGen) ) {
			return nParsedGen;
		}
	}

	// Forced to try by name
	sStrippedName = formatDetails.name.substring(0, 6);
	sStrippedName = sStrippedName.replace('[Gen ', '');
	nParsedGen = parseInt( sStrippedName, 10 );
	if(isLegalGen(nParsedGen) ) {
		return nParsedGen;
	}

	// Assume current gen if we can't derive anything
	return c_nCurrentGen;
}

//#endregion

//#region Mod

var determineFormatMod = exports.determineFormatMod = function (formatDetails) {
	if(!formatDetails || !formatDetails.name) {
		monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return '';
	}

	if(formatDetails.mod) {
		return formatDetails.mod;
	}

	// This probably can't happen, but just to cover the case...
	return '';
}

var isDefaultModName = exports.isDefaultModName = function (sModName) {
	return ( '' === genStripName(sModName) );
}

//#endregion

//#region CustomCallbacks

var CustomCallbackNamesArray = exports.CustomCallbackNamesArray = [
	'checkLearnset',
	'onAfterMega',
	'onBegin',
	'onChangeSet',
	'onModifyTemplate',
	'onTeamPreview',
	'onValidateSet',
	'onValidateTeam',
	'validateSet',
	'validateTeam',
];
Object.freeze(DisruptiveRuleArray);

var doesFormatHaveKeyCustomCallbacks = exports.doesFormatHaveKeyCustomCallbacks = function (formatDetails) {
	if(!formatDetails || !formatDetails.name) {
		monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return '';
	}

	if(formatDetails.mod) {
		return formatDetails.mod;
	}

	// This probably can't happen, but just to cover the case...
	return '';
}

var calcFormatCustomCallbacks = exports.calcFormatCustomCallbacks = function (formatDetails) {
	/*for (const value of Object.values(obj)) {

	}
	*/

	if(!formatDetails || !formatDetails.name) {
		monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return '';
	}

	var customCallbackArray = [];


}

//#endregion

//#region Ruleset

var DisruptiveRuleArray = exports.DisruptiveRuleArray = [
	'Pokemon',
	'Standard',
	'Standard NEXT',
	'Standard Ubers',
	'Standard GBU',
	'Minimal GBU',
	'Standard Doubles',
	'Sleep Clause Mod',
	'Species Clause',
	'Nickname Clause',
	'OHKO Clause',
	'Moody Clause',
	'Evasion Moves Clause',
	'Endless Battle Clause',
	'HP Percentage Mod',
	'Cancel Mod'
];
Object.freeze(DisruptiveRuleArray);

//#endregion

//#region Ruleset

var MashupBaseRequirement = exports.MashupBaseRequirement = {
	'NonStandardMod':0,
	'SuppliesTeam':1,
	'KeyCustomCallbacks':2,
	'CustomValidation':3,
	'NonStandardProperties':4,

    'Count':5,

    'Undefined':-1
};
Object.freeze(MashupBaseRequirement);

var MashupBaseRequirementDataArray = exports.MashupBaseRequirementDataArray = [
	{ isStrict: true }, // NonStandardMod
	{ isStrict: true }, // SuppliesTeam
	{ isStrict: true }, // KeyCustomCallbacks
	{ isStrict: false }, // CustomValidation
	{ isStrict: false }, // NonStandardProperties
];
Object.freeze(MashupBaseRequirementDataArray);

//#endregion

var MashupAuthType = exports.MashupAuthType = {
    'Official':0,
    'Spotlight':1,
    'Other':2,

    'Count':3,

    'Undefined':4
};
Object.freeze(MashupAuthType);

var tourAuthTypeIdealRatiosArray = exports.tourAuthTypeIdealRatiosArray = [
	3/6, // Official
	2/6, // Spotlight
	1/6, // Other
];
Object.freeze(tourAuthTypeIdealRatiosArray);

// Copied directly from the megathread tour lists; spacing is inconsistent there
// https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586
var officialTourNamesArray = exports.officialTourNamesArray = [
	// OM Mashups​
	['[Gen7] Pure Hackmons'],
	// Mix and Mega Anything Goes (Not on main) 
	['[Gen7] AAA Ubers'],
	['[Gen7] CAAAmomons'],
	['[Gen 7] STABmons Ubers'],
	['[Gen 7] AAA STABmons', '[Gen 7] STAAABmons'],
	['[Gen 7] STAB n Mega', '[Gen 7] STAB and Mega'],

	// Doubles Metagames​
	['[Gen 7] Balanced Hackmons Doubles', '[Gen 7] Doubles Balanced Hackmons'],
	['[Gen7] AAA Doubles'],
	// Mix and Mega Doubles (Not on main)
	['[Gen7] STABmons Doubles'],

	// Little Cup Metagames​
	['[Gen 7] LC Balanced Hackmons'],
	['[Gen7] Almost Any Ability LC'],
	['[Gen 7] STABmons LC'],
	['[Gen 7] Mix and Mega LC'],
];
Object.freeze(officialTourNamesArray);
var officialTourNamesIdArray = exports.officialTourNamesIdArray = [];
var officialTourNamesGenericIdArray = exports.officialTourNamesGenericIdArray = [];

var todayStartTimestamp = exports.todayStartTimestamp = function() {
	var d = new Date();
	d.setHours(0,0,0,0);
	return d;
};

var loadCompletedTourAuthTypeArray = exports.loadCompletedTourAuthTypeArray = function() {
	resetCompletedTourAuthTypeArray();

	// Init save data
	if (!mashupsSavedData['authType']) {
		mashupsSavedData['authType'] = {};
		for (var nAuthTypeItr=0; nAuthTypeItr<MashupAuthType.Count; ++nAuthTypeItr) {
			mashupsSavedData['authType'][nAuthTypeItr] = 0;
		}
	}
	if (!mashupsSavedData['dateY']) {
		var d = todayStartTimestamp();
		mashupsSavedData['dateY'] = d.getFullYear();
		mashupsSavedData['dateM'] = d.getMonth();
		mashupsSavedData['dateD'] = d.getDate();
	}

	for (var nAuthTypeItr=0; nAuthTypeItr<MashupAuthType.Count; ++nAuthTypeItr) {
		completedTourAuthTypeArray[nAuthTypeItr] = mashupsSavedData['authType'][nAuthTypeItr];
	}
};

var resetCompletedTourAuthTypeArray = exports.resetCompletedTourAuthTypeArray = function() {
	completedTourAuthTypeArray = new Array(MashupAuthType.Count);
	for (var nAuthTypeItr=0; nAuthTypeItr<MashupAuthType.Count; ++nAuthTypeItr) {
		completedTourAuthTypeArray[nAuthTypeItr] = 0;
	}
};

var setCompletedTourAuthTypeCount = exports.setCompletedTourAuthTypeCount = function(nAuthType, nCount) {
	if(undefined === completedTourAuthTypeArray) {
		loadCompletedTourAuthTypeArray();
	}
	completedTourAuthTypeArray[nAuthType] = nCount;
};

var incrementCompletedTourAuthTypeCount = exports.incrementCompletedTourAuthTypeCount = function(nAuthType) {
	if(nAuthType >= MashupAuthType.Count) return;
	setCompletedTourAuthTypeCount(nAuthType, completedTourAuthTypeArray[nAuthType]+1);
};

var analyseTourAuthTypeCountStatement = exports.analyseTourAuthTypeCountStatement = function() {
	var tourAuthTypePropArray = new Array(MashupAuthType.Count);
	var nTourTotalCount = 0;
	for (var nAuthTypeItr=0; nAuthTypeItr<MashupAuthType.Count; ++nAuthTypeItr) {
		tourAuthTypePropArray[nAuthTypeItr] = completedTourAuthTypeArray[nAuthTypeItr];
		nTourTotalCount += completedTourAuthTypeArray[nAuthTypeItr];
	}
	if( nTourTotalCount > 0 ) {
		for (nAuthTypeItr=0; nAuthTypeItr<MashupAuthType.Count; ++nAuthTypeItr) {
			tourAuthTypePropArray[nAuthTypeItr] /= nTourTotalCount;
		}
	}

	var nRecommendedAuthType = MashupAuthType.Undefined;
	var nBiggestRatioShortfallValue = 0;
	var nBiggestRatioShortfallIdealRatio = 0;
	var nShortfallValue;
	for (nAuthTypeItr=0; nAuthTypeItr<MashupAuthType.Count; ++nAuthTypeItr) {
		nShortfallValue = tourAuthTypePropArray[nAuthTypeItr] / tourAuthTypeIdealRatiosArray[nAuthTypeItr];
		if( (nShortfallValue < nBiggestRatioShortfallValue) ||
			( (nShortfallValue == nBiggestRatioShortfallValue) && (tourAuthTypeIdealRatiosArray[nAuthTypeItr] > nBiggestRatioShortfallIdealRatio) ) ||
			(MashupAuthType.Undefined == nRecommendedAuthType) ) {
			nBiggestRatioShortfallValue = nShortfallValue;
			nBiggestRatioShortfallIdealRatio = tourAuthTypeIdealRatiosArray[nAuthTypeItr];
			nRecommendedAuthType = nAuthTypeItr;
		}
	}

	var sStatement = `Tours today: `;
	var sAuthTypeName;
	for (nAuthTypeItr=0; nAuthTypeItr<MashupAuthType.Count; ++nAuthTypeItr) {
		sAuthTypeName = string_of_enum(MashupAuthType, nAuthTypeItr);
		sStatement += `${sAuthTypeName}: ${completedTourAuthTypeArray[nAuthTypeItr]} (${(100*tourAuthTypePropArray[nAuthTypeItr]).toFixed(2)}% / Ideal: ${(100*tourAuthTypeIdealRatiosArray[nAuthTypeItr]).toFixed(2)}%)`;
		if(nAuthTypeItr < (MashupAuthType.Count-1)) {
			sStatement += ', ';
		}
	}
	sStatement += `. Suggested next tour type: ${string_of_enum(MashupAuthType, nRecommendedAuthType)}.`;
	return sStatement;
};

var genericiseMetaName = exports.genericiseMetaName = function(sName) {
	sName = toId(sName);
	sName = genStripName(sName);
	return String(sName);
}

var tourNameToAuthTypeGenericId = exports.tourNameToAuthTypeGenericId = function (sTourName, bRemoveTierData=true) {
	let sGenericId = toId(sTourName);

	// Remove gen data
	sGenericId = genStripName(sGenericId);

	// Remove tier data
	if(bRemoveTierData) {
		var tierAliases;
		for (var nTier=0; nTier<Tier.Count; ++nTier) {
			sGenericId = sGenericId.replace(toId(tierDataArray[nTier].name), '');
			// FIXME: Try to add tier aliases
			/*
			tierAliases = aliases[toId(tierDataArray[nTier].name)];
			if (tierAliases) {

			}
			*/
		}
	}
	return sGenericId;
};

var setSpotlightTourNameArray = exports.setSpotlightTourNameArray = function (sSpotlightNameArray) {
	for (var nAliasItr=0; nAliasItr<sSpotlightNameArray.length; ++nAliasItr) {
		spotlightTourNameArray[nAliasItr] = sSpotlightNameArray[nAliasItr];
		spotlightTourNameIdArray[nAliasItr] = toId(sSpotlightNameArray[nAliasItr]);
		spotlightTourNameGenericIdArray[nAliasItr] = tourNameToAuthTypeGenericId(sSpotlightNameArray[nAliasItr], false);
	}

	Object.freeze(spotlightTourNameArray);
	Object.freeze(spotlightTourNameIdArray);
	Object.freeze(spotlightTourNameGenericIdArray);

	//for (var nAliasItr=0; nAliasItr<Mashups.spotlightTourNameGenericIdArray.length; ++nAliasItr) {
	//console.log(`spotlightTourName: ${spotlightTourName}`);
	//console.log(`spotlightTourNameId: ${spotlightTourNameId}`);
	//console.log(`spotlightTourNameGenericId: ${spotlightTourNameGenericId}`);
	//}
};

//#region GameObject

var getGameObjectKey = exports.getGameObjectKey = function (sGameObjectAlias) {
	sGameObjectAlias = toId(sGameObjectAlias);

	// Convert from standard alias if this is one
	try {
		var aliases = DataDownloader.getAliases();
		if (aliases[sGameObjectAlias]) sGameObjectAlias = toId(aliases[sGameObjectAlias]);
	} catch (e) {
		debug(`Could not fetch aliases.`);
		return null;
	}

	// Check any type of object with this alias exists
	if(PokedexArray[sGameObjectAlias]) {
		return sGameObjectAlias;
	}
	if(MovesArray[sGameObjectAlias]) {
		return sGameObjectAlias;
	}
	if(AbilitiesArray[sGameObjectAlias]) {
		return sGameObjectAlias;
	}
	if(MovesArray[sGameObjectAlias]) {
		return sGameObjectAlias;
	}

	return null;
};

//#endregion

//#region PokemonGO

var getGameObjectAsPokemon = exports.getGameObjectAsPokemon = function(sGameObject) {
	sGameObject = toId(sGameObject);
	monitor(`DEBUG sGameObject: ${sGameObject}`);

	var nLength = Object.keys(PokedexArray).length
	monitor(`DEBUG nLength: ${nLength}`);

	return PokedexArray[sGameObject];
}

var calcPokemonTier = exports.calcPokemonTier = function(goPokemon) {
	if(!goPokemon) return Tier.Undefined;

	if(!goPokemon.tier) { // Recurse from base forme
		if(!goPokemon.baseSpecies) return Tier.Undefined;
		return calcPokemonTier(toId(goPokemon.baseSpecies));
	}

	if(!goPokemon.tier) return Tier.Undefined;

	if('(PU)' === goPokemon.tier) { // Special case
		return Tier.ZU;
	}

	return tierNameToId(goPokemon.tier);
}

var getPokemonKey = exports.getPokemonKey = function (sPokemonAlias) {
	sPokemonAlias = toId(sPokemonAlias);

	// Convert from standard alias if this is one
	try {
		var aliases = DataDownloader.getAliases();
		if (aliases[sPokemonAlias]) sPokemonAlias = toId(aliases[sPokemonAlias]);
	} catch (e) {
		debug(`Could not fetch aliases.`);
		return null;
	}

	// Check Pokemon exists
	if(PokedexArray[sPokemonAlias]) {
		return sPokemonAlias;
	}

	return null;
}

//#endregion

//#region MoveGO

var getGameObjectAsMove = exports.getGameObjectAsMove = function(sGameObject) {
	sGameObject = toId(sGameObject);
	return MovesArray[sGameObject];
}

//#endregion

//#region AbilityGO

var getGameObjectAsAbility = exports.getGameObjectAsAbility = function(sGameObject) {
	sGameObject = toId(sGameObject);
	return AbilitiesArray[sGameObject];
}

//#endregion

//#region ItemGO

var getGameObjectAsItem = exports.getGameObjectAsItem = function(sGameObject) {
	sGameObject = toId(sGameObject);
	return ItemsArray[sGameObject];
}

//#endregion

//#region Format

var getFormatKey = exports.getFormatKey = function (sFormatAlias) {
	sFormatAlias = toId(sFormatAlias);

	// Special cases aliases
	if('aaa' === sFormatAlias) {
		sFormatAlias = 'almostanyability';
	}
	if('stab' === sFormatAlias) {
		sFormatAlias = 'stabmons';
	}
	if('bh' === sFormatAlias) {
		sFormatAlias = 'balancedhackmons';
	}
	if('camo' === sFormatAlias) {
		sFormatAlias = 'camomons';
	}
	if('pic' === sFormatAlias) {
		sFormatAlias = 'partnersincrime';
	}

	// Convert from standard alias if this is one
	try {
		var aliases = DataDownloader.getAliases();
		if (aliases[sFormatAlias]) sFormatAlias = toId(aliases[sFormatAlias]);
	} catch (e) {
		debug(`Could not fetch aliases.`);
		return null;
	}

	// Add 'gen7' prefix if no gen was specified
	if('gen' !== sFormatAlias.substring(0, 3)) {
		sFormatAlias = 'gen7' + sFormatAlias;
	}

	// Find format that fits alias
	for (var formatKey in Formats) {
		if(sFormatAlias === formatKey) {
			return formatKey;
		}
	}

	return null;
};

var findFormatDetails = exports.findFormatDetails = function (sSearchFormatName) {
	sSearchFormatName = toId(sSearchFormatName);

	// Search all format details for match by name => id
	//monitor(`DEBUG FormatDetailsArray.length: ${FormatDetailsArray.length}`);
	for (var nFDItr=0; nFDItr<FormatDetailsArray.length; ++nFDItr) {
		if( !FormatDetailsArray[nFDItr] ) continue;
		if( !FormatDetailsArray[nFDItr].name ) continue;
		//monitor(`DEBUG FormatDetailsArray[${nFDItr}].name: ${FormatDetailsArray[nFDItr].name}`);

		if( sSearchFormatName == toId(FormatDetailsArray[nFDItr].name) ) {
			return FormatDetailsArray[nFDItr];
		}
	}

	return null;
}

//#endregion

exports.init = function () {
	// Set up spotlight data
	setSpotlightTourNameArray(spotlightTourNameArray);

	// Set up officials data
	for (var nOfficial=0; nOfficial<officialTourNamesArray.length; ++nOfficial) {
		officialTourNamesIdArray[nOfficial] = [];
		officialTourNamesGenericIdArray[nOfficial] = [];
		for (var nAliasItr=0; nAliasItr<officialTourNamesArray[nOfficial].length; ++nAliasItr) {
			//console.log(`sOfficialMashupName: ${officialTourNamesArray[nOfficial][nAliasItr]}`);
			officialTourNamesIdArray[nOfficial][nAliasItr] = toId(officialTourNamesArray[nOfficial][nAliasItr]);
			officialTourNamesGenericIdArray[nOfficial][nAliasItr] = tourNameToAuthTypeGenericId(officialTourNamesArray[nOfficial][nAliasItr]);
		}
	}

	for (var i in tourMetaData)
		delete tourMetaData[i];

	loadCompletedTourAuthTypeArray();
};

exports.parse = function (room, message, isIntro, spl) {
	if (spl[0] !== 'tournament') return;
	if (isIntro) return;
	if (!tourMetaData[room]) tourMetaData[room] = {};
	switch (spl[1]) {
		case 'update':
			try {
				var data = JSON.parse(spl[2]);
				for (var i in data)
                tourMetaData[room][i] = data[i];
			} catch (e){}
			break;
		case 'end':
			try {
				var data = JSON.parse(spl[2]);
				for (var i in data)
                tourMetaData[room][i] = data[i];
			} catch (e){}
			TourRatioTracker.onTournamentEnd(room, tourMetaData[room]);
			delete tourMetaData[room];
			break;
		case 'forceend':
			// Debug
			//TourRatioTracker.onTournamentEnd(room, tourMetaData[room]);
			delete tourMetaData[room];
			break;
	}
};

exports.destroy = function () {
	if (Features[exports.id]) delete Features[exports.id];
};

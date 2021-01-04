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
var LearnsetsArray = exports.LearnsetsArray = require('./../../data/learnsets.js').BattleLearnsets;

var TourRatioTracker = exports.TourRatioTracker = require('./tour-ratio-tracker.js');

var TourCodeManager = exports.TourCodeManager = require('./tour-code-manager.js');

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

// Tour code cache
try {
	TourCodeManager.refreshTourCodeCache();
} catch (e) {
	errlog(e.stack);
	error("Could not initiate tour codes cache: " + sys.inspect(e));
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

var spotlightTourNameArray = exports.spotlightTourNameArray = [];
var spotlightTourNameIdArray = exports.spotlightTourNameIdArray = [];
var spotlightTourNameGenericIdArray = exports.spotlightTourNameGenericIdArray = [];

var string_of_enum = exports.string_of_enum = function string_of_enum(eEnum,value) 
{
	for (var k in eEnum) if (eEnum[k] == value) return k;
	return null;
}

//#region DEBUG

var MASHUPS_DEBUG_ON = exports.MASHUPS_DEBUG_ON = false;

//#endregion

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
// E.g. [Gen 8] Underused will be UU, but [Gen 8] Mix and Mega is Undefined, not Ubers
var determineFormatDefinitionTierId = exports.determineFormatDefinitionTierId = function (sFormatName, nGen=null) {
	if(null === nGen) {
		var formatDetails = findFormatDetails(sFormatName);
		nGen = determineFormatGen(formatDetails);
	}

	sFormatName = toId(sFormatName);

	var sLoopTierName;
	for(nTierItr=0; nTierItr<Tier.Count; ++nTierItr) {
		//if( Tier.AG === nTierItr ) continue; // Prevent AG form counting here

		sLoopTierName = toId(getGenName(nGen) + tierDataArray[nTierItr].name);
		if(MASHUPS_DEBUG_ON) monitor(`DEBUG tier comparison: ${sLoopTierName} and ${sFormatName}`);
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

var isFormatTierDefinition = exports.isFormatTierDefinition = function (sFormatName, nGen) {
	return (Tier.Undefined !== determineFormatDefinitionTierId(sFormatName, nGen));
}

var isABannedInTierB = exports.isABannedInTierB = function(nCheckTier, nBasisTier) {
	return (nCheckTier < nBasisTier);
}

// This actually tries to deduce a format's intrinsic tier (used for bases primarily)
// E.g. [Gen 8] Mix and Mega is Ubers
var determineFormatBasisTierId = exports.determineFormatBasisTierId = function (formatDetails, nGen) {
	if(!formatDetails || !formatDetails.name) {
		//var e = new Error();
		//console.log(e.stack);
		if(MASHUPS_DEBUG_ON) monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return Tier.Undefined;
	}

	var sFormatName = formatDetails.name;

	// Initially check if the format itself is a tier-defining format
	var nTierDefinedByFormat = determineFormatDefinitionTierId(sFormatName, nGen);
	if(Tier.Undefined !== nTierDefinedByFormat) {
		return nTierDefinedByFormat;
	}

	// Not a tier-defining format: use rules to determine tier

	// Prevent misclassification of tier definition formats, which may include a higher tier format name in their rules before adding bans, etc
	var nTierAsDefinitionFormat = determineFormatBasisTierId(sFormatName, nGen);
	if(Tier.Undefined !== nTierAsDefinitionFormat) {
		if(MASHUPS_DEBUG_ON) monitor(`Returning through nTierAsDefinitionFormat: ${nTierAsDefinitionFormat}.`);
		return nTierAsDefinitionFormat;
	}

	// If a tier has no ruleset, we can only assume AG (maybe Undefined?)
	if(!formatDetails.ruleset) {
		if(MASHUPS_DEBUG_ON) monitor(`Returning AG due to undefined ruleset.`);
		return Tier.AG;
	}

	// Use ruleset to determine the basis tier
	var ruleset = formatDetails.ruleset;
	var nRuleAsTier;
	for(var nRuleItr=0; nRuleItr<formatDetails.ruleset.length; ++nRuleItr) {
		nRuleAsTier = determineFormatDefinitionTierId(ruleset[nRuleItr], nGen);
		if(Tier.Undefined !== nRuleAsTier) {
			return nRuleAsTier;
		}
	}

	// If not relevant rules are found, we have to assume AG as a basis tier
	if(MASHUPS_DEBUG_ON) monitor(`Returning AG due to lack of relevant rules.`);
	return Tier.AG; // FIXME: Think about this, should it be Ubers?
}

var findTierFormatDetails = exports.findTierFormatDetails = function (nTierId, nGen=c_nCurrentGen) {
	if(MASHUPS_DEBUG_ON) monitor(`nTierId: ` + nTierId);
	if(nTierId < 0) return Tier.OU;

	var sTierName = tierDataArray[nTierId].name;
	if(MASHUPS_DEBUG_ON) monitor(`sTierName: ` + sTierName);

	// Extract rules if this tier has a format
	var sGenName = getGenName(nGen);
	var bestMatchTier = findFormatDetails(sGenName + sTierName);
	if(null !== bestMatchTier) return bestMatchTier;

	// Otherwise search for a rough best match
	if(nTierId < 0.5 * Tier.Count) {
		for(var nTierItr=0; nTierItr<Tier.Count; ++nTierItr) {
			bestMatchTier = findFormatDetails(sGenName + tierDataArray[nTierId].name);
			if(null !== bestMatchTier) return bestMatchTier;
		}
	}
	else {
		for(var nTierItr=Tier.Count-1; nTierItr>=0; --nTierItr) {
			bestMatchTier = findFormatDetails(sGenName + tierDataArray[nTierId].name);
			if(null !== bestMatchTier) return bestMatchTier;
		}
	}

	// Really can't find anything usable
	return null;
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

var c_nCurrentGen = exports.c_nCurrentGen = 8;

var getGenName = exports.getGenName = function(nGen) {
	return 'gen' + nGen.toString();
}

var getCurrentGenName = exports.getCurrentGenName = function() {
	return getGenName(c_nCurrentGen);
}

var getGenNameDisplayFormatted = exports.getGenNameDisplayFormatted = function(nGen) {
	return '[Gen ' + nGen.toString() + ']';
}

var getCurrentGenNameDisplayFormatted = exports.getCurrentGenNameDisplayFormatted = function() {
	return getGenNameDisplayFormatted(c_nCurrentGen);
}

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

var hasOwnProperty = exports.hasOwnProperty = function (obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

var CustomCallbackNamesArray = exports.CustomCallbackNamesArray = [
	'checkLearnset',
	'onAfterMega',
	'onBeforeSwitchIn',
	'onBegin',
	'onChangeSet',
	'onModifySpecies',
	'onSwitchIn',
	'onTeamPreview',
	'onValidateSet',
	'onValidateTeam',
	'validateSet',
	'validateTeam',
];
Object.freeze(CustomCallbackNamesArray);

var doesFormatHaveKeyCustomCallbacks = exports.doesFormatHaveKeyCustomCallbacks = function (formatDetails) {
	if(!formatDetails || !formatDetails.name) {
		monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return false;
	}

	var keyCustomCallbacks = calcFormatCustomCallbacks(formatDetails);
	if(keyCustomCallbacks && keyCustomCallbacks.length && (keyCustomCallbacks.length > 0)) {
		return true;
	}

	return false;
}

var calcFormatCustomCallbacks = exports.calcFormatCustomCallbacks = function (formatDetails) {
	if(MASHUPS_DEBUG_ON) {
		for (const value of Object.values(formatDetails)) {
			monitor(`callback val: ${value}`);
		}
	}

	var customCallbackArray = [];

	if(!formatDetails || !formatDetails.name) {
		monitor(`formatDetails undefined! May have been erroneously passed a format name.`);
		return customCallbackArray;
	}

	for(var nCCItr=0; nCCItr<CustomCallbackNamesArray.length; ++nCCItr) {
		if(!hasOwnProperty(formatDetails, CustomCallbackNamesArray[nCCItr])) continue;
		customCallbackArray.push(CustomCallbackNamesArray[nCCItr]);
	}

	return customCallbackArray;
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

// Copied directly from the megathread tour lists; spacing can be inconsistent there
// Gen 8: https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299989
// Gen 7: https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586
var officialTourNamesArray = exports.officialTourNamesArray = [
	// OM Mashups​
	['[Gen 8] Camomons BH', '[Gen 8] Camomons Balanced Hackmons'],
	['[Gen 8] STABmons + Almost Any Ability', '[Gen 8] AAA STABmons', '[Gen 8] STAAABmons'],
	['[Gen 8] Camomons + Almost Any Ability', '[Gen 8] CAAAmomons'],
	['[Gen 8] STABmons Mix and Mega', '[Gen 8] STAB n Mega', '[Gen 8] STAB and Mega'],
	['[Gen 8] Almost Any Ability Ubers', '[Gen 8] AAA Ubers'],
	['[Gen 8] STABmons Ubers'],

	// Doubles Metagames​
	['[Gen 8] Almost Any Ability Doubles', '[Gen8] AAA Doubles'],
	['[Gen 8] Balanced Hackmons Doubles', '[Gen 8] Doubles Balanced Hackmons', '[Gen 8] BH Doubles'],
	['[Gen 8] Camomons Doubles'],
	['[Gen 8] STABmons Doubles'],

	// Little Cup Metagames​
	['[Gen 8] Almost Any Ability Little Cup', '[Gen8] Almost Any Ability LC'],
	['[Gen 8] STABmons LC'],
	['[Gen 8] Camomons Little Cup'],
	['[Gen 8] Balanced Hackmons Little Cup', '[Gen 8] LC Balanced Hackmons'],
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

	// We can no longer freeze spotlightTourNameArray, etc because they can be dynamically updated from OperationTourCode

	//for (var nAliasItr=0; nAliasItr<spotlightTourNameGenericIdArray.length; ++nAliasItr) {
	//console.log(`spotlightTourNameArray: ${spotlightTourNameArray}`);
	//console.log(`spotlightTourNameIdArray: ${spotlightTourNameIdArray}`);
	//console.log(`spotlightTourNameGenericIdArray: ${spotlightTourNameGenericIdArray}`);
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
	if(MASHUPS_DEBUG_ON) monitor(`DEBUG sGameObject: ${sGameObject}`);

	sGameObject = getPokemonKey(sGameObject);
	if(MASHUPS_DEBUG_ON) monitor(`DEBUG aliased sGameObject: ${sGameObject}`);
	if(!sGameObject) return null;

	//var nLength = Object.keys(PokedexArray).length;
	//if(MASHUPS_DEBUG_ON) monitor(`DEBUG nLength: ${nLength}`);

	return PokedexArray[sGameObject];
}

var getGameObjectAsPokemonRaw = exports.getGameObjectAsPokemonRaw = function(sGameObject) {
	sGameObject = toId(sGameObject);
	return PokedexArray[sGameObject];
}

var getGameObjectAsPokemonBaseForme = exports.getGameObjectAsPokemonBaseForme = function(sGameObject) {
	var pokemonGO = getGameObjectAsPokemon(sGameObject);
	if(!pokemonGO) return null;

	if(pokemonGO.baseSpecies) {
		pokemonGO = getGameObjectAsPokemon(pokemonGO.baseSpecies);
	}

	return pokemonGO;
}

var getAllPokemonFormesArray = exports.getAllPokemonFormesArray = function(sGameObject) {
	var basePokemonGO = getGameObjectAsPokemonBaseForme(sGameObject);
	if(!basePokemonGO) return null;

	var allFormesArray = basePokemonGO.otherFormes || [];
	allFormesArray.unshift(basePokemonGO.name + '-Base');
	return allFormesArray;
}

var isGameObjectPokemon = exports.isGameObjectPokemon = function(sGameObject) {
	return getGameObjectAsPokemon(sGameObject) ? true : false;
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
	sPokemonAlias = sPokemonAlias.replace('-Base', ''); // '-Base' formes aren't keys in the Showdown dex dictionary
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

var DoesPokemonHavePreBattleAccessToTyping = exports.DoesPokemonHavePreBattleAccessToTyping = function(sPokemonName, sTypingName, bRecurseFormes)
{
	var pokemonGO = getGameObjectAsPokemon(sPokemonName);
	if(!pokemonGO) return false;

	// Battle change-only special cases (Mega/Primal)
	if(pokemonGO.forme) {
		// Mega/Primals case: treat as base forme
		if( ('Mega' ===  pokemonGO.forme) ||
			('Mega-X' ===  pokemonGO.forme) ||
			('Mega-Y' ===  pokemonGO.forme) ||
			('Primal' ===  pokemonGO.forme) )
		{
			if(!pokemonGO.baseSpecies) return false; // Should be impossible

			if(bRecurseFormes) return DoesPokemonHavePreBattleAccessToTyping( pokemonGO.baseSpecies, sTypingName, true );
			else return false;
		}
	}

	// Battle change-only special cases (others)
	if(pokemonGO.species) {
		var sSpeciesId = toId(pokemonGO.species);
		if( ('arceus' === sSpeciesId) ||
			('silvally' === sSpeciesId) )
		{ // Arceus/Silvally are special case that get every typing
			return true;
		}

		if( ( 'castformsunny' === sSpeciesId ) ||
			( 'castformrainy' === sSpeciesId ) ||
			( 'castformsnowy' === sSpeciesId ) ||
			( 'meloettapirouette' === sSpeciesId ) ||
			( 'darmanitanzen' === sSpeciesId ) )
		{
			if(!pokemonGO.baseSpecies) return false; // Should be impossible

			if(bRecurseFormes) return DoesPokemonHavePreBattleAccessToTyping( pokemonGO.baseSpecies, sTypingName, true );
			else return false;
		}
	}

	// Check if we have the typing
	if(pokemonGO.types) {
		for (var nTypeItr = 0; nTypeItr < pokemonGO.types.length; ++nTypeItr) {
			if( sTypingName === pokemonGO.types[nTypeItr] ) return true;
		}
	}

	if(bRecurseFormes) { // Recurse other formes for typing
		if(pokemonGO.otherFormes) {
			for (var nFormeItr = 0; nFormeItr < pokemonGO.otherFormes.length; ++nFormeItr) {
				if( DoesPokemonHavePreBattleAccessToTyping( pokemonGO.otherFormes[nFormeItr], sTypingName, false ) ) {
					return true;
				}
			}
		}
		if(pokemonGO.baseSpecies) {
			if( DoesPokemonHavePreBattleAccessToTyping( pokemonGO.baseSpecies, sTypingName, false ) ) {
				return true;
			}
		}
	}

	if(pokemonGO.prevo) { // Check prevo for typing
		if( DoesPokemonHavePreBattleAccessToTyping( pokemonGO.prevo, sTypingName, false ) ) {
			return true;
		}
	}

	// Exhausted means of obtaining typing
	return false;
}

//#endregion

//#region MoveGO

var getGameObjectAsMove = exports.getGameObjectAsMove = function(sGameObject) {
	sGameObject = toId(sGameObject);
	return MovesArray[sGameObject];
}

var isGameObjectMove = exports.isGameObjectMove = function(sGameObject) {
	return getGameObjectAsMove(sGameObject) ? true : false;
}

//#endregion

//#region AbilityGO

var getGameObjectAsAbility = exports.getGameObjectAsAbility = function(sGameObject) {
	sGameObject = toId(sGameObject);
	return AbilitiesArray[sGameObject];
}

var isGameObjectAbility = exports.isGameObjectAbility = function(sGameObject) {
	return getGameObjectAsAbility(sGameObject) ? true : false;
}

//#endregion

//#region ItemGO

var getGameObjectAsItem = exports.getGameObjectAsItem = function(sGameObject) {
	sGameObject = toId(sGameObject);
	return ItemsArray[sGameObject];
}

var isGameObjectItem = exports.isGameObjectItem = function(sGameObject) {
	return getGameObjectAsItem(sGameObject) ? true : false;
}

//#endregion

//#region Learnsets

var doesPokemonLearnMove = exports.doesPokemonLearnMove = function(sPokemonName, sMoveName, bRecurseFormes=true) {
	sPokemonName = toId(sPokemonName);

	var pokemonGO = getGameObjectAsPokemon(sPokemonName);
	if(!pokemonGO) return false;

	if(bRecurseFormes) { // Some formes don't have their own learnsets, others do; go to base and check all formes
		if(pokemonGO.baseSpecies) {
			return doesPokemonLearnMove(pokemonGO.baseSpecies, sMoveName, true);
		}
		else if(pokemonGO.otherFormes) {
			for (var nFormeItr = 0; nFormeItr < pokemonGO.otherFormes.length; ++nFormeItr) {
				if(doesPokemonLearnMove(pokemonGO.otherFormes[nFormeItr], sMoveName, false) ) {
					return true;
				}
			}
		}
	}

	sMoveName = toId(sMoveName);

	var battleLearnset = LearnsetsArray[sPokemonName];
	if(!battleLearnset) return false;
	if(!battleLearnset.learnset) return false;

	return (sMoveName in battleLearnset.learnset);
}

//#endregion

//#region Format

var getFormatKey = exports.getFormatKey = function (sFormatAlias, bAllowVirtualFormats=false) {
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

	// Add current gen prefix if no gen was specified
	if('gen' !== sFormatAlias.substring(0, 3)) {
		sFormatAlias = getCurrentGenName() + sFormatAlias;
	}

	// Find format that fits alias
	for (var formatKey in Formats) {
		if(sFormatAlias === formatKey) {
			return formatKey;
		}
	}

	// Check in virtual formats if allowed
	if(bAllowVirtualFormats) {
		for (var formatKey in VirtualFormats) {
			if(MASHUPS_DEBUG_ON) monitor(`DEBUG formatKey: ${formatKey}`);
			if(sFormatAlias === formatKey) {
				return formatKey;
			}
		}
	}

	return null;
};

var findFormatDetails = exports.findFormatDetails = function (sSearchFormatName, bAllowVirtualFormats=false) {
	sSearchFormatName = toId(sSearchFormatName);

	// Search all format details for match by name => id
	if(MASHUPS_DEBUG_ON) monitor(`DEBUG FormatDetailsArray.length: ${FormatDetailsArray.length}`);
	for (var nFDItr=0; nFDItr<FormatDetailsArray.length; ++nFDItr) {
		if( !FormatDetailsArray[nFDItr] ) continue;
		if( !FormatDetailsArray[nFDItr].name ) continue;
		if(MASHUPS_DEBUG_ON) monitor(`DEBUG FormatDetailsArray[${nFDItr}].name: ${FormatDetailsArray[nFDItr].name}`);

		if( sSearchFormatName == toId(FormatDetailsArray[nFDItr].name) ) {
			return FormatDetailsArray[nFDItr];
		}
	}

	if(MASHUPS_DEBUG_ON) monitor(`DEBUG returning null for sSearchFormatName: ${sSearchFormatName}`);
	return null;
}

//#endregion

exports.init = function () {
	// Spotlight name data is now set from OperationTourCode; see tour-code-manager.js

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

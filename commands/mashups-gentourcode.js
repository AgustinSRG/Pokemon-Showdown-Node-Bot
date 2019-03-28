/*
	Commands for tour code generation
*/

// FIXME: HERE: Auto unban abilities like Drizzle from lower-tier AAA mashups

var Mashups = exports.Mashups = require('./../features/mashups/index.js');

var c_sIgnoreRuleArray = ['Pokemon', 'Standard', 'Team Preview'];

var extractedRuleArray = [];
var nExtractedRuleCount = 0;
var extractedBanArray = [];
var nExtractedBanCount = 0;
var extractedUnbanArray = [];
var nExtractedUnbanCount = 0;

var baseFormatDetails = null;
var baseFormatTierDetails = null;
var sBaseModName;
var nBaseGen;
var nBaseGameType;

var nTierId;
var bTierModified;
var bTierIncreased;
var bIsLC;

var TryAddRule = function(sCurrentRule, params)
{
	var bIgnoreRule = false;

	monitor(`DEBUG ruleset: ${sCurrentRule}`);

	var sCurrentRuleId = toId(sCurrentRule);

	// Banned (redundant) rules
	for (nExistingRuleItr = 0; nExistingRuleItr < c_sIgnoreRuleArray.length; ++nExistingRuleItr) {
		if (toId(c_sIgnoreRuleArray[nExistingRuleItr]) === sCurrentRuleId) {
			bIgnoreRule = true;
			break;
		}
		if (bIgnoreRule) return;
	}

	// Tier rules have no value on a separate base and disrupt mashups with invisible compound bans
	for (nExistingRuleItr = 0; nExistingRuleItr < Mashups.Tier.Count; ++nExistingRuleItr) {
		if (toId('gen7'+Mashups.tierDataArray[nExistingRuleItr].name) === sCurrentRuleId) { // FIXME: Multi-gen support
			bIgnoreRule = true;
			break;
		}
		if (bIgnoreRule) return;
	}

	// Ignore certain 'disruptive' rules like Standard with nested bans and that are generally redundant
	for (nExistingRuleItr = 0; nExistingRuleItr < Mashups.DisruptiveRuleArray.length; ++nExistingRuleItr) {
		//monitor(`DEBUG disruptive: ${Mashups.DisruptiveRuleArray[nExistingRuleItr]}, ${sCurrentRule}`);
		if (toId(Mashups.DisruptiveRuleArray[nExistingRuleItr]) === sCurrentRuleId) {
			bIgnoreRule = true;
			break;
		}
		if (bIgnoreRule) return;
	}

	// Ignore rules that are already in the base format
	if(baseFormatDetails.ruleset) {
		for (nExistingRuleItr = 0; nExistingRuleItr < baseFormatDetails.ruleset.length; ++nExistingRuleItr) {
			if (baseFormatDetails.ruleset[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
			if (bIgnoreRule) return;
		}
	}

	if (params.additionalRules) { // Ignore rules that are redundant because they have already been added in params
		for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalRules.length; ++nExistingRuleItr) {
			if (params.additionalRules[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	if (extractedRuleArray) { // Ignore rules that are already in extractedRuleArray
		for (nExistingRuleItr = 0; nExistingRuleItr < extractedRuleArray.length; ++nExistingRuleItr) {
			if (extractedRuleArray[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	monitor(`DEBUG ruleset survived culling: ${sCurrentRule}`);

	// Add relevant rule
	extractedRuleArray[nExtractedRuleCount] = sCurrentRule;
	nExtractedRuleCount++;
}

var TryAddBan = function(sCurrentRule, params, nSourceTier, bTierCheck=false)
{
	var bIgnoreRule = false;

	monitor(`DEBUG banlist: ${sCurrentRule}`);

	// Ignore bans that are already in the base format
	for (nExistingRuleItr = 0; nExistingRuleItr < baseFormatDetails.banlist.length; ++nExistingRuleItr) {
		if (baseFormatDetails.banlist[nExistingRuleItr] === sCurrentRule) {
			bIgnoreRule = true;
			break;
		}
		if (bIgnoreRule) return;
	}

	// Ignore bans that are already in the base format's tier format (e.g. Baton Pass for OU-based metas)
	for (nExistingRuleItr = 0; nExistingRuleItr < baseFormatTierDetails.banlist.length; ++nExistingRuleItr) {
		if (baseFormatTierDetails.banlist[nExistingRuleItr] === sCurrentRule) {
			bIgnoreRule = true;
			break;
		}
		if (bIgnoreRule) return;
	}

	//monitor(`DEBUG ban survived culling 0: ${sCurrentRule}`);

	if (params.additionalBans) { // Ignore bans that are redundant because they have already been added in params
		for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalBans.length; ++nExistingRuleItr) {
			if (params.additionalBans[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	//monitor(`DEBUG ban survived culling 1: ${sCurrentRule}`);

	if (params.additionalUnbans) { // Ignore unbans that are in unbans params because we want that to take priority
		for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalUnbans.length; ++nExistingRuleItr) {
			if (params.additionalUnbans[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	if (extractedBanArray) { // Ignore bans that are already in extractedBanArray
		for (nExistingRuleItr = 0; nExistingRuleItr < extractedBanArray.length; ++nExistingRuleItr) {
			if (extractedBanArray[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	var goAsPoke = Mashups.getGameObjectAsPokemon(sCurrentRule);
	if(goAsPoke) { // As Pokemon checks
		// Ignore specific Pokemon bans if it would already be banned by tier
		if(!bTierCheck && bTierModified && !bIsLC) {
			var nPokeTier = Mashups.calcPokemonTier(goAsPoke);
			if(Mashups.isABannedInTierB(nPokeTier, nTierId)) {
				return;
			}
		}
		// Ignore Pokemon bans if the final tier is higher than the source formats's tier
		if(!bTierCheck && (nTierId < nSourceTier) ) {
			var nPokeTier = Mashups.calcPokemonTier(goAsPoke);
			if(!Mashups.isABannedInTierB(nPokeTier, nTierId)) {
				return;
			}
		}
	}

	monitor(`DEBUG ban survived culling: ${sCurrentRule}`);

	// Add relevant ban
	extractedBanArray[nExtractedBanCount] = sCurrentRule;
	nExtractedBanCount++;

	if (extractedUnbanArray) { // If a Pokemon is banned in one component meta and banned in another, prioritise ban: remove it from prior extracted unbans
		for (nExistingRuleItr = 0; nExistingRuleItr < nExtractedUnbanCount; ++nExistingRuleItr) {
			if (extractedUnbanArray[nExistingRuleItr] === sCurrentRule) {
				extractedUnbanArray.splice(nExistingRuleItr, 1);
				nExtractedUnbanCount--;
			}
		}
	}
}

var TryAddUnban = function(sCurrentRule, params, nSourceTier, bTierCheck=false)
{
	var bIgnoreRule = false;

	monitor(`DEBUG unbanlist: ${sCurrentRule}`);

	// Ignore unbans that are already in the base format
	if(baseFormatDetails.unbanlist) {
		for (nExistingRuleItr = 0; nExistingRuleItr < baseFormatDetails.unbanlist.length; ++nExistingRuleItr) {
			if (baseFormatDetails.unbanlist[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	if (params.additionalUnbans) { // Ignore unbans that are redundant because they have already been added in params
		for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalUnbans.length; ++nExistingRuleItr) {
			if (params.additionalUnbans[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	if (extractedUnbanArray) { // Ignore unbans that are already in extractedUnbanArray
		for (nExistingRuleItr = 0; nExistingRuleItr < extractedUnbanArray.length; ++nExistingRuleItr) {
			if (extractedUnbanArray[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	if (params.additionalBans) { // Ignore unbans that are in ban params under all circumstances because we clearly want to definitely ban that thing
		for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalBans.length; ++nExistingRuleItr) {
			if (params.additionalBans[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	if (extractedBanArray) { // Ignore unbans that were implicitely banned by another meta (if they were in unban params also we would already have continued)
		for (nExistingRuleItr = 0; nExistingRuleItr < extractedBanArray.length; ++nExistingRuleItr) {
			if (extractedBanArray[nExistingRuleItr] === sCurrentRule) {
				bIgnoreRule = true;
				break;
			}
		}
		if (bIgnoreRule) return;
	}

	var goAsPoke = Mashups.getGameObjectAsPokemon(sCurrentRule);
	if(goAsPoke) { // As Pokemon checks
		// Autoreject overtiered pokes if base tier altered
		if(!bTierCheck && bTierModified && !bIsLC) { // FIXME: LC needs separate processing
			var nPokeTier = Mashups.calcPokemonTier(goAsPoke);
			if(Mashups.isABannedInTierB(nPokeTier, nTierId)) {
				return;
			}
		}
	}

	monitor(`DEBUG unban survived culling: ${sCurrentRule}`);

	// Add relevant unban
	extractedUnbanArray[nExtractedUnbanCount] = sCurrentRule;
	nExtractedUnbanCount++;
}

var ExtractFormatRules = function(formatDetails, params, bTierCheck=false)
{
	if(!formatDetails) return;
	if(!formatDetails.name) return;

	var sCurrentRule;

	var nFormatBasisTier = Mashups.determineFormatBasisTierId(formatDetails);

	// ruleset
	if (formatDetails.ruleset) {
		monitor(`DEBUG ruleset`);
		for (nRuleItr = 0; nRuleItr < formatDetails.ruleset.length; ++nRuleItr) {
			sCurrentRule = formatDetails.ruleset[nRuleItr];

			TryAddRule(sCurrentRule, params);
		}
	}

	// banlist
	if (formatDetails.banlist) {
		monitor(`DEBUG banlist`);
		for (nRuleItr = 0; nRuleItr < formatDetails.banlist.length; ++nRuleItr) {
			sCurrentRule = formatDetails.banlist[nRuleItr];

			TryAddBan(sCurrentRule, params, nFormatBasisTier, bTierCheck);
		}
	}

	// unbanlist
	if (formatDetails.unbanlist) {
		monitor(`DEBUG unbanlist`);
		for (nRuleItr = 0; nRuleItr < formatDetails.unbanlist.length; ++nRuleItr) {
			sCurrentRule = formatDetails.unbanlist[nRuleItr];

			TryAddUnban(sCurrentRule, params, nFormatBasisTier, bTierCheck);
		}
	}

	// Special cases
	var sGenericMetaName = Mashups.genericiseMetaName(formatDetails.name);
	switch(sGenericMetaName) {
		case 'almostanyability':
			// For AAA, we can't restrict abilties properly due to tour code length limits, so treat restrictedAbilities as extra bans
			if (formatDetails.restrictedAbilities) {
				for (nRuleItr = 0; nRuleItr < formatDetails.restrictedAbilities.length; ++nRuleItr) {
					sCurrentRule = formatDetails.restrictedAbilities[nRuleItr];
					TryAddBan(sCurrentRule, params, nFormatBasisTier, bTierCheck);
				}
			}
			break;
		case 'stabmons': // FIXME: Remember to bypass in long tour code case
			// In a 'short' tour code, treat restricted moves as extra bans
			if (formatDetails.restrictedMoves) {
				for (nRuleItr = 0; nRuleItr < formatDetails.restrictedMoves.length; ++nRuleItr) {
					sCurrentRule = formatDetails.restrictedMoves[nRuleItr];
					TryAddBan(sCurrentRule, params, nFormatBasisTier, bTierCheck);
				}
			}
			break;
		// FIXME: Other special cases: Mix and Mega?
	}

}

//#region eCommandParam

var eCommandParam = {
	'BaseFormat':0,
	'AddOnFormats':1,
	'LaunchTour':2,
	'UseComplexBansForRestrictions':3,
	'AdditionalBans':4,
	'AdditionalUnbans':5,
	'AdditionalRules':6,
	'AdditionalUnrules':7,
	'AdditionalRestrictions':8,
	'CustomTitle':9,
	'TimeToStart':10,
	'AutoDQ':11,

    'Count':12,
};
Object.freeze(eCommandParam);

//#endregion

exports.commands = {
	genmashup: 'gentourcode',
	generatemashup: 'gentourcode',
	generatetourcode: 'gentourcode',
	gentourcode: 'gentourcode',
	gentour: 'gentourcode',
	generatetour: 'gentourcode',
	gentourcode: function (arg, user, room, cmd) {
		if (!this.isRanked(Tools.getGroup('voice'))) return false;

		if (!arg || !arg.length) {
			this.reply(`No formats specified!`);
			return;
		}

		var args = arg.split(',');
		var params = {
			baseFormat: null,
			addOnFormats: null,
			additionalBans: null,
			additionalUnbans: null,
			additionalRestrictions: null,
			additionalRules: null,
			additionalUnrules: null,
			customTitle: null,
			timeToStart: 10,
			autodq: null,
			type: 'elimination',
			useCompression: true,
		};
		for (var i = 0; i < args.length; i++) {
			args[i] = args[i].trim();
			if (!args[i]) continue;
			switch (i) {
				case eCommandParam.BaseFormat: // baseFormat
					// Search base format as a server native format
					params.baseFormat = Mashups.getFormatKey(args[i]);
					// FIXME: Add support for common compound bases like PH
					if (null === params.baseFormat) {
						this.reply(`Base format: "${args[i]}" not found on this server!`);
						return;
					}
					if (Mashups.isFormatTierDefinition(params.baseFormat)) {
						this.reply(`Base format shouldn't be a tier definition! (Identified as "${args[i]}".)`);
						return;
					}
					break;
				case eCommandParam.AddOnFormats: { // addOnFormats
					// Start add-ons with empty array
					var nAddOnCount = 0;
					params.addOnFormats = [];

					// Split add-ons
					var sAddOnFormatsString = args[i];
					var addOnFormatsArray = sAddOnFormatsString.split('|');
					var sAddOnKey;
					//this.reply(`DEBUG sAddOnFormatsString: ${sAddOnFormatsString}`);
					for (var nAddOn = 0; nAddOn < addOnFormatsArray.length; ++nAddOn) {
						if (!addOnFormatsArray[nAddOn]) continue;
						//this.reply(`DEBUG addOnFormatsArray[${nAddOn}]: ${addOnFormatsArray[nAddOn]}`);
						addOnFormatsArray[nAddOn].trim();
						// Search add-on format as a server native format
						sAddOnKey = Mashups.getFormatKey(addOnFormatsArray[nAddOn]);
						// FIXME: Add support for common compound bases like PH
						if (null === sAddOnKey) {
							this.reply(`Add-on format: "${addOnFormatsArray[nAddOn]}" not found on this server!`);
							return;
						}
						params.addOnFormats[nAddOnCount] = sAddOnKey;
						nAddOnCount++;
					}
				}
				break;
				case eCommandParam.LaunchTour: {

				}
				break;
				case eCommandParam.UseComplexBansForRestrictions: {

				}
				break;
				case eCommandParam.AdditionalBans: { // additionalBans
					// Start addition bans with empty array
					var nAdditionalBanCount = 0;
					params.additionalBans = [];

					// Split addition bans
					var sAdditionalBansString = args[i];
					var additionalBansArray = sAdditionalBansString.split('|');
					var sBanGOKey;
					for (var nGO = 0; nGO < additionalBansArray.length; ++nGO) {
						sBanGOKey = additionalBansArray[nGO].trim(); // Do validation in warnings for reliability
						params.additionalBans[nAdditionalBanCount] = sBanGOKey;
						nAdditionalBanCount++;
					}
				}
				break;
				case eCommandParam.AdditionalUnbans: { // additionalUnbans
					// Start addition unbans with empty array
					var nAdditionalUnbanCount = 0;
					params.additionalUnbans = [];

					// Split addition unbans
					var sAdditionalUnbansString = args[i];
					var additionalUnbansArray = sAdditionalUnbansString.split('|');
					var sUnbanGOKey;
					for (var nGO = 0; nGO < additionalUnbansArray.length; ++nGO) {
						sUnbanGOKey = additionalUnbansArray[nGO].trim(); // Do validation in warnings for reliability
						params.additionalUnbans[nAdditionalUnbanCount] = sUnbanGOKey;
						nAdditionalUnbanCount++;
					}
				}
				break;
				case eCommandParam.AdditionalRules: { // additionalRules
					var nAdditionalRuleCount = 0;
					params.additionalRules = [];

					// Split addition restrictions
					var sAdditionalRulesString = args[i];
					var additionalRulesArray = sAdditionalRulesString.split('|');
					var sRuleKey;
					for (var nRule = 0; nRule < additionalRulesArray.length; ++nRule) {
						sRuleKey = additionalRulesArray[nRule].trim();
						// FIXME: Somehow pull and validate rules?
						params.additionalRules[nAdditionalRuleCount] = sRuleKey;
						nAdditionalRuleCount++;
					}
				}
				break;
				case eCommandParam.AdditionalUnrules: {

				}
				break;
				case eCommandParam.AdditionalRestrictions: { // additionalRestrictions
					// Start addition restrictions with empty array
					var nAdditionalRestrictionCount = 0;
					params.additionalRestrictions = [];

					// Split addition restrictions
					var sAdditionalRestrictionsString = args[i];
					var additionalRestrictionsArray = sAdditionalRestrictionsString.split('|');
					var sRestrictionGOKey;
					for (var nGO = 0; nGO < additionalRestrictionsArray.length; ++nGO) {
						additionalRestrictionsArray[nGO].trim();
						// Get GameObject id; check it exists
						sRestrictionGOKey = Mashups.getGameObjectKey(additionalRestrictionsArray[nGO]);
						if (null === sRestrictionGOKey) {
							this.reply(`Additionally restricted GameObject: "${additionalRestrictionsArray[nGO]}" could not be identified!`);
							return;
						}
						params.additionalRestrictions[nAdditionalRestrictionCount] = sRestrictionGOKey;
						nAdditionalRestrictionCount++;
					}
				}
				break;
				case eCommandParam.CustomTitle: // customTitle
					if ((args[i]) && ('' !== args[i])) {
						params.customTitle = args[i];
					}
					break;
				case eCommandParam.TimeToStart: // timeToStart
					params.timeToStart = args[i];
					break;
				case eCommandParam.AutoDQ: // autodq
					params.autodq = args[i];
					break;
			}
		}
		// Old but useful?
		/*
		if (params.baseFormat) { // FIXME: Need to subsplit here
			var format = Tools.parseAliases(params.baseFormat);
			if (!Formats[format] || !Formats[format].chall) return this.reply(this.trad('e31') + ' ' + format + ' ' + this.trad('e32'));
			details.format = format;
		}
		*/

		// Reset module globals
		extractedRuleArray = [];
		nExtractedRuleCount = 0;
		extractedBanArray = [];
		nExtractedBanCount = 0;
		extractedUnbanArray = [];
		nExtractedUnbanCount = 0;

		// Determine format name and base format
		var sFormatName = Formats[params.baseFormat].name;
		if (params.useCompression) {
			sFormatName = toId(sFormatName);
		}
		baseFormatDetails = Mashups.findFormatDetails(params.baseFormat);
		//this.reply(`DEBUG baseFormatDetails: ${JSON.stringify(baseFormatDetails)}`);
		var nBaseFormatTierId = Mashups.determineFormatBasisTierId(baseFormatDetails);
		nBaseGameType = Mashups.determineFormatGameTypeId(baseFormatDetails);
		nBaseGen = Mashups.determineFormatGen(baseFormatDetails);
		sBaseModName = Mashups.determineFormatMod(baseFormatDetails);
		baseFormatTierDetails = Mashups.findTierFormatDetails(nBaseFormatTierId, nBaseGen);

		// FIXME: Non-gen 7 case

		var nAddOn;
		var addOnFormat;
		var nRuleItr;

		// Check same meta is not included multiple times (pointless, fatal error)
		if (params.addOnFormats) {
			var nSubAddOn;
			var subAddOnFormat;
			for (nAddOn = 0; nAddOn < params.addOnFormats.length; ++nAddOn) {
				addOnFormat = Mashups.findFormatDetails(params.addOnFormats[nAddOn]);
				if(!addOnFormat) {
					this.reply(`Unknown add-on! : ${params.addOnFormats[nAddOn]}`);
					return;
				}

				// Check add-on is not the same as the base
				if(baseFormatDetails.name === addOnFormat.name) {
					this.reply(`An add-on format is the same as the base! : ${addOnFormat.name}`);
					return;
				}

				// Check same add-on is not included multiple times
				for (nSubAddOn = nAddOn+1; nSubAddOn < params.addOnFormats.length; ++nSubAddOn) {
					if(nAddOn === nSubAddOn) continue;
					subAddOnFormat = Mashups.findFormatDetails(params.addOnFormats[nSubAddOn]);
					if(addOnFormat.name === subAddOnFormat.name) {
						this.reply(`An add-on format appeared multiple times! : ${addOnFormat.name}`);
						return;
					}
				}
			}
		}

		// Put all involved metas into an array for robust accessing
		var sMetaArray = [params.baseFormat];
		var metaDetailsArray = [baseFormatDetails];
		for ( nAddOn = 0; nAddOn < params.addOnFormats.length; ++nAddOn) {
			sMetaArray[nAddOn+1] = params.addOnFormats[nAddOn];
			metaDetailsArray[nAddOn+1] = Mashups.findFormatDetails(params.addOnFormats[nAddOn]);
		}

		// Determine tier
		nTierId = nBaseFormatTierId; // Assume the base format's tier by default
		bTierModified = false;
		bTierIncreased = false;
		// Search add-ons for tier-altering formats
		var nTierFormatAddOnIdx = -1;
		var nTierFormatMetaIdx = -1;
		var nLoopTierId;
		if (params.addOnFormats) {
			for (nAddOn = 0; nAddOn < params.addOnFormats.length; ++nAddOn) {
				addOnFormat = Mashups.findFormatDetails(params.addOnFormats[nAddOn]);
				if(!addOnFormat) continue;
				if(!addOnFormat.name) continue;

				nLoopTierId = Mashups.determineFormatDefinitionTierId(addOnFormat.name);
				if( -1 !== nLoopTierId ) {
					// Found matching tier
					if(-1 !== nTierFormatAddOnIdx) {
						this.reply(`Found conflicting tier candidates, including : ${Mashups.tierDataArray[nTierId].name} and ${Mashups.tierDataArray[nLoopTierId].name}!`);
						return;
					}
					nTierId = nLoopTierId;
					nTierFormatAddOnIdx = nAddOn;
					nTierFormatMetaIdx = nAddOn + 1;
					bTierModified = true;
				}
			}
		}
		bIsLC = (Mashups.Tier.LC == nTierId) || (Mashups.Tier.LCUbers == nTierId);
		monitor(`DEBUG Using tier format: ${Mashups.tierDataArray[nTierId].name}`);

		// Deconstruct tier and build up bans atomically so they can be edited properly
		var nDeltaTier = nBaseFormatTierId - nTierId;
		var deltaUnbanArray = [];
		var nDeltaUnbanCount = 0;
		var bIsUbersBase = Mashups.tierDataArray[nTierId].isUbers;
		var bReachedLimit = false;
		var nRecursiveTierId;
		var bFirstLoop = true;
		var formatDetails;
		var sTierName;
		var nTierParent;
		if(nDeltaTier < 0) { // Final tier is reduced from base by an add-on tier format
			nRecursiveTierId = nTierId;
			while(!bReachedLimit) {
				sTierName = Mashups.tierDataArray[nRecursiveTierId].name;
				monitor(`sTierName: ${sTierName}`);

				// Extract rules if this tier has a format
				formatDetails = Mashups.findFormatDetails('gen7' + sTierName);
				if(null !== formatDetails) {
					monitor(`Extract tier`);
					ExtractFormatRules(formatDetails, params, true);
				}

				// Ban the whole tier if it is above base
				if(!bFirstLoop) {
					TryAddBan(sTierName, params, nRecursiveTierId);
				}

				// Move on to next tier or end
				nTierParent = Mashups.tierDataArray[nRecursiveTierId].parent;
				monitor(`nTierParent: ${nTierParent}`);
				if( (nTierParent <= nBaseFormatTierId) ||
					(Mashups.Tier.Undefined === nTierParent) ||
					(!bIsUbersBase && Mashups.tierDataArray[nTierParent].isUbers) )
				{
					bReachedLimit = true;
				}
				else {
					nRecursiveTierId = nTierParent;
				}

				bFirstLoop = false;
			}
		}
		else if(nDeltaTier > 0) { // Final tier is increased over base by an add-on tier format
			bTierIncreased = true;
			nRecursiveTierId = nBaseFormatTierId;
			var nDeltaUnbanIndexOf;
			while(!bReachedLimit) {
				sTierName = Mashups.tierDataArray[nRecursiveTierId].name;
				monitor(`sTierName: ${sTierName}`);

				// Extract rules if this tier has a format (only needed if above base)
				formatDetails = Mashups.findFormatDetails('gen7' + sTierName);
				if(!bFirstLoop) {
					if(null !== formatDetails) {
						monitor(`Extract tier`);
						ExtractFormatRules(formatDetails, params, true);
					}
				}

				// Determine if this will be the final loop
				nTierParent = Mashups.tierDataArray[nRecursiveTierId].parent;
				monitor(`nTierParent: ${nTierParent}`);
				if( (nTierParent < nTierId) ||
					(Mashups.Tier.Undefined === nTierParent) /*||
					(!bIsUbersBase && Mashups.tierDataArray[nTierParent].isUbers)*/ )
				{
					bReachedLimit = true;
				}
				else {
					nRecursiveTierId = nTierParent;
				}

				// Prevent unbans from previous tiers if they are rebanned in the upper tier
				if(null !== formatDetails) {
					monitor(`Extract bans for rebanning`);
					if(formatDetails.banlist) {
						for(nRuleItr = 0; nRuleItr < formatDetails.banlist.length; ++nRuleItr) {
							nDeltaUnbanIndexOf = deltaUnbanArray.indexOf(formatDetails.banlist[nRuleItr]);
							if(nDeltaUnbanIndexOf < 0) continue;
							deltaUnbanArray[nDeltaUnbanIndexOf] = null;
						}

						deltaUnbanArray = deltaUnbanArray.filter(function (el) {
							return el != null;
						});
						nDeltaUnbanCount = deltaUnbanArray.length;
					}
				}

				// Prepare to unban all the bans in the tier if we haven't reached limit
				if(!bReachedLimit) {
					if(null !== formatDetails) {
						monitor(`Extract bans so we can reverse them`);
						if(formatDetails.banlist) {
							for(nRuleItr = 0; nRuleItr < formatDetails.banlist.length; ++nRuleItr) {
								if(deltaUnbanArray.includes(formatDetails.banlist[nRuleItr])) continue;
								deltaUnbanArray[nDeltaUnbanCount++] = formatDetails.banlist[nRuleItr];
							}
						}
					}
				}

				bFirstLoop = false;
			}

			// Delta unban Pokemon from the base format tiered below the new tier
			var goAsPoke;
			for(nRuleItr = 0; nRuleItr < baseFormatDetails.banlist.length; ++nRuleItr) {
				goAsPoke = Mashups.getGameObjectAsPokemon(baseFormatDetails.banlist[nRuleItr]);
				if(goAsPoke) { // As Pokemon checks
					var nPokeTier = Mashups.calcPokemonTier(goAsPoke);
					monitor(`${goAsPoke.name}: nPokeTier: ${nPokeTier}, nTierId: ${nTierId}`);
					if(!Mashups.isABannedInTierB(nPokeTier, nTierId)) {
						deltaUnbanArray[nDeltaUnbanCount++] = baseFormatDetails.banlist[nRuleItr];
					}
				}
			}

			// Effect the delta unbans
			for(nRuleItr = 0; nRuleItr < deltaUnbanArray.length; ++nRuleItr) {
				TryAddUnban(deltaUnbanArray[nRuleItr], params, nTierId, true);
			}
		}
		// Otherwise, the base and final tier match, so we don't need to do anything

		// Determine tour name
		{ // FIXME: Make tier meta last
			var sGenStrippedName;
			var nAAAIdx = -1;
			var sAAAPlaceholderToken = '@@@';
			var sMnMPlaceholderToken = '$$$';
			var bIncludesMnM = false;
			var bIncludesSubstantiveNonMnM = false;
			var bIncludesStabmons = false;

			var sMetaNameBasis;
			var sReplacePlaceholderContent;

			var sTourName = '[Gen 7] ';
			for ( var nMetaItr = 0; nMetaItr < sMetaArray.length; ++nMetaItr) {
				// Special cases
				sGenStrippedName = Mashups.genStripName(sMetaArray[nMetaItr]);
				switch(sGenStrippedName) {
					case 'almostanyability':
						nAAAIdx = nMetaItr;
						sTourName += sAAAPlaceholderToken;
						continue;
					case 'mixandmega':
						bIncludesMnM = true;
						sTourName += sMnMPlaceholderToken;
						continue;
					case 'stabmons':
						bIncludesStabmons = true;
						bIncludesSubstantiveNonMnM = true;
						break;
					default:
						if( nTierFormatMetaIdx !== nMetaItr) {
							bIncludesSubstantiveNonMnM = true;
						}
						break;
				}

				// Spacing
				if(nMetaItr > 0) sTourName += ' ';

				// Append name as normal
				if(metaDetailsArray[nMetaItr]) {
					sMetaNameBasis = Mashups.genStripName(metaDetailsArray[nMetaItr].name);
				}
				else {
					sMetaNameBasis = sMetaArray[nMetaItr];
				}
				sTourName += sMetaNameBasis;
			}

			// Post-process for special case meta names
			if(bIncludesMnM) {
				sReplacePlaceholderContent = '';
				if(bIncludesSubstantiveNonMnM) {
					sTourName += ' n Mega';
				}
				else {
					sReplacePlaceholderContent = 'Mix and Mega';
				}
				sTourName = sTourName.replace(sMnMPlaceholderToken, sReplacePlaceholderContent);
			}
			if( nAAAIdx >= 0 ) {
				sReplacePlaceholderContent = '';
				if(sTourName.includes('STABmons')) { // Prioritise stabmons
					sTourName = sTourName.replace('STABmons', 'STAAABmons');
				}
				else if(sTourName.includes('a')) { // Replace letter a/A if we can
					sTourName = sTourName.replace('a', 'AAA');
				}
				else if(sTourName.includes('A')) {
					sTourName = sTourName.replace('A', 'AAA');
				}
				else { // Otherwise just fill in as AAA in ordered place
					if(0 === nAAAIdx) {
						sReplacePlaceholderContent += 'AAA';
					}
					else {
						sReplacePlaceholderContent += ' AAA';
					}
				}
				sTourName = sTourName.replace(sAAAPlaceholderToken, sReplacePlaceholderContent);
			}

			// Remove double spaces
			sTourName = sTourName.replace('  ', ' ');

			// Custom name option
			if (params.customTitle) {
				sTourName = params.customTitle;
			}
		}

		// Determine tour rules
		var tourRulesArray = [];
		var nTourRuleCount = 0;
		{
			// Add rules from add-ons
			if (params.addOnFormats) {
				//this.reply(`DEBUG reached addOnFormats`);

				var nExistingRuleItr;
				var bIgnoreRule;
				var sCurrentRule;
				for ( nAddOn = 0; nAddOn < params.addOnFormats.length; ++nAddOn) {
					//addOnFormat = Formats[params.addOnFormats[nAddOn]];
					addOnFormat = Mashups.findFormatDetails(params.addOnFormats[nAddOn]);
					monitor(`DEBUG addOnFormats[${nAddOn}]: ${JSON.stringify(addOnFormat)}`);

					// Don't do anything here with a tier add-on, as that should be handled above
					if(nTierFormatAddOnIdx === nAddOn) {
						monitor(`DEBUG Ignoring as tier format...`);
						continue;
					}

					ExtractFormatRules(addOnFormat, params);

					// Format-exclusive unique behaviours
					if(!addOnFormat) continue;
					// FIXME: Others
					switch(toId(addOnFormat.name)) {
						case 'gen7cap':
						if (extractedUnbanArray) {
							extractedUnbanArray[nExtractedUnbanCount++] = 'Crucibellite';
							deltaUnbanArray[nDeltaUnbanCount++] = 'Crucibellite';
						}
						break;
					}
				}
			}

			// Post-processes
			if(extractedUnbanArray) { // Cull extracted unbans that aren't included in base and every add-on (unbans are an intersection not union)
				var goAsPoke;
				var nPokeTier;
				for (var nRuleItr = 0; nRuleItr < extractedUnbanArray.length; ++nRuleItr) {
					// Delta unbans are whitelisted
					if(deltaUnbanArray.includes(extractedUnbanArray[nRuleItr])) continue;

					// Whitelist pokes that have been legalised by final tier to support ubers, etc
					goAsPoke = Mashups.getGameObjectAsPokemon(extractedUnbanArray[nRuleItr]);
					if(goAsPoke) { // As Pokemon checks
						nPokeTier = Mashups.calcPokemonTier(goAsPoke);
						if(!Mashups.isABannedInTierB(nPokeTier, nTierId)) {
							continue;
						}
					}

					// Nullify unbans that are banned by base format
					if(!baseFormatDetails.unbanlist || (!baseFormatDetails.unbanlist.includes(extractedUnbanArray[nRuleItr]))) {
						extractedUnbanArray[nRuleItr] = null;
						continue;
					}

					if (params.addOnFormats) { // Nullify unbans that are banned by any add-on
						for ( nAddOn = 0; nAddOn < params.addOnFormats.length; ++nAddOn) {
							addOnFormat = Mashups.findFormatDetails(params.addOnFormats[nAddOn]);
							if(!addOnFormat) continue;

							if(!addOnFormat.unbanlist || !addOnFormat.unbanlist.includes(extractedUnbanArray[nRuleItr])) {
								extractedUnbanArray[nRuleItr] = null;
								continue;
							}
						}
					}
				}

				extractedUnbanArray = extractedUnbanArray.filter(function (el) {
					return el != null;
				});

				nExtractedUnbanCount = extractedUnbanArray.length;
			}

			// Generate warning list
			var warningArray = [];
			if (params.addOnFormats) {
				var nAddOnGameType;
				var nAddOnGen;
				var sAddOnMod;
				var sWarningStatement;
				var sGenericMetaName;
				var sGOKey;
				for ( nAddOn = 0; nAddOn < params.addOnFormats.length; ++nAddOn) {
					addOnFormat = Mashups.findFormatDetails(params.addOnFormats[nAddOn]);
					if(!addOnFormat) continue;

					// Mod conflict check - this is almost certain to be a fatal problem
					sAddOnMod = Mashups.determineFormatMod(addOnFormat);
					if( (sAddOnMod !== sBaseModName) && (!Mashups.isDefaultModName(sAddOnMod)) ) {
						sWarningStatement = `Mod Conflict: "${sAddOnMod}" in add-on "${addOnFormat.name}" conflicts with base mod "${sBaseModName}"!`;
						warningArray.push(sWarningStatement);
					}

					// FIXME: We could test for the existence of onBeforeSwitchIn etc in addOns

					// Whitelist certain add-ons that we know will work cross-gen/gametype
					sGenericMetaName = Mashups.genericiseMetaName(addOnFormat.name);
					switch(sGenericMetaName) {
						case 'almostanyability':
						case 'stabmons':
						case 'balancedhackmons':
						continue;
					}

					// GameType conflict check
					nAddOnGameType = Mashups.determineFormatGameTypeId(addOnFormat);
					if(nAddOnGameType !== nBaseGameType) {
						sWarningStatement = `GameType Conflict: gametype "${Mashups.GameTypeDataArray[nAddOnGameType].name}" of add-on "${addOnFormat.name}" conflicts with base gametype "${Mashups.GameTypeDataArray[nBaseGameType].name}"!`;
						warningArray.push(sWarningStatement);
					}

					// Gen conflict check
					nAddOnGen = Mashups.determineFormatGen(addOnFormat);
					if(nAddOnGen !== nBaseGen) {
						sWarningStatement = `Generation Conflict: addOn "${addOnFormat.name}" is [Gen ${nAddOnGen.toString()}] but base format is [Gen ${nBaseGen.toString()}]!`;
						warningArray.push(sWarningStatement);
					}
				}

				if(params.additionalBans) { // Check param bans are real GameObjects
					for(nRuleItr = 0; nRuleItr < params.additionalBans.length; ++nRuleItr) {
						// Get GameObject id; check it exists
						sGOKey = Mashups.getGameObjectKey(params.additionalBans[nRuleItr]);
						if(sGOKey) continue;
						sWarningStatement = `Unidentified additional ban: "${params.additionalBans[nRuleItr]}" could not be identified as a real GameObject!`;
						warningArray.push(sWarningStatement);
					}
				}
				if(params.additionalUnbans) { // Added param unbans
					for(nRuleItr = 0; nRuleItr < params.additionalUnbans.length; ++nRuleItr) {
						// Get GameObject id; check it exists
						sGOKey = Mashups.getGameObjectKey(params.additionalUnbans[nRuleItr]);
						if(sGOKey) continue;
						sWarningStatement = `Unidentified additional unban: "${params.additionalUnbans[nRuleItr]}" could not be identified as a real GameObject!`;
						warningArray.push(sWarningStatement);
					}
				}
			}

			// Lock bans/unbans at this point and concatenate '+'/'-'
			if(extractedBanArray) { // Inherent bans
				for (nRuleItr = 0; nRuleItr < extractedBanArray.length; ++nRuleItr) {
					extractedBanArray[nRuleItr] = '-' + extractedBanArray[nRuleItr];
				}
			}
			if(params.additionalBans) { // Added param bans
				for (nRuleItr = 0; nRuleItr < params.additionalBans.length; ++nRuleItr) {
					params.additionalBans[nRuleItr] = '-' + params.additionalBans[nRuleItr];
				}
			}
			if(extractedUnbanArray) { // Inherent unbans
				for (nRuleItr = 0; nRuleItr < extractedUnbanArray.length; ++nRuleItr) {
					extractedUnbanArray[nRuleItr] = '+' + extractedUnbanArray[nRuleItr];
				}
			}
			if(params.additionalUnbans) { // Added param unbans
				for (nRuleItr = 0; nRuleItr < params.additionalUnbans.length; ++nRuleItr) {
					params.additionalUnbans[nRuleItr] = '+' + params.additionalUnbans[nRuleItr];
				}
			}

			// Construct final rules array from concatenated content
			if (extractedRuleArray) { // Put inherent rules in first
				tourRulesArray = tourRulesArray.concat(extractedRuleArray);
			}
			if (params.additionalRules) { // Then added param rules
				tourRulesArray = tourRulesArray.concat(params.additionalRules);
			}
			if(extractedBanArray) { // Inherent bans
				tourRulesArray = tourRulesArray.concat(extractedBanArray);
			}
			if(params.additionalBans) { // Added param bans
				tourRulesArray = tourRulesArray.concat(params.additionalBans);
			}
			if(extractedUnbanArray) { // Inherent unbans
				tourRulesArray = tourRulesArray.concat(extractedUnbanArray);
			}
			if(params.additionalUnbans) { // Added param unbans
				tourRulesArray = tourRulesArray.concat(params.additionalUnbans);
			}

			nTourRuleCount = tourRulesArray.length;
		}

		// Construct tour code string
		let sTourCode = '';
		sTourCode += `/tour new ${sFormatName}, ${params.type}, 32,1\n`;
		sTourCode += `/tour autostart ${params.timeToStart}\n`;
		if (nTourRuleCount > 0) { // Constructed rules
			sTourCode += `/tour rules `;
			for (nRuleItr = 0; nRuleItr < tourRulesArray.length; ++nRuleItr) {
				if (nRuleItr > 0) {
					sTourCode += `, `;
				}
				sTourCode += `${tourRulesArray[nRuleItr]}`;
			}
			sTourCode += `\n`;
		}
		sTourCode += `/tour name ${sTourName}\n`;

		// Print out as !code
		let sStatement = '!code ' + sTourCode;
		if (sStatement) this.reply(sStatement);

		// Print out warnings (after, so we don't hit message limit with tour code output itself)
		if(warningArray.length > 0) {
			var sWarningPlural = ( warningArray.length > 1 ) ? 'warnings' : 'warning';
			this.reply(`Code generation triggered ${warningArray.length.toString()} ${sWarningPlural}:-`);
			var sWarningStatement = '!code ';
			for(var nWarnItr=0; nWarnItr<warningArray.length; ++nWarnItr) {
				sWarningStatement += warningArray[nWarnItr];
				sWarningStatement += `\n`;
			}
			if (sWarningStatement) this.reply(sWarningStatement);
		}
	}
};

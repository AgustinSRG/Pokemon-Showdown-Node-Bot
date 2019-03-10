/*
	Commands for tour code generation
*/

var Mashups = exports.Mashups = require('./../features/mashups/index.js');

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
			// FIXME: Might need 'unrules'
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
				case 0: // baseFormat
					// Search base format as a server native format
					params.baseFormat = Mashups.getFormatKey(args[i]);
					// FIXME: Add support for common compund bases like PH
					if (null === params.baseFormat) {
						this.reply(`Base format: "${args[i]}" not found on this server!`);
						return;
					}
					if (Mashups.isFormatTierDefinition(params.baseFormat)) {
						this.reply(`Base format shouldn't be a tier definition! (Identified as "${args[i]}".)`);
						return;
					}
					break;
				case 1: { // addOnFormats
					// Start add-ons with empty array
					var nAddOnCount = 0;
					params.addOnFormats = [];

					// FIXME: Check and warn about formats that probably won't work as add-ons

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
						// FIXME: Add support for common compund bases like PH
						if (null === sAddOnKey) {
							this.reply(`Add-on format: "${addOnFormatsArray[nAddOn]}" not found on this server!`);
							return;
						}
						params.addOnFormats[nAddOnCount] = sAddOnKey;
						nAddOnCount++;
					}
				}
					break;
				case 2: { // additionalBans
					// Start addition bans with empty array
					var nAdditionalBanCount = 0;
					params.additionalBans = [];

					// Split addition bans
					var sAdditionalBansString = args[i];
					var additionalBansArray = sAdditionalBansString.split('|');
					var sBanGOKey;
					for (var nGO = 0; nGO < additionalBansArray.length; ++nGO) {
						additionalBansArray[nGO].trim();
						// Get GameObject id; check it exists
						sBanGOKey = Mashups.getGameObjectKey(additionalBansArray[nGO]);
						if (null === sBanGOKey) {
							this.reply(`Additionally banned GameObject: "${additionalBansArray[nGO]}" could not be identified!`);
							return;
						}
						params.additionalBans[nAdditionalBanCount] = sBanGOKey;
						nAdditionalBanCount++;
					}
				}
					break;
				case 3: { // additionalUnbans
					// Start addition unbans with empty array
					var nAdditionalUnbanCount = 0;
					params.additionalUnbans = [];

					// Split addition unbans
					var sAdditionalUnbansString = args[i];
					var additionalUnbansArray = sAdditionalUnbansString.split('|');
					var sUnbanGOKey;
					for (var nGO = 0; nGO < additionalUnbansArray.length; ++nGO) {
						additionalUnbansArray[nGO].trim();
						// Get GameObject id; check it exists
						sUnbanGOKey = Mashups.getGameObjectKey(additionalUnbansArray[nGO]);
						if (null === sUnbanGOKey) {
							this.reply(`Additionally unbanned GameObject: "${additionalUnbansArray[nGO]}" could not be identified!`);
							return;
						}
						params.additionalUnbans[nAdditionalUnbanCount] = sUnbanGOKey;
						nAdditionalUnbanCount++;
					}
				}
					break;
				case 4: { // additionalRestrictions
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
				case 5: { // additionalRules
					var nAdditionalRuleCount = 0;
					params.additionalRules = [];

					// Split addition restrictions
					var sAdditionalRulesString = args[i];
					var additionalRulesArray = sAdditionalRulesString.split('|');
					var sRuleKey;
					for (var nRule = 0; nRule < additionalRulesArray.length; ++nRule) {
						additionalRulesArray[nRule].trim();
						// FIXME: Somehow pull and validate rules?
						params.additionalRules[nAdditionalRuleCount] = sRuleKey;
						nAdditionalRuleCount++;
					}
				}
					breaks;
				case 6: // customTitle
					if ((args[i]) && ('' !== args[i])) {
						params.customTitle = args[i];
					}
					break;
				case 7: // timeToStart
					params.timeToStart = args[i];
					break;
				case 8: // autodq
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

		// Determine format name and base format
		var sFormatName = Formats[params.baseFormat].name;
		if (params.useCompression) {
			sFormatName = toId(sFormatName);
		}
		//var baseFormat = Formats[params.baseFormat];
		var baseFormat = Mashups.findFormatDetails(params.baseFormat);
		//this.reply(`DEBUG baseFormat: ${JSON.stringify(baseFormat)}`);

		// FIXME: Non-gen 7 case

		var nAddOn;
		var addOnFormat;

		// FIXME: Check same meta is not included multiple times
		if (params.addOnFormats) {
			var nSubAddOn;
			var subAddOnFormat;
			for (nAddOn = 0; nAddOn < params.addOnFormats.length; ++nAddOn) {
				addOnFormat = Mashups.findFormatDetails(params.addOnFormats[nAddOn]);

				if(baseFormat.name === addOnFormat.name) {
					this.reply(`An add-on format is the same as the base! : ${addOnFormat.name}`);
					return;
				}

				for (nSubAddOn = nAddOn+1; nSubAddOn < params.addOnFormats.length; ++nSubAddOn) {

				}
			}
		}

		// Determine tier
		var nTierId = Mashups.Tier.OU; // We use OU by default
		// Search add-ons for tier-altering formats
		var nTierFormatAddOnIdx = -1;
		var nLoopTierId;
		if (params.addOnFormats) {
			for (nAddOn = 0; nAddOn < params.addOnFormats.length; ++nAddOn) {
				addOnFormat = Mashups.findFormatDetails(params.addOnFormats[nAddOn]);
				if(!addOnFormat) continue;
				if(!addOnFormat.name) continue;

				nLoopTierId = Mashups.determineFormatTierId(addOnFormat.name);
				if( -1 !== nLoopTierId ) {
					// Found matching tier
					if(-1 !== nTierFormatAddOnIdx) {
						this.reply(`Found conflicting tier candidates, including : ${Mashups.tierDataArray[nTierId].name} and ${Mashups.tierDataArray[nLoopTierId].name}!`);
						return;
					}
					nTierId = nLoopTierId;
					nTierFormatAddOnIdx = nAddOn;
				}
			}
		}
		monitor(`DEBUG Using tier format: ${Mashups.tierDataArray[nTierId].name}`);

		// Deconstruct tier and build up bans atomically so they can be edited properly
		var bIsUbersBase = Mashups.tierDataArray[nTierId].isUbers;
		var bReachedLimit = false;
		if(!bReachedLimit) {
			
		}

		// FIXME: Implement
		// Determine tour name
		var sTourName = '[Gen 7] Generated Tour';
		if (params.customTitle) {
			sTourName = params.customTitle;
		}

		// Determine tour rules
		var tourRulesArray = [];
		var nTourRuleCount = 0;
		{
			var nRuleItr;

			// Add rules from add-ons
			if (params.addOnFormats) {
				//this.reply(`DEBUG reached addOnFormats`);

				var nExistingRuleItr;
				var extractedRuleArray = [];
				var nExtractedRuleCount = 0;
				var extractedBanArray = [];
				var nExtractedBanCount = 0;
				var extractedUnbanArray = [];
				var nExtractedUnbanCount = 0;
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

					if(!addOnFormat) continue;
					if(!addOnFormat.name) continue;

					// ruleset
					if (addOnFormat.ruleset) {
						monitor(`DEBUG ruleset`);
						for (nRuleItr = 0; nRuleItr < addOnFormat.ruleset.length; ++nRuleItr) {
							bIgnoreRule = false;
							sCurrentRule = addOnFormat.ruleset[nRuleItr];

							monitor(`DEBUG ruleset[${nRuleItr}]: ${sCurrentRule}`);

							// This rule has no value on a separate base and disrupts mashups
							if( 'gen7ou' === toId(sCurrentRule) ) {
								continue;
							}

							// Ignore rules that are already in the base format
							if(baseFormat.ruleset) {
								for (nExistingRuleItr = 0; nExistingRuleItr < baseFormat.ruleset.length; ++nExistingRuleItr) {
									if (baseFormat.ruleset[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
									if (bIgnoreRule) continue;
								}
							}

							if (params.additionalRules) { // Ignore rules that are redundant because they have already been added in params
								for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalRules.length; ++nExistingRuleItr) {
									if (params.additionalRules[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							if (extractedRuleArray) { // Ignore rules that are already in extractedRuleArray
								for (nExistingRuleItr = 0; nExistingRuleItr < extractedRuleArray.length; ++nExistingRuleItr) {
									if (extractedRuleArray[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							monitor(`DEBUG ruleset survived culling: ${sCurrentRule}`);

							// Add relevant rule
							extractedRuleArray[nExtractedRuleCount] = sCurrentRule;
							nExtractedRuleCount++;
						}
					}

					// banlist
					if (addOnFormat.banlist) {
						monitor(`DEBUG banlist`);
						for (nRuleItr = 0; nRuleItr < addOnFormat.banlist.length; ++nRuleItr) {
							bIgnoreRule = false;
							sCurrentRule = addOnFormat.banlist[nRuleItr];

							monitor(`DEBUG banlist[${nRuleItr}]: ${sCurrentRule}`);

							// Ignore bans that are already in the base format
							for (nExistingRuleItr = 0; nExistingRuleItr < baseFormat.banlist.length; ++nExistingRuleItr) {
								if (baseFormat.banlist[nExistingRuleItr] === sCurrentRule) {
									bIgnoreRule = true;
									break;
								}
								if (bIgnoreRule) continue;
							}

							//monitor(`DEBUG ban survived culling 0: ${sCurrentRule}`);

							if (params.additionalBans) { // Ignore bans that are redundant because they have already been added in params
								for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalBans.length; ++nExistingRuleItr) {
									if (params.additionalBans[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							//monitor(`DEBUG ban survived culling 1: ${sCurrentRule}`);

							if (params.additionalUnbans) { // Ignore unbans that are in unbans params because we want that to take priority
								for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalUnbans.length; ++nExistingRuleItr) {
									if (params.additionalUnbans[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							if (extractedBanArray) { // Ignore bans that are already in extractedBanArray
								for (nExistingRuleItr = 0; nExistingRuleItr < extractedBanArray.length; ++nExistingRuleItr) {
									if (extractedBanArray[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
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
					}

					// unbanlist
					if (addOnFormat.unbanlist) {
						monitor(`DEBUG unbanlist`);
						for (nRuleItr = 0; nRuleItr < addOnFormat.unbanlist.length; ++nRuleItr) {
							bIgnoreRule = false;
							sCurrentRule = addOnFormat.unbanlist[nRuleItr];

							monitor(`DEBUG unbanlist[${nRuleItr}]: ${sCurrentRule}`);

							// Ignore unbans that are already in the base format
							if(baseFormat.unbanlist) {
								for (nExistingRuleItr = 0; nExistingRuleItr < baseFormat.unbanlist.length; ++nExistingRuleItr) {
									if (baseFormat.unbanlist[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							if (params.additionalUnbans) { // Ignore unbans that are redundant because they have already been added in params
								for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalUnbans.length; ++nExistingRuleItr) {
									if (params.additionalUnbans[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							if (extractedUnbanArray) { // Ignore unbans that are already in extractedUnbanArray
								for (nExistingRuleItr = 0; nExistingRuleItr < extractedUnbanArray.length; ++nExistingRuleItr) {
									if (extractedUnbanArray[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							if (params.additionalBans) { // Ignore unbans that are in ban params under all circumstances because we clearly want to definitely ban that thing
								for (nExistingRuleItr = 0; nExistingRuleItr < params.additionalBans.length; ++nExistingRuleItr) {
									if (params.additionalBans[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							if (extractedBanArray) { //Ignore unbans that were implicitely banned by another meta (if they were in unban params also we would already have continued)
								for (nExistingRuleItr = 0; nExistingRuleItr < extractedBanArray.length; ++nExistingRuleItr) {
									if (extractedBanArray[nExistingRuleItr] === sCurrentRule) {
										bIgnoreRule = true;
										break;
									}
								}
								if (bIgnoreRule) continue;
							}

							monitor(`DEBUG unban survived culling: ${sCurrentRule}`);

							// Add relevant unban
							extractedUnbanArray[nExtractedUnbanCount] = sCurrentRule;
							nExtractedUnbanCount++;
						}
					}

					// Format-exclusive unique behaviours
					// FIXME:
					switch(toId(addOnFormat.name)) {
						case 'gen7cap':
						if (extractedUnbanArray) {
							extractedUnbanArray[nExtractedUnbanCount] = 'Crucibellite';
							nExtractedUnbanCount++;
						}
						break;
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

		let sStatement = '!code ' + sTourCode;

		if (sStatement) this.reply(sStatement);
	}
};

/*
	Commands for Mashups room management
*/

var Mashups = exports.Mashups = require('./../features/mashups/index.js');
var TourCodeManager = exports.Mashups = require('./../features/mashups/tour-code-manager.js');
var Tournaments = exports.Tournaments = require('./../features/tournaments/index.js');

exports.commands = {
	resettours: 'resettourratio',
	resettourratio: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('driver'))) return false;

        Mashups.resetCompletedTourAuthTypeArray();
        Mashups.save();

        var sAnalysisStatement = Mashups.analyseTourAuthTypeCountStatement();
	    if (sAnalysisStatement) Bot.say(room, sAnalysisStatement);
    },
    setofficialcount: 'setofficialtourscount',
    setofficialtourscount: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('driver'))) return false;

        Mashups.setCompletedTourAuthTypeCount(Mashups.MashupAuthType.Official, parseInt(arg));
        Mashups.save();

        var sAnalysisStatement = Mashups.analyseTourAuthTypeCountStatement();
	    if (sAnalysisStatement) Bot.say(room, sAnalysisStatement);
    },
    setspotlightcount: 'setspotlighttourscount',
    setspotlighttourscount: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('driver'))) return false;

        Mashups.setCompletedTourAuthTypeCount(Mashups.MashupAuthType.Spotlight, parseInt(arg));
        Mashups.save();

        var sAnalysisStatement = Mashups.analyseTourAuthTypeCountStatement();
	    if (sAnalysisStatement) Bot.say(room, sAnalysisStatement);
    },
    setothercount: 'setothertourscount',
    setothertourscount: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('driver'))) return false;

        Mashups.setCompletedTourAuthTypeCount(Mashups.MashupAuthType.Other, parseInt(arg));
        Mashups.save();

        var sAnalysisStatement = Mashups.analyseTourAuthTypeCountStatement();
	    if (sAnalysisStatement) Bot.say(room, sAnalysisStatement);
    },
    analysetours: 'analysetourratio',
	analysetourratio: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('voice'))) return false;

        var sAnalysisStatement = Mashups.analyseTourAuthTypeCountStatement();
	    if (sAnalysisStatement) Bot.say(room, sAnalysisStatement);
    },
    refresh: 'refreshtourcodes',
	refreshtourcodes: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('driver'))) return false;

        TourCodeManager.refreshTourCodeCache(room);
        this.reply(`Attempting to refresh tour code cache...`);
    },
    checktourcodes: 'checkcachedtourcodes',
	checkcachedtourcodes: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('voice'))) return false;

        var sNames = TourCodeManager.nameCachedTourCodes();
        this.reply('!code ' + sNames);
    },
	starttour: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('driver'))) return false;

        const validFormatKey = TourCodeManager.replyToSearchValidDynamicFormatKey(this, arg);
        if(!validFormatKey) return;

        this.reply(TourCodeManager.searchTourCode(validFormatKey));
    },
    preview: 'previewtour',
	previewtour: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('voice'))) return false;

        const validFormatKey = TourCodeManager.replyToSearchValidDynamicFormatKey(this, arg);
        if(!validFormatKey) return;

        this.reply('!code ' + TourCodeManager.searchTourCode(validFormatKey));
    },
    mashup: 'tier',
    om: 'tier',
    tier: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('voice'))) return false;

        const validFormatKey = TourCodeManager.replyToSearchValidDynamicFormatKey(this, arg);
        if(!validFormatKey) return;

        const formatRaw = TourCodeManager.generateDynamicFormatRaw(validFormatKey);
        if(!formatRaw) {
            this.reply(`generateDynamicFormatRaw failed for format: ` + arg);
            return;
        }

        var sOutput = '!code ';

        // Name
        sOutput += formatRaw.name;

        // Description
        if (formatRaw.description) {
            sOutput += '\n';
            sOutput += formatRaw.description;
        }

        // Resource threads
        // 20/02/13: Seems pointless unless we can output in HTML
        /*const baseFormatDetails = formatRaw.baseFormatDetails;
        if (baseFormatDetails) {
            let combinedThreadsArray = [];
            if(baseFormatDetails.threads) {
                // Base format vanilla threads
                combinedThreadsArray = combinedThreadsArray.concat(baseFormatDetails.threads);
                combinedThreadsArray = combinedThreadsArray.map(sItem => sItem.replace(`">`, `">Vanilla `));
            }
            // Mashup generic resources
            let sGenericThread = 'Resources: '+TourCodeManager.GenericResourcesLink;
            combinedThreadsArray.unshift(sGenericThread);
            sOutput += '\n';
            sOutput += combinedThreadsArray.join('\n');
        }*/

        // Ruleset
        var rulesArray = formatRaw.rulesArray;
        if (rulesArray && rulesArray.length > 0) {
            sOutput += '\n\n';
            sOutput += 'Ruleset: ';
            sOutput += TourCodeManager.formatRulesArrayForDispay(rulesArray);
        }

        // Bans
        var bansArray = formatRaw.bansArray;
        if (bansArray && bansArray.length > 0) {
            sOutput += '\n\n';
            sOutput += 'Bans: ';
            sOutput += TourCodeManager.formatRulesArrayForDispay(bansArray);
        }

        // Unbans
        var unbansArray = formatRaw.unbansArray;
        if (unbansArray && unbansArray.length > 0) {
            sOutput += '\n\n';
            sOutput += 'Unbans: ';
            sOutput += TourCodeManager.formatRulesArrayForDispay(unbansArray);
        }

        // Restricted
        var restrictedArray = formatRaw.restrictedArray;
        if (restrictedArray && restrictedArray.length > 0) {
            sOutput += '\n\n';
            sOutput += 'Restricted: ';
            sOutput += TourCodeManager.formatRulesArrayForDispay(restrictedArray);
        }

        // Tour Code URL
        const sURL = TourCodeManager.searchTourCodeURL(validFormatKey);
        if (sURL) {
            sOutput += '\n\n';
            sOutput += 'Tour Code URL: '+sURL;
        }

        this.reply(sOutput);
    },
    schedule: 'dailyschedule',
    dailyschedule: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('voice'))) return false;

        var sDailyRawContent = TourCodeManager.DailyRawContent;
        var rawContentPerDayArray = sDailyRawContent.split('\n');
        var dayDictionary = {};
        var splitArray, timeSplitArray, sTimeSlot, sDay, dHour, dTime, nDay, sFormatGroup;
        for(let sDayContent of rawContentPerDayArray) {
            sDayContent = sDayContent.replace(/ +(?= )/g,''); // Ensure the line of text is single-spaced
            //console.log(sDayContent);
            splitArray = sDayContent.split(':');
            sTimeSlot = splitArray[0];
            if(splitArray.length > 1) {
                sFormatGroup = splitArray[1].trim();
                if('spotlight' === toId(sFormatGroup)) {
                    sFormatGroup = `Spotlight (${TourCodeManager.SpotlightNamesArray[0]})`;
                }
                else {
                    for(let name of TourCodeManager.SpotlightNamesArray) {
                        //console.log(name);
                        if(toId(sFormatGroup) !== toId(name)) continue;
                        sFormatGroup = `Free (would be ${name} if it wasn't spotlight)`;
                        break;
                    }
                }
            }
            else {
                sFormatGroup = '';
            }
            timeSplitArray = sDayContent.split(',');
            sDay = timeSplitArray[0].trim();
            if(timeSplitArray.length > 1) {
                dHour = TourCodeManager.parseTime(timeSplitArray[1]);
            }
            else {
                dHour = new Date();
            }

            dayDictionary[sDay] = {
                hour: dHour.getUTCHours(),
                day: TourCodeManager.parseDay(sDay),
                formatgroup: sFormatGroup
            };
        }

        var sOutput = '';

        var dNow = TourCodeManager.convertDateToUTC(new Date(Date.now()));
        var nCurrentDay = dNow.getUTCDay();
        
        var sSoonestDailyKey = null, nSoonestDailyDeltaTime;
        var dTestDate, nDeltaDays, nDeltaTime;
        for (let key in dayDictionary) {
            nDeltaDays = (dayDictionary[key].day < nCurrentDay) ? (6 - nCurrentDay) + dayDictionary[key].day : dayDictionary[key].day - nCurrentDay;
            //console.log('nDeltaDays: ' + nDeltaDays);
            dTestDate = TourCodeManager.addDays(dNow, nDeltaDays);
            dTestDate.setUTCHours(dayDictionary[key].hour);
            dTestDate.setUTCMinutes(0);
            dTestDate.setUTCSeconds(0);
            nDeltaTime = dTestDate - dNow;
            if(!sSoonestDailyKey || (nSoonestDailyDeltaTime > nDeltaTime)) {
                sSoonestDailyKey = key;
                nSoonestDailyDeltaTime = nDeltaTime;
            }
        }
        if(sSoonestDailyKey) {
            var nSeconds = Math.floor(nSoonestDailyDeltaTime/1000);
            var nMinutes = Math.floor(nSeconds/60);
            var nHours = Math.floor(nMinutes/60);
            var nDays = Math.floor(nHours/24);

            nHours = nHours-(nDays*24);
            nMinutes = nMinutes-(nDays*24*60)-(nHours*60);

            sOutput += `!code Next daily: ${dayDictionary[sSoonestDailyKey].formatgroup} in `;
            if(nHours > 0) {
                sOutput += `${nHours} hours, `;
            }
            sOutput += `${nMinutes} minutes.`;
        }

        sOutput += '\n\nThis is the OM Mashups daily tour schedule:-\n';
        //sOutput += '<br><div class="infobox">';
        var bFirstLoop = true;
        for (let key in dayDictionary) {
            //console.log(key + ' is ' + dayDictionary[key]);
            if(!bFirstLoop) {
                sOutput += '\n';
            }
            sOutput += key+': '+dayDictionary[key].formatgroup;
            bFirstLoop = false;
        }
        //sOutput += '</div>';

        //this.reply('/addhtmlbox ' + sOutput);
        this.reply(sOutput);
    },
    genmashupformats: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('admin'))) return false;

        this.reply(`Attempting to generate mashups format data...`);

        const bSucceeded = TourCodeManager.generateMashupFormats();
        if(bSucceeded) {
            this.reply(`Succeeded!`);
        }
        else {
            this.reply(`Failed...`);
        }
    },
    nottrickmode: 'trickmode',
	trickmode: function (arg, user, room, cmd) {
        if (('thenumberman' !== toId(user)) &&
            ('pokapk' !== toId(user)) &&
            ('cringemeta' !== toId(user)) ) return false;

		if (cmd === "nottrickmode") {
			if (!Tournaments.getTrickMode()) return this.reply("Already not in Trick Mode!");
			Tournaments.setTrickMode(false);
			this.reply("Trick Mode turned off!");
		} else {
			if (Tournaments.getTrickMode()) return this.reply("Already in Trick Mode!");
			Tournaments.setTrickMode(true);
			this.reply("Trick Mode turned on!");
		}
	},
};

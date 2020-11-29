/*
	Commands for Mashups room management
*/

var Mashups = exports.Mashups = require('./../features/mashups/index.js');
var TourCodeManager = exports.Mashups = require('./../features/mashups/tour-code-manager.js');

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

        var result = TourCodeManager.startTour(arg);
        if(!result) {
            if('spotlight' === toId(arg)) {
                this.reply(`Could not find tour code matching spotlight names metadata.`);
            }
            else {
                this.reply(`Could not find tour code data for format: ` + arg);
            }
            return;
        }

        this.reply(result);
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
    }
};

/*
* Tour code manager
*/

var fs = require('fs');

var Mashups = exports.Mashups = require('./index.js');
var DataDownloader = exports.DataDownloader = require('./../../data-downloader.js');

var allSettled = require('promise.allsettled');

const TourCodesURLRoot = 'https://raw.githubusercontent.com/TheNumberMan/OperationTourCode/master/';
const OfficialPathExtension = 'official/';
const OtherPathExtension = 'other/';
const MetadataPathExtension = 'metadata/';
const ListFName = 'list.txt';
const SpotlightNamesFName = 'spotlightnames.txt';
const DailyRawContentFName = 'dailyschedule.txt';
const TourExt = '.tour';

const MashupsURLRoot = TourCodesURLRoot + 'mashups/';
const MashupsMetadataURLRoot = MashupsURLRoot + MetadataPathExtension;
const SpotlightNamesURL = MashupsMetadataURLRoot + SpotlightNamesFName;
const DailyRawContentURL = MashupsMetadataURLRoot + DailyRawContentFName;
const OfficialURLRoot = MashupsURLRoot + OfficialPathExtension;
const OfficialMetadataURLRoot = OfficialURLRoot + MetadataPathExtension;
const OfficialListURL = OfficialMetadataURLRoot + ListFName;
const OtherURLRoot = MashupsURLRoot + OtherPathExtension;
const OtherMetadataURLRoot = OtherURLRoot + MetadataPathExtension;
const OtherListURL = OtherMetadataURLRoot + ListFName;

const LocalOTCRoot = 'operationtourcode/';
const LocalOTCMetadataPath = LocalOTCRoot + MetadataPathExtension;
const LocalOTCOfficialPath = LocalOTCRoot + OfficialPathExtension;
const LocalOTCOfficialMetadataPath = LocalOTCOfficialPath + MetadataPathExtension;
const LocalOTCOtherPath = LocalOTCRoot + OtherPathExtension;
const LocalOTCOtherMetadataPath = LocalOTCOtherPath + MetadataPathExtension;

const NotFoundErrorText = '404: Not Found';

const LocalDataRoot = './data/';
const GenMashupFormatsRoot = LocalDataRoot + 'genmashupformats/';
const GenMashupFormatsTemplatesRoot = GenMashupFormatsRoot + 'templates/';
const CommentHeaderTemplatePath = GenMashupFormatsTemplatesRoot + 'commentheader.tmp';
const FormatTemplatePath = GenMashupFormatsTemplatesRoot + 'format.tmp';
const FormatListTemplatePath = GenMashupFormatsTemplatesRoot + 'formatlist.tmp';
const RestrictedTemplatePath = GenMashupFormatsTemplatesRoot + 'restricted.tmp';
const SectionHeaderTemplatePath = GenMashupFormatsTemplatesRoot + 'sectionheader.tmp';
const UnbanListTemplatePath = GenMashupFormatsTemplatesRoot + 'unbanlist.tmp';
const ThreadTemplatePath = GenMashupFormatsTemplatesRoot + 'thread.tmp';
const GenMashupFormatsOutputRoot = GenMashupFormatsRoot + 'output/';
const MashupFormatsOutputPath = GenMashupFormatsOutputRoot + 'generatedmashupformats.ts';

const TourNameLinePrefix = '/tour name ';
const TourNameMissingFallback = 'Unknown Format';
const TourBaseFormatLinePrefix = '/tour new ';
const TourBaseFormatMissingFallback = '[Gen 8] OU';
const TourBaseFormatModMissingFallback = 'gen8';
const TourDeltaRulesLinePrefix = '/tour rules ';

const GenericResourcesLink = 'https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984';

var OfficialTourCodesNamesArray = exports.OfficialTourCodesNamesArray = [];
var OtherTourCodesNamesArray = exports.OtherTourCodesNamesArray = [];
var AllTourCodesNamesArray = exports.AllTourCodesNamesArray = [];

var AllTourCodesDictionary = exports.AllTourCodesDictionary = {};

var SpotlightNamesArray = exports.SpotlightNamesArray = [];

var DailyRawContent = exports.DailyRawContent = 'Uninit';

var downloadFilePromise = exports.downloadFilePromise = function (url, file)
{
    let promise = new Promise(function(resolve, reject) {
        DataDownloader.downloadFile(
            url,
            file,
            function (s, err) {
                info('url: ' + url);
                info('dl completed');
                if (s) {
                    return resolve(file);
                }
                error("Data download failed: " + file + "\n" + err.message);
                errlog(err.stack);
                return reject(err);
            }
        );
    });
    return promise;
}

var refreshTourCodeCache = exports.refreshTourCodeCache = async function (room)
{
    const listPromises = [
        downloadFilePromise(
            OfficialListURL,
            LocalOTCOfficialMetadataPath + ListFName),
        downloadFilePromise(
            OtherListURL,
            LocalOTCOtherMetadataPath + ListFName),
        downloadFilePromise(
            SpotlightNamesURL,
            LocalOTCMetadataPath + SpotlightNamesFName),
        downloadFilePromise(
            DailyRawContentURL,
            LocalOTCMetadataPath + DailyRawContentFName),
    ];

    allSettled(listPromises).
    then(
        (results) => {
            //results.forEach((result) => console.log(result.status));

            // Officials
            var officialNames = fs.readFileSync('./data/' + LocalOTCOfficialMetadataPath + ListFName).toString();
            var officialPromises = [];
            if( NotFoundErrorText !== officialNames ) {
                OfficialTourCodesNamesArray = officialNames.split(',');
                for( var nItr=0; nItr<OfficialTourCodesNamesArray.length; ++nItr ) {
                    OfficialTourCodesNamesArray[nItr] = toId(OfficialTourCodesNamesArray[nItr]);
                    officialPromises.push(
                        downloadFilePromise(
                            OfficialURLRoot + OfficialTourCodesNamesArray[nItr] + TourExt,
                            LocalOTCOfficialPath + OfficialTourCodesNamesArray[nItr] + TourExt)
                    );
                }
            }

            // Spotlight Names
            var spotlightNames = fs.readFileSync('./data/' + LocalOTCMetadataPath + SpotlightNamesFName).toString();
            if( NotFoundErrorText !== spotlightNames ) {
                SpotlightNamesArray = spotlightNames.split(',');
                exports.SpotlightNamesArray = SpotlightNamesArray;
            }
            Mashups.setSpotlightTourNameArray(SpotlightNamesArray);

            // Daily Content
            var sDailyRawContentFName = './data/' + LocalOTCMetadataPath + DailyRawContentFName;
            var bExists = fs.existsSync(sDailyRawContentFName);
            if(!bExists) {
                console.log('Daily content missing: ' + sDailyRawContentFName);
            }
            DailyRawContent = fs.readFileSync(sDailyRawContentFName).toString();
            exports.DailyRawContent = DailyRawContent; // Reassignment necessary due to being reference type(?)
            //console.log('DailyRawContent: ' + DailyRawContent);

            // Others
            var otherNames = fs.readFileSync('./data/' + LocalOTCOtherMetadataPath + ListFName).toString();
            var otherPromises = [];
            if( NotFoundErrorText !== otherNames ) {
                OtherTourCodesNamesArray = otherNames.split(',');
                for( var nItr=0; nItr<OtherTourCodesNamesArray.length; ++nItr ) {
                    OtherTourCodesNamesArray[nItr] = toId(OtherTourCodesNamesArray[nItr]);
                    otherPromises.push(
                        downloadFilePromise(
                            OtherURLRoot + OtherTourCodesNamesArray[nItr] + TourExt,
                            LocalOTCOtherPath + OtherTourCodesNamesArray[nItr] + TourExt)
                    );
                }
            }

            // Combined
            AllTourCodesNamesArray = OfficialTourCodesNamesArray.concat(OtherTourCodesNamesArray);
            var totalPromises = officialPromises.concat(otherPromises);

            allSettled(totalPromises).then(
                (tourResults) => {
                    //tourResults.forEach( (tourResult) => { console.log(tourResult.status); });

                    // Officials
                    for( var nItr=0; nItr<OfficialTourCodesNamesArray.length; ++nItr ) {
                        var sLocalFName = './data/' + LocalOTCOfficialPath + OfficialTourCodesNamesArray[nItr] + TourExt;
                        var bExists = fs.existsSync(sLocalFName);
                        if(!bExists) {
                            console.log('File missing: ' + sLocalFName);
                            continue;
                        }
                        var sFileContent = fs.readFileSync(sLocalFName).toString();
                        if( NotFoundErrorText === sFileContent ) {
                            console.log('File 404: ' + sLocalFName);
                            continue;
                        }
                        AllTourCodesDictionary[OfficialTourCodesNamesArray[nItr]] = sFileContent;
                    }

                    // Others
                    for( var nItr=0; nItr<OtherTourCodesNamesArray.length; ++nItr ) {
                        var sLocalFName = './data/' + LocalOTCOtherPath + OtherTourCodesNamesArray[nItr] + TourExt;
                        var bExists = fs.existsSync(sLocalFName);
                        if(!bExists) {
                            console.log('File missing: ' + sLocalFName);
                            continue;
                        }
                        var sFileContent = fs.readFileSync(sLocalFName).toString();
                        if( NotFoundErrorText === sFileContent ) {
                            console.log('File 404: ' + sLocalFName);
                            continue;
                        }
                        AllTourCodesDictionary[OtherTourCodesNamesArray[nItr]] = sFileContent;
                    }

                    // Test output
                    if (room) {
                        var sNames = nameCachedTourCodes();
                        Bot.say(room, '!code Completed refresh.\n\n' + sNames);
                    }
                }
            );

            info(OfficialTourCodesNamesArray);
        }
    );
}

var nameCachedTourCodes = exports.nameCachedTourCodes = function ()
{
    var sOutput = 'Officials: ';
    var bFirstLoop = true;
    for( var nItr=0; nItr<OfficialTourCodesNamesArray.length; ++nItr ) {
        if(!(OfficialTourCodesNamesArray[nItr] in AllTourCodesDictionary)) continue;
        if(!bFirstLoop) {
            sOutput += ', ';
        }
        sOutput += OfficialTourCodesNamesArray[nItr];
        bFirstLoop = false;
    }

    sOutput += '\n\n';
    sOutput += 'Others: ';
    bFirstLoop = true;
    for( var nItr=0; nItr<OtherTourCodesNamesArray.length; ++nItr ) {
        if(!(OtherTourCodesNamesArray[nItr] in AllTourCodesDictionary)) continue;
        if(!bFirstLoop) {
            sOutput += ', ';
        }
        sOutput += OtherTourCodesNamesArray[nItr];
        bFirstLoop = false;
    }

    sOutput += '\n\n';
    sOutput += 'Spotlight names: ';
    bFirstLoop = true;
    for( var nItr=0; nItr<SpotlightNamesArray.length; ++nItr ) {
        if(!bFirstLoop) {
            sOutput += ', ';
        }
        sOutput += SpotlightNamesArray[nItr];
        bFirstLoop = false;
    }
    
    return sOutput;
}

var startTour = exports.startTour = function (sTourName)
{
    if('spotlight' === toId(sTourName)) {
        // Spotlight special case: search for tour code name in SpotlightNamesArray
        for(let name of SpotlightNamesArray) {
            //console.log(name);
            if(!AllTourCodesDictionary.hasOwnProperty(toId(name))) continue;
            sTourName = toId(name);
            break;
        }
    }

    if(!AllTourCodesDictionary.hasOwnProperty(sTourName)) {
        // Try to automatically recognize current-gen tour names without the gen explicitly specified
        if('gen' !== sTourName.substring(0, 3)) {
            sTourName = Mashups.getCurrentGenName() + sTourName;
            if(!AllTourCodesDictionary.hasOwnProperty(sTourName)) {
                return null;
            }
        }
        else {
            return null;
        }
    }

    return AllTourCodesDictionary[sTourName];
}

var parseTime = exports.parseTime = function (timeString) {	
	if (timeString == '') return null;
	
	var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);	
	if (time == null) return null;
	
	var hours = parseInt(time[1],10);	 
	if (hours == 12 && !time[4]) {
		  hours = 0;
	}
	else {
		hours += (hours < 12 && time[4])? 12 : 0;
	}	
	var d = new Date();    	    	
	d.setHours(hours);
	d.setMinutes(parseInt(time[3],10) || 0);
	d.setSeconds(0, 0);	 
	return d;
}

var parseDay = exports.parseDay = function (sDayString) {
	if (sDayString == '') return -1;
    
    var nDay = -1;
    switch(sDayString) {
        case 'Sunday': nDay = 0; break;
        case 'Monday': nDay = 1; break;
        case 'Tuesday': nDay = 2; break;
        case 'Wednesday': nDay = 3; break;
        case 'Thursday': nDay = 4; break;
        case 'Friday': nDay = 5; break;
        case 'Saturday': nDay = 6; break;
    }
    return nDay;
}

var addDays = exports.addDays = function (dDate, nDeltaDays) {
    var result = new Date(dDate);
    result.setDate(result.getDate() + nDeltaDays);
    return result;
}

var convertDateToUTC = exports.convertDateToUTC = function (dDate) {
    return new Date(
        dDate.getUTCFullYear(),
        dDate.getUTCMonth(),
        dDate.getUTCDate(),
        dDate.getUTCHours(),
        dDate.getUTCMinutes(),
        dDate.getUTCSeconds());
}

//#region generateMashupFormats
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number] 
            : match
        ;
        });
    };
}

if (!String.periodicJoin) {
    String.periodicJoin = function(array, regularSeparator, period, periodicSeparator) {
        var sOutput = '';
        if(!array || (0 == array.length)) return sOutput;
        var nPeriodicCounter = 1;
        var sSeparator;
        for(var nItr=0; nItr<array.length-1; ++nItr) {
            if(nPeriodicCounter >= period) {
                sSeparator = periodicSeparator;
                nPeriodicCounter = 0;
            }
            else {
                sSeparator = regularSeparator;
            }
            ++nPeriodicCounter;
            sOutput += array[nItr] + sSeparator;
        }
        sOutput += array[array.length-1];
        return sOutput;
    };
}

var formatRulesList = function (array) {
    array = array.map(sItem => sItem.replace(`'`, `\\'`));
    return `'` + String.periodicJoin(array, `', '`, 8, `',\n\t\t\t'`) + `'`;
}

var generateMashupFormats = exports.generateMashupFormats = function () {
    if(!fs.existsSync(CommentHeaderTemplatePath)) {
        console.log('File missing: ' + CommentHeaderTemplatePath);
        return false;
    }
    var sCommentHeaderTemplate = fs.readFileSync(CommentHeaderTemplatePath).toString();
    if(!fs.existsSync(FormatTemplatePath)) {
        console.log('File missing: ' + FormatTemplatePath);
        return false;
    }
    var sFormatTemplate = fs.readFileSync(FormatTemplatePath).toString();
    if(!fs.existsSync(FormatListTemplatePath)) {
        console.log('File missing: ' + FormatListTemplatePath);
        return false;
    }
    var sFormatListTemplate = fs.readFileSync(FormatListTemplatePath).toString();
    if(!fs.existsSync(RestrictedTemplatePath)) {
        console.log('File missing: ' + RestrictedTemplatePath);
        return false;
    }
    var sRestrictedTemplate = fs.readFileSync(RestrictedTemplatePath).toString();
    if(!fs.existsSync(SectionHeaderTemplatePath)) {
        console.log('File missing: ' + SectionHeaderTemplatePath);
        return false;
    }
    var sSectionHeaderTemplate = fs.readFileSync(SectionHeaderTemplatePath).toString();
    if(!fs.existsSync(ThreadTemplatePath)) {
        console.log('File missing: ' + ThreadTemplatePath);
        return false;
    }
    var sThreadTemplate = fs.readFileSync(ThreadTemplatePath).toString();
    if(!fs.existsSync(UnbanListTemplatePath)) {
        console.log('File missing: ' + UnbanListTemplatePath);
        return false;
    }
    var sUnbanListTemplate = fs.readFileSync(UnbanListTemplatePath).toString();

    var nRuleItr;
    var sRawOutput = '';

    let sTestTourCodeName = 'gen8staaabmons';
    let sTourCode = AllTourCodesDictionary[sTestTourCodeName];

    // Determine format name, base format, etc from tour code
    let lineArray = sTourCode.split('\n');
    let sTourNameLine = null;
    let sBaseFormatLine = null;
    let sDeltaRulesLine = null;
    lineArray.forEach(function(sLine) {
        if(!sLine) return;
        sLine = sLine.replace(/ +(?= )/g,''); // Ensure the line of text is single-spaced
        //console.log(sLine);
        if(!sTourNameLine && sLine.startsWith(TourNameLinePrefix)) {
            sTourNameLine = sLine;
        }
        if(!sBaseFormatLine && sLine.startsWith(TourBaseFormatLinePrefix)) {
            sBaseFormatLine = sLine;
        }
        if(!sDeltaRulesLine && sLine.startsWith(TourDeltaRulesLinePrefix)) {
            sDeltaRulesLine = sLine;
        }
    });

    let sTourName = '';
    if(!sTourNameLine) { // Fallback in case name is missing
        sTourName = TourNameMissingFallback;
        console.log('Tour name missing!');
    }
    else { // Accurate name
        sTourName = sTourNameLine.substr(TourNameLinePrefix.length);
    }

    let sBaseFormatName = '';
    if(!sBaseFormatLine) { // Fallback in case base format is missing
        sBaseFormatName = TourBaseFormatMissingFallback;
        console.log('Tour base format missing!');
    }
    else { // Accurate base format name
        sBaseFormatName = sBaseFormatLine.substr(TourBaseFormatLinePrefix.length);
        sBaseFormatName = sBaseFormatName.split(',')[0];
    }

    let deltaRulesArray = [];
    if(sDeltaRulesLine) { // We don't necessarily expect rule changes
        let sDeltaRules = sDeltaRulesLine.substr(TourDeltaRulesLinePrefix.length);;
        deltaRulesArray = sDeltaRules.split(',');
        for(nRuleItr=0; nRuleItr<deltaRulesArray.length; ++nRuleItr) {
            deltaRulesArray[nRuleItr] = deltaRulesArray[nRuleItr].replace(/^\s+|\s+$/g, ''); // Remove any trailing/leading spaces from every rule
        }
    }

    let baseFormatDetails = Mashups.findFormatDetails(sBaseFormatName);
    if(!baseFormatDetails) {
        console.log('Could not retrieve details for format: ' + sBaseFormatName);
        return false;
    }

    var sDescriptionOutput = 'FIXME: Description Content';

    // threads
    let combinedThreadsArray = [];
    if(baseFormatDetails.threads) {
        // Base format vanilla threads
        combinedThreadsArray = combinedThreadsArray.concat(baseFormatDetails.threads);
        combinedThreadsArray = combinedThreadsArray.map(sItem => sItem.replace(`">`, `">Vanilla `));
    }
    // Mashup generic resources
    let sGenericThread = String.format(sThreadTemplate,
        GenericResourcesLink, // {0}
        sTourName+" Resources" // {1}
    );
    combinedThreadsArray.unshift(sGenericThread);
    // Combined threads
    var sThreadOutput = '`' + combinedThreadsArray.join('`,\n\t\t\t`') + '`';

    // mod
    var sModOutput = '';
    if(!baseFormatDetails.mod) {
        sModOutput = TourBaseFormatModMissingFallback;
        console.log('Tour base format has no mod specified!');
    }
    else {
        sModOutput = baseFormatDetails.mod;
    }

    // Rule modifications
    var deltaRulesetArray = [];
    var deltaUnrulesetArray = [];
    var deltaBansArray = [];
    var deltaUnbansArray = [];
    var deltaRestrictedArray = [];
    for(nRuleItr=0; nRuleItr<deltaRulesArray.length; ++nRuleItr) {
        let sDeltaRule = deltaRulesArray[nRuleItr];
        let sLeadingChar = sDeltaRule.substr(0, 1);
        let sRemainingChars = sDeltaRule.substr(1);
        switch(sLeadingChar) {
            case '+':
                deltaUnbansArray.push(sRemainingChars);
                break;
            case '-':
                deltaBansArray.push(sRemainingChars);
                break;
            case '!':
                deltaUnrulesetArray.push(sRemainingChars);
                break;
            case '*':
                deltaRestrictedArray.push(sRemainingChars);
                break;
            default:
                deltaRulesetArray.push(sDeltaRule);
                break;
        }
    }

    // ruleset
    var combinedRulesArray = [];
    var combinedUnrulesArray = [];
    var baseFormatRulesArray = [];
    var baseFormatUnrulesArray = [];
    if(baseFormatDetails.ruleset) {
        let baseFormatRuleset = baseFormatDetails.ruleset;
        for(nRuleItr=0; nRuleItr<baseFormatRuleset.length; ++nRuleItr) {
            let sDeltaRule = baseFormatRuleset[nRuleItr];
            let sLeadingChar = sDeltaRule.substr(0, 1);
            let sRemainingChars = sDeltaRule.substr(1);
            switch(sLeadingChar) {
                case '!':
                    baseFormatUnrulesArray.push(sRemainingChars);
                    break;
                default:
                    baseFormatRulesArray.push(sDeltaRule);
                    break;
            }
        }
    }
    combinedRulesArray = baseFormatRulesArray.concat(deltaRulesetArray);
    combinedUnrulesArray = baseFormatUnrulesArray.concat(deltaUnrulesetArray);
    combinedUnrulesArray = combinedUnrulesArray.filter(function(value, index, arr) {
        return !deltaRulesetArray.includes(value);
    });
    combinedRulesArray = combinedRulesArray.filter(function(value, index, arr){
        return !combinedUnrulesArray.includes(value);
    });
    // Re-format rules
    combinedUnrulesArray = combinedUnrulesArray.map(sItem => '!' + sItem);
    combinedRulesArray = combinedRulesArray.concat(combinedUnrulesArray);
    var sRulesetOutput = formatRulesList(combinedRulesArray);

    // banlist
    var combinedBansArray = [];
    var baseFormatBansArray = [];
    if(baseFormatDetails.banlist) {
        baseFormatBansArray = baseFormatDetails.banlist;
    }
    combinedBansArray = baseFormatBansArray.concat(deltaBansArray);
    combinedBansArray = combinedBansArray.filter(function(value, index, arr) {
        return !deltaUnbansArray.includes(value) && !deltaRestrictedArray.includes(value);
    });
    var sBanlistOutput = formatRulesList(combinedBansArray);

    // unbanlist
    var combinedUnbanList = [];
    var baseFormatUnbanList = [];
    if(baseFormatDetails.unbanlist) {
        baseFormatUnbanList = baseFormatDetails.unbanlist;
    }
    combinedUnbanList = baseFormatUnbanList.concat(deltaUnbansArray);
    combinedUnbanList = combinedUnbanList.filter(function(value, index, arr) {
        return !deltaBansArray.includes(value) && !deltaRestrictedArray.includes(value);
    });
    var sUnbanListOutput = (combinedUnbanList.length > 0) ? formatRulesList(combinedUnbanList) : null;

    // restricted
    var combinedRestrictedList = [];
    var baseFormatRestrictedList = [];
    if(baseFormatDetails.restricted) {
        baseFormatRestrictedList = baseFormatDetails.restricted;
    }
    combinedRestrictedList = baseFormatRestrictedList.concat(deltaRestrictedArray);
    combinedRestrictedList = combinedRestrictedList.filter(function(value, index, arr) {
        return !deltaBansArray.includes(value) && !deltaUnbansArray.includes(value);
    });
    var sRestrictedListOutput = (combinedRestrictedList.length > 0) ? formatRulesList(combinedRestrictedList) : null;

    // Supplementary output
    var sSupplementaryOutput = '';
    if(sUnbanListOutput) {
        sSupplementaryOutput += String.format(sUnbanListTemplate, sUnbanListOutput);
        sSupplementaryOutput += String.format(sRestrictedTemplate, sRestrictedListOutput);
    }

    var sFormatOutput = String.format(sFormatTemplate,
        sTourName, // {0}
        sDescriptionOutput, // {1}
        sThreadOutput, // {2}
        sModOutput, // {3}
        sRulesetOutput, // {4}
        sBanlistOutput, // {5}
        sSupplementaryOutput, // {6}
    );

    sRawOutput += sFormatOutput;

    // Format into list
    sRawOutput = String.format(sFormatListTemplate, sRawOutput);

    var bFileWriteFailed = false;
    fs.writeFile(MashupFormatsOutputPath, sRawOutput, function (err2) {
        if (err2) {
            console.log('Output failed: ' + MashupFormatsOutputPath);
            bFileWriteFailed = true;
        }
    });
    if(bFileWriteFailed) return false;

    return true;
}
//#endregion generateMashupFormats
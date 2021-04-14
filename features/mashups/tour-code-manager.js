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
const DynamicFormatDescriptionsFName = 'dynamicformatdescriptions.txt';
const AliasesFName = 'aliases.txt';
const SpotlightNamesFName = 'spotlightnames.txt';
const DailyRawContentFName = 'dailyschedule.txt';
const MashupsPopularRandomFormatsFName = 'popularrandomformats.txt';
const TourExt = '.tour';

const GeneralMetadataURLRoot = TourCodesURLRoot + MetadataPathExtension;
const DynamicFormatDescriptionsURL = GeneralMetadataURLRoot + DynamicFormatDescriptionsFName;
const AliasesURL = GeneralMetadataURLRoot + AliasesFName;

const MashupsURLRoot = TourCodesURLRoot + 'mashups/';
const MashupsMetadataURLRoot = MashupsURLRoot + MetadataPathExtension;
const SpotlightNamesURL = MashupsMetadataURLRoot + SpotlightNamesFName;
const DailyRawContentURL = MashupsMetadataURLRoot + DailyRawContentFName;
const MashupsPopularRandomFormatsURL = MashupsMetadataURLRoot + MashupsPopularRandomFormatsFName;
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
const ArrayTemplatePath = GenMashupFormatsTemplatesRoot + 'array.tmp';
const SectionHeaderTemplatePath = GenMashupFormatsTemplatesRoot + 'sectionheader.tmp';
const ThreadTemplatePath = GenMashupFormatsTemplatesRoot + 'thread.tmp';
const GenMashupFormatsOutputRoot = GenMashupFormatsRoot + 'output/';
const GenMashupFormatsFName = 'generated-mashup-formats.ts';
const MashupFormatsOutputPath = GenMashupFormatsOutputRoot + GenMashupFormatsFName;

const TourNameLinePrefix = '/tour name ';
const TourNameMissingFallback = 'Unknown Format';
const TourBaseFormatLinePrefix = '/tour new ';
const TourBaseFormatMissingFallback = '[Gen 8] OU';
const TourBaseFormatModMissingFallback = 'gen8';
const TourDeltaRulesLinePrefix = '/tour rules ';
const TourDescriptionMissingFallback = '(No description)';
const TourInlineNameSeparator = ',,,';

const GenericResourcesLink = exports.GenericResourcesLink = 'https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984';
const MashupsGeneratedFormatsColumn = 1;

var OfficialTourCodesNamesArray = exports.OfficialTourCodesNamesArray = [];
var OtherTourCodesNamesArray = exports.OtherTourCodesNamesArray = [];
var AllTourCodesNamesArray = exports.AllTourCodesNamesArray = [];

var AllTourCodesDictionary = exports.AllTourCodesDictionary = {};
var TourCodeURLsDictionary = {};
var DynamicFormatDescriptionsDictionary = {};
var AliasesDictionary = {};
var MashupsPopularRandomFormatsWeightsDictionary = {};

var SpotlightNamesArray = exports.SpotlightNamesArray = [];

var DailyRawContent = exports.DailyRawContent = 'Uninit';

//#region Random Tour

const RandomTourCategory = exports.RandomTourCategory = Object.freeze({
	'Any':      'any',
	'Official': 'official',
	'Other':    'other',
	'Popular':  'popular',
});

var tryGetRandomTourCodeForCategory = exports.tryGetRandomTourCodeForCategory = function (commandContext, sCategoryName)
{
    if ('' === sCategoryName) {
        sCategoryName = RandomTourCategory.Any;
    }
    sCategoryName = toId(sCategoryName);

    if (!Object.values(RandomTourCategory).includes(sCategoryName)) {
        const sParamNames = Object.values(RandomTourCategory).join(', ');
        commandContext.reply(`Invalid category: ${sCategoryName}! Valid categories: ${sParamNames} (or leave blank for any tour).`);
        return null;
    }

    var sTourCodeName = null;
    switch(sCategoryName) {
        case RandomTourCategory.Any:
            sTourCodeName = AllTourCodesNamesArray[Math.floor(Math.random() * AllTourCodesNamesArray.length)];
            break;
        case RandomTourCategory.Official:
            sTourCodeName = OfficialTourCodesNamesArray[Math.floor(Math.random() * OfficialTourCodesNamesArray.length)];
            break;
        case RandomTourCategory.Other:
            sTourCodeName = OtherTourCodesNamesArray[Math.floor(Math.random() * OtherTourCodesNamesArray.length)];
            break;
        case RandomTourCategory.Popular: {
                const weightsValues = Object.values(MashupsPopularRandomFormatsWeightsDictionary);
                const fWeightsSum = weightsValues.reduce((a, b) => a + b, 0);
                //console.log(`fWeightsSum: ${fWeightsSum}`);
                const fWeightThreshold = Math.random() * fWeightsSum;
                //console.log(`fWeightThreshold: ${fWeightThreshold}`);
                var fDeltaWeight = 0;
                var workDictionary = {...MashupsPopularRandomFormatsWeightsDictionary};
                while(true) {
                    //console.log(`fDeltaWeight: ${fDeltaWeight}`);
                    var keyArray = Object.keys(workDictionary);
                    //console.log(`keyArray: ${keyArray}`);
                    if(0 === keyArray.length) {
                        //console.log(`Stopped because dictionary was empty!`);
                        break;
                    }
                    if(1 === keyArray.length) {
                        sTourCodeName = keyArray[0];
                        //console.log(`Stopped with 1 left.`);
                        break;
                    }
                    var sPickKey = keyArray[Math.floor(Math.random() * keyArray.length)];
                    fDeltaWeight += workDictionary[sPickKey];
                    if(fDeltaWeight >= fWeightThreshold) {
                        sTourCodeName = sPickKey;
                        //console.log(`Stopped with multiple left.`);
                        break;
                    }
                    delete workDictionary[sPickKey];
                }
            }
            break;
    }
    //console.log(`sTourCodeName: ${sTourCodeName}`);

    if (!sTourCodeName) {
        commandContext.reply(`Failed to retrive a valid tour code name for category: ${sCategoryName}!`);
        return null;
    }

    const sValidDynamicFormatKey = replyToSearchValidDynamicFormatKey(commandContext, sTourCodeName);
    if (!sValidDynamicFormatKey) {
        commandContext.reply(`Selected invalid tour code name: ${sTourCode}!`);
        return null;
    }

    return searchTourCode(sValidDynamicFormatKey);
}

//#endregion

var downloadFilePromise = exports.downloadFilePromise = function (url, file)
{
    let promise = new Promise(function(resolve, reject) {
        DataDownloader.downloadFile(
            url + "?" + Date.now(),
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
            DynamicFormatDescriptionsURL,
            LocalOTCMetadataPath + DynamicFormatDescriptionsFName),
        downloadFilePromise(
            AliasesURL,
            LocalOTCMetadataPath + AliasesFName),
        downloadFilePromise(
            SpotlightNamesURL,
            LocalOTCMetadataPath + SpotlightNamesFName),
        downloadFilePromise(
            DailyRawContentURL,
            LocalOTCMetadataPath + DailyRawContentFName),
        downloadFilePromise(
            MashupsPopularRandomFormatsURL,
            LocalOTCMetadataPath + MashupsPopularRandomFormatsFName),
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
                OfficialTourCodesNamesArray = OfficialTourCodesNamesArray.map(function (sTour) {return sTour.trim();}); // Remove spaces
                OfficialTourCodesNamesArray = OfficialTourCodesNamesArray.sort(); // Make alphabetical
                for( var nItr=0; nItr<OfficialTourCodesNamesArray.length; ++nItr ) {
                    OfficialTourCodesNamesArray[nItr] = toId(OfficialTourCodesNamesArray[nItr]);
                    TourCodeURLsDictionary[OfficialTourCodesNamesArray[nItr]] = OfficialURLRoot + OfficialTourCodesNamesArray[nItr] + TourExt;
                    officialPromises.push(
                        downloadFilePromise(
                            TourCodeURLsDictionary[OfficialTourCodesNamesArray[nItr]],
                            LocalOTCOfficialPath + OfficialTourCodesNamesArray[nItr] + TourExt)
                    );
                }
            }

            // Others
            var otherNames = fs.readFileSync('./data/' + LocalOTCOtherMetadataPath + ListFName).toString();
            var otherPromises = [];
            if( NotFoundErrorText !== otherNames ) {
                OtherTourCodesNamesArray = otherNames.split(',');
                OtherTourCodesNamesArray = OtherTourCodesNamesArray.map(function (sTour) {return sTour.trim();}); // Remove spaces
                OtherTourCodesNamesArray = OtherTourCodesNamesArray.sort(); // Make alphabetical
                for( var nItr=0; nItr<OtherTourCodesNamesArray.length; ++nItr ) {
                    OtherTourCodesNamesArray[nItr] = toId(OtherTourCodesNamesArray[nItr]);
                    TourCodeURLsDictionary[OtherTourCodesNamesArray[nItr]] = OtherURLRoot + OtherTourCodesNamesArray[nItr] + TourExt;
                    otherPromises.push(
                        downloadFilePromise(
                            TourCodeURLsDictionary[OtherTourCodesNamesArray[nItr]],
                            LocalOTCOtherPath + OtherTourCodesNamesArray[nItr] + TourExt)
                    );
                }
            }

            // Combined
            AllTourCodesNamesArray = OfficialTourCodesNamesArray.concat(OtherTourCodesNamesArray);
            var totalPromises = officialPromises.concat(otherPromises);

            // Dynamic Format Descriptions
            var dynamicFormatDescriptions = fs.readFileSync('./data/' + LocalOTCMetadataPath + DynamicFormatDescriptionsFName).toString();
            if( NotFoundErrorText !== dynamicFormatDescriptions ) {
                let contentArray = dynamicFormatDescriptions.split('\n');
                var nSubStringIdx;
                var bIsSplitTokenPresent;
                var sName;
                for(const sLine of contentArray) {
                    if('' === sLine) continue;
                    nSubStringIdx = sLine.indexOf(':');
                    bIsSplitTokenPresent = (-1 !== nSubStringIdx);
                    if(bIsSplitTokenPresent) {
                        sName = toId(sLine.substring(0, nSubStringIdx));
                        if(!AllTourCodesNamesArray.includes(sName)) {
                            console.log('Undefined format has description: ' + sName);
                        }
                        //console.log('Description key: ' + sName);
                        //console.log('Description value: ' + sLine.substring(nSubStringIdx + 1));
                        DynamicFormatDescriptionsDictionary[sName] = sLine.substring(nSubStringIdx + 1).replace(/^\s+|\s+$/g, '');
                    }
                }
            }

            // Aliases
            var aliasesRaw = fs.readFileSync('./data/' + LocalOTCMetadataPath + AliasesFName).toString();
            if( NotFoundErrorText !== aliasesRaw ) {
                const contentArray = aliasesRaw.split('\n');
                var nSubStringIdx;
                var sValue;
                var sKey;
                for(const sLine of contentArray) {
                    if('' === sLine) continue;
                    nSubStringIdx = sLine.indexOf(':');
                    if(-1 !== nSubStringIdx) {
                        sValue = toId(sLine.substring(0, nSubStringIdx)).replace(/^\s+|\s+$/g, '');
                        //console.log('Alias value: ' + sValue);
                        const keyContentArray = sLine.substring(nSubStringIdx + 1).split(',');
                        keyContentArray.forEach( (alias) => {
                            AliasesDictionary[alias.replace(/^\s+|\s+$/g, '')] = sValue;
                            //console.log('Alias value: ' + alias);
                        });
                    }
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

            // Mashups Popular Random Formats
            var sMashupsPopularRandomFormatsFName = './data/' + LocalOTCMetadataPath + MashupsPopularRandomFormatsFName;
            bExists = fs.existsSync(sMashupsPopularRandomFormatsFName);
            if(!bExists) {
                console.log('Mashups Popular Random Formats metadata missing: ' + sMashupsPopularRandomFormatsFName);
            }

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

                    // Mashups Popular Random Formats (generate weights)
                    var sMashupsPopularRandomFormatsRawContent = fs.readFileSync(sMashupsPopularRandomFormatsFName).toString();
                    //console.log('sMashupsPopularRandomFormatsRawContent: ' + sMashupsPopularRandomFormatsRawContent);
                    if( NotFoundErrorText !== sMashupsPopularRandomFormatsRawContent ) {
                        MashupsPopularRandomFormatsWeightsDictionary = {};
                        const contentArray = sMashupsPopularRandomFormatsRawContent.split('\n');
                        var nSubStringIdx;
                        var sValue;
                        var sKey;
                        for(const sLine of contentArray) {
                            if('' === sLine) continue;

                            nSubStringIdx = sLine.indexOf(':');
                            if(-1 !== nSubStringIdx) {
                                sKey = toId(sLine.substring(0, nSubStringIdx));
                                sValue = Number(sLine.substring(nSubStringIdx + 1).split(','));
                                if(0 === sValue) {
                                    sValue = 1;
                                }
                            }
                            else {
                                sKey = sLine;
                                sValue = 1;
                            }
                            sKey = sKey.replace(/^\s+|\s+$/g, '');

                            if(!AllTourCodesNamesArray.includes(sKey) && ('spotlight' !== sKey)) {
                                console.log('MashupsPopularRandomFormats had unrecognized format (ignored): ' + sKey);
                                continue;
                            }

                            MashupsPopularRandomFormatsWeightsDictionary[sKey] = sValue;
                        }
                    }

                    // Test output
                    if (room) {
                        var sNames = nameCachedTourCodes();
                        Bot.say(room, '!code Completed refresh.\n\n' + sNames);
                    }
                    console.log('ALL DOWNLOADS COMPLETE');
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

var toDynamicFormatKey = function (sSearch)
{
    sSearch = sSearch.replace(' ', '');
    sSearch = toId(sSearch);
    return sSearch;
}

var searchValidDynamicFormatKeyInternal = function (sSearch)
{
    sSearch = toDynamicFormatKey(sSearch);

    if('spotlight' === sSearch) {
        // Spotlight special case: search for tour code name in SpotlightNamesArray
        for(let name of SpotlightNamesArray) {
            //console.log(name);
            if(!AllTourCodesDictionary.hasOwnProperty(toDynamicFormatKey(name))) continue;
            sSearch = toDynamicFormatKey(name);
            break;
        }
    }

    if(!AllTourCodesDictionary.hasOwnProperty(sSearch)) {
        // Try to automatically recognize current-gen tour names without the gen explicitly specified
        if('gen' !== sSearch.substring(0, 3)) {
            sSearch = Mashups.getCurrentGenName() + sSearch;
            if(!AllTourCodesDictionary.hasOwnProperty(sSearch)) {
                return null;
            }
        }
        else {
            return null;
        }
    }

    return sSearch;
}

var searchValidDynamicFormatKey = function (sSearch)
{
    // Prefer using the raw value over alias searching if we can
    const sRawSearch = searchValidDynamicFormatKeyInternal(sSearch);
    if(sRawSearch) return sRawSearch;

    // Aliased search
    const sAliasedSearch = resolveAlias(sSearch);
    if(sAliasedSearch === sSearch) return null; // No point in repeating internal seach if alias doesn't change anything
    return searchValidDynamicFormatKeyInternal(sAliasedSearch);
}

var resolveAlias = exports.resolveAlias = function (sSearch)
{
    // Direct alias reference case
    if(AliasesDictionary.hasOwnProperty(sSearch)) {
        return AliasesDictionary[sSearch];
    }

    // Try to find valid alias by stripping away potentially anomalous current-gen prefixes
    if(Mashups.getCurrentGenName() === sSearch.substring(0, 4)) {
        const sGenStrippedSearch = sSearch.substring(4);
        if(AliasesDictionary.hasOwnProperty(sGenStrippedSearch)) {
            return AliasesDictionary[sGenStrippedSearch];
        }
    }

    return sSearch;
}

var searchTourCode = exports.searchTourCode = function (sSearch)
{
    sSearch = searchValidDynamicFormatKey(sSearch);
    if (!sSearch) return null;

    return AllTourCodesDictionary[sSearch];
}

var replyToSearchValidDynamicFormatKey = exports.replyToSearchValidDynamicFormatKey = function (commandContext, sSearch)
{
    var result = searchValidDynamicFormatKey(sSearch);
    //commandContext.reply(`result: ` + result);
    if(!result) {
        if('spotlight' === toId(sSearch)) {
            commandContext.reply(`Could not find tour code matching spotlight names metadata.`);
        }
        else {
            commandContext.reply(`Could not find tour code data for format: ` + sSearch);
        }
        return null;
    }
    return result;
}

var searchTourCodeURL = exports.searchTourCodeURL = function(sSearch)
{
    sSearch = searchValidDynamicFormatKey(sSearch);
    if (!sSearch) return null;

    if (!TourCodeURLsDictionary.hasOwnProperty(sSearch)) return null;
    return TourCodeURLsDictionary[sSearch];
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

var addTrashChannelRulesForFormat = function (rulesArray, formatName) {
    formatName = Mashups.getFormatKey(formatName);
    if(null === formatName) return rulesArray;

    formatName = Mashups.genStripName(formatName);

    switch(formatName) {
        case 'camomons':
            rulesArray.push('Camomons Rule');
            break;
        case 'mixandmega':
            rulesArray.push('Mix and Mega Standard Package');
            break;
        case 'tiershift':
            rulesArray.push('Tier Shift Rule');
            break;
    }

    return rulesArray;
}

var formatRulesList = function (array) {
    array = array.map(sItem => sItem.replace(`'`, `\\'`));
    // Human-generated format data rules by convention end with a trailing comma
    return `'` + String.periodicJoin(array, `', '`, 8, `',\n\t\t\t'`) + `',`;
}

var formatRulesArrayForDispay = exports.formatRulesArrayForDispay = function (array) {
    return array.join(`, `);
}

var unpackPokemonFormesInGOArray = function (sourceArray) {
    if(!sourceArray || (sourceArray.length < 1)) return sourceArray;

    sourceArray = [...new Set(sourceArray)]; // Remove any duplicates

    var priorityDict = {};

    var filterOutFormes = new Set();
    var correctedInFormes = new Set();
    var nPriority;
    var sCorrectedName;
    for(const sGO of sourceArray) {
        let pokemonGO = Mashups.getGameObjectAsPokemon(sGO);
        if(!pokemonGO) continue;

        let bIsBaseForme = !(pokemonGO.baseSpecies);
        let bReferencesAllFormes = bIsBaseForme && (Mashups.getGameObjectAsPokemonRaw(sGO) === pokemonGO);
        if(bReferencesAllFormes) {
            //console.log("Ref all formes: " + sGO);
            nPriority = 1;
            if(pokemonGO.otherFormes) {
                for(const sForme of pokemonGO.otherFormes) {
                    sCorrectedName = sForme;
                    correctedInFormes.add(sForme);
                    if(priorityDict && 
                        (!(sCorrectedName in priorityDict) 
                            || (priorityDict[sCorrectedName] > nPriority))) {
                        priorityDict[sCorrectedName] = nPriority;
                    }
                }
                sCorrectedName = pokemonGO.name + '-Base';
                correctedInFormes.add(sCorrectedName);
                if(priorityDict && 
                    (!(sCorrectedName in priorityDict) 
                        || (priorityDict[sCorrectedName] > nPriority))) {
                    priorityDict[sCorrectedName] = nPriority;
                }
            }
            else {
                sCorrectedName = pokemonGO.name.toString();
                correctedInFormes.add(sCorrectedName);
                if(priorityDict) {
                    priorityDict[sCorrectedName] = nPriority;
                }
            }
        }
        else {
            //console.log("Ref specific forme: " + sGO);
            nPriority = 0;
            if(bIsBaseForme) {
                sCorrectedName = pokemonGO.name + '-Base';
            }
            else {
                sCorrectedName = pokemonGO.name;
            }
            correctedInFormes.add(sCorrectedName);
            if(priorityDict) {
                priorityDict[sCorrectedName] = nPriority;
            }
        }

        filterOutFormes.add(sGO);
    }

    sourceArray = sourceArray.filter(function(value, index, arr) {
        return !filterOutFormes.has(value);
    });

    /*console.log("filterOutFormes:");
    console.log(filterOutFormes);

    console.log("correctedInFormes:");
    console.log(correctedInFormes);

    console.log("priorityDict:");
    console.log(priorityDict);*/

    return { array: sourceArray.concat(...correctedInFormes), dict: priorityDict };
}

var filterPokemonFormeArrayByPriority = function (targetArray, targetPriorityDict, ...filterPriorityDictArray) {
    return targetArray.filter(function(value, index, arr) {
        if(Mashups.isGameObjectPokemon(value) && !(value in targetPriorityDict)) { // Should be impossible
            console.log("Key missing from priority dict: " + value);
            return false;
        }

        for(const filterDict of filterPriorityDictArray) {
            if(value in filterDict) {
                if(filterDict[value] < targetPriorityDict[value]) {
                    return false;
                }
            }
        }

        return true;
    });
}

var packPokemonFormesInGOArray = function (sourceArray) {
    if(!sourceArray || (sourceArray.length < 1)) return sourceArray;

    sourceArray = [...new Set(sourceArray)]; // Remove any duplicates

    var filterOutFormes = new Set();
    var correctedInFormes = new Set();
    var bAllFormesInArray;
    for(const sGO of sourceArray) {
        let goAllFormesArray = Mashups.getAllPokemonFormesArray(sGO);
        if(!goAllFormesArray) continue;

        bAllFormesInArray = true;
        for(const forme of goAllFormesArray) {
            let pokemonForme = Mashups.getGameObjectAsPokemon(forme);
            if(!pokemonForme) continue;

            if(!pokemonForme.baseSpecies) {
                if(sourceArray.includes(pokemonForme.name + '-Base')) continue;
            }
            else {
                if(sourceArray.includes(pokemonForme.name)) continue;
            }
            bAllFormesInArray = false;
        }

        if(bAllFormesInArray) {
            goAllFormesArray.forEach(function callback(value) {  
                filterOutFormes.add(value);
            });
            let basePokemonGO = Mashups.getGameObjectAsPokemonBaseForme(sGO);
            if(basePokemonGO) {
                correctedInFormes.add(basePokemonGO.name);
            }
        }
    }

    /*console.log("filterOutFormes 2:");
    console.log(filterOutFormes);

    console.log("correctedInFormes 2:");
    console.log(correctedInFormes);*/

    sourceArray = sourceArray.filter(function(value, index, arr) {
        return !filterOutFormes.has(value);
    });

    return sourceArray.concat(...correctedInFormes);
}

var standarizeGameObjectArrayContent = function (sourceArray) {
    sourceArray = packPokemonFormesInGOArray(sourceArray);

    if(!sourceArray || (sourceArray.length < 2)) return sourceArray;

    sourceArray = [...new Set(sourceArray)]; // Remove any duplicates

    var pokemonGOArray = [];
    var abilitiesGOArray = [];
    var itemsGOArray = [];
    var movesGOArray = [];
    var othersGOArray = [];
    for(const sGO of sourceArray) {
        if(Mashups.isGameObjectPokemon(sGO)) {
            pokemonGOArray.push(sGO);
            continue;
        }
        if(Mashups.isGameObjectAbility(sGO)) {
            abilitiesGOArray.push(sGO);
            continue;
        }
        if(Mashups.isGameObjectItem(sGO)) {
            itemsGOArray.push(sGO);
            continue;
        }
        if(Mashups.isGameObjectMove(sGO)) {
            movesGOArray.push(sGO);
            continue;
        }
        othersGOArray.push(sGO);
    }

    pokemonGOArray.sort();
    abilitiesGOArray.sort();
    itemsGOArray.sort();
    movesGOArray.sort();
    othersGOArray.sort();

    return othersGOArray
        .concat(pokemonGOArray)
        .concat(abilitiesGOArray)
        .concat(itemsGOArray)
        .concat(movesGOArray);
}

var generateDynamicFormatRaw = exports.generateDynamicFormatRaw = function(sTourCodeKey) {
    if(!AllTourCodesDictionary.hasOwnProperty(toId(sTourCodeKey))) return false;

    var nRuleItr;

    let sTourCode = searchTourCode(sTourCodeKey);
    if(!sTourCode) return false;

    // Determine format name, base format, etc from tour code
    let lineArray = sTourCode.split('\n');
    let sTourNameLine = null;
    let sBaseFormatLine = null;
    let sDeltaRulesLine = null;
    let baseFormatLineArray = null;
    let sInlineTourName = null;
    lineArray.forEach(function(sLine) {
        if(!sLine) return;
        sLine = sLine.replace(/ +(?= )/g,''); // Ensure the line of text is single-spaced
        //console.log(sLine);
        if(!sTourNameLine && sLine.startsWith(TourNameLinePrefix)) {
            sTourNameLine = sLine;
        }
        if(!sBaseFormatLine && sLine.startsWith(TourBaseFormatLinePrefix)) {
            if(sLine.includes(TourInlineNameSeparator)) {
                baseFormatLineArray = sLine.split(TourInlineNameSeparator);
                sBaseFormatLine = baseFormatLineArray[0].replace(/^\s+|\s+$/g, '');
                sInlineTourName = baseFormatLineArray[1].replace(/^\s+|\s+$/g, '');
            }
            else {
                sBaseFormatLine = sLine;
            }
        }
        if(!sDeltaRulesLine && sLine.startsWith(TourDeltaRulesLinePrefix)) {
            sDeltaRulesLine = sLine;
        }
    });

    let sTourName = '';
    if(sTourNameLine) { // Prioritize name from dedicated line
        sTourName = sTourNameLine.substr(TourNameLinePrefix.length);
    }
    else if(sInlineTourName) { // Support inline names
        sTourName = sInlineTourName;
    }
    else { // Fallback in case name is missing
        sTourName = TourNameMissingFallback;
        console.log('Tour name missing!');
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

    // Acquire delta rules
    let deltaRulesArray = [];
    if(sDeltaRulesLine) { // We don't necessarily expect rule changes
        let sDeltaRules = sDeltaRulesLine.substr(TourDeltaRulesLinePrefix.length);;
        deltaRulesArray = sDeltaRules.split(',');
        for(nRuleItr=0; nRuleItr<deltaRulesArray.length; ++nRuleItr) {
            deltaRulesArray[nRuleItr] = deltaRulesArray[nRuleItr].replace(/^\s+|\s+$/g, ''); // Remove any trailing/leading spaces from every rule
            deltaRulesArray[nRuleItr] = deltaRulesArray[nRuleItr].replace('-base', '-Base'); // Deal with poorly-represented bans
        }
    }
    // Filter out empty rules (trailing comma, etc)
    deltaRulesArray = deltaRulesArray.filter(function(value, index, arr) {
        return ('' !== value);
    });

    // Unpack any format-stacking rules
    var filterOutFormatStackingDeltaRules = new Set();
    var unpackedFormatStackingDeltaRules = new Set();
    for(const sRule of deltaRulesArray) {
        let format = Mashups.findFormatDetails(sRule);
        if(!format) continue; // Not format-stacking

        // Allow format-stacking for tier-defining formats
        // 21/02/13: Seems like we need to unpack these as well
        //if(Mashups.isFormatTierDefinition(sRule)) continue;

        if(format.banlist) {
            format.banlist.forEach(function callback(value) {  
                unpackedFormatStackingDeltaRules.add('-'+value);
            });
        }

        if(format.unbanlist) {
            format.unbanlist.forEach(function callback(value) {  
                unpackedFormatStackingDeltaRules.add('+'+value);
            });
        }

        if(format.restricted) {
            format.restricted.forEach(function callback(value) {  
                unpackedFormatStackingDeltaRules.add('*'+value);
            });
        }

        if(format.ruleset) { // FIXME: Probably need to clean up after
            format.ruleset.forEach(function callback(value) {  
                unpackedFormatStackingDeltaRules.add(value);
            });
        }

        filterOutFormatStackingDeltaRules.add(sRule);
    }
    deltaRulesArray = deltaRulesArray.filter(function(value, index, arr) {
        return !filterOutFormatStackingDeltaRules.has(value);
    });
    deltaRulesArray = deltaRulesArray.concat(...unpackedFormatStackingDeltaRules);
    // Add Trash Channel rules defining common methods for stacked formats
    for(const sStackedFormat of filterOutFormatStackingDeltaRules) {
        deltaRulesArray = addTrashChannelRulesForFormat(deltaRulesArray, sStackedFormat);
    }

    // Acquire base format data
    let baseFormatDetails = Mashups.findFormatDetails(sBaseFormatName);
    if(!baseFormatDetails) {
        console.log('Could not retrieve details for format: ' + sBaseFormatName);
        return false;
    }

    var sDescription = DynamicFormatDescriptionsDictionary.hasOwnProperty(sTourCodeKey) ?
        DynamicFormatDescriptionsDictionary[sTourCodeKey] :
        null;

    // Analyze base format rules
    var baseFormatRulesArray = [];
    var baseFormatRepealsArray = [];
    if(baseFormatDetails.ruleset) {
        let baseFormatRuleset = baseFormatDetails.ruleset;
        for(nRuleItr=0; nRuleItr<baseFormatRuleset.length; ++nRuleItr) {
            let sDeltaRule = baseFormatRuleset[nRuleItr];
            let sLeadingChar = sDeltaRule.substr(0, 1);
            let sRemainingChars = sDeltaRule.substr(1);
            switch(sLeadingChar) {
                case '!':
                    baseFormatRepealsArray.push(sRemainingChars);
                    break;
                default:
                    baseFormatRulesArray.push(sDeltaRule);
                    break;
            }
        }
    }
    // Add Trash Channel rules defining common methods for base format
    baseFormatRulesArray = addTrashChannelRulesForFormat(baseFormatRulesArray, baseFormatDetails.name);

    var baseFormatBansArray = [];
    if(baseFormatDetails.banlist) {
        baseFormatBansArray = baseFormatDetails.banlist;
    }
    var baseFormatUnbansArray = [];
    if(baseFormatDetails.unbanlist) {
        baseFormatUnbansArray = baseFormatDetails.unbanlist;
    }
    var baseFormatRestrictedArray = [];
    if(baseFormatDetails.restricted) {
        baseFormatRestrictedArray = baseFormatDetails.restricted;
    }
    baseFormatBansArray = unpackPokemonFormesInGOArray(baseFormatBansArray).array || [];
    baseFormatUnbansArray = unpackPokemonFormesInGOArray(baseFormatUnbansArray).array || [];
    baseFormatRestrictedArray = unpackPokemonFormesInGOArray(baseFormatRestrictedArray).array || [];

    // Rule modifications
    var deltaRulesetArray = [];
    var deltaRepealsArray = [];
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
                deltaRepealsArray.push(sRemainingChars);
                break;
            case '*':
                deltaRestrictedArray.push(sRemainingChars);
                break;
            default:
                deltaRulesetArray.push(sDeltaRule);
                break;
        }
    }
    var deltaBansRes = unpackPokemonFormesInGOArray(deltaBansArray);
    deltaBansArray = deltaBansRes.array || [];
    var deltaBansPriorityDict = deltaBansRes.dict || {};
    var deltaUnbansRes = unpackPokemonFormesInGOArray(deltaUnbansArray);
    deltaUnbansArray = deltaUnbansRes.array || [];
    var deltaUnbansPriorityDict = deltaUnbansRes.dict || {};
    var deltaRestrictedRes = unpackPokemonFormesInGOArray(deltaRestrictedArray);
    deltaRestrictedArray = deltaRestrictedRes.array || [];
    var deltaRestrictionsPriorityDict = deltaRestrictedRes.dict || {};

    deltaBansArray = filterPokemonFormeArrayByPriority(
        deltaBansArray,
        deltaBansPriorityDict,
        deltaUnbansPriorityDict,
        deltaRestrictionsPriorityDict);
    deltaUnbansArray = filterPokemonFormeArrayByPriority(
        deltaUnbansArray,
        deltaUnbansPriorityDict,
        deltaBansPriorityDict,
        deltaRestrictionsPriorityDict);
    deltaRestrictedArray = filterPokemonFormeArrayByPriority(
        deltaRestrictedArray,
        deltaRestrictionsPriorityDict,
        deltaBansPriorityDict,
        deltaUnbansPriorityDict);

    // ruleset
    var combinedRulesArray = baseFormatRulesArray.concat(deltaRulesetArray);
    var combinedRepealsArray = baseFormatRepealsArray.concat(deltaRepealsArray);
    combinedRepealsArray = combinedRepealsArray.filter(function(value, index, arr) {
        return !deltaRulesetArray.includes(value);
    });
    combinedRulesArray = combinedRulesArray.filter(function(value, index, arr) {
        return !combinedRepealsArray.includes(value);
    });
    // Remove any duplicates
    combinedRulesArray = [...new Set(combinedRulesArray)];
    combinedRepealsArray = [...new Set(combinedRepealsArray)];
    // Re-format rules
    combinedRepealsArray = combinedRepealsArray.map(sItem => '!' + sItem);
    combinedRulesArray = combinedRulesArray.concat(combinedRepealsArray);

    // Determine implicit bans and restrictions (those included inside rules)
    // If an implicit ban also exists in the banlist, it will crash the validator, so we need to filter these out
    var implicitBansArray = [];
    var implicitUnbansArray = [];
    var implicitRestrictedArray = [];
    for(const sRule of combinedRulesArray) {
        let format = Mashups.findFormatDetails(sRule);
        if(format) { // FIXME: This logic is too simple and can't account for rebans, etc but for now...
            if (format.banlist) {
                implicitBansArray = implicitBansArray.concat(format.banlist);
            }
            if (format.unbanlist) {
                implicitUnbansArray = implicitUnbansArray.concat(format.unbanlist);
            }
            if (format.restricted) {
                implicitRestrictedArray = implicitRestrictedArray.concat(format.restricted);
            }
        }
        // FIXME: For complete coverage, we also need to look at rules as these can also include bans, etc but there seems to be no good way to access these yet
    }

    // Determine tier basis for unbans
    var nMinTierIncluded = Mashups.Tier.Undefined;
    for(const sRule of combinedRulesArray) {
        let nRuleTierId = Mashups.determineFormatDefinitionTierId(sRule);
        if(nRuleTierId > nMinTierIncluded) {
            nMinTierIncluded = nRuleTierId;
        }
    }

    // banlist
    var combinedBansArray = baseFormatBansArray.concat(deltaBansArray);
    combinedBansArray = combinedBansArray.filter(function(value, index, arr) {
        return !deltaUnbansArray.includes(value)
            && !deltaRestrictedArray.includes(value)
            && !implicitBansArray.includes(value);
    });
    combinedBansArray = standarizeGameObjectArrayContent(combinedBansArray);

    // unbanlist
    var combinedUnbansArray = baseFormatUnbansArray.concat(deltaUnbansArray);
    combinedUnbansArray = combinedUnbansArray.filter(function(value, index, arr) {
        return !deltaBansArray.includes(value)
            && !deltaRestrictedArray.includes(value)
            && !implicitUnbansArray.includes(value);
    });
    // Filter out unbans that are redundant due to not being included through a tiered format
    // Do before standardization so the formes are split (may be tiered separately)
    combinedUnbansArray = combinedUnbansArray.filter(function(value, index, arr) {
        let pokemonForme = Mashups.getGameObjectAsPokemon(value);
        if(!pokemonForme) return true;

        let nPokemonTier = Mashups.calcPokemonTier(pokemonForme);
        //console.log("Checking unban of forme: "+value+" nPokemonTier: "+nPokemonTier.toString()+" nMinTierIncluded: "+nMinTierIncluded.toString());
        return nPokemonTier < nMinTierIncluded;
    });
    combinedUnbansArray = standarizeGameObjectArrayContent(combinedUnbansArray);

    // restricted
    var combinedRestrictedArray = baseFormatRestrictedArray.concat(deltaRestrictedArray);
    combinedRestrictedArray = combinedRestrictedArray.filter(function(value, index, arr) {
        return !deltaBansArray.includes(value)
            && !deltaUnbansArray.includes(value)
            && !implicitRestrictedArray.includes(value);
    });
    combinedRestrictedArray = standarizeGameObjectArrayContent(combinedRestrictedArray);

    return {
        name: sTourName,
        baseFormatDetails: baseFormatDetails,
        description: sDescription,
        rulesArray: combinedRulesArray,
        bansArray: combinedBansArray,
        unbansArray: combinedUnbansArray,
        restrictedArray: combinedRestrictedArray,
    };
}

var generateDynamicFormat = function(sTourCodeKey, sArrayTemplate, sFormatTemplate, sThreadTemplate) {
    var formatRaw = generateDynamicFormatRaw(sTourCodeKey);
    if (!formatRaw) {
        console.log('Could not retrieve formatRaw for sTourCodeKey: ' + sTourCodeKey);
        return false;
    }

    // format name
    var sFormatName = formatRaw.name;

    var baseFormatDetails = formatRaw.baseFormatDetails;

    // description
    var sDescriptionOutput = formatRaw.description ?
        formatRaw.description :
        TourDescriptionMissingFallback;
    sDescriptionOutput = sDescriptionOutput.replace('Pokemon', 'Pok&eacute;mon'); // Format for html

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
        sFormatName+" Resources" // {1}
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

    // Pre-rules supplementary output
    var sSingleItemFormatPropertyTemplate = `\n\t\t{0}: {1},`;
    var sPrerulesSupplementaryOutput = '';
    if(baseFormatDetails.gameType) {
        sPrerulesSupplementaryOutput += String.format(sSingleItemFormatPropertyTemplate, 'gameType', `'` + baseFormatDetails.gameType + `'`);
    }
    if(baseFormatDetails.maxLevel) {
        sPrerulesSupplementaryOutput += String.format(sSingleItemFormatPropertyTemplate, 'maxLevel', baseFormatDetails.maxLevel.toString());
    }

    // ruleset
    var sRulesetOutput = formatRulesList(formatRaw.rulesArray);

    // banlist
    var sBanlistOutput = formatRulesList(formatRaw.bansArray);

    // unbanlist
    var sUnbanListOutput = (formatRaw.unbansArray.length > 0) ? formatRulesList(formatRaw.unbansArray) : null;

    // restricted
    var sRestrictedListOutput = (formatRaw.restrictedArray.length > 0) ? formatRulesList(formatRaw.restrictedArray) : null;

    // Late supplementary output
    var sLateSupplementaryOutput = '';
    if(sUnbanListOutput) {
        sLateSupplementaryOutput += String.format(sArrayTemplate, 'unbanlist', sUnbanListOutput);
    }
    if(sRestrictedListOutput) {
        sLateSupplementaryOutput += String.format(sArrayTemplate, 'restricted', sRestrictedListOutput);
    }

    var sFormatOutput = String.format(sFormatTemplate,
        sFormatName, // {0}
        sDescriptionOutput, // {1}
        sThreadOutput, // {2}
        sModOutput, // {3}
        sPrerulesSupplementaryOutput, // {4}
        sRulesetOutput, // {5}
        sBanlistOutput, // {6}
        sLateSupplementaryOutput, // {7}
    );

    return sFormatOutput;
}

var generateFormatsFromArray = function(sHeaderName, formatsArray, sArrayTemplate, sFormatTemplate, sThreadTemplate, sSectionHeaderTemplate) {
    var sRawOutput = '';
    if(formatsArray.length > 0) {
        formatsArray.sort();
        sRawOutput += String.format(sSectionHeaderTemplate, sHeaderName, MashupsGeneratedFormatsColumn);
        for(var sTourName of formatsArray) {
            sRawOutput += generateDynamicFormat(sTourName, sArrayTemplate, sFormatTemplate, sThreadTemplate);
            sRawOutput += '\n';
        }
    }

    return sRawOutput;
}

var generateMashupFormats = exports.generateMashupFormats = function () {
    if(!fs.existsSync(ArrayTemplatePath)) {
        console.log('File missing: ' + ArrayTemplatePath);
        return false;
    }
    var sArrayTemplate = fs.readFileSync(ArrayTemplatePath).toString();

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

    var sRawOutput = '';

    // Place spotlight first in list, if it is well-defined
    var sSpotlightKeyName = null;
    for(const name of SpotlightNamesArray) {
        if(!AllTourCodesDictionary.hasOwnProperty(toId(name))) continue;
        sSpotlightKeyName = toId(name);
        break;
    }
    if(sSpotlightKeyName) {
        sRawOutput += String.format(sCommentHeaderTemplate, 'Mashups Spotlight');
        sRawOutput += String.format(sSectionHeaderTemplate, 'Mashups Spotlight', MashupsGeneratedFormatsColumn);
        sRawOutput += generateDynamicFormat(sSpotlightKeyName, sArrayTemplate, sFormatTemplate, sThreadTemplate);
        sRawOutput += '\n';
    }

    // Formats removed from output entirely (test, temporary or gimmick metas, etc)
    const ignoredFormatsArray = [
        'gen8dppstaaab',
        'gen8staaabbl',
        'gen8staaabtiers',
        'gen8staaabtrial'
    ];

    // Official mashup formats
    var nonSpotlightOfficialsArray = OfficialTourCodesNamesArray.filter(function(value, index, arr) {
        if (ignoredFormatsArray.includes(value)) return false;
        return (value !== sSpotlightKeyName);
    });
    var doublesOfficialsArray = nonSpotlightOfficialsArray.filter(function(value, index, arr) {
        return value.includes('doubles');
    });
    var littleCupOfficialsArray = nonSpotlightOfficialsArray.filter(function(value, index, arr) {
        return value.includes('littlecup');
    });
    var singlesOfficialsArray = nonSpotlightOfficialsArray.filter(function(value, index, arr) {
        return !doublesOfficialsArray.includes(value) && !littleCupOfficialsArray.includes(value);
    });

    // Officials comment header
    sRawOutput += String.format(sCommentHeaderTemplate, 'Official OM Mashups');

    // Officials format lists
    sRawOutput += generateFormatsFromArray('Official OM Mashups (Singles)', singlesOfficialsArray, sArrayTemplate, sFormatTemplate, sThreadTemplate, sSectionHeaderTemplate);
    sRawOutput += generateFormatsFromArray('Official OM Mashups (Doubles)', doublesOfficialsArray, sArrayTemplate, sFormatTemplate, sThreadTemplate, sSectionHeaderTemplate);
    sRawOutput += generateFormatsFromArray('Official OM Mashups (Little Cup)', littleCupOfficialsArray, sArrayTemplate, sFormatTemplate, sThreadTemplate, sSectionHeaderTemplate);

    // Section to test specific tour codes
    /*
    let sTestTourCodeName = 'gen8staaabmons';
    //let sTestTourCodeName = 'gen8tsaaa';
    //let sTestTourCodeName = 'gen8camomonsdoubles';

    sRawOutput += generateDynamicFormat(sTestTourCodeName, sArrayTemplate, sFormatTemplate, sThreadTemplate);
    sRawOutput += '\n';
    */

    // Remove trailing line return
    sRawOutput = sRawOutput.replace(/\n$/, "")

    // Format into list
    sRawOutput = String.format(sFormatListTemplate, sRawOutput);

    var outputFPath = Config.overrideGeneratedMashupsFormatsOutputDirectory ?
        Config.overrideGeneratedMashupsFormatsOutputDirectory + GenMashupFormatsFName :
        MashupFormatsOutputPath;

    var bFileWriteFailed = false;
    fs.writeFile(outputFPath, sRawOutput, function (err2) {
        if (err2) {
            console.log('Output failed: ' + outputFPath);
            bFileWriteFailed = true;
        }
    });
    if(bFileWriteFailed) return false;

    return true;
}
//#endregion generateMashupFormats
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
const TourExt = '.tour';

const MashupsURLRoot = TourCodesURLRoot + 'mashups/';
const MashupsMetadataURLRoot = MashupsURLRoot + MetadataPathExtension;
const SpotlightNamesURL = MashupsMetadataURLRoot + SpotlightNamesFName;
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

var OfficialTourCodesNamesArray = exports.OfficialTourCodesNamesArray = [];
var OtherTourCodesNamesArray = exports.OtherTourCodesNamesArray = [];
var AllTourCodesNamesArray = exports.AllTourCodesNamesArray = [];

var AllTourCodesDictionary = exports.AllTourCodesDictionary = {};

var SpotlightNamesArray = exports.SpotlightNamesArray = [];

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

var refreshTourCodeCache = exports.refreshTourCodeCache = async function ()
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
            }
            Mashups.setSpotlightTourNameArray(SpotlightNamesArray);

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
    
    sOutput += '\n';
    sOutput += 'Others:    ';
    bFirstLoop = true;
    for( var nItr=0; nItr<OtherTourCodesNamesArray.length; ++nItr ) {
        if(!(OtherTourCodesNamesArray[nItr] in AllTourCodesDictionary)) continue;
        if(!bFirstLoop) {
            sOutput += ', ';
        }
        sOutput += OtherTourCodesNamesArray[nItr];
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
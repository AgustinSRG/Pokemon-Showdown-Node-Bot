/*
* Tournament metadata tracker
*/

var Mashups = exports.Mashups = require('./index.js');

exports.onTournamentEnd = function (room, data) {
    //var statement = `Tour ended in ${room}!`;
    //if (statement) Bot.say(room, statement);
	
	// Debug
    //for (var i in data)
    //Bot.say(room, `${i.toString()}: ${data[i]}`);

	// Get ended tour format
	var sFormatId = data['format'];
	//Bot.say(room, `Format: ${sFormatId}`);
	var sGenericFormatId = Mashups.tourNameToAuthTypeGenericId(sFormatId);
	var sGenericFormatIdHardTiered = Mashups.tourNameToAuthTypeGenericId(sFormatId, false);
	//Bot.say(room, `sGenericFormatId: ${sGenericFormatId}`);
	
	// Determine tour type
	var eAuthType = Mashups.MashupAuthType.Other;
	var sIdentifiedDerivedFromTourName = '';

	// Prioritise spotlight if spotlight is official
	if( Mashups.MashupAuthType.Other === eAuthType ) {
		for (var nAliasItr=0; nAliasItr<Mashups.spotlightTourNameGenericIdArray.length; ++nAliasItr) {
			//Bot.say(room, `spotlightTourNameGenericId: ${Mashups.spotlightTourNameGenericIdArray[nAliasItr]}`);
			if( Mashups.spotlightTourNameGenericIdArray[nAliasItr] === sGenericFormatIdHardTiered ) {
				eAuthType = Mashups.MashupAuthType.Spotlight;
				sIdentifiedDerivedFromTourName = Mashups.spotlightTourNameArray[nAliasItr];
			}
		}
	}

	// Compare to list data
	var sOfficialFormat;
	if( Mashups.MashupAuthType.Other === eAuthType ) {
		if( Mashups.officialTourNamesArray ) {
			for (var nOfficial=0; nOfficial<Mashups.officialTourNamesArray.length; ++nOfficial) {
				for (var nAliasItr=0; nAliasItr<Mashups.officialTourNamesArray[nOfficial].length; ++nAliasItr) {
					//Bot.say(room, `official: ${Mashups.officialTourNamesGenericIdArray[nOfficial][nAliasItr]}`);
					if( Mashups.officialTourNamesGenericIdArray[nOfficial][nAliasItr] === sGenericFormatId ) {
						eAuthType = Mashups.MashupAuthType.Official;
						sIdentifiedDerivedFromTourName = Mashups.officialTourNamesArray[nOfficial][nAliasItr];
					}
				}
			}
		}
	}

	// Check if day has changed
	var currentTimestamp = Mashups.todayStartTimestamp();
	//Bot.say(room, currentTimestamp.toString() + ' / ' + Mashups.mashupsSavedData['date'].toString() );
	if( (currentTimestamp.getFullYear() !== Mashups.mashupsSavedData['dateY']) ||
		(currentTimestamp.getMonth() !== Mashups.mashupsSavedData['dateM']) ||
		(currentTimestamp.getDate() !== Mashups.mashupsSavedData['dateD']) )
	{
		var sDayChangedStatement = `Resetting tour counts because date has changed... `;
		sDayChangedStatement += `(Y:${currentTimestamp.getFullYear().toString()}, `;
		sDayChangedStatement += `M:${currentTimestamp.getMonth().toString()}, `;
		sDayChangedStatement += `D:${currentTimestamp.getDate().toString()})`;
		if (sDayChangedStatement) Bot.say(room, sDayChangedStatement);

		Mashups.mashupsSavedData['dateY'] = currentTimestamp.getFullYear();
		Mashups.mashupsSavedData['dateM'] = currentTimestamp.getMonth();
		Mashups.mashupsSavedData['dateD'] = currentTimestamp.getDate();
		Mashups.resetCompletedTourAuthTypeArray();
	}

	// Print justification
	var sAuthTypeName = Mashups.string_of_enum(Mashups.MashupAuthType, eAuthType);
	var sDeterminationJustification = '';
	if(Mashups.MashupAuthType.Other !== eAuthType) {
		sDeterminationJustification += `Identified successfully ended tour as a derivative of ${sIdentifiedDerivedFromTourName}`;
	}
	else {
		sDeterminationJustification += `Could not identify successfully ended tour`;
	}
	sDeterminationJustification += `, incrementing ${sAuthTypeName} count...`;
	if (sDeterminationJustification) Bot.say(room, sDeterminationJustification);
	
	// Increment
	Mashups.incrementCompletedTourAuthTypeCount(eAuthType);
	Mashups.save();

	// Print analysis of post-tour ratio
	var sAnalysisStatement = Mashups.analyseTourAuthTypeCountStatement();
	if (sAnalysisStatement) Bot.say(room, sAnalysisStatement);
};
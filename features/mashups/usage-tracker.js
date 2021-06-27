/*
* Dynamic formats Pokemon usage tracker
*/

var Mashups = exports.Mashups = require('./index.js');

const UsageDataRoot = AppOptions.data + 'usage/';

const ActiveTourNameKey = 'activetourname';

var LogData = {};

exports.onTournamentUpdate = function (room, data) {
	const sFormatId = toId(data['format']);
	//Bot.say(room, `Format: ${sFormatId}`);

    Mashups.mashupsSavedData[ActiveTourNameKey] = sFormatId;
};

exports.onTournamentEnd = function (room, data) {
    Mashups.mashupsSavedData[ActiveTourNameKey] = null;
};

exports.logTeamMember = function (room, playerSlot, pokemon) {
    if (!LogData.hasOwnProperty(room)) {
        LogData[room] = {};
        LogData[room]['date'] = Mashups.todayStartTimestamp();
    }
    if (!LogData[room].hasOwnProperty(playerSlot)) {
        LogData[room][playerSlot] = new Array();
    }
    LogData[room][playerSlot].push(pokemon);
};

exports.saveTeamLog = function (room) {
    const sFormatId = Mashups.mashupsSavedData[ActiveTourNameKey];
    if (!sFormatId) return;
    if (!LogData.hasOwnProperty(room)) return;

    var formatFFM = new Settings.FlatFileManager(UsageDataRoot + sFormatId + '.json');
    var formatSavedData = {};
    try {
        formatSavedData = formatFFM.readObj();
        formatSavedData[room] = LogData[room];
        formatFFM.writeObj(formatSavedData);
    } catch (e) {
        errlog(e.stack);
        error("Could not read formatSavedData: " + sys.inspect(e));
    }

    delete LogData[room];
};
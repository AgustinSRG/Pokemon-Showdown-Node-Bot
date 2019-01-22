/*
	Commands for Mashups room management
*/

var Mashups = exports.Mashups = require('./../features/mashups/index.js');

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
        if (!this.isRanked(Tools.getGroup('driver'))) return false;

        var sAnalysisStatement = Mashups.analyseTourAuthTypeCountStatement();
	    if (sAnalysisStatement) Bot.say(room, sAnalysisStatement);
    },
};
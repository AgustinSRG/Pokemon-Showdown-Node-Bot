/*
	Commands for analysing which formats can be mashed up
*/

var Mashups = exports.Mashups = require('./../features/mashups/index.js');

//#region eCommandParam

var eCommandParam = {
	'FormatA':0,
    'FormatB':1,

    'Count':2,
};
Object.freeze(eCommandParam);

//#endregion

//#region eFormat

var eFormat = {
	'A':0,
    'B':1,

    'Count':2,
};
Object.freeze(eFormat);

var m_formatKeyArray = [];
var m_formatDataArray = [];

//#endregion

//#region FormatAnalysis

function FormatAnalysis( _formatDetails )
{
    if(!_formatDetails || !_formatDetails.name) {
		monitor(`_formatDetails undefined! May have been erroneously passed a format name.`);
		return null;
	}

    // NonStandardMod checks
    this.sModName = Mashups.determineFormatMod(_formatDetails);
    this.bModIsStandard = Mashups.isDefaultModName(this.sModName);

    // SuppliesTeam checks
    this.bSuppliesTeam = !_formatDetails.team ? false : true;

    // KeyCustomCallbacks
    
}

//#endregion

//#region eCommandParam

exports.commands = {
	canwemash: 'analysemashup',
	analysemashup: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('voice'))) return false;
        
        var nFmtItr=0;

        if (!arg || !arg.length) {
			this.reply(`No formats specified!`);
			return;
		}

        var args = arg.split(',');
		var params = {
			formatA: null,
			formatB: null,
        };

        for (var i = 0; i < args.length; i++) {
			args[i] = args[i].trim();
			switch (i) {
                case eCommandParam.FormatA: // FormatA
                    if (!args[i]) {
                        this.reply(`First mashup format not supplied!`);
                        return;
                    }

                    m_formatKeyArray[eFormat.A] = args[i];
                    break;
                case eCommandParam.FormatB: // FormatB
                    if (!args[i]) {
                        this.reply(`Second mashup format not supplied!`);
                        return;
                    }

                    m_formatKeyArray[eFormat.B] = args[i];
                    break;
            }
        }

        //#region Validate Params

        for (nFmtItr = 0; nFmtItr < eFormat.Count; nFmtItr++) {
            // Search format as a server native format
            m_formatDataArray[nFmtItr] = Mashups.getFormatKey(m_formatKeyArray[nFmtItr]);
            if (null === m_formatDataArray[nFmtItr]) {
                this.reply(`Format: "${m_formatKeyArray[nFmtItr]}" not found on this server!`);
                return;
            }
            // FIXME: Add support for common compound bases like PH
        }

        //#endregion

        //#region Determine Conflict Level

        var sPriorMod;
        var bSharedNonStandardMod = false;
        var formatBaseRequirementsArray = [];
        var nBaseReqItr;
        for (nFmtItr = 0; nFmtItr < eFormat.Count; nFmtItr++) {
            formatBaseRequirementsArray[nFmtItr] = [];
            for (nBaseReqItr = 0; nBaseReqItr < Mashups.MashupBaseRequirement.Count; nBaseReqItr++) {
                switch(nBaseReqItr) {
                    case Mashups.MashupBaseRequirement.NonStandardMod:
                    sPriorMod = Mashups.determineFormatMod(m_formatDataArray[nFmtItr]);
                    break;
                }
            }
        }

        //#endregion
    }
};

//#endregion
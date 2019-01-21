/*
	Commands for tour code generation
*/

exports.commands = {
	genmashup: 'gentourcode',
	generatemashup: 'gentourcode',
	generatetourcode: 'gentourcode',
	gentourcode: 'gentourcode',
	gentour: 'gentourcode',
	generatetour: 'gentourcode',
	gentourcode: function (arg, user, room, cmd) {
        if (!this.isRanked(Tools.getGroup('voice'))) return false;
        
        if(undefined === arg) {
            this.reply(`No formats specified!`);
        }

        var details = {
			format: 'ou',
			type: 'elimination',
			timeToStart: 10,
			autodq: 1.5
		};
        if (arg && arg.length) {
			var args = arg.split(",");
			var params = {
				formats: null,
				type: null,
				timeToStart: null,
				autodq: null
			};
			var splArg;
			for (var i = 0; i < args.length; i++) {
				args[i] = args[i].trim();
				if (!args[i]) continue;
				splArg = args[i].split("=");
				if (splArg.length < 2) {
					switch (i) {
						case 0:
							params.formats = args[i];
							break;
						case 1:
							params.timeToStart = args[i];
							break;
						case 2:
							params.autodq = args[i];
							break;
						case 3:
							params.type = args[i];
							break;
					}
				} else {
					var idArg = toId(splArg[0]);
					var valueArg = splArg[1].trim();
					switch (idArg) {
						case 'formats':
							params.formats = valueArg;
							break;
						case 'time':
						case 'singups':
						case 'timer':
							params.timeToStart = valueArg;
							break;
						case 'autodq':
						case 'dq':
							params.autodq = valueArg;
							break;
						case 'generator':
						case 'type':
							params.type = valueArg;
							break;
						default:
							return this.reply(this.trad('param') + ' ' + idArg + ' ' + this.trad('paramhelp') + ": tier, timer, dq, users, type");
					}
				}
			}
            if (params.formats) { // FIXME: Need to subsplit here
                var format = Tools.parseAliases(params.formats);
				if (!Formats[format] || !Formats[format].chall) return this.reply(this.trad('e31') + ' ' + format + ' ' + this.trad('e32'));
                details.format = format;
                /*
				var format = Tools.parseAliases(params.format);
				if (!Formats[format] || !Formats[format].chall) return this.reply(this.trad('e31') + ' ' + format + ' ' + this.trad('e32'));
                details.format = format;
                */
			}
			if (params.timeToStart) {
				if (toId(params.timeToStart) === 'off') {
					details.timeToStart = null;
				} else {
					var time = parseInt(params.timeToStart);
					if (!time || time < 10) return this.reply(this.trad('e4'));
					details.timeToStart = time * 1000;
				}
			}
			if (params.autodq) {
				if (toId(params.autodq) === 'off') {
					details.autodq = false;
				} else {
					var dq = parseFloat(params.autodq);
					if (!dq || dq < 0) return this.reply(this.trad('e5'));
					details.autodq = dq;
				}
			}
			if (params.type) {
				var type = toId(params.type);
				if (type !== 'elimination' && type !== 'roundrobin') return this.reply(this.trad('e7'));
				details.type = type;
			}
        }
        
        let sTourCode = '';
        sTourCode += ` /tour new ${details.format}, ${details.type}, 32,1\n`;
        sTourCode += ` /tour autostart ${details.timeToStart}\n`;
        sTourCode += ` /tour rules +unreleased, +illegal\n`;
        sTourCode += ` /tour name [Gen7] Pure Hackmons\n`;

        this.reply(sTourCode);
	}
};

/*
	Pokemon Showdown Bot, for NodeJS

	By: Ecuacion
*/

try {
	require('sugar');

	global.colors = require('colors');
	global.sys = require('sys');
	global.fs = require('fs');
	global.path = require('path');
	global.PSClient = require('node-ps-client');
} catch (e) {
	console.log(e.stack);
	console.log("ERROR: missing dependencies, try 'npm install'");
	process.exit(-1);
}

console.log((
	'-----------------------------------------------\n' +
	'   Welcome to Pokemon Showdown Bot for Node!   \n' +
	'-----------------------------------------------\n'
).yellow);

require('./tools.js');

if (!fs.existsSync('./config.js')) {
	console.log("config.js does not exist - creating one with default settings...");
	fs.writeFileSync('./config.js', fs.readFileSync('./config-example.js'));
}

global.Config = require('./config.js');

global.reloadConfig = function () {
	uncacheTree('./config.js');
	global.Config = require('./config.js');
};

info('Loading globals');

/* Globals */

global.Formats = {};

global.Settings = require('./settings.js');

global.DataDownloader = require('./data-downloader.js');

global.CommandParser = require('./command-parser.js');

/* Features */

global.Features = {};

var featureList = fs.readdirSync('./features/');

featureList.forEach(function (feature) {
	if (fs.existsSync('./features/' + feature + '/index.js')) {
		try {
			var f = require('./features/' + feature + '/index.js');
			if (f.id) {
				Features[f.id] = f;
				ok("New feature: " + f.id + ' | ' + f.desc);
			} else {
				error("Failed to load feature: " + './features/' + feature);
			}
		} catch (e) {
			errlog(e.stack);
			error("Failed to load feature: " + './features/' + feature);
		}
	}
});

global.reloadFeatures = function () {
	var featureList = fs.readdirSync('./features/');
	var errs = [];
	featureList.forEach(function (feature) {
		if (fs.existsSync('./features/' + feature + '/index.js')) {
			try {
				uncacheTree('./features/' + feature + '/index.js');
				var f = require('./features/' + feature + '/index.js');
				if (f.id) {
					Features[f.id] = f;
					Features[f.id].init();
				}
			} catch (e) {
				errlog(e.stack);
				errs.push(feature);
			}
		}
	});
	return errs;
};

/* Bot creation and connection */

function botAfterConnect () {
	//join rooms
	var cmds = [];
	for (var i = 0; i < Config.rooms.length; i++) {
		cmds.push('|/join ' + Config.rooms[i]);
	}
	for (var i = 0; i < Config.initCmds.length; i++) {
		cmds.push(Config.initCmds[i]);
	}
	Bot.send(cmds, 2000);
	DataDownloader.download();
}

var opts = {
	serverid: Config.serverid,
	secprotocols: [],
	connectionTimeout: Config.connectionTimeout,
	loginServer: 'https://play.pokemonshowdown.com/~~' + Config.serverid + '/action.php',
	nickName: null,
	pass: null,
	retryLogin: false,
	autoConnect: false,
	autoReconnect: true,
	autoReconnectDelay: Config.autoReconnectDelay || (60 * 1000),
	autoJoin: [],
	showErrors: (Config.debug ? Config.debug.debug : true),
	debug: (Config.debug ? Config.debug.debug : true)
};

info('Connecting to server ' + Config.server + ':' + Config.port);

global.Bot = new PSClient(Config.server, Config.port, opts);

Bot.on('connect', function (con) {
	ok('Connected to server ' + Config.serverid);
	for (var f in Features) {
		try {
			Features[f].init();
		} catch (e) {
			errlog(e.stack);
			error("Feature Crash: " + f + " | " + sys.inspect(e));
		}
	}
});

Bot.on('formats', function (formats) {
	var formatsArr = formats.split('|');
	var commaIndex, sharpIndex, f, arg, formatData, spf, nCommas;
	for (var i = 0; i < formatsArr.length; i++) {
		commaIndex = formatsArr[i].indexOf(',');
		if (commaIndex === -1) {
			Formats[toId(formatsArr[i])] = {name: formatsArr[i], team: true, ladder: true, chall: true};
		} else if (commaIndex === 0) {
			continue;
		} else {
			f = formatsArr[i].substr(0, commaIndex);
			arg = formatsArr[i].substr(commaIndex);
			formatData = {name: f, team: true, ladder: true, chall: true};
			sharpIndex = arg.indexOf('#');
			if (sharpIndex >= 0) formatData.team = false;
			spf = arg.split(',');
			nCommas = 0;
			for (var k = 0; k < spf.length; k++) if (!spf[k]) nCommas++;
			if (nCommas === 2) formatData.ladder = false;
			else if (nCommas === 3) formatData.chall = false;
			Formats[toId(f)] = formatData;
		}
	}
});

Bot.on('challstr', function (challstr) {
	if (!Config.nick) {
		Bot.rename('Bot ' + generateRandomNick(10));
	} else {
		Bot.rename(Config.nick, Config.pass);
	}
});

Bot.on('renamefailure', function (e) {
	if (e === -1)  {
		if (!Config.nick) {
			debug('Login failure - generating another random nickname');
			Bot.rename('Bot ' + generateRandomNick(10));
		} else {
			error('Login failure - name registered, invalid or no password given');
			if (!Bot.status.named) {
				info("Invalid nick + pass, using a random nickname");
				Config.nick = '';
				Bot.rename('Bot ' + generateRandomNick(10));
			}
		}
	} else {
		error('Login failure, retrying in ' + (Config.autoReloginDelay / 1000) + ' seconds');
		setTimeout(
			function () {
				if (!Config.nick) {
					Bot.rename('Bot ' + generateRandomNick(10));
				} else {
					Bot.rename(Config.nick, Config.pass);
				}
			},
		Config.autoReloginDelay);
	}
});

Bot.on('rename', function (name, named) {
	if (named) {
		ok('Succesfully logged in as ' + name);
		if (!Config.nick) {
			if (Bot.roomcount > 0) return; // Namechange, not initial login
			botAfterConnect();
		} else if (toId(Config.nick) === toId(name)) {
			botAfterConnect();
		}
	}
});

Bot.on('disconnect', function (e) {
	info('Disconnected from server');
});

/* Commands */

Bot.on('chat', function (room, timeOff, by, msg) {
	CommandParser.parse(room, by, msg);
	Settings.reportSeen(by, room, 'c', []);
});

Bot.on('pm', function (by, msg) {
	CommandParser.parse(',' + by, by, msg);
});

Bot.on('userjoin', function (room, by) {
	Settings.reportSeen(by, room, 'j', []);
});

Bot.on('userleave', function (room, by) {
	Settings.reportSeen(by, room, 'l', []);
});

Bot.on('userrename', function (room, old, by) {
	Settings.reportSeen(old, room, 'n', [by]);
});

/* Features */

Bot.on('line', function (room, message, isIntro, spl) {
	for (var f in Features) {
		try {
			Features[f].parse(room, message, isIntro, spl);
		} catch (e) {
			errlog(e.stack);
			error("Feature Crash: " + f + " | " + sys.inspect(e));
			Features[f].disabled = true;
			Features[f].parse = function () {
				return true;
			};
			info("Feature " + f + " has been disabled");
		}
	}
});

/* Info and debug */

Bot.on('joinroom', function (room) {
	ok('Joined room ' + room + ' [' + Bot.rooms[room].type + ']');
});

Bot.on('joinfailure', function (room, e, info) {
	error('Could not join ' + room + ': [' + e + '] ' + info);
});

Bot.on('message', function (msg) {
	recv(msg);
});

Bot.on('send', function (msg) {
	sent(msg);
});

Bot.connect();

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

global.Tools = require('./tools.js');

if (!fs.existsSync('./config.js')) {
	console.log("config.js does not exist - creating one with default settings...");
	fs.writeFileSync('./config.js', fs.readFileSync('./config-example.js'));
}

global.Config = require('./config.js');
Tools.checkConfig();

global.reloadConfig = function () {
	Tools.uncacheTree('./config.js');
	global.Config = require('./config.js');
	Tools.checkConfig();
	CommandParser.reloadTokens();
};

info('Loading globals');

/* Globals */

global.Formats = {};

global.Settings = require('./settings.js');

global.DataDownloader = require('./data-downloader.js');

global.CommandParser = require('./command-parser.js');

/* Commands */

CommandParser.loadCommands();

/* Languages (translations) */

Tools.loadTranslations();

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
				Tools.uncacheTree('./features/' + feature + '/index.js');
				var f = require('./features/' + feature + '/index.js');
				if (f.id) {
					if (Features[f.id] && typeof Features[f.id].destroy === "function") Features[f.id].destroy();
					Features[f.id] = f;
					Features[f.id].init();
				}
			} catch (e) {
				errlog(e.stack);
				errs.push(feature);
			}
		}
	});
	info('Features reloaded' + (errs.length ? ('. Errors: ' + errs.join(', ')) : ''));
	return errs;
};

/* Bot creation and connection */

function botAfterConnect () {
	//join rooms
	if (typeof Config.rooms === "string") {
		joinByQueryRequest(Config.rooms);
	} else {
		var cmds = [];
		for (var i = 0; i < Config.rooms.length; i++) {
			cmds.push('|/join ' + Config.rooms[i]);
		}
		for (var i = 0; i < Config.initCmds.length; i++) {
			cmds.push(Config.initCmds[i]);
		}
		Bot.send(cmds, 2000);
	}
	if (!Config.disableDownload) {
		DataDownloader.download();
	}
}

function joinByQueryRequest(target) {
	if (target === 'official' || target === 'public' || target === 'all') {
		info('Joining ' + target + ' rooms');
	} else {
		error('Config.rooms, as a string must be "official", "public" or "all"');
		var cmds = [];
		for (var i = 0; i < Config.initCmds.length; i++) {
			cmds.push(Config.initCmds[i]);
		}
		Bot.send(cmds, 2000);
		return;
	}
	Bot.on('queryresponse', function (data) {
		data = data.split('|');
		if (data[0] === 'rooms') {
			data.splice(0, 1);
			var str = data.join('|');
			var cmds = [];
			try {
				var rooms = JSON.parse(str);
				var offRooms = [], publicRooms = [];
				if (rooms.official) {
					for (var i = 0; i < rooms.official.length; i++) {
						if (rooms.official[i].title) offRooms.push(toId(rooms.official[i].title));
					}
				}
				if (rooms.chat) {
					for (var i = 0; i < rooms.chat.length; i++) {
						if (rooms.chat[i].title) publicRooms.push(toId(rooms.chat[i].title));
					}
				}
				if (target === 'all' || target === 'official') {
					for (var i = 0; i < offRooms.length; i++) cmds.push('|/join ' + offRooms[i]);
				}
				if (target === 'all' || target === 'public') {
					for (var i = 0; i < publicRooms.length; i++) cmds.push('|/join ' + publicRooms[i]);
				}
			} catch (e) {}
			for (var i = 0; i < Config.initCmds.length; i++) {
				cmds.push(Config.initCmds[i]);
			}
			Bot.send(cmds, 2000);
			Bot.on('queryresponse', function () {return;});
		}
	});
	Bot.send('|/cmd rooms');
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
	autoReconnect: false,
	autoReconnectDelay: 0,
	autoJoin: [],
	showErrors: (Config.debug ? Config.debug.debug : true),
	debug: (Config.debug ? Config.debug.debug : true)
};

global.Bot = new PSClient(Config.server, Config.port, opts);

var connected = false;
Bot.on('connect', function (con) {
	ok('Connected to server ' + Config.serverid + ' (' + Tools.getDateString() + ')');
	connected = true;
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
	global.Formats = {};
	var formatsArr = formats.split('|');
	var commaIndex, arg, formatData, code, name;
	for (var i = 0; i < formatsArr.length; i++) {
		commaIndex = formatsArr[i].indexOf(',');
		if (commaIndex === -1) {
			Formats[toId(formatsArr[i])] = {name: formatsArr[i], team: true, ladder: true, chall: true};
		} else if (commaIndex === 0) {
			i++;
			continue;
		} else {
			name = formatsArr[i];
			formatData = {name: name, team: true, ladder: true, chall: true};
			code = commaIndex >= 0 ? parseInt(name.substr(commaIndex + 1), 16) : NaN;
			if (!isNaN(code)) {
				name = name.substr(0, commaIndex);
				if (code & 1) formatData.team = false;
				if (!(code & 2)) formatData.ladder = false;
				if (!(code & 4)) formatData.chall = false;
				if (!(code & 8)) formatData.disableTournaments = true;
			} else {
				if (name.substr(name.length - 2) === ',#') { // preset teams
					formatData.team = false;
					name = name.substr(0, name.length - 2);
				}
				if (name.substr(name.length - 2) === ',,') { // search-only
					formatData.chall = false;
					name = name.substr(0, name.length - 2);
				} else if (name.substr(name.length - 1) === ',') { // challenge-only
					formatData.ladder = false;
					name = name.substr(0, name.length - 1);
				}
			}
			formatData.name = name;
			Formats[toId(name)] = formatData;
		}
	}
	ok('Received battle formats. Total: ' + formatsArr.length);
});

Bot.on('challstr', function (challstr) {
	info('Received challstr, logging in...');
	if (!Config.nick) {
		Bot.rename('Bot ' + Tools.generateRandomNick(10));
	} else {
		Bot.rename(Config.nick, Config.pass);
	}
});

var retryingRename = false;
Bot.on('renamefailure', function (e) {
	if (e === -1)  {
		if (!Config.nick) {
			debug('Login failure - generating another random nickname');
			Bot.rename('Bot ' + Tools.generateRandomNick(10));
		} else {
			error('Login failure - name registered, invalid or no password given');
			if (!Bot.status.named) {
				info("Invalid nick + pass, using a random nickname");
				Config.nick = '';
				Bot.rename('Bot ' + Tools.generateRandomNick(10));
			}
		}
	} else {
		if (Config.autoReloginDelay) {
			error('Login failure, retrying in ' + (Config.autoReloginDelay / 1000) + ' seconds');
			retryingRename = true;
			setTimeout(function () {
				retryingRename = false;
				if (!Config.nick) {
					Bot.rename('Bot ' + Tools.generateRandomNick(10));
				} else {
					Bot.rename(Config.nick, Config.pass);
				}
			}, Config.autoReloginDelay);
		} else {
			error('Login failure');
		}
	}
});

Bot.on('rename', function (name, named) {
	monitor('Bot nickname has changed: ' + (named ? name.green : name.yellow) + (named ? '' : ' [guest]'));
	if (named) {
		if (!Config.nick) {
			if (Bot.roomcount > 0) return; // Namechange, not initial login
			ok('Succesfully logged in as ' + name);
			botAfterConnect();
		} else if (toId(Config.nick) === toId(name)) {
			ok('Succesfully logged in as ' + name);
			botAfterConnect();
		}
	}
});

/* Reconnect timer */

var reconnectTimer = null;
var reconnecting = false;
Bot.on('disconnect', function (e) {
	connected = false;
	if (Config.autoReconnectDelay) {
		if (reconnecting) return;
		reconnecting = true;
		error('Disconnected from server, retrying in ' + (Config.autoReconnectDelay / 1000) + ' seconds');
		reconnectTimer = setTimeout(function () {
			reconnecting = false;
			info('Connecting to server ' + Config.server + ':' + Config.port);
			Bot.connect();
		}, Config.autoReconnectDelay);
	} else {
		error('Disconnected from server, exiting...');
		process.exit(0);
	}
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

Bot.on('joinroom', function (room, type) {
	if (type === 'chat') monitor('Joined room ' + room, 'room', 'join');
	else if (type === 'battle') monitor('Joined battle ' + room, 'battle', 'join');
	else monitor('Joined room ' + room + ' [' + Bot.rooms[room].type + ']', 'room', 'join');
});

Bot.on('joinfailure', function (room, e, moreInfo) {
	monitor('Could not join ' + room + ': [' + e + '] ' + moreInfo, 'room', 'error');
});

Bot.on('leaveroom', function (room) {
	var roomType = Bot.rooms[room] ? Bot.rooms[room].type : 'chat';
	if (roomType === 'chat') monitor('Left room ' + room, 'room', 'leave');
	else if (roomType === 'battle') monitor('Left battle ' + room, 'battle', 'leave');
	else monitor('Left room ' + room + ' [' + Bot.rooms[room].type + ']', 'room', 'leave');
});

Bot.on('message', function (msg) {
	recv(msg);
});

Bot.on('send', function (msg) {
	sent(msg);
});

ok('Bot object is ready');

/* Global Monitor */

var checkSystem = function () {
	var status = '';
	var issue = false;
	status += 'Connection: ';
	if (connected) {
		status += 'connected'.green;
		status += ' | Nickname: ';
		if (Bot.status.named) {
			status += Bot.status.nickName.green;
		} else if (retryingRename) {
			status += Bot.status.nickName.yellow;
		} else {
			status += Bot.status.nickName.red;
			issue = 'login';
		}
	} else if (reconnecting) {
		status += 'retrying'.yellow;
	} else {
		issue = 'connect';
		status += 'disconnected'.red;
	}
	monitor(status + ' (' + Tools.getDateString() + ')', 'status');
	if (issue) {
		switch (issue) {
			case 'connect':
				monitor("Monitor failed: Connection issue. Reconnecting");
				Bot.connect();
				break;
			case 'login':
				monitor("Monitor failed: Login issue. Loging in a random username");
				Config.nick = '';
				Bot.rename('Bot ' + Tools.generateRandomNick(10));
				break;
		}
	}
};
var sysChecker = setInterval(checkSystem, 60 * 60 * 1000);
ok('Global monitor is working');

//CrashGuard
if (Config.crashguard) {
	process.on('uncaughtException', function (err) {
		error(("" + err.message).red);
		errlog(("" + err.stack).red);
	});
	ok("Crashguard enabled");
}

//WatchConfig
if (Config.watchconfig) {
	Tools.watchFile('./config.js', function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		try {
			reloadConfig();
			info('config.js reloaded');
		} catch (e) {
			error('could not reload config.js');
			errlog(e.stack);
		}
	});
	ok("Watchconfig enabled");
}

console.log("\n-----------------------------------------------\n".yellow);

//Connection
info('Connecting to server ' + Config.server + ':' + Config.port);
Bot.connect();
Bot.startConnectionTimeOut();

/*
 * Bot Setup
 * Configuration helper
 */

try {
	require('sugar');
	require('colors');
} catch (e) {
	console.log('Installing dependencies...');
	require('child_process').spawnSync('sh', ['-c', 'npm install --production'], {stdio: 'inherit'});
}

try {
	require('readline-sync');
} catch (e) {
	console.log('Installing dependencies... (readline-sync)');
	require('child_process').spawnSync('sh', ['-c', 'npm install readline-sync'], {stdio: 'inherit'});
}

var readline = require('readline-sync');
var fs = require('fs');
var sys = require('sys');
var url = require('url');
var http = require('http');

function scan (p) {
	return readline.question(p);
}

function print (t) {
	console.log(t);
}

function generateConfigFile (opts, file) {
	var lines = fs.readFileSync("./config-example.js").toString().split("\n");
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.indexOf("exports.server =") === 0) {
			lines[i] = "exports.server = " + JSON.stringify(opts.server) + ";";
		} else if (line.indexOf("exports.port =") === 0) {
			lines[i] = "exports.port = " + JSON.stringify(opts.port) + ";";
		} else if (line.indexOf("exports.serverid =") === 0) {
			lines[i] = "exports.serverid = " + JSON.stringify(opts.serverid) + ";";
		} else if (line.indexOf("exports.nick =") === 0) {
			lines[i] = "exports.nick = " + JSON.stringify(opts.nick) + ";";
		} else if (line.indexOf("exports.pass =") === 0) {
			lines[i] = "exports.pass = " + JSON.stringify(opts.pass) + ";";
		} else if (line.indexOf("exports.rooms =") === 0) {
			lines[i] = "exports.rooms = " + JSON.stringify(opts.rooms) + ";";
		} else if (line.indexOf("exports.initCmds =") === 0) {
			lines[i] = "exports.initCmds = ['|/avatar " + opts.avatar + "'];";
		} else if (line.indexOf("exports.exceptions =") === 0) {
			if (i < lines.length - 1) {
				var k = "";
				for (var j = 0; j < opts.owners.length; j++) {
					k += "\t" + JSON.stringify(opts.owners[j]) + ": true";
					if (j < opts.owners.length - 1) k += ",\n";
				}
				lines[i + 1] = k;
			}
		} else if (line.indexOf("exports.language =") === 0) {
			lines[i] = "exports.language = " + JSON.stringify(opts.language) + ";";
		}
	}
	fs.writeFileSync(file, lines.join("\n"));
}

function getServer (serverUrl, callback) {
	if (serverUrl.indexOf('://') !== -1) {
		serverUrl = url.parse(serverUrl).host;
	}
	if (serverUrl.slice(-1) === '/') {
		serverUrl = serverUrl.slice(0, -1);
	}
	console.log('Getting data for ' + serverUrl + '...');
	console.log('This may take some time, depending on Showdown\'s speed.');
	var received = false;
	var requestOptions = {
		hostname: 'play.pokemonshowdown.com',
		port: 80,
		path: '/crossdomain.php?host=' + serverUrl + '&path=',
		method: 'GET'
	};
	var req = http.request(requestOptions, function (res) {
		res.setEncoding('utf8');
		var str = '';
		res.on('data', function (chunk) {
			str += chunk;
		});
		res.on('end', function () {
			if (received) {
				return;
			}
			received = true;
			var search = 'var config = ';
			var index = str.indexOf(search);
			if (index !== -1) {
				var data = str.substr(index);
				data = data.substr(search.length, data.indexOf(';') - search.length);
				while (typeof data === "string") {
					try {
						data = JSON.parse(data);
					} catch (e) {
						console.log(e.message);
						console.log(e.stack);
						break;
					}
				}
				callback(true, data.host, data.port, data.id);
			} else {
				console.log('ERROR: failed to get data!');
				callback(false);
			}
		});
		res.on('error', function (err) {
			console.log('ERROR: ' + sys.inspect(err));
			callback(false);
		});
	});
	req.on('error', function (err) {
		console.log('ERROR: ' + sys.inspect(err));
		callback(false);
	});
	req.end();
}

var opts = {
	server: '',
	port: 80,
	serverid: '',
	nick: '',
	pass: '',
	rooms: [],
	owners: [],
	avatar: '',
	language: ""
};

function step1 () {
	print("Step 1".green + " - Server configuration");
	print("-------------------------------------------\n");
	print("First of all, choose the server you want to use for your bot");
	print("\t1 - Use Main server (play.pokemonshowdown.com)");
	print("\t2 - Use another server ([server].psim.us)\n");
	var o;
	do {
		o = parseInt(scan("Choose an option: "));
	} while (o !== 1 && o !== 2);
	var ask = function () {
		var serverUrl = scan("Enter the server (example.psim.us): ");
		getServer(serverUrl, function (ok, host, port, id) {
			if (!ok) {
				print("Invalid server, must be [server].psim.us".red + "\n");
				ask();
				return;
			}
			print("Server: " + host + ", Port: " + port + ", Id: " + id);
			var r;
			do {
				r = scan("Are you sure you want to use that server? (y/n): ").toLowerCase().charAt(0);
			} while (!(r in {y: 1, n: 1}));
			if (r === "y") {
				print("");
				opts.server = host;
				opts.port = parseInt(port);
				opts.serverid = id;
				step2();
			} else {
				print("");
				step1();
			}
		});
	};
	print("");
	if (o === 1) {
		var host = "sim.psim.us", port = 8000, id = "showdown";
		print("Server: " + host + ", Port: " + port + ", Id: " + id);
		var r;
		do {
			r = scan("Are you sure do you want to use that server? (y/n): ").toLowerCase().charAt(0);
		} while (!(r in {y: 1, n: 1}));
		if (r === "y") {
			print("");
			opts.server = host;
			opts.port = port;
			opts.serverid = id;
			step2();
		} else {
			print("");
			step1();
		}
	} else {
		ask();
	}
}

function step2 () {
	print("Step 2".green + " - Bot credentials");
	print("-------------------------------------------\n");
	print("Make an account in Pokemon Showdown for your bot and register it");
	print("Enter here the nick and passowrd for your bot\n");
	var nick, pass;
	nick = scan("Enter the nickname: ");
	pass = scan("Enter the password: ");
	print("Nick: " + nick + ", Pass: " + pass);
	var r;
	do {
		r = scan("Are you sure do you want to use those credentials? (y/n): ").toLowerCase().charAt(0);
	} while (!(r in {y: 1, n: 1}));
	if (r === "y") {
		opts.nick = nick;
		opts.pass = pass;
		print("");
		step3();
	} else {
		print("");
		step2();
	}
}

function step3 () {
	print("Step 3".green + " - Rooms");
	print("-------------------------------------------\n");
	print("Specify the rooms you want the bot to join");
	print("Separe them whith commas. Example: room1, room2, room3\n");
	var rooms = scan("Enter the rooms: ");
	rooms = rooms.split(",");
	for (var i = 0; i < rooms.length; i++) rooms[i] = rooms[i].replace(/[^a-zA-Z0-9-]+/g, '').toLowerCase();
	print("Rooms: " + rooms.join(",") + " | Total: " + rooms.length);
	var r;
	do {
		r = scan("Are you sure do you want to use those chat rooms? (y/n): ").toLowerCase().charAt(0);
	} while (!(r in {y: 1, n: 1}));
	if (r === "y") {
		opts.rooms = rooms;
		print("");
		step4();
	} else {
		print("");
		step3();
	}
}

function step4 () {
	print("Step 4".green + " - Bot auth exceptions");
	print("-------------------------------------------\n");
	print("Enter here your nicknames to give them " + "full access to bot commands".cyan);
	print("Separate them with commas");
	print("Example: ecuacion, ecuacionafk, ecuacionalt2\n");
	var excepted = scan("Enter the excepted users: ");
	excepted = excepted.split(",");
	for (var i = 0; i < excepted.length; i++) excepted[i] = excepted[i].toLowerCase().replace(/[^a-z0-9]/g, '');
	print("Excepted users: " + excepted.join(",") + " | Total: " + excepted.length);
	var r;
	do {
		r = scan("Are you sure? (y/n): ").toLowerCase().charAt(0);
	} while (!(r in {y: 1, n: 1}));
	if (r === "y") {
		opts.owners = excepted;
		print("");
		finish();
	} else {
		print("");
		step4();
	}
}

function finish () {
	print("Step 5".green + " - Avatar and language");
	print("-------------------------------------------\n");
	print("Choose the avatar number (for example 120 for standard bot avatar)");
	var avatar;
	var r;
	do {
		avatar = scan("Enter the avatar number: ");
		do {
			r = scan("Avatar: " + avatar + " | Are you sure? (y/n): ").toLowerCase().charAt(0);
		} while (!(r in {y: 1, n: 1}));
	} while (r !== "y");
	opts.avatar = avatar;
	var languages = ["english", "french", "german", "italian", "spanish"];
	var lang = "english";
	print("");
	print("This bot can works in multiple languages");
	print("Enter the default language");
	print("Options: " + languages.join(", "));
	print("");
	do {
		do {
			lang = scan("Enter the language: ").toLowerCase().replace(/[^a-z0-9]/g, '');
			if (languages.indexOf(lang) < 0) print("Invalid language");
		} while (languages.indexOf(lang) < 0);
		do {
			r = scan("Language: " + lang + " | Are you sure? (y/n): ").toLowerCase().charAt(0);
		} while (!(r in {y: 1, n: 1}));
	} while (r !== "y");
	opts.language = lang;
	print("");
	print("-------------------------------------------\n");
	print("Note: You can edit the file config.js to specify more details\n");
	if (fs.existsSync("./config.js")) {
		do {
			r = scan("config.js already exists, do you want to OVERWRITE it? If not, it will use another filename. (y/n): ").toLowerCase().charAt(0);
		} while (!(r in {y: 1, n: 1}));
		if (r === "y") {
			print("Writting the config...");
			generateConfigFile(opts, "./config.js");
			print("Done! The configuration file 'config.js' was created with sucess".green);
			print("To start the bot, use ".cyan + "node bot".blue);
		} else {
			var rndString = function (numChars) {
				var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
				var str = '';
				for (var i = 0, l = chars.length; i < numChars; i++) {
					str += chars.charAt(~~(Math.random() * l));
				}
				return str;
			};
			print("Writting the config...");
			var file = "config-tmp-" + rndString(4) + ".js";
			generateConfigFile(opts, "./" + file);
			print("Done! The configuration file '".green + file.green + "' was created with sucess".green);
			print("To start the bot, use ".cyan + ("node bot -c ./" + file).blue);
		}
	} else {
		print("Writting the config...");
		generateConfigFile(opts, "./config.js");
		print("Done! The configuration file 'config.js' was created with sucess".green);
		print("To start the bot, use ".cyan + "node bot".blue);
	}
	process.exit();
}

print((
	"\n-------------------------------------------\n" +
	"    Configure your Pokemon Showdown Bot    \n" +
	"-------------------------------------------\n"
).yellow);

print("Welcome, this is a interactive setup script to help");
print("configuring your Pokemon Showdown bot");
print("Note: Use Ctrl + C to exit\n");

step1();

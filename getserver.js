/*
	Server configuration help
*/

try {
	require('sugar');
	require('colors');
} catch (e) {
	console.log('Installing dependencies...');
	require('child_process').spawnSync('sh', ['-c', 'npm install --production'], {stdio: 'inherit'});
}

require('sugar');
var colors = require('colors');
var readline = require('readline');
var sys = require('sys');
var url = require('url');
var http = require('http');
var fs = require('fs');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function askUrl () {
	rl.question("Client url for server (example.psim.us): ", function (serverUrl) {
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
					console.log('---------------');
					console.log('server: ' + data.host);
					console.log('port: ' + data.port);
					console.log('serverid: ' + data.id);
					console.log('---------------\n');
					writeConfig(data.host, data.port, data.id);
				} else {
					console.log('ERROR: failed to get data!');
					rl.close();
					process.exit(-1);
				}
			});
			res.on('error', function (err) {
				console.log('ERROR: ' + sys.inspect(err));
				rl.close();
				process.exit(-1);
			});
		});

		req.on('error', function (err) {
			console.log('ERROR: ' + sys.inspect(err));
			rl.close();
			process.exit(-1);
		});

		req.end();
	});
}

function writeConfig (server, port, serverid) {
	rl.question("Do you want to write this in config.js? (yes, no): ", function (answer) {
		answer = answer.toLowerCase().replace(/[^a-z0-9]/g, '');
		if (answer in {'no': 1, 'n': 1}) {
			rl.close();
			return process.exit();
		}
		if (answer in {'yes': 1, 'y': 1}) {
			if (!fs.existsSync('./config.js')) {
				console.log("config.js does not exist - creating one with default settings...");
				fs.writeFileSync('./config.js', fs.readFileSync('./config-example.js'));
			}
			var conf = fs.readFileSync('./config.js').toString().split('\n');
			var status = {
				server: 0,
				port: 0,
				serverid: 0
			};
			for (var i = 0; i < conf.length; i++) {
				if (conf[i].substr(0, "exports.serverid".length) === "exports.serverid") {
					conf[i] = "exports.serverid = '" + serverid + "';";
					status.serverid = 1;
				} else if (conf[i].substr(0, "exports.server".length) === "exports.server") {
					conf[i] = "exports.server = '" + server + "';";
					status.server = 1;
				} else if (conf[i].substr(0, "exports.port".length) === "exports.port") {
					conf[i] = "exports.port = " + port + ";";
					status.port = 1;
				}
			}
			if (!status.server) conf.unshift("exports.server = '" + server + "';");
			if (!status.port) conf.unshift("exports.port = " + port + ";");
			if (!status.serverid) conf.unshift("exports.serverid = '" + serverid + "';");
			fs.writeFileSync('./config.js', conf.join('\n'));
			console.log("Done!".green + "\t" + "successfully created default config");
			rl.close();
			return process.exit();
		}
		writeConfig(server, port, serverid);
	});
}

console.log((
	"\n-------------------------------------------\n" +
	"       Pokemon-Showdown Servers Helper      \n" +
	"-------------------------------------------\n"
).yellow);

askUrl();

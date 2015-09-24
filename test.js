/*
	Test Script
*/

const MAX_COMMAND_RECURSION = 10;

function test (str) {
	console.log("test".cyan + "\t" + str);
}

function warn (str) {
	console.log("warn".yellow + "\t" + str);
}

/*
* Features test
*/

test("Starting features test");

var featureList = fs.readdirSync('./features/');
var featureErr = false;

featureList.forEach(function (feature) {
	if (fs.existsSync('./features/' + feature + '/index.js')) {
		try {
			var f = require('./features/' + feature + '/index.js');
			if (f.id) {
				Features[f.id] = f;
				ok("New feature: " + f.id + ' | ' + f.desc);
			} else {
				error("Feature " + './features/' + feature + " does not have an id");
				featureErr = true;
			}
		} catch (e) {
			errlog(e.stack);
			error("Failed to load feature: " + './features/' + feature);
			featureErr = true;
		}
	}
});

for (var f in Features) {
	try {
		if (typeof Features[f].destroy === "function") {
			Features[f].destroy();
			debug("destroyed feature " + f);
		} else {
			delete Features[f];
		}
	} catch (e) {
		errlog(e.stack);
		error("Failed to destroy feature: " + f);
		featureErr = true;
	}
}

if (featureErr) {
	error("features test failed. See above for details.");
	process.exit(1);
}

/*
* Command Test
*  -Test if some commands are repeated
*  -Test if some commands are invalid (not functions or references)
*/

test("Starting command test");

CommandParser.loadCommands();

var cmderr = false;
var commands = CommandParser.commands, cmdaux = {}, tempcmds = {};
fs.readdirSync('./commands').forEach(function (file) {
	if (file.substr(-3) === '.js') {
		try {
			tempcmds = require('./commands/' + file).commands;
		} catch (e) {
			errlog(e.stack);
			error("Could not import commands file: ./commands/" + file);
			cmderr = true;
			return;
		}
		for (var c in tempcmds) {
			if (c.toLowerCase() !== c) {
				warn("Command key \"" + c + "\" contains uppercase letters, whitch are not supported. See: " + file);
				cmderr = true;
			}
			if (cmdaux[c]) {
				cmdaux[c].push(file);
				warn("Command \"" + c + "\" is repeated: " + cmdaux[c].join(', '));
				cmderr = true;
			} else {
				cmdaux[c] = [];
				cmdaux[c].push(file);
			}
			var handler = c;
			var loopBreaker = 0;
			while (typeof commands[handler] === 'string' && (loopBreaker++ < MAX_COMMAND_RECURSION)) {
				handler = commands[handler];
			}
			if (typeof commands[handler] !== 'function') {
				error("invalid command type: " + c + ' (' + handler + ')' + ' = ' + sys.inspect(commands[handler]));
				cmderr = true;
			}
		}
	}
});

if (cmderr) {
	error("command test failed. See above for details.");
	process.exit(1);
}

/*
* Languages Test
*/

test("Starting languages test");

Tools.loadTranslations();

var defaultLang = Config.language || "english";

if (!Tools.translations[defaultLang]) {
	error("language test failed. Default language was not found: " + defaultLang);
	process.exit(1);
}

var langErr = false;
for (var k in Tools.translations[defaultLang]) {
	for (var l in Tools.translations) {
		if (!Tools.translations[l][k]) {
			warn("Key \"" + k + "\" not found in " + l + " language");
			langErr = true;
		}
	}
}

if (langErr) {
	error("language test failed. See above for details.");
	process.exit(1);
}


/* Test passed */

ok("Test script passed");
process.exit();

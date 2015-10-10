const COMMAND_PATH = "./commands";
const MAX_COMMAND_RECURSION = 10;

var assert = require("assert");

var commands = {}, separatedCommands = {};

function getFile (cmd) {
	for (var file in separatedCommands) {
		if (cmd in separatedCommands[file]) return file;
	}
}

describe("Commands", function () {
	it("Should not crash when loading files", function () {
		fs.readdirSync(COMMAND_PATH).forEach(function (file) {
			if (file.substr(-3) === ".js") {
				separatedCommands[file] = require("../../" + COMMAND_PATH + "/" + file).commands;
			}
		});
	});
	it("Should come from files with #commands attribute as object type", function () {
		for (var file in separatedCommands) {
			assert.strictEqual(typeof separatedCommands[file], "object", "commands file \"" + file + "\" has not a valid commands attribute");
			assert.notStrictEqual(separatedCommands[file], null, "commands file \"" + file + "\" has not a valid commands attribute");
		}
	});
	it("Should not be repeated in more than one file", function () {
		for (var file in separatedCommands) {
			for (var command in separatedCommands[file]) {
				assert.strictEqual(commands[command], undefined, "command \"" + command + "\" from file \"" + file + "\" is repeated (" + getFile(command) + ")");
				commands[command] = separatedCommands[file][command];
			}
		}
	});
	it("Should be functions or valid references", function () {
		var handler;
		var loopBreaker;
		for (var command in commands) {
			loopBreaker = 0;
			handler = command;
			while (typeof commands[handler] === "string" && (loopBreaker++ < MAX_COMMAND_RECURSION)) {
				handler = commands[handler];
			}
			assert.strictEqual(typeof commands[handler], "function", "command \"" + command + "\" from file \"" + getFile(command) + "\" is not a valid function or reference");
		}
	});
	it("Should not contain uppercase characters or spaces on their names", function () {
		for (var command in commands) {
			assert.strictEqual(command, command.toLowerCase().replace(/[ ]/, ""), "command \"" + command + "\" from file \"" + getFile(command) + "\" contains uppercase or spaces in the name");
		}
	});
});

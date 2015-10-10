var assert = require("assert");

Bot.status = {connected: true, named: true, nickName: 'Bot'};

var nullfunction = function () {};

Bot.send = nullfunction;

Bot.rooms = {
	lobby: {type: 'chat', title: 'Lobby', users: {'admin': '~Admin', 'regularuser': ' Regular User', 'bot': '@Bot'}, userCount: 2}
};

describe("CommandParser", function () {
	it("Should not return errors on commands loading", function () {
		var errs = CommandParser.loadCommands();
		assert.strictEqual(errs.length, 0, errs.join(', '));
	});
	it("Should try join a room when parsing a \"/invite\" message", function (done) {
		this.timeout(500);
		Bot.send = function (str) {
			if (str === "|/join room") {
				Bot.send = nullfunction;
				done();
			}
		};
		CommandParser.parse(",admin", "~Admin", "/invite room");
	});
	it("Should work with commands as functions", function (done) {
		this.timeout(500);
		CommandParser.commands["test"] = function (arg, by, room, cmd) {
			assert.strictEqual(arg, "command arg test");
			assert.strictEqual(by, "~Admin");
			assert.strictEqual(room, "lobby");
			assert.strictEqual(cmd, "test");
			done();
		};
		CommandParser.parse("lobby", "~Admin", ".test command arg test");
	});
	it("Should work with commands as references", function (done) {
		this.timeout(500);
		CommandParser.commands["testref"] = "test";
		CommandParser.commands["test"] = function (arg, by, room, cmd) {
			assert.strictEqual(arg, "command arg test");
			assert.strictEqual(by, "~Admin");
			assert.strictEqual(room, "lobby");
			assert.strictEqual(cmd, "testref");
			done();
		};
		CommandParser.parse("lobby", "~Admin", ".testref command arg test");
	});
	describe("#Command-Context", function () {
		it("Should return correct data", function (done) {
			this.timeout(500);
			CommandParser.commands["testref"] = "test";
			CommandParser.commands["test"] = function (arg, by, room, cmd) {
				assert.strictEqual(this.arg, arg);
				assert.strictEqual(this.by, by);
				assert.strictEqual(this.room, room);
				assert.strictEqual(this.cmd, cmd);
				assert.strictEqual(this.handler, "test");
				assert.strictEqual(this.cmdToken, ".");
				assert.strictEqual(this.roomType, Bot.rooms[room].type);
				assert.strictEqual(this.botName, Bot.status.nickName);
				assert.strictEqual(this.isExcepted, false);
				assert.strictEqual(this.language, Config.language);
				done();
			};
			CommandParser.parse("lobby", "~Admin", ".testref command arg test");
		});
	});
});

describe("Settings", function () {
	it("Should manage permissions properly", function () {
		Settings.addPermissions(['test']);
		Config.exceptions = {'author': true};
		Settings.setPermission('lobby', 'test', '@');
		assert.strictEqual(Settings.userCan('lobby', ' User', 'test'), false);
		assert.strictEqual(Settings.userCan('lobby', '+User', 'test'), false);
		assert.strictEqual(Settings.userCan('lobby', '@User', 'test'), true);
		assert.strictEqual(Settings.userCan('lobby', '~User', 'test'), true);
		assert.strictEqual(Settings.userCan('lobby', ' Author', 'test'), true);
		assert.strictEqual(Settings.userCan('lobby', '+Author', 'test'), true);
		Settings.setPermission('lobby', 'test', true);
		assert.strictEqual(Settings.userCan('lobby', ' User', 'test'), false);
		assert.strictEqual(Settings.userCan('lobby', '~User', 'test'), false);
		assert.strictEqual(Settings.userCan('lobby', ' Author', 'test'), true);
		assert.strictEqual(Settings.userCan('lobby', '+Author', 'test'), true);
		Settings.setPermission('lobby', 'test', ' ');
		assert.strictEqual(Settings.userCan('lobby', ' User', 'test'), true);
		assert.strictEqual(Settings.userCan('lobby', '~User', 'test'), true);
		assert.strictEqual(Settings.userCan('lobby', ' Author', 'test'), true);
		assert.strictEqual(Settings.userCan('lobby', '+Author', 'test'), true);
	});
	it("Should parse CommandParser filters properly", function (done) {
		this.timeout(500);
		CommandParser.commands["test"] = nullfunction;
		Settings.addParseFilter('test', function () {
			done();
		});
		CommandParser.parse("lobby", "~Admin", ".test command arg test");
	});
});

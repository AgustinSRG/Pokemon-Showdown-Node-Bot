const FEATURES_PATH = "./features";

var assert = require("assert");

Bot.status = {connected: true, named: true, nickName: 'Bot'};

var nullfunction = function () {};

Bot.send = nullfunction;

Bot.rooms = {
	lobby: {type: 'chat', title: 'Lobby', users: {'admin': '~Admin', 'regularuser': ' Regular User', 'bot': '@Bot'}, userCount: 2}
};

var separatedFeatures = {};

describe("Features", function () {
	it("Should not crash on load", function () {
		var featureList = fs.readdirSync(FEATURES_PATH);
		featureList.forEach(function (feature) {
			if (fs.existsSync(FEATURES_PATH + "/" + feature + '/index.js')) {
				var crash = false;
				var err = "";
				try {
					separatedFeatures[feature] = require("../../" + FEATURES_PATH + "/" + feature + '/index.js');
				} catch (e) {
					err = e.stack;
					crash = true;
				}
				assert.strictEqual(crash, false, "feature \"" + feature + "\" crashed on load\n" + err);
			}
		});
	});
	it("Should have an unique id", function () {
		for (var i in separatedFeatures) {
			assert.strictEqual(typeof separatedFeatures[i].id, "string", "feature \"" + i + "\" does not have an id");
			assert.strictEqual(Features[separatedFeatures[i].id], undefined, "feature \"" + i + "\" has a repeated id");
			Features[separatedFeatures[i].id] = separatedFeatures[i];
		}
	});
	it("Should not crash on init", function () {
		for (var feature in Features) {
			if (typeof Features[feature].init === "function") {
				var crash = false;
				var err = ""
				try {
					Features[feature].init()
				} catch (e) {
					err = e.stack;
					crash = true;
				}
				assert.strictEqual(crash, false, "feature \"" + feature + "\" crashed on init\n" + err);
			}
		}
	});
	it("Should be destroyed properly", function () {
		for (var feature in Features) {
			if (typeof Features[feature].destroy === "function") {
				var crash = false;
				var err = "";
				try {
					Features[feature].destroy()
				} catch (e) {
					err = e.stack;
					crash = true;
				}
				assert.strictEqual(crash, false, "feature \"" + feature + "\" crashed on destroy\n" + err);
			} else {
				delete Features[feature];
			}
			assert.strictEqual(Features[feature], undefined, "feature \"" + feature + "\" does not have a proper destroy method");
		}
	});
});
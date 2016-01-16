/*
 * Battle modules
 */

var modules = exports.modules = {};

var modFiles = ['singles-eff.js', 'ingame-nostatus.js'];

modFiles.forEach(function (file) {
	var mod;
	try {
		mod = require("./modules/" + file);
		if (!mod.id) return;
		modules[mod.id] = mod;
		debug("Loaded battle module: " + mod.id + (mod.desc ? (" [" + mod.desc + "]") : ""));
	} catch (e) {
		errlog(e.stack);
		error("Could not import battle module: " + file + " | " + sys.inspect(e));
	}
});

exports.choose = function (battle) {
	if (!battle.tier) return null;

	if (Config.battleModules && Config.battleModules[toId(battle.tier)]) {
		var mod = Config.battleModules[toId(battle.tier)];
		mod = modules[mod];
		if (mod) {
			debug("Battle module [" + battle.id + "] - Using " + mod);
			return mod;
		}
	}

	/* Module decision by default */

	if (toId(battle.tier) in {'challengecup1v1': 1, '1v1': 1}) {
		if (modules["ingame-nostatus"]) {
			debug("Battle module [" + battle.id + "] - Using ingame-nostatus");
			return modules["ingame-nostatus"];
		}
	}

	if (battle.gametype === "singles") {
		if (modules["singles-eff"]) {
			debug("Battle module [" + battle.id + "] - Using singles-eff");
			return modules["singles-eff"];
		}
	}

	if (modules["ingame-nostatus"]) {
		debug("Battle module [" + battle.id + "] - Using ingame-nostatus");
		return modules["ingame-nostatus"];
	}

	/* Random, no module designed */

	debug("Battle module [" + battle.id + "] - Not found, using random");
	return null;
};

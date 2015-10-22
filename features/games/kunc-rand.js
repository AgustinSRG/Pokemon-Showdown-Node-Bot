const DATA_FILE = "./../../data/kunc-sets.js";

if (!fs.existsSync("./data/kunc-sets.js")) {
	debug("./data/kunc-sets.js" + " does not exist - creating from default...");
	fs.writeFileSync("./data/kunc-sets.js", fs.readFileSync('./data/kunc-sets-example.js'));
}

var FormatData = {};

var getData = exports.getData = function () {
	try {
		return require(DATA_FILE).sets;
	} catch (e) {
		debug(e.stack);
		return null;
	}
};

exports.random = function () {
	var data = getData();
	if (!data) return null;
	var res = {};
	var id = Math.floor(Math.random() * data.length);
	res.id = id;
	res.species = data[id].species || 'Pikachu';
	res.moves = data[id].moves || ["Thunderbolt"];
	return res;
};

exports.randomNoRepeat = function (arr) {
	if (!arr) return exports.random();
	var temp, loopBreak = 0;
	do {
		temp = exports.random();
		loopBreak++;
	} while (arr.indexOf(temp.id) >= 0 && loopBreak < 50);
	return temp;
};

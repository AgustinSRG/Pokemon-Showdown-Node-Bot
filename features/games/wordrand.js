const DATA_FILE = "./../../data/games-words.js";

if (!fs.existsSync("./data/games-words.js")) {
	debug("./data/games-words.js" + " does not exist - creating from default...");
	fs.writeFileSync("./data/games-words.js", fs.readFileSync('./data/games-words-example.js'));
}

var getData = exports.getData = function () {
	try {
		return require(DATA_FILE).words;
	} catch (e) {
		debug(e.stack);
		return null;
	}
};

exports.random = function () {
	var data = getData();
	if (!data) return null;
	var elements = 0;
	for (var i in data) elements += data[i].length;
	var chosen = Math.floor(Math.random() * elements);
	var c = 0, last = '';
	for (var i in data) {
		if (chosen < data[i].length) return {word: data[i][chosen], clue: i};
		chosen -= data[i].length;
		last = i;
	}
	//should never happen
	debug("Random word generator: chosen not found in the array");
	return {word: data[last][0], clue: last};
};

exports.randomNoRepeat = function (arr) {
	if (!arr) return exports.random();
	var temp, loopBreak = 0;
	do {
		temp = exports.random();
		loopBreak++;
	} while (arr.indexOf(temp.word) >= 0 && loopBreak < 50);
	return temp;
};

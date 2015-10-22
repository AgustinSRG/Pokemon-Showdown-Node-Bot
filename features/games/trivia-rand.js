const DATA_FILE = "./../../data/trivia-data.js";

if (!fs.existsSync("./data/trivia-data.js")) {
	debug("./data/trivia-data.js" + " does not exist - creating from default...");
	fs.writeFileSync("./data/trivia-data.js", fs.readFileSync('./data/trivia-data-example.js'));
}

var getData = exports.getData = function () {
	try {
		return require(DATA_FILE).questions;
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
	res.question = data[id].q;
	if (typeof data[id].a === "string") res.answers = [data[id].a];
	else res.answers = data[id].a;
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

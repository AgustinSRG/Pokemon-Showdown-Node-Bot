/*
* Test index file
*/

global.AppOptions = {config: './config-example.js', data: './test-data/', testmode: true};

require('./../index.js');

for (var key in Config.debug) Config.debug[key] = false;

var testFiles = fs.readdirSync('./test/testfiles');
testFiles.forEach(function (testFile) {
	if (testFile.substr(-3) === '.js') require("./testfiles/" + testFile);
});

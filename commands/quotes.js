const quotesDataFile = './data/quotes.json';

if (!fs.existsSync(quotesDataFile))
	fs.writeFileSync(quotesDataFile, '{}');

var quotes = {};

try {
	quotes = JSON.parse(fs.readFileSync(quotesDataFile).toString());
} catch (e) {
	errlog(e.stack);
	error("Could not import quotes: " + sys.inspect(e));
}

var writing = false;
var writePending = false;
var saveQuotes = function () {
	var data = JSON.stringify(quotes);
	var finishWriting = function () {
		writing = false;
		if (writePending) {
			writePending = false;
			saveQuotes();
		}
	};
	if (writing) {
		writePending = true;
		return;
	}
	fs.writeFile(quotesDataFile + '.0', data, function () {
		// rename is atomic on POSIX, but will throw an error on Windows
		fs.rename(quotesDataFile + '.0', quotesDataFile, function (err) {
			if (err) {
				// This should only happen on Windows.
				fs.writeFile(quotesDataFile, data, finishWriting);
				return;
			}
			finishWriting();
		});
	});
};

Settings.addPermissions(['quote']);

exports.commands = {
	randomjoke: 'quote',
	joke: 'quote',
	randomquote: 'quote',
	quote: function (arg, by, room, cmd) {
		var quotesArr = Object.keys(quotes);
		if (!quotesArr.length) return this.restrictReply(this.trad('nodata'), 'quote');
		var rand = quotesArr[Math.floor(Math.random() * quotesArr.length)];
		this.restrictReply(quotes[rand], 'quote');
	},
	setquote: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (!CommandParser.tempVar) {
			return this.reply(this.trad('notemp'));
		}
		var quoteId = toId(arg);
		if (!quoteId) return;
		var text;
		if (quotes[quoteId]) {
			text = this.trad('q') + ' "' + quoteId + '" ' + this.trad('modified');
		} else {
			text = this.trad('q') + ' "' + quoteId + '" ' + this.trad('created');
		}
		quotes[quoteId] = CommandParser.tempVar;
		saveQuotes();
		this.reply(text);
	},
	delquote: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var quoteId = toId(arg);
		if (!quotes[quoteId]) return this.reply(this.trad('q') + ' "' + quoteId + '" ' + this.trad('n'));
		delete quotes[quoteId];
		saveQuotes();
		this.reply(this.trad('q') + ' "' + quoteId + '" ' + this.trad('d'));
	},
	vq: 'viewquotes',
	viewquote: 'viewquotes',
	viewquotes: function (arg, by, room, cmd) {
		if (arg) {
			var quoteId = toId(arg);
			if (!quotes[quoteId]) return this.restrictReply(this.trad('q') + ' "' + quoteId + '" ' + this.trad('n'), 'quote');
			return this.reply(quotes[quoteId]);
		}
		if (!this.isRanked('~')) return false;
		var data = '';
		for (var i in quotes) {
			data += i + ' -> ' + quotes[i] + '\n';
		}
		if (!data) return this.reply(this.trad('empty'));
		Tools.uploadToHastebin(this.trad('list') + ':\n\n' + data, function (r, link) {
			if (r) return this.pmReply(this.trad('list') + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	}
};

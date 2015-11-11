const quotesDataFile = AppOptions.data + 'quotes.json';

var quotesFFM = new Settings.FlatFileManager(quotesDataFile);

var quotes = {};

try {
	quotes = quotesFFM.readObj();
} catch (e) {
	errlog(e.stack);
	error("Could not import quotes: " + sys.inspect(e));
}

var saveQuotes = function () {
	quotesFFM.writeObj(quotes);
};

Settings.addPermissions(['quote']);

exports.commands = {
	randomjoke: 'quote',
	joke: 'quote',
	randomquote: 'quote',
	quote: function (arg, by, room, cmd) {
		if (arg) {
			var args = arg.split(',');
			var action = toId(args[0]);
			args.splice(0, 1);
			switch (action) {
				case 'add':
					return this.parse(this.cmdToken + 'addquotes ' + args.join(','));
				case 'set':
					return this.parse(this.cmdToken + 'setquote ' + args.join(','));
				case 'delete':
				case 'remove':
					return this.parse(this.cmdToken + 'delquote ' + args.join(','));
				case 'view':
				case 'list':
					return this.parse(this.cmdToken + 'viewquotes ' + args.join(','));
			}
		}
		var quotesArr = Object.keys(quotes);
		if (!quotesArr.length) return this.restrictReply(this.trad('nodata'), 'quote');
		var rand = quotesArr[Math.floor(Math.random() * quotesArr.length)];
		this.restrictReply(quotes[rand], 'quote');
	},
	setquote: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
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
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
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
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
		var data = '';
		for (var i in quotes) {
			data += i + ' -> ' + quotes[i] + '\n';
		}
		if (!data) return this.reply(this.trad('empty'));
		Tools.uploadToHastebin(this.trad('list') + ':\n\n' + data, function (r, link) {
			if (r) return this.pmReply(this.trad('list') + ': ' + link);
			else this.pmReply(this.trad('err'));
		}.bind(this));
	},
	addquotes: function (arg, by, room, cmd) {
		if (!this.isRanked(Tools.getGroup('admin'))) return false;
		if (!arg) return false;
		var link = arg.trim();
		if (!link) return false;
		if (link.substr(-1) === '/') link = link.substr(0, link.length - 1);
		var splitedLink = link.split('/');
		link = 'http://hastebin.com/raw/' + splitedLink[splitedLink.length - 1];
		this.reply(this.trad('d') + ': ' + link);
		var http = require('http');
		http.get(link, function (res) {
			var data = '';
			res.on('data', function (part) {
				data += part;
			}.bind(this));
			res.on('end', function (end) {
				if (data === '{"message":"Document not found."}') {
					Bot.say(room, this.trad('notfound'));
					return;
				}
				var lines = data.split('\n');
				for (var i = 0; i < lines.length; i++) {
					if (!lines[i].trim()) continue;
					var quoteId;
					do {
						quoteId = Tools.generateRandomNick(4);
					} while (quotes[quoteId]);
					quotes[quoteId] = lines[i].trim();
				}
				Bot.say(room, this.trad('add') + ' ' + lines.length + ' ' + this.trad('q'));
				saveQuotes();
			}.bind(this));
			res.on('error', function (end) {
				Bot.say(room, this.trad('err'));
			}.bind(this));
		}.bind(this)).on('error', function (e) {
			Bot.say(room, this.trad('err'));
		}.bind(this));
	}
};

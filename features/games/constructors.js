/* Games Constructors */


/*
* Auxiliar functions
*/

function isNotAlphanumeric (str) {
	return (/[^a-z0-9ñ]/g).test(str) ? true : false;
}

function toWordId (str) {
	if (!str) return '';
	return str.toLowerCase().replace(/[^a-z0-9ñ]/g, '');
}

function normalize_init () {
	var str1 = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑÇç";
	var str2 = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuñcc";
	var map = {};
	for (var i = 0; i < str1.length; i++) {
		map[str1.charAt(i)] = str2.charAt(i);
	}
	return map;
}

var normalObj = normalize_init();
function normalize (str) {
	if (!str) return '';
	var res = '';
	for (var i = 0; i < str.length; i++) {
		res += normalObj[str.charAt(i)] ? normalObj[str.charAt(i)] : str.charAt(i);
	}
	return res;
}

/*
* Hangman
*/

var Hangman = exports.Hangman = (function () {
	function Hangman (opts, output) {
		this.output = output;
		this.room = opts.room || '';
		this.title = opts.title || 'Hangman';
		this.word = opts.word || 'undefined';
		this.clue = opts.clue || 'undefined';
		this.status = [];
		var w = normalize(this.word).trim().toLowerCase();
		for (var i = 0; i < w.length; i++) {
			if (isNotAlphanumeric(w.charAt(i))) this.status.push({type: 'sep', key: w.charAt(i)});
			else this.status.push({type: 'key', key: w.charAt(i), guessed: false});
		}
		this.wordId = toWordId(w);
		this.said = [];
		this.maxFails = opts.maxFails || 0;
		this.fails = 0;
	}

	Hangman.prototype.emit = function (type, data) {
		if (typeof this.output === "function") return this.output.call(this, type, data);
	};

	Hangman.prototype.guess = function (user, str) {
		str = normalize(str);
		if (toWordId(str) === this.wordId) {
			this.end({type: 'win', winner: user});
			return;
		}
		var c = str.trim().toLowerCase();
		if (c.length !== 1) {
			this.fails++;
			if (this.maxFails && this.fails > this.maxFails) this.end({type: 'end'});
			return;
		}
		if (this.said.indexOf(c) >= 0 || isNotAlphanumeric(c)) return;
		this.said.push(c);
		var err = true, isCompleted = true;
		for (var i = 0; i < this.status.length; i++) {
			if (this.status[i].type === 'key' && !this.status[i].guessed) {
				if (this.status[i].key === c) {
					err = false;
					this.status[i].guessed = true;
				} else {
					isCompleted = false;
				}
			}
		}
		if (isCompleted) {
			this.end({type: 'win', winner: user});
		} else if (err) {
			this.fails++;
			if (this.maxFails && this.fails > this.maxFails) this.end({type: 'end', victim: user});
		} else {
			this.emit('show', null);
		}
	};

	Hangman.prototype.start = function () {
		this.emit('start', null);
	};

	Hangman.prototype.end = function (results) {
		if (!results) return this.emit('forceend', results);
		switch (results.type) {
			case 'win':
				this.emit('win', results);
				break;
			case 'end':
				this.emit('end', results);
				break;
		}
	};

	return Hangman;
})();

/*
* Anagrams
*/

var Anagrams = exports.Anagrams = (function () {
	function Anagrams (opts, output) {
		this.output = output;
		this.room = opts.room || '';
		this.title = opts.title || 'Anagrams';
		this.wordGenerator = opts.wordGenerator || (function () {return {word: 'undefined', clue: 'default word'};});
		this.recentWords = [];
		this.maxRecentWordsLength = opts.maxRecentWordsLength || 10;
		this.maxGames = opts.maxGames || 0;
		this.maxPoints = opts.maxPoints || 0;
		this.ngame = 0;
		this.points = {};
		this.names = {};
		this.timer = null;
		this.waitTime = opts.waitTime || 2000;
		this.answerTime = opts.answerTime || 30000;
		this.status = 0; //0-created, 1-waiting for new game, 2-waiting for responses
		this.word = '';
		this.wordId = '';
		this.randomizedChars = [];
		this.clue = '';
	}

	Anagrams.prototype.emit = function (type, data) {
		if (typeof this.output === "function") return this.output.call(this, type, data);
	};

	Anagrams.prototype.start = function (type, data) {
		this.status = 1;
		this.emit('start', null);
		this.wait();
	};

	Anagrams.prototype.wait = function () {
		this.timer = setTimeout(function () {
			this.timer = null;
			this.nextGame();
		}.bind(this), this.waitTime);
	};

	Anagrams.prototype.startAnswerTimer = function () {
		this.timer = setTimeout(function () {
			this.timer = null;
			this.answerTimeout();
		}.bind(this), this.answerTime);
	};

	Anagrams.prototype.nextGame = function () {
		this.ngame++;
		if (this.maxGames && this.ngame > this.maxGames) return this.end();
		if (this.maxPoints) {
			for (var u in this.points) {
				if (this.points[u] >= this.maxPoints) return this.end();
			}
		}
		var dt = this.wordGenerator.call(this, this.recentWords);
		if (!dt) return this.emit('error', null);
		this.word = dt.word;
		this.clue = dt.clue;
		this.wordId = toWordId(normalize(this.word));
		this.randomizedChars = [];
		for (var i = 0; i < this.wordId.length; i++) {
			this.randomizedChars.push(this.wordId.charAt(i));
		}
		this.randomizedChars = this.randomizedChars.randomize();
		this.status = 2;
		this.recentWords.push(this.wordId);
		if (this.recentWords.length > this.maxRecentWordsLength) this.recentWords.shift();
		this.emit('show', null);
		this.startAnswerTimer();
	};

	Anagrams.prototype.answerTimeout = function () {
		this.status = 1;
		this.emit('timeout', null);
		this.wait();
	};

	Anagrams.prototype.guess = function (user, str) {
		str = normalize(str);
		var userid = toId(user);
		if (toWordId(str) === this.wordId) {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			if (!this.points[userid]) this.points[userid] = 0;
			this.points[userid]++;
			this.names[userid] = user;
			this.emit('point', {user: user, points: this.points[userid]});
			this.wait();
		}
	};

	Anagrams.prototype.end = function (forced) {
		if (forced) return this.emit('forceend');
		this.status = 0;
		var winners = [], points = 0;
		for (var i in this.points) {
			if (this.points[i] === points) {
				winners.push(this.names[i]);
			} else if (this.points[i] > points) {
				points = this.points[i];
				winners = [];
				winners.push(this.names[i]);
			}
		}
		if (!points) return this.emit('end', null);
		this.emit('win', {winners: winners, points: points});
	};

	Anagrams.prototype.clearTimers = function () {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	};

	return Anagrams;
})();

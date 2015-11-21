/*
	Tournaments Manager Feature
*/

exports.id = 'tours';
exports.desc = 'A tool to ease tournaments creation';

var tournaments = exports.tournaments = {};
var tourData = exports.tourData = {};

var Leaderboards = exports.Leaderboards = require('./leaderboards.js');

var Tournament = exports.Tournament = (function () {
	function Tournament (room, details) {
		this.format = details.format || 'randombattle';
		this.type = details.type || 'elimination';
		this.users = 0;
		this.maxUsers = details.maxUsers || null;
		this.signups = false;
		this.started = false;
		this.startTimer = null;
		this.room = room || 'lobby';
		this.timeToStart = details.timeToStart || 30 * 1000;
		this.autodq = details.autodq || false;
		this.scoutProtect = details.scoutProtect || false;
	}

	Tournament.prototype.createTour = function () {
		Bot.say(this.room, '/tournament create ' + this.format + ', ' + this.type);
	};
	Tournament.prototype.startTimeout = function () {
		if (!this.timeToStart) return;
		this.signups = true;
		if (this.scoutProtect) Bot.say(this.room, '/tournament setscouting disallow');
		this.startTimer = setTimeout(function () {
			this.startTour();
			this.started = true;
			this.startTimer = null;
		}.bind(this), this.timeToStart);
	};
	Tournament.prototype.startTour = function () {
		Bot.say(this.room, '/tournament start');
	};
	Tournament.prototype.checkUsers = function () {
		if (!this.maxUsers) return;
		if (this.maxUsers <= this.users) this.startTour();
	};
	Tournament.prototype.setAutodq = function () {
		if (!this.autodq) return;
		Bot.say(this.room, '/tournament autodq ' + this.autodq);
	};
	Tournament.prototype.endTour = function () {
		Bot.say(this.room, '/tournament end');
	};

	return Tournament;
})();

var newTour = exports.newTour = function (room, details) {
	tournaments[room] = new Tournament(room, details);
	tournaments[room].createTour();
};

exports.init = function () {
	for (var i in tournaments) {
		try {
			if (tournaments[i].startTimer) clearTimeout(tournaments[i].startTimer);
		} catch (e) {}
		delete tournaments[i];
	}
	for (var i in tourData)
		delete tourData[i];
};

exports.parse = function (room, message, isIntro, spl) {
	if (spl[0] !== 'tournament') return;
	if (isIntro) return;
	if (!tourData[room]) tourData[room] = {};
	switch (spl[1]) {
		case 'create':
			if (!tournaments[room]) break;
			tournaments[room].startTimeout();
			break;
		case 'join':
			if (!tournaments[room]) break;
			tournaments[room].users++;
			tournaments[room].checkUsers();
			break;
		case 'leave':
			if (!tournaments[room]) break;
			tournaments[room].users--;
			tournaments[room].checkUsers();
			break;
		case 'start':
			if (!tournaments[room]) break;
			if (tournaments[room].signups) {
				tournaments[room].signups = false;
				clearTimeout(tournaments[room].startTimer);
				tournaments[room].setAutodq();
			}
			break;
		case 'update':
			try {
				var data = JSON.parse(spl[2]);
				for (var i in data)
					tourData[room][i] = data[i];
			} catch (e){}
			break;
		case 'updateEnd':
			if (!tournaments[room]) break;
			if (tournaments[room].started && !tourData[room].isStarted) {
				tournaments[room].startTour();
			}
			break;
		case 'end':
			try {
				var data = JSON.parse(spl[2]);
				for (var i in data)
					tourData[room][i] = data[i];
			} catch (e){}
			Leaderboards.onTournamentEnd(room, tourData[room]);
			delete tourData[room];
			if (tournaments[room] && tournaments[room].startTimer) clearTimeout(tournaments[room].startTimer);
			if (tournaments[room]) delete tournaments[room];
			break;
		case 'forceend':
			delete tourData[room];
			if (tournaments[room] && tournaments[room].startTimer) clearTimeout(tournaments[room].startTimer);
			if (tournaments[room]) delete tournaments[room];
			break;
	}
};

exports.destroy = function () {
	if (Features[exports.id]) delete Features[exports.id];
};

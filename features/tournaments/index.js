/*
	Tournaments Manager Feature
*/

exports.id = 'tours';
exports.desc = 'A tool to ease tournaments creation';


var tournaments = exports.tournaments = {};
var tourData = exports.tourData = {};

var Tour = function () {
	var TourPrototype = {
		format: 'randombattle',
		type: 'elimination',
		users: 0,
		maxUsers: null,
		signups: false,
		started: false,
		startTimer: null,
		room: '',
		timeToStart: 30 * 1000,
		autodq: false,

		createTour: function () {
			Bot.say(this.room, '/tournament create ' + this.format + ', ' + this.type);
		},

		startTimeout: function () {
			if (!this.timeToStart) return;
			this.signups = true;
			this.startTimer = setTimeout(function () {
				this.startTour();
				this.started = true;
				this.startTimer = null;
			}.bind(this), this.timeToStart);
		},

		startTour: function () {
			Bot.say(this.room, '/tournament start');
		},

		checkUsers: function () {
			if (!this.maxUsers) return;
			if (this.maxUsers <= this.users) this.startTour();
		},

		setAutodq: function () {
			if (!this.autodq) return;
			Bot.say(this.room, '/tournament autodq ' + this.autodq);
		}
	};
	for (var i in TourPrototype)
		this[i] = TourPrototype[i];
	return this;
};

var newTour = exports.newTour = function (room, details) {
	tournaments[room] = new Tour();
	tournaments[room].room = room;
	for (var i in details)
		tournaments[room][i] = details[i];
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

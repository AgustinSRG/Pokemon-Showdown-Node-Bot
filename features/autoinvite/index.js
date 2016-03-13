/*
	Auto-Invite
*/

exports.id = 'autoinvite';
exports.desc = 'Automated /invite for private rooms';

var parserIndex = -1;
var parserArray = [];

var privateRooms = [];
var linkedRooms = [];
var roomAuth = exports.roomAuth = {};
var roomAuthChanges = exports.roomAuthChanges = {};

var checkAuthTimer = null;
var checkAuth = exports.checkAuth = function () {
	if (!Bot.status.connected) return;
	parserArray = [];
	for (var i in roomAuthChanges) {
		parserArray.push(i);
		delete roomAuthChanges[i];
	}
	if (!parserArray.length) return;
	parserIndex = -1;
	getNextRoom();
};

function getRoomLinked (room) {
	var res = [];
	for (var i = 0; i < linkedRooms.length; i++) {
		if (room === linkedRooms[i].linked) {
			if (res.indexOf(linkedRooms[i].private) >= 0) continue;
			res.push(linkedRooms[i].private);
		}
	}
	return res;
}

function isInRoom (room, user) {
	if (Bot.rooms && Bot.rooms[room] && Bot.rooms[room].users && (user in Bot.rooms[room].users)) return true;
	return false;
}

function getRank (room, from) {
	for (var i = 0; i < linkedRooms.length; i++) {
		if (from === linkedRooms[i].linked && room === linkedRooms[i].private) return linkedRooms[i].rank;
	}
	return '+';
}

function hasAuth (room, user, from) {
	if (!roomAuth[room] || !roomAuth[room][user]) return false;
	var userIdent = roomAuth[room][user] + user;
	var rank = getRank(room, from);
	return Tools.equalOrHigherRank(userIdent, rank);
}

function parseJoin (room, user) {
	user = toId(user);
	var rooms = getRoomLinked(room);
	for (var i = 0; i < rooms.length; i++) {
		if (isInRoom(rooms[i], user)) continue;
		if (!hasAuth(rooms[i], user, room)) continue;
		Bot.say('', '/invite ' + user + ',' + rooms[i]);
	}
}

function parseRename (room, user, old) {
	user = toId(user);
	old = toId(old || '');
	var rooms = getRoomLinked(room);
	for (var i = 0; i < rooms.length; i++) {
		if (isInRoom(rooms[i], user)) continue;
		if (isInRoom(rooms[i], old)) continue;
		if (!hasAuth(rooms[i], user, room)) continue;
		Bot.say('', '/invite ' + user + ',' + rooms[i]);
	}
}

function parseRaw (room, raw) {
	if (privateRooms.indexOf(room) < 0) return;
	if (raw.indexOf(" was promoted ") >= 0 || raw.indexOf(" was demoted ") >= 0) {
		if (!roomAuthChanges[room]) roomAuthChanges[room] = 0;
		roomAuthChanges[room]++;
		debug('Auth change detected [' + room + ']: ' + raw);
	}
}

/* Auth parser */
function getNextRoom () {
	parserIndex++;
	if (parserIndex >= parserArray.length) {
		if (parserArray.length) debug('Room auth received and parsed from: ' + parserArray.join(", "));
		return;
	}
	var popupParser = function (popup) {
		if (toId(popup.substr(0, 4)) === 'room') {
			var auth = {};
			var _message = popup.replace("Moderators", ":");
			_message = _message.replace("Drivers", ":");
			_message = _message.replace("Voices", ":");
			var parts = _message.split(':');
			var rank = " ";
			var usersList;
			for (var i = 0; i < parts.length; i += 2) {
				usersList = parts[i + 1].split(',');
				if (parts[i].indexOf("(") > -1) rank = parts[i].substr(parts[i].indexOf("(") + 1, 1);
				for (var f = 0; f < usersList.length; f++) {
					auth[toId(usersList[f])] = rank;
				}
			}
			roomAuth[parserArray[parserIndex]] = auth;
			if (Config.debug && Config.debug.debug) debug("Roomauth from " + parserArray[parserIndex] + " = " + JSON.stringify(auth));
			Bot.removeListener('popup', popupParser);
			setTimeout(getNextRoom, 1500);
		}
	};
	Bot.on('popup', popupParser);
	Bot.say(parserArray[parserIndex], '/roomauth');
}

exports.init = function () {
	privateRooms = [];
	linkedRooms = {};
	roomAuthChanges = exports.roomAuthChanges = {};
	if (Config.autoInvite) {
		for (var i = 0; i < Config.autoInvite.length; i++) {
			if (privateRooms.indexOf(Config.autoInvite[i].private) < 0) privateRooms.push(Config.autoInvite[i].private);
			roomAuthChanges[Config.autoInvite[i].private] = 1;
		}
		linkedRooms = Config.autoInvite;
	}
	if (checkAuthTimer) clearInterval(checkAuthTimer);
	checkAuthTimer = null;
	if (privateRooms.length) checkAuthTimer = setInterval(checkAuth, 10 * 1000);
};

exports.parse = function (room, message, isIntro, spl) {
	if (isIntro) return;
	if (!Bot.rooms[room] || Bot.rooms[room].type !== "chat") return;
	switch (spl[0]) {
		case 'J': case 'j':
			parseJoin(room, spl[1]);
			break;
		case 'n': case 'N':
			parseRename(room, spl[1], spl[2]);
			break;
	}
	if (message.substr(0) !== '|') parseRaw(room, message);
};

exports.destroy = function () {
	for (var i in roomAuth)
		delete roomAuth[i];
	if (checkAuthTimer) clearInterval(checkAuthTimer);
	checkAuthTimer = null;
	if (Features[exports.id]) delete Features[exports.id];
};

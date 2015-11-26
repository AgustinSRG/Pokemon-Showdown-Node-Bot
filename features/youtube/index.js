var https = require('https');

exports.id = 'youtube';
exports.desc = 'Automated YouTube link recognition';

exports.init = function () {
	return;
};

function getLinkId (msg) {
	msg = msg.split(' ');
	for (var i = 0; i < msg.length; i++) {
		if ((/youtu\.be/i).test(msg[i])) {
			var temp = msg[i].split('/');
			return temp[temp.length - 1];
		} else if ((/youtube\.com/i).test(msg[i])) {
			return msg[i].substring(msg[i].indexOf("=") + 1).replace(".", "");
		}
	}
}

function parseChat (room, time, by, msg) {
	var enableByDefault = Config.youtube ? Config.youtube.enableByDefault : false;
	var enabled = enableByDefault;
	if (Settings.settings['ytlinks'] && typeof Settings.settings['ytlinks'][room] !== "undefined") {
		enabled = !!Settings.settings['ytlinks'][room];
	}
	if (enabled && ((/youtube\.com/i).test(msg) || (/youtu\.be/i).test(msg))) {
		var transYT = function (data) {
			var tempLang = Config.language || 'english';
			if (Settings.settings['language'] && Settings.settings['language'][room]) tempLang = Settings.settings['language'][room];
			return Tools.translateGlobal('youtube', data, tempLang);
		};
		try {
			var id = getLinkId(msg);
			if (!id) return;
			var options = {
				host: 'www.googleapis.com',
				path: '/youtube/v3/videos?id=' + id + '&key=AIzaSyBHyOyjHSrOW5wiS5A55Ekx4df_qBp6hkQ&fields=items(snippet(channelId,title,categoryId))&part=snippet'
			};
			var callback = function (response) {
				var str = '';
				response.on('data', function (chunk) {
					str += chunk;
				});
				response.on('end', function () {
					try {
						var youTubeData = JSON.parse(str);
						if (youTubeData.items && youTubeData.items.length && youTubeData.items[0].snippet) {
							Bot.say(room, transYT('before') + ' ' + by.substr(1) + transYT('after') + ': **"' + youTubeData.items[0].snippet.title + '"**');
						}
					} catch (e) {}
				});
				response.on('error', function (e) {
					debug('failed on connection with YouTube');
				});
			};
			var ytErr = function (e) {
				debug('failed on connection with YouTube');
			};
			var req = https.request(options, callback);
			req.on('error', ytErr);
			req.end();
		} catch (e) {
			errlog(e.stack);
		}
	}
}

exports.parse = function (room, message, isIntro, spl) {
	if (isIntro) return;
	if (!Bot.rooms[room] || Bot.rooms[room].type !== "chat") return;
	var by, timeOff;
	switch (spl[0]) {
		case 'c':
			by = spl[1];
			timeOff = Date.now();
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|").length));
			break;
		case 'c:':
			by = spl[2];
			timeOff = parseInt(spl[1]) * 1000;
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|" + spl[2] + "|").length));
			break;
	}
};

exports.destroy = function () {
	if (Features[exports.id]) delete Features[exports.id];
};

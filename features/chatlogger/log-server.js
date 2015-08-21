const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000;
const MAX_BAN_DURATION = 24 * 60 * 60 * 1000;

var http = require('http');
var qs = require('querystring');

function parseCookies (request) {
	var list = {}, rc = request.headers.cookie;
	if (rc) rc.split(';').forEach(function (cookie) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = decodeURI(parts.join('='));
	});
	return list;
}

function getLog (room, file, head) {
	if (!fs.existsSync('./logs/' + room + "/" + file)) return false;
	return (fs.readFileSync('./logs/' + room + "/" + file).toString());
}

function getMonthString (n) {
	var table = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return table[parseInt(n) - 1];
}

function getLogInfo (file) {
	var txt = '(';
	try {
		file = file.substr(0, file.length - 4);
		var parts = file.split('_');
		if (parts.length < 4) return '(Unknown)';
		txt += 'Room: ' + parts[0] + ', Date: ' + getMonthString(parts[2]) + " " + parts[3] + ", " + parts[1];
		txt += ')';
		return txt;
	} catch (e) {
		return '(Unknown)';
	}
}

var LOGIN_HTML = '<form action="" method="post" name="formlogin" target="_self" id="formlogin"><label><br /><strong>User: &emsp;</strong><input name="user" type="text" id="user" /></label><br /><br /><label><strong>Password: &emsp;</strong>  <input name="password" type="password" id="password" /></label><br /><br /><label><input type="submit" name="login" value="Log In" /></label></form>';

var LOGOUT_HTML = '<br /><form action="" method="post" name="formlogout" target="_self" id="formlogout"><label><input type="submit" name="logout" value="Log Out" /></label></form>';

var LogServer = (function () {
	function LogServer (opts) {
		if (!opts) opts = {};
		this.connectionTimes = {};
		this.connections = {};
		this.bannedIps = {};
		this.antiSpam = true;
		this.tokens = {};
		this.port = opts.port || 5400;
		this.bindaddress = opts.bindaddress || null;
		this.server = null;
	}

	LogServer.prototype.getConfig = function () {
		var d = Config.logServer || {};
		if (!d.rooms) d.rooms = {};
		if (!d.users) d.users = {};
		return d;
	};

	LogServer.prototype.log = function (txt) {
		debug("LOG SERVER: " + txt);
	};

	LogServer.prototype.listen = function () {
		var server = this.server = http.createServer(this.handleRequest.bind(this));
		setTimeout(function () {
			server.listen(this.port, this.bindaddress);
			info("Log Server Listening at " + (this.bindaddress || "localhost") + ":" + this.port);
		}.bind(this), 1000);
	};

	LogServer.prototype.handleRequest = function (request, response) {
		var url = request.url;
		var ip = request.connection.remoteAddress;
		var roomConfig = this.getConfig().rooms;

		if (!this.countIp(ip)) return request.connection.destroy(); //Ignore Banned Ips
		this.log(request.connection.remoteAddress + " requested " + request.url + " (" + Tools.getDateString() + ")");
		this.update();

		request.on('error', function (err) {
			this.log("Request error: " + sys.inspect(err));
		}.bind(this));
		response.on('error', function (err) {
			this.log("Respose error: " + sys.inspect(err));
		}.bind(this));

		if (url === '/favicon.ico') {
			var img = fs.readFileSync('./features/chatlogger/favicon.ico');
			response.writeHead(200, {'Content-Type': 'image/ico'});
			response.end(img, 'binary');
			return;
		}

		var cookies = parseCookies(request);
		var secToken = cookies['accesstoken'];
		var acs = this.checkToken(secToken);

		if (request.method === 'POST') {
			var body = '';
			request.on('data', function (data) {
				body += data;
				if (body.length > 1e6) request.connection.destroy();
			}.bind(this));
			request.on('end', function () {
				var post = qs.parse(body);
				if (post.logout) {
					if (acs.user) {
						this.logout(secToken);
						this.finishResponse(request, response, 'none', true);
					}
				} else {
					var token = this.login(post.user, post.password);
					if (token) {
						this.finishResponse(request, response, token, true);
					} else {
						this.finishResponse(request, response, token);
					}
				}
			}.bind(this));
			return;
		}
		this.finishResponse(request, response, secToken);
	};
	LogServer.prototype.finishResponse = function (request, response, secToken, setToken) {
		var url = request.url;
		var ip = request.connection.remoteAddress;
		var roomConfig = this.getConfig().rooms;
		var acs = this.checkToken(secToken);

		var htmlHead = {'Content-Type': 'text/html; charset=utf-8'}, logHead = {'Content-Type': 'text/plain; charset=utf-8'};
		if (setToken) {
			htmlHead['Set-Cookie'] = 'accesstoken=' + secToken + "; Path=/";
			logHead['Set-Cookie'] = 'accesstoken=' + secToken + "; Path=/";
		}
		var roomArr = [];
		for (var i in acs.rooms) roomArr.push('<a target="_self" href="/' + i + '/">' + i + '</a>');

		var html = '';
		var title = '';
		html += '</title></head>';
		html += '<body>';
		html += '<h2>Logs Server - Pokemon Showdown Bot</h2>\n<p><strong>Server: </strong><a target="_blank" href="http://' + Config.server + ':' + Config.port + '">' + Config.server + '</a>&nbsp;|&nbsp;<strong>Bot: </strong>' + Bot.status.nickName + '</p><p><strong>Rooms: </strong>' + (roomArr.join('&nbsp;|&nbsp;') || '<i>(none)</i>') + '</p>';
		html += '<hr />';
		html += '<p>' + (acs.user ? ('User: <strong>' + acs.user + '</strong>' + LOGOUT_HTML) : LOGIN_HTML) + (secToken === 'invalid' ? '<br /><font color="red">Invalid credentials</font>' : '') + '</p>';
		html += '<hr />';
		if (!url || url === "/") {
			title = 'Logs Server - Pokemon Showdown Bot';
		} else {
			var parts = url.split('/');
			var room = parts[0] || parts[1];
			var file = (parts[0] ? parts[1] : parts[2]);
			var acsRoom = this.checkToken(secToken, room);
			if (!roomConfig[room]) {
				title = '404 - Not found';
				html += '<h3>Room not found</h3>';
			} else if (acsRoom.denied) {
				title = 'Access denied';
				html += '<h3>Access denied</h3>';
			} else if (!file) {
				title = 'Logs Server - Pokemon Showdown Bot - ' + room;
				html += '<h3>Room: ' + room + '</h3>';
				html += '<h4>Logs</h4><p>';
				html += this.getLogList(room);
				html += '</p>';
			} else {
				var log = getLog(room, file + '.log');
				if (!log) {
					title = '404 - Not found';
					html += '<h3>404 - File Not Found</h3>';
				} else {
					response.writeHead(200, logHead);
					response.write(log);
					response.end();
					return;
				}
			}
		}
		html += '</body></html>';
		html = '<html><head><title>' + title + html;
		if (secToken && secToken === 'invalid') {
			response.writeHead(200, {
				'Content-Type': 'text/html; charset=utf-8',
				'Set-Cookie': 'accesstoken=none'
			});
		} else {
			response.writeHead(200, htmlHead);
		}
		response.write(html);
		response.end();
	};
	LogServer.prototype.getLogList = function (room) {
		try {
			var logList = '';
			var files = fs.readdirSync('./logs/' + room + '/');
			for (var i = 0; i < files.length; i++) {
				if (files[i].substr(-4) !== ".log") continue;
				logList += '<a style="margin-left:10px;" target="_blank" href="./' + files[i].substr(0, files[i].length - 4) + '">' + files[i] + '</a>&emsp;' + getLogInfo(files[i]) + ' <br /><br />';
			}
			return logList;
		} catch (e) {
			return '(No logs Found)';
		}
	};

	LogServer.prototype.login = function (user, pass) {
		if (!user) return false;
		user = toId(user);
		var conf = Config.logServer || {};
		var users = conf.users || {};
		if (!users[user]) return 'invalid';
		if (users[user].pass !== pass) return 'invalid';
		var token;
		do {
			token = Tools.generateRandomNick(10);
		} while (this.tokens[token]);
		this.tokens[token] = {
			user: user,
			pass: pass,
			date: Date.now()
		};
		return token;
	};
	LogServer.prototype.logout = function (token) {
		if (this.tokens[token]) delete this.tokens[token];
	};
	LogServer.prototype.checkToken = function (token, room) {
		var acs = {
			user: false,
			denied: false,
			rooms: {}
		};
		var conf = Config.logServer || {};
		var users = conf.users || {};
		var rooms = conf.rooms || {};
		for (var i in rooms) {
			if (!rooms[i].private) acs.rooms[i] = 1;
		}
		var userid = false;
		if (token && this.tokens[token] && conf.users[this.tokens[token].user] && conf.users[this.tokens[token].user].pass === this.tokens[token].pass) {
			userid = this.tokens[token].user;
			acs.user = conf.users[userid].name;
			for (var i in conf.users[this.tokens[token].user].access) {
				acs.rooms[i] = 1;
			}
		} else {
			acs.user = false;
		}
		if (!room || !rooms[room]) {
			acs.denied = true;
		} else {
			if (rooms[room].private) {
				if (userid) {
					if (conf.users[userid].access && conf.users[userid].access[room]) acs.denied = false;
					else acs.denied = true;
				} else {
					acs.denied = true;
				}
			} else {
				acs.denied = false;
			}
		}
		return acs;
	};

	LogServer.prototype.countIp = function (ip, name) {
		if (this.bannedIps[ip]) return false;
		var now = Date.now();
		if (!this.connectionTimes[ip]) {
			this.connections[ip] = 1;
			this.connectionTimes[ip] = now;
			return true;
		}
		var duration = now - this.connectionTimes[ip];
		name = (name ? ': ' + name : '');
		if (ip in this.connections && duration < 10 * 60 * 1000) {
			this.connections[ip]++;
			if (this.connections[ip] >= 500) {
				this.log('IP ' + ip + ' has been banned for connection flooding (' + this.connections[ip] + ' times in the last ' + duration.duration() + name + ')');
				this.bannedIps[ip] = {
					date: now
				};
				return false;
			}
		} else {
			this.connections[ip] = 1;
			this.connectionTimes[ip] = now;
		}
		return true;
	};
	LogServer.prototype.update = function () {
		for (var i in this.tokens) {
			if (Date.now() - this.tokens[i].date > MAX_TOKEN_AGE) {
				delete this.tokens[i];
			}
		}
		for (var ip in this.bannedIps) {
			if (Date.now() - this.bannedIps[ip].date > MAX_BAN_DURATION) {
				delete this.bannedIps[ip];
			}
		}
	};

	LogServer.prototype.destroy = function () {
		if (this.server) {
			this.server.close();
			delete this.server;
			this.log('Log server closed');
		}
	};

	return LogServer;
})();

module.exports = LogServer;

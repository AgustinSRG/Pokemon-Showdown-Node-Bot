var port = Config.github ? Config.github.port : 3420;
var secret = Config.github ? Config.github.secret : "";

exports.id = 'github';
exports.desc = 'Development tool that gets data from github';

var updates = exports.updates = {};

function report (str) {
	debug("GitHub: " + str);
	if (Config.github) Bot.say(Config.github.room, "/addhtmlbox " + str);
}

function startWebHook (secret, port) {
	if (!secret) return;
	try {
		require('githubhook');
	} catch (e) {
		error('Feature ' + exports.id + ' could not work without githubhook. Try "npm install githubhook" if you want to use this feature');
		return;
	}
	var github = exports.github = require('githubhook')({
		port: port,
		secret: secret
	});
	github.on('push', function push(repo, ref, result) {
		var url = result.compare;
		var branch = /[^/]+$/.exec(ref)[0];
		var messages = [];
		var message = "";
		message += "[<font color='FF00FF'>" + Tools.escapeHTML(repo) + '</font>] ';
		message += "<font color='909090'>" + Tools.escapeHTML(result.pusher.name) + "</font> ";
		message += (result.forced ? '<font color="red">force-pushed</font>' : 'pushed') + " ";
		message += "<b>" + Tools.escapeHTML(result.commits.length) + "</b> ";
		message += "new commit" + (result.commits.length === 1 ? '' : 's') + " to ";
		message += "<font color='800080'>" + Tools.escapeHTML(branch) + "</font>: ";
		message += "<a href=\"" + Tools.escapeHTML(url) + "\">View &amp; compare</a>";
		messages.push(message);
		result.commits.forEach(function (commit) {
			var commitMessage = commit.message;
			var shortCommit = /.+/.exec(commitMessage)[0];
			if (commitMessage !== shortCommit) {
				shortCommit += '&hellip;';
			}
			message = "";
			message += "<font color='FF00FF'>" + Tools.escapeHTML(repo) + "</font>/";
			message += "<font color='800080'>" + Tools.escapeHTML(branch) + "</font> ";
			message += "<a href=\"" + Tools.escapeHTML(commit.url) + "\">";
			message += "<font color='606060'>" + Tools.escapeHTML(commit.id.substring(0, 6)) + "</font></a> ";
			message += "<font color='909090'>" + Tools.escapeHTML(commit.author.name) + "</font>: " + Tools.escapeHTML(shortCommit);
			messages.push(message);
		});
		report(messages.join("<br>"));
	});
	github.on('pull_request', function pullRequest(repo, ref, result) {
		var COOLDOWN = 10 * 60 * 1000;
		var requestNumber = result.pull_request.number;
		var url = result.pull_request.html_url;
		var action = result.action;
		if (!updates[repo]) updates[repo] = {};
		if (action === 'synchronize') {
			action = 'updated';
		}
		if (action === 'labeled') {
			// Nobody cares about labels
			return;
		}
		var now = Date.now();
		if (updates[repo][requestNumber] && updates[repo][requestNumber] + COOLDOWN > now) {
			return;
		}
		updates[repo][requestNumber] = now;
		var message = "";
		message += "[<font color='FF00FF'>" + repo + "</font>] ";
		message += "<font color='909090'>" + result.sender.login + "</font> ";
		message += action + " pull request <a href=\"" + url + "\">#" + requestNumber + "</a>: ";
		message += result.pull_request.title;
		report(message);
	});
	github.listen();
	monitor("GitHub Hook listening on port " + port);
}

exports.init = function () {
	for (var i in updates) delete updates[i];
};

exports.destroy = function () {
	if (exports.github) {
		try {
			exports.github.server.close();
		} catch (e) {}
		delete exports.github;
	}
	if (Features[exports.id]) {
		delete Features[exports.id];
	}
};

startWebHook(secret, port);

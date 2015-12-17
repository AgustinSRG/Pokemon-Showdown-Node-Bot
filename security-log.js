/*
	Log system
*/

const LOGS_PATH = './logs/';

function dateDifference (date1, date2) {
	if (!date1 || !date1.day || !date1.month || !date1.year) return 0;
	if (!date2 || !date2.day || !date2.month || !date2.year) return 0;
	var dif = 0;
	dif += 365 * (date1.year - date2.year);
	var days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var daysA = 0, daysB = 0;
	for (var i = 1; i < date1.month; i++)
		daysA += days[i];
	daysA += date1.day;
	for (var i = 1; i < date2.month; i++)
		daysB += days[i];
	daysB += date2.day;
	dif += (daysA - daysB);
	dif = Math.abs(dif);
	return dif;
}

function checkDir (dir) {
	try {
		if (!fs.existsSync(dir))
			fs.mkdirSync(dir);
	} catch (e) {}
}

checkDir(LOGS_PATH);

module.exports = {
	logStream: null,
	logDate: null,

	"write": function (message) {
		var f = new Date();
		var fstr = Tools.addLeftZero(f.getFullYear(), 4) + '_' + Tools.addLeftZero(f.getMonth() + 1, 2) + '_' + Tools.addLeftZero(f.getDate(), 2);
		if (!this.logStream || this.logDate !== fstr) {
			if (this.logStream) {
				try {
					this.logStream.close();
				} catch (e) {}
			}
			this.logDate = fstr;
			checkDir(LOGS_PATH + 'security-log' + '/');
			this.logStream = fs.createWriteStream(LOGS_PATH + 'security-log' + '/' + 'security' + '_' + fstr + '.log', {flags:'a+'});
			this.sweep(LOGS_PATH + 'security-log' + '/');
		}
		this.logStream.write('[' + Tools.addLeftZero(f.getHours(), 2) + ':' + Tools.addLeftZero(f.getMinutes(), 2) + ':' + Tools.addLeftZero(f.getSeconds(), 2) + '] ' + message + '\n');
	},

	"log": function (message) {
		try {
			this.write(message);
		} catch (e) {
			errlog(e.stack);
			error("Failed to write security log: " + e.message);
		}
	},

	sweep: function (dir) {
		//delete previous logs
		var ageOfLogs = 15;
		if (Config.securityLog && typeof Config.securityLog.ageOfLogs === "number") {
			if (Config.securityLog.ageOfLogs <= 0) return;
			ageOfLogs = Config.securityLog.ageOfLogs;
		}
		var f = new Date();
		try {
			var logs = fs.readdirSync(dir);
			var aux;
			var maxDaysOld = ageOfLogs;
			for (var i = 0; i < logs.length; i++) {
				if (logs[i].substr(-4) !== ".log") continue;
				aux = logs[i].substr(0, logs[i].indexOf("."));
				aux = aux.split('_');
				if (aux.length < 4) continue;
				if (dateDifference({"day": parseInt(aux[3]), "month": parseInt(aux[2]), "year": parseInt(aux[1])}, {"day": f.getDate(), "month": f.getMonth() + 1, "year": f.getFullYear()}) > maxDaysOld) {
					try {fs.unlinkSync(dir + logs[i]);} catch (e) {error('failed to delete old security logs\n' +  e.stack);}
				}
			}
		} catch (e) {
			errlog(e.message);
			errlog(e.stack);
		}
	}
};

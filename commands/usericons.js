/*************************************************************************************************************************************
*                                                                                                                                    *
*  Userlist-Icons: Users can set their icon in the userlist with these commands.                                                     *
*                                                                                                                                    *
**************************************************************************************************************************************
*                                                                                                                                    *
*  Documentation for .icon                                                                                                           *
*  .icon                                     display short description.                                                              *
*  .icon        [url]                        request a userlist icon.                                                                *
*  .icon css    [css]                        request a userlist icon. Use css only if you know what you're doing.                    *
*  .icon cancel                              cancel an icon request you have placed.                                                 *
*  .icon delete                              delete your userstyle icon.                                                             *
*                                                                                                                                    *
*  Documentation for .icon {admin commands}                                                                                          *
*  .icon requests                            get a css hastebin with the current requests.                                           *
*  .icon output                              get a css hastebin with the requests merged in. This will delete                        *
*                                            any requests it finds already implemented.                                              *
*                                                                                                                                    *
//*  .icon cancel [user], [message]            reject a request with [message].                        [TODO]                        *
//*  .icon delete [user], [message]            delete a user's icon with [message].                    [TODO]                        *
//*  .icon ignore [user]                       never show requests from this user again.               [TODO]                        *
*                                                                                                                                    *
*************************************************************************************************************************************/

var httpRequest = require('request');
var sizeOfImage = require('request-image-size');

var iconRequests = [];  // (MAYBE): on init - load iconRequests array from file REQUESTS
                        //
                        // code to load requests goes here..
                        //

function splitCSS(cssString) {
	cssString = cssString.split('\r\n').join('\n');
	var userCSS = cssString.split('}').map( (s) => s + '}' );  // split after '}', but keep the bracket
	userCSS.pop();                                             // drop whatever is left behind the last entry
	var result = [];
	for (var k in userCSS) {
		var username = userCSS[k].match(/\[id\$\=\'\-userlist\-user\-([\s\S]*?)\'\]/);
		var innerCSS = userCSS[k].match(/\{([\s\S]*?)\}/);
		if (username && innerCSS && username[1] && innerCSS[1]) {
			username = username[1];  // username[0] = "[id$='-userlist-user-NAME']", username[1] = "NAME"
			innerCSS = innerCSS[1];  // innerCSS[0] = "{CSS}" (with brackets),       innerCSS[1] = "CSS"
			result[username] = userCSS[k].trim();
			result[username].innerCSS = innerCSS;
		} else console.log('Missing username or css brackets: ' + userCSS[k]);
	}
	return result;
}

function getInnerCSS(cssString) {
	var result = cssString.match(/\{([\s\S]*?)\}/);
	if (!result || !result[1]) return '';
	return result[1].trim();
}

function ExtractKeyword(argString, Keywords) {
	// argString must be an object, so that it can be modified like a var parameter
	var pos;
	for (var k in Keywords) {
		pos = (argString + ' ').indexOf(Keywords[k] + ' ');
		if (pos > -1) {
			if (argString.substring(0, pos).trim())
				continue;  // there's letters before the keyword. But it's only a match if it's the first word.
			var temp = argString.substring(pos + Keywords[k].length);
			argString.valueOf = argString.toSource = argString.toString = () => temp;
			return Keywords[k];
		}
	}
	return '';
}

exports.commands = {
	"usericon": 'icon',
	"userlisticon": 'icon',
	icon: function (arg, by, room, cmd) {
		by = toId(by);
		arg = Object(arg);  // allow functions to modify this string
		var keyword = ExtractKeyword(arg, ['help', 'cancel', 'delete', 'css', 'requests', 'output']);
		switch(keyword) {

			// Admin commands

			case 'requests':
				if (!this.isRanked('~')) return this.pmReply("You don't have permission to do this.");
				var result = [];
				for (var username in iconRequests) {
					if (iconRequests[username]) result.push(iconRequests[username]);
				}
				if (result.length === 0) return this.pmReply('No icon requests have been made since the last fetch.');
				Tools.uploadToHastebin(result.join('\n\n'), function (success, hastebinLink) {
					if (success) return this.pmReply('Icon requests since the last fetch: ' + hastebinLink);
					else this.pmReply('An error occured while uploading to hastebin.com/');
				}.bind(this));
				return;

				case 'output':
				if (!this.isRanked('~')) return this.pmReply("You don't have permission to do this.");
				console.log('fetching latest userstyle css..');
//				httpRequest.get('https://userstyles.org/styles/119345/userlist-icons.css', function (error, response, body) {
				httpRequest.get('https://dl.dropboxusercontent.com/u/9207945/showdown/userlist-icons.css', function (error, response, body) {
					if (error || response.statusCode !== 200) return this.pmReply('An error occured while fetching the css file.');
					body = body.split('/* userlist icons */');
					if (body.length !== 3) {
						return this.pmReply('Error: The userlist stylish should contain the comment ``/* userlist icons */`` '
						                    + 'exactly twice.');
					}
					var iconStylishPreamble = body[0] + '/* userlist icons */\n';
					var icons = splitCSS(body[1]);
					var iconStylishAddendum = '\n/* userlist icons */' + body[2];
					// remove fulfilled requests, keep unfulfilled ones
					for (var username in icons) {
						if (iconRequests[username] === icons[username]) {
							iconRequests[username] = undefined;
							console.log('fulfilled request (' + username + ').');
						}
					}
					for (var username in iconRequests) {
						if (iconRequests[username])
							console.log('unfulfilled request (' + username + ').');
					}
					// (MAYBE): save to REQUESTS after removing the fulfilled ones
					//
					// code to save requests goes here..
					//
					
					// apply requests
					console.log('applying requests..');
					for (var username in iconRequests) {
						if (!iconRequests[username]) continue;
						if (iconRequests[username] === 'delete')
							icons[username] = undefined
						else icons[username] = iconRequests[username];
					}
					
					// create output
					var result = [];
					for (var username in icons) {
						if (icons[username]) result.push(icons[username]);
					}
					Tools.uploadToHastebin(iconStylishPreamble + result.join('\n\n') + iconStylishAddendum,
						function (success, hastebinLink) {
							if (success) return this.pmReply('Updated usericons css: ' + hastebinLink);
							else return this.pmReply('An error occured while uploading to hastebin.com/');
						}.bind(this)
					);
					return;
				}.bind(this));
				return;


			// user commands

			case 'cancel':
				if (!iconRequests[by]) this.pmReply('There is no icon request to be canceled.')
				else {
					iconRequests[by] = undefined;
					// (MAYBE): save to file REQUESTS, so a bot restart doesn't remove it
					this.pmReply('Your icon request has been canceled.');
					console.log('User ' + by + ' canceled their request.');
				}
				break;

			case 'delete':
				iconRequests[by] = 'delete';
				console.log('User ' + by + ' requested deletion of their icon.');
				break;

			default:
				// .icon
				// usage help
				if (keyword === 'help' || !arg.valueOf()) {
					this.pmReply('Usage: ``.icon [link]``. Sets your userlist-icon to the image ``[link]``. ' +
					'You need to install a stylish to see userlist-icons: https://userstyles.org/styles/119345/userlist-icons');
					break;
				}

				// test for invalid request
				// (MAYBE): in case we get spammed with requests, make it so a user needs to be autoconfirmed to make one.
				//
				// code to test it goes here..
				//
				if (arg.indexOf("vignette") > -1) {
					return this.pmReply("Vignette is untrustworthy for userlist icons, either upload this image to imgur.com " +
					                    "or find a different version.");
				}
				if (arg.indexOf(".png") === -1 && arg.indexOf(".gif") === -1 && arg.indexOf(".jpg") === -1)
					return this.reply('You did not supply a valid image link. Supported formats are: png, gif, jpg.');

				if (keyword === 'css')
					iconRequests[by] = arg  // plain css request
				else {
					// image link request
					sizeOfImage(arg.valueOf(), function (err, dimensions, length) {
						if (err) this.pmReply(err);
						iconRequests[by] = "background: url(" + arg + ") bottom right / "
						                 + Math.floor(dimensions.width * 20 / dimensions.height)
						                 + "px 20px no-repeat; ";  // image height: 20px, width: proportional

						iconRequests[by] = "li[id$='-userlist-user-" + by + "'] {\n    " + iconRequests[by] + "\n}";
						// (MAYBE): save to file REQUESTS, so a bot restart doesn't remove it
						//
						// code to save requests goes here..
						//
						// give info on pending requests
						this.pmReply('Your usericon is awaiting moderation - ``' + getInnerCSS(iconRequests[by]).split('\n').join(' ') + '``');
						this.pmReply('To change your request, redo the command. To cancel your request and leave the icon as it was, do ``.icon cancel``.');

					}.bind(this));
					return;
				}
				iconRequests[by] = "li[id$='-userlist-user-" + by + "'] {\n    " + iconRequests[by] + "\n}";
				// (MAYBE): save to file REQUESTS, so a bot restart doesn't remove it
				//
				// code to save requests goes here..
				//
		}
		
		// give info on pending requests
		if (iconRequests[by]) {
			if (iconRequests[by] === 'delete') this.pmReply('Your usericon is awaiting deletion.')
			else this.pmReply('Your usericon is awaiting moderation - ``' + getInnerCSS(iconRequests[by]).split('\n').join(' ') + '``');
			this.pmReply('To change your request, use the ``.icon`` command. To cancel your request and leave the icon as it was, do ``.icon cancel``.');
		}
	}
};

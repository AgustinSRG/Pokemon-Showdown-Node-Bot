YouTube link recognition feature
====================

If this feature is enabled, when an user posts a Youtube link (`www.youtube.com/watch?v=example` or `youtu.be/example`) the bot tells the title of the video.

In order to enable this feature, first set the default config for all rooms, in `config.js`:
```js
/*
* Youtube
*/

exports.youtube = {
	enableByDefault: true //true or false
};
```

Then, you can use the bot command `youtube [on/off]` or `youtubelinks [on/off]` to enable or disable this feature in a specific room.

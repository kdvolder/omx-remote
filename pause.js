/*global require module */
var mediaDir = require('./config').mediaDir;

var omxplayer = require('./omxplayer');

function pause(req, res) {
	omxplayer.pause(function () {
		res.redirect('/');
	});
}

module.exports = pause;
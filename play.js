/*global require module */
var mediaDir = require('./config').mediaDir;

var omxplayer = require('./omxplayer');

function play(req, res) {
	var fileName = req.query.file;
	
	omxplayer.start(fileName, function() {
		res.redirect('/');
	});
}

module.exports = play;
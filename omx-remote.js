/*global console require __dirname process*/
var express = require('express');
var app = express();

var xml = require('xmlbuilder');
var index = require('./main-view');

var omxplayer = require('./omxplayer');

// app.use(express.static('public'));

// Note: https://github.com/oozcitak/xmlbuilder-js/wiki
// looks decent / easy to use for generating xml documents.

var config = require('./config');
var unlink = require('fs').unlink;
var resolve = require('path').resolve;

app.get('/', index);
app.use('/css', express['static'](__dirname+'/css'));

app.get('/play', function (req, res) {
	var fileName = req.query.file;
	omxplayer.start(fileName, function() {
		res.redirect('/');
	});
});

app.get('/delete', function (req, res) {
	var fileName = req.query.file;
	unlink(
		resolve(config.mediaDir, fileName), 
		function () {
			res.redirect('/');
		}
	);
});

app.get('/pause', function (req, res) {
	omxplayer.pause(function () {
		res.redirect('/');
	});
});

app.get('/stop', function (req, res) {
	omxplayer.stop(function () {
		res.redirect('/');
	});
});

app.get('/forward', function (req, res) {
	omxplayer.forward(function () {
		res.redirect('/');
	});
});

app.get('/back', function (req, res) {
	omxplayer.back(function () {
		res.redirect('/');
	});
});


var server = app.listen(3000, function() {
    console.log('OMXRemote: listening on port %d', server.address().port);
});

process.on( 'SIGINT', exit); 
process.on( 'SIGTERM', exit);
process.on( 'SIGQUIT', exit);
process.on( 'SIGABRT', exit);
process.on( 'SIGHUP', exit);

function exit() {
	omxplayer.stop(function () {
		console.log('OMX Remote: Have nice day ;-)');
		process.exit();
	});
}
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

/**
 * Determine name of corresponding .srt (subtitles) file
 * for a given mediaFile
 */
function srtFile(mediaFile) {
	var extensionStart = mediaFile.lastIndexOf('.');
	if (extensionStart>=0) {
		return mediaFile.substring(0,extensionStart)+'.srt';
	} else {
		return mediaFile + '.srt';
	}
}

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
	var mediaFile = resolve(config.mediaDir, fileName);
	unlink(
		resolve(mediaFile), 
		function () {
			res.redirect('/');
		}
	);
	try {
		unlink(srtFile(mediaFile));
	} catch (e) {
		//ignore
	}
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

app.get('/fforward', function (req, res) {
	omxplayer.bigForward(function () {
		res.redirect('/');
	});
});

app.get('/fback', function (req, res) {
	omxplayer.bigBack(function () {
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
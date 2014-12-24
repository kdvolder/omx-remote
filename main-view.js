/*global console require module */

var xmlbuilder = require('xmlbuilder');
var config = require('./config');
var readdir = require('fs').readdir;
var URI = require('URIjs');

var mediaExtensions = ['.mp4', '.avi', '.mkv'];
var mediaDir = config.mediaDir;

var omxplayer = require('./omxplayer');

function isMedia(file) {
//	console.log("isMedia? "+file);
	for (var i = 0; i < mediaExtensions.length; i++) {
		if (endsWith(file, mediaExtensions[i])) {
			return true;
		}
	}
	return false;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function button(name, displayName) {
	displayName = displayName || name;
	return { a: {
		'@href': name,
		'@class': name+" button",
		'#text' : displayName
	}};
}

function actionLink(fileName, action, text) {
	text = text || fileName;
	return { a: {
		'@href': URI(action).addSearch({file: fileName}).toString(),
		'@class': action+'link',
		'#text' : text
	}};
}

function playLink(fileName) {
	return actionLink(fileName, 'play');
}

function deleteLink(fileName) {
	return actionLink(fileName, 'delete', 'DELETE');
}

function displayCurrentFile(node) {
	var currentFile = omxplayer.isPlaying();
	if (currentFile) {
		node.element({div: {
				'@class': 'playing',
				'#text' : currentFile
			}
		});
		node.element({'#list':  [
			button('pause', 'PAUSE'),
			button('stop', 'STOP'),
			button('back', '<<'),
			button('forward', '>>')
		]});
	}
}

function index(req, res) {
	//console.log('request received');
	//console.log('media dir = '+mediaDir);
	
	var title = "OMX Remote";
	
	var root = xmlbuilder.create('html', {
		version: '1.0',
		encoding: 'UTF-8'
	});

	var head = root.element({
		head: {
			title: title,
			link: {
				'@href':'css/stylesheet.css',
				'@rel': 'stylesheet',
				'@type': 'text/css'
			}
		}
	});
	var body = root.element({
		body: {
			h1: { '#text' : title}
		}
	});
	
	displayCurrentFile(body);
	
	var node = body.element('ul');
	
	readdir(mediaDir, function (err, files) {
		if (err) {
//			console.log(err);
			node.element({li: {'#text' : err.toString()}});
		} else {
			//console.log('files = '+files);
			var list = node.element({div: {
				'@class' : 'list'
			}});
			var mediaFiles = files.filter(isMedia);
//			console.log('mediaFiles = '+mediaFiles);
			mediaFiles.forEach(function(file) {
//				console.log('file = '+file);
				list.element({div: {
					'@class': 'item',
					'#list': [ 
						playLink(file),
						deleteLink(file)
					]
				}});
			});
		}
		console.log(root.toString());
		res.send(root.toString());
	});
	
//	body.element(button('shutdown', 'Shutdown'));
	
}

module.exports = index;
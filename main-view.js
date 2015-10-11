/*global console require module */

var xmlbuilder = require('xmlbuilder');
var config = require('./config');
var readdir = require('fs').readdir;
var URI = require('URIjs');

var mediaExtensions = ['.mp4', '.avi', '.mkv', '.MOV'];
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

var hideExps = [
    "\\.mp4", "\\.mkv", 
    //"1080p", "720p", "REPACK",
    "BluRay", "YIFY", "anoXmous", "x264", "X264",
    "BRRip", "DD5\\.1", "-PSYPHER", "-DIMENSION", "-KILLERS",
    "-dimension",
    "-LOL", "\\[VTV\\]", "-killers", "-2hd",
    "hdtv", "HDTV",
    "\\.", "\\+" ," "
];

var toReplace = ((function () {
    var pat = "";
    for (var i = 0; i < hideExps.length; i++) {
		var piece = hideExps[i];
		if (i>0) {
			pat += "|";
		}
		pat += piece;
    }
    pat = "(" + pat + ")+"; 
    console.log("hideExp="+pat);
    return new RegExp("("+pat+")+" ,"g");
})());

function beatify(fileName) {
	return fileName.replace(toReplace, ' ');
}

function actionLink(fileName, action, text) {
	return { a: {
		'@href': URI(action).addSearch({file: fileName}).toString(),
		'@class': action+'link',
		'#text' : text
	}};
}

function playLink(fileName, text) {
	return actionLink(fileName, 'play', text);
}

function deleteLink(fileName) {
	return actionLink(fileName, 'delete', 'DELETE');
}

function displayCurrentFile(node) {
	var currentFile = omxplayer.isPlaying();
	if (currentFile) {
		node.element({div: {
				'@class': 'playing',
				'#text' : beatify(currentFile)
			}
		});
		node.element({div: {
			'@class': 'buttons',
			'#list':  [
				button('pause', 'PAUSE'),
				button('stop', 'STOP'),
			    button('fback', '<<'),
				button('back', '<'),
			    button('forward', '>'),
				button('fforward', '>>'),
				button('next_audio', '>a')
			]

		}});
	}
}

function createSearchBox(parent, searchParam) {
	parent.element({form: {
		'@class' : 'search',
		input: { 
			'@type':"search",  
			'@name': 'search',
			'@id' : 'search',
			'@size': 30,
			'@value': searchParam || ''
		}
	}});
}

function searchMatch(text, searchStr) {
	return !searchStr || text.toLowerCase().indexOf(searchStr.toLowerCase())>=0;
}

function index(req, res) {
	req.cookies = req.cookies || {};
	console.log('main-view-request');
	var searchParam = req.query.search;
	console.log('searchParam=', searchParam);
	if (typeof(searchParam)==='string') {
		if (searchParam==='p0rky') {
			res.cookie('mediaDir', '/media/terra/.p/to-watch', {maxAge: 3600*1000});
			res.cookie('search', '');
			return res.redirect('/');
		} else if (searchParam==='d0ne') {
			res.clearCookie('mediaDir');
		} else {
			res.cookie('search', searchParam);
		}
	} else {
		searchParam = req.cookies && req.cookies.search;
		console.log('searchParam(from cookie)=', searchParam);
	}
	
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

	createSearchBox(body, searchParam);
	
	displayCurrentFile(body);
	
	var node = body;
	
	readdir(req.cookies.mediaDir || mediaDir, function (err, files) {
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
				var label = beatify(file);
				if (searchMatch(label, searchParam)) {
					list.element({div: {
						'@class': 'item',
						'#list': [ 
							playLink(file, label),
							deleteLink(file)
						]
					}});
				}
			});
		}
//		console.log(root.toString());
		res.send(root.toString());
	});
	
//	body.element(button('shutdown', 'Shutdown'));
	
}

module.exports = index;
/*global console require exports Buffer*/

//
// This module is responsible for keeping track of a single omxplayer process.
// It can be asked to start playing a file or stop it (kill the process).

var child_process = require('child_process');
var config = require('./config');

var killSignal = config.killSignal || 'SIGTERM';
var playerCommand = config.playerCommand || 'omxplayer';
var playerOptions = config.playerOptions || [];

var process = null;
var playing = null;

var exitListeners = [];

function start(file, mediaDir, callback) {
	stop(function () {
		console.log(playerCommand + " " +playerOptions +file);
		process = child_process.spawn(playerCommand, playerOptions.concat([file]), {
			cwd: mediaDir,
			detached: true // new process group so can kill with all its children.
		});
		playing = file;
		process.on('exit', exited(process));
		process.on('error', function (evt) {
			console.log('error: '+evt);
		});
		process.stdout.on('data', function (data) {
			console.log('stdout: '+data);
		});
		process.stderr.on('data', function (data) {
			console.log('stderr: '+data);
		});
		playing = file;
		callback();
	});
}

function exited(exitedProcess) {
	return function (evt) {
		handleExit(exitedProcess);
	};
}

function handleExit(exitedProcess) {
	console.log('exited: '+exitedProcess);
	if (process===exitedProcess) {
		//Careful not to get confused by exit events unrelated to current process. 
		process = null; 
		playing = null;
		for (var i = 0; i < exitListeners.length; i++) {
			exitListeners[i]();
		}
		exitListeners = [];
	}
}

function stop(callback) {
	console.log('Request to stop: '+process);
	if (process!==null) {
//		console.log('Sending signal: '+killSignal + ' to: '+process.pid);
		var killCmd = 'bash -c "kill -s '+killSignal+' -'+process.pid+'"';
//		console.log('killCmd = '+killCmd);
		child_process.exec(killCmd, function (err, stdout, stderr) {
//			console.log('err: '+err);
//			console.log("stdout: "+stdout);
//			console.log("stderr: "+stdout);
		});
		exitListeners.push(callback);
//		console.log('exitListeners = '+exitListeners);
	} else {
//		console.log('Request ignored');
		callback();
	}
}

function isPlaying() {
	return playing;
}

function sendCodes(codes) {
	return function (callback) {
		if (isPlaying()) {	
			process.stdin.write(codes);
		}
		callback();
	};
}

exports.start =  start;
exports.stop = stop;
exports.pause = sendCodes(' ');
exports.forward = sendCodes(new Buffer([0x5b, 0x43]));
exports.back = sendCodes(new Buffer([0x5b, 0x44]));
exports.bigBack = sendCodes(new Buffer([0x5b, 0x42]));
exports.bigForward = sendCodes(new Buffer([0x5b, 0x41]));
exports.sendCodes = function (codes, callback) {
	return sendCodes(codes)(callback);
};

exports.isPlaying = isPlaying;

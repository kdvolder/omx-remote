omx-remote
==========

omx-remote is a simple 'remote controller' web app for omxplayer on Raspberry Pi. It is implemented in nodejs.

omx-remote lets you use a iPad, iPhone or any other device that has a basic web-browser to serve as a remote control
for your Raspberry Pi playing video files from some directory to your TV.

The remote controll app allows you to:

 - see list a files in a specific directory in the browser
 - click a file to start playing it on your TV (assuming yout TV is connected to your RPi)
 - stop playing a file
 - pause/resume playing a file
 - skip forward/backward in the file.

Prerequisites
=============

 - nodejs (verified to work with node v0.10.26)
   See this [nice blog article](http://raspberryalphaomega.org.uk/2014/06/11/installing-and-using-node-js-on-raspberry-pi/) for some instructions on how to setup nodejs on 
   Raspberry Pi (note: nodejs is also installable with "apt-get" but this will give you an older version).

Setup
=====

Download the (zip)[https://github.com/kdvolder/omx-remote/archive/master.zip] and unzip it somewhere. Or clone this
repo. 

Now edit the file `config.js` to 'configure' it.

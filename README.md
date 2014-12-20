omx-remote
==========

omx-remote is a simple 'remote controller' web app for omxplayer on Raspberry Pi. It is implemented in nodejs.

omx-remote lets you use a iPad, iPhone or any other device that has a basic web-browser to serve as a remote control
for your Raspberry Pi playing video files from some `media directory` on your RPi to your TV.

The remote controll app allows you to use any web browser to:

 - see the list of video from the media directory (in the web browser)
 - click a file to start playing it on your TV (assuming your TV is connected to your RPi)
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

## Define the Media Dir

omxremote assumes you have the video files you want to watch in a specific directory. It is up to
you how you set this up and how you get files into that directory. To be able to play the files
with `omx-remote` you have to tell it where this directory is.

Edit the file `config.js` and set `mediaDir` to wherever it is that you keep the video files you want to watch.

## Install dependencies

From the unzip directory (or clone location) enter:

      npm install
   
This should install some dependencies in a directory called 'node_modules'.

Starting the Server
===================

From the unzip directory (or clone) enter:

     npm start

After a little while you should see a message like this:

     OMXRemote: listening on port 3000
   
This means the server has successfully started and is waiting for requests. It is now accessible on

     http://<your-rpi-ip-address>:3000/
  
You can find out the precise ip addres by using the `ifconfig` command.


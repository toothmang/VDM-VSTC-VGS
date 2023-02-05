# VDM;VSTC;VGS
> "Cover me!"
> "I'll cover you."
> "Shazbot!"

Our roots are where we find our tribes. And for us, Tribes is where we found our roots.

For Global Game Jam '23, we used [https://threejs.org/](three.js) and [https://geckos.io/](geckos.io) to make a real-time multiplayer shooter (big surprise for Team 2THS1M 😉). 

## Setup
After cloning the repo to a working folder:
run `./setup.sh` to create symlinks to common folder in both client and server.

## Local deploy
in ./server, run `npm install` and `npm run local` in one terminal to start the node server on port 4121

in ./client, run `python3 -m http.server` in another terminal to start a web server, then go to [http://localhost:8000/tribes.html](http://localhost:8000/tribes.html) to test it out.

## Server deploy
Hosting on a server requires running `npm run droplet` and a reverse-proxy forward as is typical with Node instances and nginx. Opening ports is also necessary for geckos.io's use of node-datachannel (beats being stuck with TCP, hello UDP/WebRTC!)

Server hosting also requires hosting the client folder. If you set up *another* reverse-proxy forward you could use the same python3 command as with local deploy, or you can copy the client folder into a folder served by nginx (and also copy the common folder into that destination). 

## Controls
Good old WSAD for movement, mouse for aiming, left-click for rapid fire, shift for SHIFT, space for jump/jet.

Controller support is added with the Gamepad API but it is rough. Left trigger for jump/jet, right trigger for rapid fire, and then the typical left-stick/right-stick for move/aim. 
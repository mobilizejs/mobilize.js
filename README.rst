This is an experimental framework to do website mobilization on the client side.


User experience
================

* Touch optimized user interface

* Portrait and landscape viewport detection 

* Image automatic scale

* Back navigation

* Quick menu

Optimizations

* Cruft CSS and Javascript is removed from HTML document before these are being loaded

* Images which are needed on mobile layout are loaded

Installation
============

Add the following snippet to your HTML code::




Unit testing
============
For running tests from command line we'll use NodeJS.

Installing NodeJS
-----------------
See: https://github.com/ry/node/wiki/Installation

Run:
	mkdir ~/local
	./configure --prefix=$HOME/local/node
	make
	make install
	export PATH=$HOME/local/node/bin:$PATH

** Installing NPM(NodeJS Package Manager) **
See: http://npmjs.org/

Run:
	curl http://npmjs.org/install.sh | sudo sh

** Install jQuery for NodeJS **
Run:
	npm install jquery

Running tests
-------------
Go to tests folder and execute node <testname>.js
TODO: Script for running all tests.

Testing Nokia devices:
======================
* http://www.forum.nokia.com/Devices/Remote_device_access/

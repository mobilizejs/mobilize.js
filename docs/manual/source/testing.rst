================== 
 Testing
==================

.. contents :: :local:

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

Go to tests folder and execute:

	node <testname>.js

TODO: Script for running all tests.

Content delivery testing
==========================

* Run ``release.py trunk``

* Start testserver.py, make sure it runs port 8080

* Open ``cloud-wordpress-front-page.html``

Device testing
=================

Apple
-----------

Use iOS simulator.

Android
------------

Use Android emulator.

Nokia devices:
-----------------

Use Nokia remote device acces 

* http://www.forum.nokia.com/Devices/Remote_device_access/

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

Add the following snippet to your HTML code

::


Walkthrough
===========

mobilize.js must not have any hard dependencies.
It leaves its standalone mobilize = {} namespace.

mobilize.js init() and bootstrap() must complete without 
any JS libraries loaded. <head> is cleaned with pure DOM 
manipulation, as <body> is hidden.

If mobile is not detected or forced nothing happens.

If mobile is detected the following happens

        * Use internal async loader (rip one from jQuery)
        
        * Async loading os jQuery.js, using internal AJAX GET handler
        
        * Async loading of mobile template using jQuery
        
        * Async loading of jQueryMobile.js, using jQuery

* prepareTransform() waits
        
* When mobile tempalte, is loaded it is injected to DOM tree

* When jquery.js is loaded, it is eval()'ed

* When both jquery.js and mobile template is loading,
  prepareTransform() calls transform()
  
* transform() calls prepareFinish()

* prepareFinish() waits until jquery.mobile.js is loaded and eval()'ed

* finish() is called, which calls $.mobile.initalizePage()

* Fun ensures

Hosting
=========

If you indent to host mobilize.js yourself

* You must host jquery.js on your own domain

* You must set mobilize.init() jQueryURL option 

or

* You must set allow origin HTTP header on your server

This is due to browser security limitations.

More info

* https://developer.mozilla.org/En/HTTP_access_control

URL paramters
=============
By default mobilize.js uses following URL parameters for configuration.

mobilize:

	If true or 1, forces mobilization of the page.
	If false or 0, forces normal page even if mobile browser.

Generating documentation
========================

Using jsdoc to generate API documentation.

Get jsdoc:
    wget http://jsdoc-toolkit.googlecode.com/files/jsdoc_toolkit-2.4.0.zip
    unzip jsdoc_toolkit-2.4.0.zip
    mv jsdoc_toolkit-2.4.0/jsdoc-toolkit
    rm jsdoc_toolkit-2.4.0

Run:
    sh getdocs.sh

TODO: jsdoc looks lame. Use Sphinx. https://github.com/stdbrouw/jsdoc-for-sphinx
TODO: create regexp to avoid jquery

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

Testing Nokia devices:
======================
* http://www.forum.nokia.com/Devices/Remote_device_access/

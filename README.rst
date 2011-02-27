.. contents ::

Introduction
============

mobilize.js is an experimental HTML5 framework to do website mobilization on the client side.
It detects mobile browser and formats the web page for touch optimized displays
using jQuery Mobile UI framework.

Features
================

User experience
----------------

* Touch optimized user interface based on jQuery Mobile

* Portrait and landscape viewport detection 

* Image automatic scale

* Back navigation

Optimizations
--------------

* Cruft CSS and Javascript is removed from HTML document before these are being loaded

* Images which are needed on mobile layout are loaded

Easy deployment
-----------------

* One <script> tag integration

* mobilize.js cloud hosts optimized JS and CSS file versions, no need to put these
  on your sever
  
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

Run::

    sh getdocs.sh

It will download jsdoc for you and compile documentation to ``docs/`` folder.

TODO: jsdoc looks lame. Use Sphinx. https://github.com/stdbrouw/jsdoc-for-sphinx

More info

* http://www.seangw.com/examples/test.js

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

CDN testing
===============

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

Delivery strategy
==========================

The following URI layout is used to host mobilize.js files

The default base is:

        http://cdn.mobilizejs.com/releases

mobilize.wordpress for mobilize.js 0.1 would be::

        http://cdn.mobilizejs.com/releases/0.1/js/mobilize.wordpress.bundle.debug.js
        
This would load files::

        http://cdn.mobilizejs.com/releases/0.1/js/jquery+jquerymobile.bundle.debug.js
        http://cdn.mobilizejs.com/releases/0.1/css/jquerymobile+wordpress.debug.css
        http://cdn.mobilizejs.com/releases/0.1/templates/wordpress.min.html
        
Alternatively::

        http://cdn.mobilizejs.com/releases/0.1/js/mobilize.wordpress.bundle.min.js

Would load files::        

        http://cdn.mobilizejs.com/releases/0.1/js/jquery+jquerymobile.bundle.min.js
        http://cdn.mobilizejs.com/releases/0.1/css/jquerymobile+wordpress.min.css
        http://cdn.mobilizejs.com/releases/0.1/templates/wordpress.min.html

Manual loading (for development)
----------------------------------

You can also access the raw files by setting ``mobilize.cdnOptions.bundle = false``.
In this you need to load scripts and CSS separately::

        <script class="mobilize-js-source" type="text/javascript" src="http://localhost:8080/js/mobilize.js"></script>
        <script type="text/javascript" src="http://localhost:8080/js/mobilize.wordpress.js"></script>  
        <script type="text/javascript">
            mobilize.init({});
            mobilize.bootstrap();
        </script>

Hosting mobilize.js
--------------------

It is easiest if you follow the following directory layout::

        js/mobilize.js
        js/...
        css/jquery.mobile.css
        css/..
        images/
        templates/    

mobilize.js should be able to load itself arbitary directory.
It is not recommended tomix mobilize.js files with other JS or static media files in
the same folder.

Locally cached files
------------------------

If mobilize.cdnOptions.cacheVersion is set to true, the loader tries to load cached versions
from local storage. If local storage is empty or the cache version mismatchs, the loader
proceed as decribed above.

Integrating Wordpress
========================

For now, add the sample code::




        
Issues
======

mobilize.wordpress.js has problems with $ jQuery shortcut and event bindings.
jquery.mobile.js triggered event handlers are not called if you use $ notation
to bind handlers. 

Tried to make sure that previous jQuery is deleted: both $ and jQuery.
Did not help.

The proper workaround for now is to use jQuery() name to bind events. 

        // XXX: Something is wrong with $ shortcut in this point
        // jQuery() event bindings work, but not when using $


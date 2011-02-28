====================
 Usage
====================

.. contents :: :local:

Introduction
=============

It just works: after properly set up, there shouldn't be nothing for "using" mobilize.js.

Mobile browser detection
==========================

It does it by magic.

URL paramters
=============
By default mobilize.js uses following URL parameters for configuration.

mobilize:

	If true or 1, forces mobilization of the page.
	If false or 0, forces normal page even if mobile browser.

Cookie
======

After ``mobilize.js`` is loaded for the first time, a cookie is created.
This cookie is present in all requests going to the server so that 
the server can adapt for the mobile user agent in the future.



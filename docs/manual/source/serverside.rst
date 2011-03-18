===========================
 Server-side integration
==========================

.. contents :: :local:

Introduction
=============

This chapter shows how to

* reach to mobile browsers on the server-side

* tell what kind of tricks you can do or what you should do optimizing for mobile

Optimizations
===============

You can modify HTML output on the server-side to perform optimizations for mobile browsers (faster page loads)

* Do not output unneeded web stylesheets 

* Do not output unneeded web Javascript

* Do not output irrelevant HTML code for mobile, like Wordpress admin bar,
  because it wouldn't be visible in any case

Refresh on arrival
======================

If ``mobilize.options.reloadOnMobile`` options is turned on, the first page load 
from your web your site by a mobile browser will lead to a page refresh before the page is rendered.

* Mobile browser is detected by Javascript

* Mobile browser aborts loading the web page and asks for a mobile page instead

Cookie
======

After ``mobilize.js`` is loaded for the first time, a cookie is created.
This cookie is present in all requests going to the server so that 
the server can adapt for the mobile user agent in the future.

Cookie behavior is following

* mobilize-mobile cookie missing - mobilize.js failed to run or is not run yet

* mobilize-mobile=1 - mobile browser detected. 
  Mobile browser must be jQuery Mobile compatible (grade A). It is detected 
  based on user agent regexp and Javascript features. 

* mobilize-mobile=0 - mobile browser detected, but mobile user asks to serve web site instead (must be
  set by go to full site link handler).
  
Server-side optimizations and caching
======================================

If you are doing server-side optimizations, make sure that you are not caching the resulting pages.

Both web and mobile pages have the same URL. If mobile page HTML gets loaded first, it will stick 
in the cache. Next time web user agent loads the page, it gets mobile page from cache, instead of 
web content it wishes.



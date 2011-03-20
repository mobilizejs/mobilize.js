=============================
 Introduction
=============================

.. contents :: :local:

Preface
--------------

This is an all audience introduction is for mobilize.js.

mobilize.js is a modern HTML5 solution to mobilize websites.
mobilize.js can be used with any web site, as it is complete
front end solution based on Javascript. In the basic use
you only need to include one <script> tag on your website
to mobilize it.

Architecture
-------------

mobilize.js builds on the top of popular jQuery and jQuery Mobile Javascript frameworks.
In the diagram below the relationship between mobilize.js and the frameworks is explained.

.. image:: images/mobilizejs/Slide1.png

Benefits
--------------------------------------------

The revolutionary idea behind mobilize.js is that
it pushes most of difficult rendering choices to the mobile client itself.
After all, this is how HTML was designed to be work. Modern phones
are smart enough to decide how the content to should be displayed the user.

This makes mobilize.js simple and easy to integrate to **any** backend.
It is the most developer friendly mobilization solution out there.

You do not need to install any difficult components or libraries on
server side. mobilize.js is written in Javascript and jQuery - both
which are ubiquoes technologies in HTML5 era and familiar to every 
front end developer.

How it works
--------------

mobilize.js <script> tags are inserted on your HTML source code
like with any other Javascript library. 

When the web page loads, mobilize.js checks whether the browser
is a mobile browser or a normal desktop browser. For mobile
browsers, a special transformation step takes place.

.. image:: images/mobilizejs/Slide2.png

* All unneeded web resources (text, images, CSS, Javascript) is left unloaded

* Content is reformated for mobile display

* jQuery Mobile theme is applied on the page

Easy to integrate
--------------------

.. image:: images/mobilizejs/Slide3.png

Because mobilize.js does not have difficult server-side components, 
it is very easy to integrate to different systems. Currently
out of the box supported systems are :doc:`Wordpress blogging platform </integrations/wordpress>`,
:doc:`Sphinx documentation system </integrations/sphinx>` and the list is growing fast.

For example, Wordpress integration plug-in is effectively only ~150 lines of code.
Code examples are available for PHP, Apache and other popular platforms.

Cloud hosted
--------------

mobilize.js comes withs own content delivery network (CDN) solution.
You do not need trouble your server with complex files. CDN automatically
optimizes all Javascript and CSS files for the fastest possible download
rates.

With CDN hosting and ever evolving mobile landscape, your data
for the mobile devices is always up-to-date.

It is also possible to host files yourself for intranet solutions.

Open source
------------

mobilize.js is an open source solution. It is hosted on `Github <https://github.com/mobilizejs/mobilize.js>`
which is a popular social coding source code repository. 

Open source nature guarantees
long term feasibility and high quality of the project. Not only that
you can customize mobilize.js for your own needs, but there is 
community process in place for `support <http://groups.google.com/group/mobilizejs-users>`, 
issue tracking <https://github.com/miohtama/mobilize.js/issues>`_ and
development `<http://groups.google.com/group/mobilizejs-users>`_. 

Device support
--------------- 

mobilize.js supports :doc:`jQuery Mobile grade A devices </support>`.
The supports covers most of developed country mobile internet devices. 

It is possible to further tune mobilize.js to increase
the device support for low end devices.
 
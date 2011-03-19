=============================
 Wordpress integration
=============================

.. contents :: :local:

Introduction
============

Mobilize.js is available for Wordpress in two ways 

* *Mobilize.js for Wordpress* plug-in, available from Wordpress Install Plug-ins*. This
  option is for blog authors that want to mobilize their blogs easily.
  
* Direct integration to the theme code with <script> tag. This is for theme authors
  and site managers who want to customize how their mobile site looks and feels.

Installing Mobilize.js for Wordpress plug-in
==============================================

Mobilize for Wordpress plug-in is aimed for people who want
to make mobile version for their blog easily.

Mobilize.js for Wordpress supports

* Blog roll (front page)

* Posts

* Pages

.. note ::

    This plug-in is not needed if you are using a Wordpress theme provoding
    required support for mobilize.js as described below. 

Requirements
------------

* You need Wordpress 3.1 minimum

* Install plug-in through Wordpress add plug-ins

Mobilize.js for Wordpress plug-in will insert mobilize.js script on your Wordpress
blog. It will also switch to default theme (twentyten) so that custom themes
don't break 

For further tuning

* Set Options -> Reading -> Blog pages show at most to 4 (default 10), so that the
  pages will load faster for mobile.

Integrating mobilize.js with your theme
=========================================

This chapter explains what kind of Wordpress web mark-up sematics (CSS class names).
you need to have in order to make mobilize.js work with it out of the box.

This is the same as Wordpress 3.1 default theme (twentyten) class names.

* Follow Wordpress 3.1 class names with your theme

* Add <script> to your theme <body>

* Add :doc:`page specific overrides </tutorial>`
  if you want to play around with category or tag navigation 

.. note ::
    
    Roadmap exists for a Wordpress plug-in solution which is compatible with all web themes.

Enabling mobilize.js in your theme
===================================

To enable mobilize.js, add following <script> tag to the page right after <body>.

.. code-block:: html

    <body>
        <script class="mobilize-js-source" src="http://cdn.mobilizejs.com/releases/trunk/js/mobilize.wordpress.min.js"></script>

If you further want to fine-tune mobilize.js settings,
see :doc:`tutorial </tutorial>` for more advanced script
including options.

Semantics
=====================

To correctly convert the front page it must follow the default theme structure
(Wordpress 3.1 twentyten theme). 
 
Posts
-----
.. code-block:: html

    <div class="posts">
      <div class="post">
        <div class="entry-title"><a src='url-to-post'>title</a></div>
        <div class="entry-content">...</div>
        <div class="entry-date">...</div>
      </div>
    </div>

Pages
-----

.. code-block:: html
    
    <div class="menu">
      <ul>
        <li><a>Page</a></li>
      </ul>
    </div>

Posts
----------

For content there should be element with class="entry-content".
For the post content there should be element with id="comments".

The content inside those tags are used as-is.

.. code-block:: html

    <div class="entry-content">

Pages
-----------

.. code-block:: html

    <div id="comments>

Advanced overrides
--------------------

Check ``mobilize.wordpress.js`` how Wordpress page elements
are transformed into jQuery Mobile template.

You can override mobilize.wordpress Javascript functions one by one if needed.
In this case, you need to disable the auto-run mode of mobilize.js.

XXX: Add example.

Testing
=========

You can load the Wordpress template used by plug-in without actually running through it jQuery for testing purposes.
This allows you to see HTML/DOM elements before they are run through any kind transformations.

* Use desktop browser

* Use HTTP GET ``mobilize-test-wordpress` query parameter to load mobile template base::
 
    http://localhost?mobilize-test-wordpress=true
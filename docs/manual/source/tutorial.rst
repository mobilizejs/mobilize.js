====================================
 Writing mobilization for your site
====================================

.. contents :local:

Introduction
------------

In this tutorial we'll explain how you can use mobilize.js to create a mobile version
out of your existing web site or HTML theme.

The target audience of this tutorial are

* Website authors who want to mobilize their web site

* Theme authors who want to support mobile version for their theme

* Mobile extension authors who want to use mobilize.js as a mobilization backend


Prerequirements
-------------------

In order to understand this tutorial you should understand

* `Javascript <http://www.w3cschool.org>`_

* `jQuery DOM manipulation <http://docs.jquery.org>`_

* `jQuery Mobile mark-up basics <http://jquerymobile.com/test/>`_

If you manage to read through :doc:`walkthrough how mobilize.js works </development>`
and you are not *totally* lost you should be ok.

If you struggle community supports is available for you

* http://docs.for.ou 

Extenders
-----------------------

`mobilize` Javascript object is a singleton Javascript object.
It will detect a mobile browser, perform mobile site transformation 
using jQuery and output the site using jQuery Mobile UI elements.

.. note ::

    There is no hard dependency to jQuery Mobile. You
    could as well use Sencha Touch, custom templates,
    etc. for the output.
    
`mobilize.js` itself does nothing. It needs to be tailored
for each site or content management system HTML output.
That's saying which elements on the web pages go to mobile pages
also.

This is achieved by using ``extender``. An extender overrides
mobilize.js abstract functions with its own system specific
versions which tell what elements go to where and such.

The name ``extender`` comes from Javascript *extends* pattern
where target object functions are overridden from one or several
source objects (as there is no real Javascript class inheritance).

Simple init
-------------

Here is an example how to perform a simpe custom mobilize.js initialization

.. code-block:: html


    <body>
        <script type="text/javascript" src="http://cdn.mobilizejs.com/releases/0.1/js/mobilize.core.debug.js"></script>
        
        <!-- Your custom extender goes here -->
        <script type="text/javascript" src="http://localhost/mobilize.mysite.js"></script>

.. note ::

    mobilize.js is designed to be executed as <body> script, right after <body> has been opened.

Then ``mobilize.mysite.js`` would contain::
    
    mobilize.extends(mobilize, {
    
        initPlugins : function() {             
    
           mobilize.extend(mobilize.cdnOptions, {

               // Identifier tag for this extender 
               // This is used for error reporting, etc.
               bundleName : "mobilize.yoursite",
               // CSS files to load *after* mobilization 
               cssBundles : ["./mobilize.yoursite.css"],
               // CSS files to load *after* mobilization
               javascriptBundles : ["./mobilize.yoursite.css"],
               
               // HTML barebone tmeplate for the mobile site 
               template : "templates/wordpress.html"
           });
           
        },    

        constructBody : function() {
            // Perform transformation here
        }

    });

Alternatively if you are developing mobilize.js itself and you want to use the trunk
version of the Javascript files you can bootstrap the framework locally. See *tests* folder
for more examples.

In this case, you manually link Javascript files and CSS files
as bundles and mobilize.js will load each file individually.
This way line number debug info stays intact.

The order of <scripts> tags and more detailed arguments are shown in the example below.

.. code-block:: html

    <body>

        <script type="text/javascript">
         // Don't start executing mobilize whilst loaading JS file, but wait
         // for our manual (development commands)
         window.mobilizeAutoload = false;
        </script>
  
        <script class="mobilize-js-source" 
                type="text/javascript" 
                src="http://localhost:8080/js/mobilize.js"
                >
        </script>

        <script type="text/javascript" 
                src="http://localhost:8080/js/mobilize.wordpress.js"
                >
        </script>

        <script type="text/javascript">        

             // Setup mobilize.js to load files from local development server
             function setupMobilizeForWordpressDevelopment(){
        
                 mobilize.init({
                     // Make the page load as mobile always
                     forceMobilize: undefined // true: always mobile  
                 }, {
                     // Additional CDN options here
                     cloud: false, // Disable automatic JS + CSS resolving
                     // Don't do cloud error reporting
                     // (it would useful for production deployment only)
                     errorReportingURL: false,
                     
                     baseURL: "http://localhost:8080", // Test server
                     // Load JS files locally
                     javascriptBundles: ["js/jquery.js", 
                                         "js/mobilize.onjq.js", 
                                         "js/jquery.mobile.js"],
                     
                     // Load CSS files locally
                     cssBundles: ["css/jquery.mobile.css", 
                                 "css/wordpress.css"],
                     
                     template: "../templates/wordpress.html"
                 });
                 
                 // Since we are not in auto-run mode,
                 // we start doing the stuff after we have set-up
                 // our options for development correctly
                 mobilize.bootstrap();
                 
             }
        
             setupMobilizeForWordpressDevelopment();
      
        
        </script>
        
        ...
        
See ``mobilizejs.php`` from ``mobilizejs-for-wordpress`` for further examples.      
              
Bootstrapping custom mobilize.js 
==================================

mobilize.js must be explicitly loaded and started.
Unlike jQuery Mobile, it does not automatically do anything 
if it just included on the page.

The common loading pattern is this

* mobilize.js is loaded. If you use CDN version this is bundled with .js files like mobilize.wordpress.js and
  the bundle is called mobilize.wordpress.min.js
  
* mobilize.js extender, e.g. mobilize.wordpress.js, is loaded and it overrides mobilize.js abstract functions
  with CMS specific versions
  
* mobilize.js can be further extended with a site specific extenders: you can cover UI patterns for a certain
  site by overriding ``constructBody()``, etc.
  
* ``mobilize.init()`` is called with ``options`` and ``cdnOptions`` arguments which allow you 
  to set your custom messages, Javascript file locations, etc.
  
* ``mobilize.bootstrap()`` is called 

More info

* `mobilize.options <http://cdn.mobilizejs.com/docs/apidocs/symbols/mobilize.options.html>`_

Setting file locations
==================================

As you are developing your own solution, you need to host a Javascript file on a server.

.. note ::

    It is recommended to prefix your mobile site JS and CSS files with ``mobilize.`` pattern.
    This is currently used by some internal code when cleaning web page styles and scripts.

There are three kind of relativity rules with mobilize.js internal loading

* Relative to the current page

* Relative to the bundle location (<script> tag source>)

* Absolute http:// referring

More info

* `mobilize.cdnOptions <http://cdn.mobilizejs.com/docs/apidocs/symbols/mobilize.options.html>`_

Bundle and version information
===================================

TODO: XXX

Cookie handling and the server side optimizations
---------------------------------------------------

mobilize.js can communicate with the server through

* setting cookie values

* page reloads when mobile browser is available

Checking cookie presence and value
====================================
      
If ``mobilize.options.reloadOnMobile`` is set to true

* When mobile browser is detected a cookie is set: ``mobilize-mobile=1``

* Page is automatically reloaded if mobilize-mobile cookie has not been set before

This allows server-side HTML output to perform optimizations for mobile browsers

* Do not output extra stylesheets 

* Do not output extra Javascript

* Do not output irrelevant HTML code for mobile, like Wordpress admin bar,
  because it wouldn't be visible in any case
  
Below is a PHP example to check the presence of the cookie

.. code-block:: php

    /**
     * Check if mobilize.js mobile cookie has been set to mobile mode.
     * 
     * @return true if the client wants to render the page in mobile optimized way 
     */
    function is_mobile() {
        
        // Javascript cookie has been set and it is set to mobile mode
        if(array_key_exists('mobilize-mobile', $_COOKIE)) {
            return $_COOKIE['mobilize-mobile'] == '1';
        }
        
        return false;
    }

Suppressing <body> rendering
===============================

By default, browsers try to render the page very greedily.
Unless you do the mobile transform on the server-side 
there ought to be elements which flicker on the mobile screen
before the web page has been completely transformed to the mobile page.

mobilize.js can optimize this by supressing body rendering 
using CSS directly on the server-side when mobile browser is detected.

Example::

    /**
     * Add our rendering supressing stylesheet to prevent
     * the page flashing before jQuery mobile styles are loaded
     */
    function mobilizejs_head() {
        if(is_mobile()) {
            ?>      
              <style type="text/css">
                  body { display: none; }
              </style>      
            <?
        }
    }
 
.. note ::

    Support for placeholder animation is on its way, so you do not 
    need to show completely white page. 


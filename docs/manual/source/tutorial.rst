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

Then ``mobilize.mysite.js`` would contain:
    
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

The order of files is shown below.

.. code-block:: html

        <script type="application/javascript">
              window.mobilizeAutoload = false;
        </script>
        <script class="mobilize-js-source" 
                type="text/javascript" 
            src="http://localhost:8080/js/mobilize.js"></script>

        <script type="text/javascript" src="http://localhost:8080/js/mobilize.sphinx.js"></script>
        
        <script type="text/javascript">
            mobilize.init(
                {
                    // Additional options here  
                },
                {                     
                    // Additional CDN options here
                    cloud : false, // Disable automatic JS + CSS resolving
                    
                    baseURL : "http://localhost:8080", // Test server
                    
                    // Load JS files locally
                    javascriptBundles : [ 
                       "js/jquery.js",
                       "js/mobilize.onjq.js",
                       "js/jquery.mobile.js"
                     ],
                    
                     // Load CSS files locally
                     cssBundles : [
                       "css/jquery.mobile.css",
                       "css/sphinx.css"                       
                     ],
                     
                     template : "../templates/sphinx.html"
                });
            mobilize.bootstrap();
        </script>
    
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


Cookie handling and the server side
------------------------------------
      

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

Server-side optimizations
----------------------------

mobilize.js can run with and without servers-support.
Optimally you could procude 
HTML so that it finely satisfies both web and mobile browsers.
However, in real-life compromises may need to be made.

Server-side optimizations are changes to HTML files produced by the server.
You may remove unnecessary CSS files or HTML mark-up to make your 
pages have less cruft.

.. note ::

    Mobile resources do not tax desktop browsers. mobilize.js
    loads mobile specific JS, CSS and image files only after
    the mobile browser has been detected.

In this tutorial we do not yet focus on any server-side 
changes.

Clean Javascript install
=========================

Pros

* No server-side code needs to be maintained

* Cache friendly: one URL, one HTML payload

* Easy to integrate with **any** web system

Cons

* May load unncessary CSS, JS and images, slowing loads

* May load unnecessary HTML payload just to later remove it with Javascript

Server-side optimizations
=============================

Pros

* HTML content can be made load faster

Cons

* Need to write server specific and system specific plug-in

* Need to tune caching

See :doc:`server-side tips and tricks </serverside>`
for more info.

Simple mobilize.js integration
--------------------------------

mobilize.js usuall contains the following parts

* <script> tag to load mobilize.js or mobilize.js bundle to some specific system (e.g. mobilize.wordpress.css)

* <script> tag which tells what site specific resources (your own custom CSS to load)


Here is an example how to perform a simpe custom mobilize.js initialization,
in production mode.

.. code-block:: html

    <head>
    
        <!-- Your custom extender goes here -->
        <script type="text/javascript">
            function mobilizeCustomInit() {
                // Add your own Javascript layer to load list
                // in mobile mode. 
                // push() is array append function in JS.
                // NOTE: Relative paths may have not luck here.
                mobilize.cdnOptions.javascriptBundles.push("http://yourserver/mobilize.mysite.js")
            }
        </script>
        
        <script type="text/javascript" src="http://cdn.mobilizejs.com/releases/0.1/js/mobilize.core.min.js"></script>
        
    
.. note ::

    mobilize.js is designed to be executed early in <head> or right after <body> tag.

Then ``mobilize.mysite.js`` would contain

.. code-block:: javascript
   
    mobilize.extends(mobilize, {
    
        constructBody : function() {
            // Map contennt elements to jQuery Mobile 
            // div[data-role=content] here
        },

        constructHeader : function() {
            // Map title and header buttons jQuery Mobile 
            // div[data-role=header] here
        },

        constructFooter : function() {
            // Construct site footer 
        }

    });

These should map elements to jQuery Mobile template which looks like

.. code-block:: html

    <div id="mobile-body"> 
    
        <!-- http://jquerymobile.com/demos/1.0a3/#docs/pages/docs-pages.html -->                
        <div data-role="page"> 
            <div data-role="header"></div> 
            <div data-role="content"></div> 
            <div data-role="footer"></div> 
        </div> 
    
    </div>

What actually goes to ``constructBody()`` and others
is jQuery transformation code which extracts a bit from the web page
and places it to jQuery Mobile elements.

You could, for example, move everything in your #content div to mobile

.. code-block:: javascript

        // Move box on the left hand to body first
        this.content.append($(".content"));
     
Debug integration
-------------------     

Alternatively if you are developing mobilize.js itself and you want to use the trunk
version of the Javascript files you can bootstrap the framework locally. See *tests* folder
for more examples.

In this case, you manually link Javascript files and CSS files
as and mobilize.js will load each file individually.
This way line number debug info stays intact and
files are reread when you simply hit refresh in your web browser.

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
                     // Don't do cloud error reporting
                     // (it would useful for production deployment only)
                     errorReportingURL: false,
                     
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
              
mobilize.js and loading of various files 
------------------------------------------

The common file loading pattern with mobilize.js is 

* mobilize.js is loaded. If you use CDN version this is bundled with .js files like mobilize.wordpress.js and
  the bundle is called mobilize.wordpress.min.js
  
* mobilize.js extender, e.g. mobilize.wordpress.js, is loaded and it overrides mobilize.js abstract functions
  with CMS specific versions
      
* ``mobilize.init()`` (setting options) and ``mobilize.bootstrap()`` (starting processing) 
  are automatically called from ``mobilize.autoloa()`` which is at the end of your bundle
  (e.g. mobilize.wordpress.js)
  
* ``mobilize.init()`` calls Javascript global ``mobilizeCustomInit`` where
  the site can adds its own mobile customization layer. Usually this is done
  by fiddling with Javascript and CSS files going to be loaded from 
  ``mobilize.cdnOptions``   

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

Writing your first mobilization
----------------------------------

Now we have covered basics how mobilize.js is installed and how it works.

It is time to start mobilizing your web site.

We assume your website runs in address. 

First

* 

Switching between different types of pages
---------------------------------------------



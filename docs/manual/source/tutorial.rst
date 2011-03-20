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

* Works on static HTML files 

* You can also integrate to sites for which you do not otherwise have access (third party systems, no source code)

Cons

* May load unncessary CSS, JS and images, slowing loads

* May load unnecessary HTML payload just to later remove it with Javascript

.. note ::

    With node.js you can execute mobilize.js transformations on
    the server side, supporting mobile browsers without Javascript
    capabilities.
     

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

We start with a sample site which consists only of

* One HTML file

* One CSS file

This is our site.

.. image :: images/screenshots/website.png

Here is our site sample.html

.. code-block:: html

    <!doctype html>
    <html lang="en">
        <head>
            <title>Example site</title>
            <link rel="stylesheet" href="styles.css" type="text/css" media="screen" />
        </head>
        <body>
            <div id="wrapper">
                <!-- #wrapper -->
                <header>
                    <!-- header --><h1><a href="#">Your Cool Site</a></h1>
                </header><!-- end of header -->
    
                <nav>
                    <!-- top nav -->
                    <div class="menu">
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
    
                            <li>
                                <a href="/about">About</a>
                            </li>
    
    
                            <li>
                                <a href="/contact">Contact</a>
                            </li>
    
    
                        </ul>
                    </div>
                </nav>
    
                <!-- end of top nav -->
                <section id="main">
                    <!-- #main content and sidebar area -->
                    <section id="container">
                        <!-- #container -->
                        <section id="content">
                                <h2>This is our story</h2>
                                <p>Long long time ago,</p>
                                <h2>... anb this is how it ends</h2>
                                <p>Galaxy far far away</p>                          
                        </section>
                        <!-- end of #content -->
                    </section>
                    <!-- end of #container -->
                    <aside id="sidebar">
    
                            <h3>Sidebar</h3>
                            <ul>
                                <li>
                                    Sidebar item 1
                                </li>
    
    
                                <li>
                                    Sidebar item 2
                                </li>
                            </ul>
    
                    </aside>
                    <!-- end of sidebar -->
                </section>
                <!-- end of #main content and sidebar-->
                <footer>
                    <section id="footer-area">
                        Some footer text. <a href="http://freehtml5templates.com/">Web theme authors.</a>
                    </section>
                    <!-- end of #footer-area -->
                </footer>
            </div>
            <!-- #wrapper -->
        </body>
    </html>


Creating mobilize.js skeleton Javascript for your site
---------------------------------------------------------

First let's create dummy ``mobilize.yoursite.js`` file

.. code-block:: javascript

    /**
     * This file is executed when the site is loaded in mobile mode.
     */
    
    mobilize.extend(mobilize, {
        
        constructBody : function() {
            // Map different elements to jQuery Mobile theme 
            this.constructHeader();
            this.constructContent();
            this.constructFooter();
            
            alert("xxx");
        },
    
        /**
         * Create mobile site header name and buttons 
         */
        constructHeader : function() {    
        },
    
        /**
         * Move content area from web site to mobile site
         */
        constructContent : function() {
            
        },
    
        /**
         * Create mobile footer
         */
        constructFooter : function() {
        }
    
    });


For now, this is file is supposed to throw an alert box on your page 
when you open the page in "mobile" browser.  

Integrating skeleton script
------------------------------

We'll now integrate this file to the site.

First we create a <script> tag which informs what additional CSS and JS files
must be loaded for mobile devices, besides standard jQuery and jQuery Mobile.
``mobilizeCustomInit()`` is a Javascript global which is called by 
``mobilize.init()`` when it is ready for setting some options.

    <body>

        <script type="text/javascript">
            
            // Called when mobilize.js is autoloading and init() is called
            function mobilizeCustomInit() {
                
                 // Add new Javascript and CSS files to mobile
                 // file loading list
                
                 // Note: Slashdot at the beginning of the filename
                 // indicates that the file path is relative to the HTML file location.
                 // This is an internal trick of mobilize.js.
                 mobilize.cdnOptions.javascriptBundles.push("./mobilize.yoursite.js");
                 mobilize.cdnOptions.cssBundles.push("./mobile-style.css");                 
            }            
        </script>
        
        
Now we can test open the page in :doc:`mobile simulators </testing>` or
simply in Firefox + Firebug + `User Agent Switcher <http://www.chrispederick.com/work/user-agent-switcher/>`_ 
combo (recommended).        

* Install User Agent Switcher

* From menu Tools -> Default user agent -> Choose iPhone 3.0. Now your 
  Firefox presents itself as "iPhone 3.0" to the servers and Javascript files.
  
Reload the page.

You should see the alert pop-up coming up. Otherwise the page show
look like empty, broken page. jQuery Mobile does not render
anything until you start adding in content. 

Now we can start transforming bits and pieces
from the web page to the mobile site.

Creating transformations
---------------------------

First we move the title from the web site to the mobile site 
by adding ``constructHeader()`` function body

.. code-block:: javascript
    
    constructHeader : function() {
        // Map title and header buttons jQuery Mobile 
        
        // This is the mobile target element 
        // which will contain the title.
        var mobileHeader = $("#mobile-body div[data-role=header]");

        // Pick the current page title from <header> section
        var title = $("header h1").text();
        
        // Set mobile header title to the same text
        var h1 = $("h1").text(title);
        mobileHeader.append(h1);        

    },    

Now you can reload in Firefox and see that title, indeed,
appears in the mobile version.

Then let's add content area and footer as well.

.. code-block:: javascript

    /**
     * Move content area from web site to mobile site
     */
    constructContent : function() {
        var content = $("#content");
        
        // Place content HTML to mobile content area container
        var mobileContent = $("#mobile-body div[data-role=content]");
        mobileContent.append(content);
    },

    /**
     * Create mobile footer
     */
    constructFooter : function() {
        var footer = $("footer").children();
        
        // Place content HTML to mobile content area container
        var mobileFooter = $("#mobile-body div[data-role=footer]");
        mobileFooter.append(footer);
        
    }

And here is the result:

.. image :: images/screenshots/mobile1.png

You can see that footer looks still little unfinished. jQuery
Mobile does not apply any default styles there.

Let's fix it by adding to our ``mobilize-style.css``

.. code-block:: css

    .ui-footer {
        padding: 10px 0;
        text-align: center;
        font-weight: lighter;
    }

(You can pick class names for your CSS file using Firebug's inspector). 

.. image :: images/screenshots/mobile2.png

Much better!

Creating mobile navigation
-----------------------------

We still haven't mobilized more than one page. 
Let's add navigation to our mobile site.

jQuery Mobile uses ``data-role`` attributes
to define its widgets. When jQuery Mobile
is initialized, which done by mobilize.js,
this mark-up is converted to actual HTML code with
wrapper elements and such needed for the visuals.

Let's put all this to new method which we call
from ``constructBody()``, the entry point of transformation.

.. code-block:: javascript

    constructBody : function() {
        // Map different elements to jQuery Mobile theme 
        this.constructHeader();
        
        this.constructContent();
        this.constructNavigation();
        
        this.constructFooter();
    },


    /**
     * Use jQuery Mobile nested list to create a navigation.
     * 
     */
    constructNavigation : function() {
        
        // Get list of items which contain links for the navigation building
        var items = $("nav li");
         
        // Create navigation list
        var list = $("<ul class='page-list' data-role='listview' data-inset=true>");
        
        // Add list header
        list.prepend("<li data-role='list-divider'>Pages</li>"); 

        // Add list items
        items.each(function () {
            var output = $("<li role='option'>");
            output.append($(this).find("a"));
            output.appendTo(list);
        });
        
        // Put list below content
        var mobileContent = $("#mobile-body div[data-role=content]");
        mobileContent.append(list);        
        
    }

Now we are done!

.. image :: images/screenshots/mobile3.png

More learning material
---------------------------

To learn more

* `Join to the discussion group and don't hesitate to ask any questions <http://groups.google.com/group/mobilizejs-users>`_

* Read :doc:`walkthrough </development>`

* Browse `API docs <mobilizejs.com/docs>`_

* `See more source code examples on Github <https://github.com/mobilizejs/mobilize.js>`_. Especially
  ``mobilize.mfabrik-blog.js`` and ``mobilize.mobilizejs-blog.js`` recommended.
  
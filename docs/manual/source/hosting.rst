========================================
 Hosting mobilize.js files 
========================================

.. contents :: :local:

URL resolving
--------------

mobilize.js, when running as ``mobilize.cdnOptions.cloud == true``
will automatically detect location of

* JS files

* CSS files

* Image files

based on the ``<script>`` tag which has ``<script class="mobilize-js-source>``. 

Bundles
---------------

mobilize.js is delivered in three bundles

* mobilize.$bundleName.js e.g. mobilize.wordpress.js - this JS code is run always, on every browser

* mobilize.$bundleName.mobile.js - this bundle contains jQuery, jQuery Mobile and additional mobilize 
  code. This bundle is loaded only if a mobile browser is detected.
  
* mobilize.$bundleName.mobile.css - this bundle contains jQuery Mobile and additional mobilize 
  CSS code. This bundle is loaded only if a mobile browser is detected.
  
All bundles have .min and .debug version

E.g::

	js/mobilize.wordpress.debug.js
	css/mobilize.wordpress.mobile.min.js
	
URI layout
----------

The following URI layout is used to host mobilize.js files.

The default URL base is:

        http://cdn.mobilizejs.com/releases/$version_tag

mobilize.wordpress for mobilize.js 0.1 would be::

        http://cdn.mobilizejs.com/releases/0.1/js/mobilize.wordpress.bundle.debug.js
        
This would load files::

        http://cdn.mobilizejs.com/releases/0.1/js/mobilize.wordpress.mobile.debug.js
        http://cdn.mobilizejs.com/releases/0.1/css/mobilize.wordpress.mobile.debug.css
        http://cdn.mobilizejs.com/releases/0.1/templates/wordpress.min.html
        
Alternatively::

        http://cdn.mobilizejs.com/releases/0.1/js/mobilize.wordpress.min.js

Would load files::        

        http://cdn.mobilizejs.com/releases/0.1/js/mobilize.wordpress.mobile.min.js
        http://cdn.mobilizejs.com/releases/0.1/css/mobilize.wordpress.mobile.min.css
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

It is easiest if you follow the following directory layout as described above.

mobilize.js should be able to load itself arbitary directory.
It is not recommended tomix mobilize.js files with other JS or static media files in
the same folder.

Allow-origin
=============

You might need to fiddle with ``mobilize.cdnOptions`` to make mobilize run on your custom hosting.

* You must set allow origin HTTP header on your server

This is due to browser security limitations.

More info

* https://developer.mozilla.org/En/HTTP_access_control

Locally cached files
------------------------

If mobilize.cdnOptions.cacheVersion is set to true, the loader tries to load cached versions
from local storage. If local storage is empty or the cache version mismatchs, the loader
proceed as decribed above.

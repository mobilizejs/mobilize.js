=============================
 Known issues
=============================

.. contents :: :local:

jQuery Mobile can't find jQuery when developing locally
--------------------------------------------------------

This happens if you are manually setting up ``cdnOptions.javascriptBundles``.
jQuery Mobile doesn't wait jQuery to be loaded and thus crashes when
it starts execution (jQuery not found).

Just hit refresh until the page loads correctly.

This problem does not happen with production bundles.


Javascript: mobilize is not defined
--------------------------------------

On line::
    
    mobilize.init({ 
    
mobilize.js files are not loaded in the desktop mode.
Usually this is because you are developing against local files
and your test server is not running.

    
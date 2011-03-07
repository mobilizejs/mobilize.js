=============================
 Integrating with Wordpress
=============================

.. contents :: :local:

Enabling
========

To enable mobilize, add following script tag to the page.

.. code-block:: html

    <script src="http://cdn.mobilizejs.com/releases/trunk/js/mobilize.wordpress.min.js"></script>

Front page
==========
To correctly convert the front page it must follow the default theme structure( Wordpress 3.1). 
 
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

Post page
=========

For content there should be element with class="entry-content".
For the post content there should be element with id="comments".

The content inside those tags are used as-is.

Content
-------
.. code-block:: html

    <div class="entry-content">

Pages
-----

.. code-block:: html

    <div id="comments>


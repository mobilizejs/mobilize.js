<?php
/*
Plugin Name: mobilize.js for Wordpress
Plugin URI: http://mobilizejs.com
Description: Mobilize your Wordpress site in an instant
Version: 0.1
Author: Mikko Ohtamaa
Author URI: http://mobilizejs.com
*/

// Which Wordpress theme we serve for jQuery Mobile transformation base
DEFINE('MOBILE_THEME_BASE', 'twentyten');

DEFINE('DEBUG', true);

// Version of mobilize.js to use
$mobilizejs_version = 'trunk';

// Set up WP plug-in hooks
add_filter('stylesheet', 'mobilizejs_stylesheet');
add_filter('template', 'mobilizejs_template');
add_filter('show_admin_bar', 'hide_admin_bar' ); // Mobile version do not need admin bar HTML

add_action('init', 'mobilizejs_init');
add_action('wp_head', 'mobilizejs_head');
add_action('wp_footer', 'mobilizejs_include_debug');


// Internal debug purposes only
function xlog($msg) {
	if(DEBUG) {
		error_log($msg);		
	}
}


/**
 * Check if mobilize.js mobile cookie has been set.
 * 
 * @return true if the client wants to render the page in mobile optimized way 
 */
function is_mobile() {
    //print_r($_COOKIE);
    
	// Disable mobilize.js for admin interface
	if(is_admin()) {
		return false;
	}
	
	xlog("Cookies");
	xlog(print_r($_COOKIE, true));
	
	// Javascript cookie has been set
    if(array_key_exists('mobilize-mobile' , $_COOKIE)) {
        return true;
    }
    
    return false;
}


/**
 * Include mobilize.js in <head> and clean up unwanted Javascript
 * 
 * @return unknown_type
 */
function mobilizejs_init() {
	
	global $mobilizejs_version;
	
	xlog("Loading mobilize.js plug-in");
	
	if(is_mobile()) {
        // Unregister all known unwanted Javascripts by default
		wp_deregister_script( 'jquery' );	
	}
	
    // Go for mobilize.js
    
    if(DEBUG) {
    	// Uses wp_head hook
    } else {
        $src = "http://cdn.mobilizejs.com/releases/{$mobilizejs_version}/js/mobilize.wordpress.min.js";    
    	wp_enqueue_script( 'mobilize', $src);    	
    }
}   

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

/**
 * Don't do admin HTML on mobile mode. 
 */
function hide_admin_bar() {
    return !is_mobile();
}

/**
 * Insert uncompress script loading from localhost:8080 test server.
 * 
 * This is mainly useful for developing mobilize.js itself on a local computer.
 * 
 * If this ain't working make sure your DEVELOPMENT SERVER IS RUNNING.
 * 
 * @return unknown_type
 */
function mobilizejs_include_debug() {
	if(DEBUG) {
		?>
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
		<?		
	}
}
 
/**
 * Use always Wordpress default template when mobilizing (known to work)
 * 
 * @param $template
 * @return unknown_type
 */
function mobilizejs_template($template) {
	if(is_mobile()) {
		return MOBILE_THEME_BASE;
	}
	return $template;
}

/**
 * Use always Wordpress default template when mobilizing (known to work)
 * 
 * @param $template
 * @return unknown_type
 */
function mobilizejs_stylesheet($css) {
    
    if(is_mobile()) {
        return MOBILE_THEME_BASE;
    }    
    return $css;
}


?>
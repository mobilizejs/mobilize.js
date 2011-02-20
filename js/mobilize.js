/**
 * Pure Javascript mobilization solution
 * 
 * @copyright 2011 Mikko Ohtamaa
 * 
 */


var jq = jQuery;


mobilize = {
	
	/**
	 * Instiate Mobilizer class in inheritance safe manner.
	 */
	init : function(options) {
	
	    if(!jq) {
	        throw "jQuery needed in order to run mobilize.js";
	    }
	    
	    // Default options
	    mobilize.options = {
	            cacheTemplate : false,
	            
	            // String tags which mark <head> JS and CSS resources not to be purged
	            resourceWhitelist : [],
	            
	            // Which template file to use - relative file or URL
	            template : "template.html"
	    };
	    
	    // Override default parameters with user supplied versions
	    
	    if(!options) {
	        options = {};
	    }
	    
	    jq.extend(mobilize.options, options);
	
	},
	
	log : function(msg) {
		if(console) {
			if(console.log) {
				console.log(msg);
			}
		}
	},
	
	/**
	 * Make a function call and report possible exceptions back to a centralized server.
	 * 
	 * We use this to track problems with possible not-so-well-implemented mobile browsers.
	 */
	callWithErrorReporting : function(func) {
	    try {
	        func();
	    } catch(e) {
	        // 
	    }
	},
	    
	/**
	 * Enable mobile mode if mobile browser is detectd.
	 */
	bootstrap : function() {
	    
	    if(this.isMobile()) {
	        this.enableMobileRendering();
	    }
	},
	    
	/**
	 * Detect a mobile browser.
	 * 
	 * @returns True if the page should be rendered in mobile mode
	 */
	isMobile : function() {
	    return true;
	},
	
	/**
	 * 
	 * Stop loading all web page resources until mobile template is properly placed
	 * and template transformation has taken place.
	 * 
	 */
	enableMobileRendering : function() {
	    
	    this.suspendLoading();
	    
	    this.cleanHead();
	    
	    // We cannot directly load template, since <body> has not been constructed
	    var self = this;
	    jq(document).ready(function() { self.loadMobileTemplate() } );
	},
	
	/**
	 * Stop loading Javascripts and CSS we do not need in mobile mode.
	 */
	cleanHead : function() {
	},
	
	suspendLoading : function() {
	    var body = jq("body");
	    if(body.size() == 0) {
	        // DOM tree loading, couldn't get hang off it
	        throw "Could not find body while loading?";
	    }
	    
	    body.hide();
	},
	
	/**
	 * Must be called before template loading,
	 * as immediately when jQuery Mobile <script> is inserted to DOM,
	 * some of its event handlers are run.
	 */
	bindTemplateEventHandlers : function() {
		 // Assign jQuery Mobile event handlers
        jq(window.document).bind("mobileinit", mobilize.onMobileInit);
	},
	
	/**
	 * Start loading mobile template to DOM tree.
	 * 
	 * Check possible mobile template cache places.
	 */
	loadMobileTemplate : function () {
	    
	    var self = this;
	    
	    jq("body").append("<div id='mobile-template-holder'></div>");
	    
		mobilize.bindTemplateEventHandlers();
		
	    jq("#mobile-template-holder").load(mobilize.options.template, function() {
	        self.transform();
	    });
	},
	
	/**
	 * Put mobile template to DOM tree
	 */
	prepareMobileTemplate : function() {
	    
	},
	
	/**
	 * Get rid of mobile template
	 */
	closeMobileTemplate : function() {
	},
	
	/**
	 * Move content from the orignal web page to mobile template by the user rules.
	 */
	transform : function() {
		
		// Assign jQuery Mobile event handlers
		
	    mobilize.constructBody();
        mobilize.constructHead();
	    
	    mobilize.finish();
	},
	
	/**
	 * Create <head> section of a mobile rendered version.
	 * 
	 * The default transform is just to copy everything
	 * in #mobile-head from template to <head> of the page.
	 */
	constructHead : function() {    
	   mobilize.log("constructHead");
	    jq("head").append(jq("#mobile-head").children());
	    // Make events to be fired when each CSS/Javascript has been loadeds
	},
	
	
	/**
	 * Create <body> section of a mobile rendered version.
	 * 
	 * This transformation is always CMS specific 
	 * and your subclass must override this function.
	 */
	constructBody : function() {        
	},
	
	/**
	 * Make the transformed mobile template body visible and remove the other body data.
	 */
	swapBody : function() { 
	    var mobileBody = jq("#mobile-body").detach();
	    jq("body").empty();
	    jq("body").append(mobileBody.children());
	},
	

	/**
	 * Mobile transformation is done. Show mobile site to the user.
	 */
	finish : function() {
	   
	    this.swapBody();

        // Enable jQuery Mobile effects
		jq.mobile.initializePage();

	    jq("body").show();
	
	},
	
	/**
	 * jQuery mobile initializer handler 
	 * 
	 * @param {Object} e
	 */
	onMobileInit : function(e) {
		
		// We'll manage our own workflow and don't want to jQuery Mobile
		// start doing things instantly when the script is loaded
		mobilize.log("Setting autoinitalize:" + jq.mobile.autoInitialize);
		jq.mobile.autoInitialize = false;
	}
}
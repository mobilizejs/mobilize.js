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
	            template : "template.html",
				
				// How many characters <style> inner text may contain it to be run through inline CSS importer check
				inlineStyleMaxCheckLength : 256,
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
	 * Check if a given link is on resource whitelist.
	 * 
	 * 
	 */
	checkResourceWhistlist : function(src) {
        for(i=0; i<mobilize.options.resourceWhitelist.length; i++) {
            var matcher = mobilize.options.resourceWhitelist[i];
			if(src.indexOf(matcher) >= 0) {
				return true;
			}
        }	
		return false;
	},
	
	/**
	 * Remove unnecessary <script> tags from <head> if not needed for mobile.
	 * 
	 * Use options.resourceWhitelist matching.
	 */
	cleanJavascript : function() {
		jq("head script").each(function() {
		    var script = jq(this);
			var src = script.attr("src");
		    if(!mobilize.checkResourceWhistlist(src)) {
				script.remove();
			}
		});
	},

    /**
     * Remove unnecessary CSS links from <head> if not needed for mobile.
     * 
     * Supports syntaxes
     * 
     * <style type="text/css">
     *  @import url(http://plone.org/portal_css/Sunburst%20Theme/newplone-cachekey7531.css);
     * </style>
     * 
     * Use options.resourceWhitelist matching.
     */	
	cleanStyle : function() {
	
		jq("head style").each(function(){
          var style = jq(this);
		  // http://bytes.com/topic/javascript/answers/600139-get-file-name-style-tag

          var text = style.text(); // TODO: optimize?
          
          // Make sure we don't start searching through very long
		  // inline CSS
		  if(text.length < mobilize.options.inlineStyleMaxCheckLength) {
		  	var matches = text.match(/@import url\(.*\);?/mg);
			for(var i=0; i<matches.length; i++) {
				if(!mobilize.checkResourceWhistlist(matches[i])) {
					style.remove();
					break;
				}
			} 
		  } else {
			// too long CSS snippet, drop unconditionally
			style.remove();
		  }
		});
	},

    /**
     * Stop loading Javascripts and CSS we do not need in mobile mode.
     */
    cleanHead : function() {
        mobilize.cleanJavascript();    
		mobilize.cleanStyle();    
    },


    /**
     * Make sure the browser does not load anything extra before mobile transform has taken place
     */
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
	 * @param href Link as a string
	 * 
	 * @returns New link target as string or null if the link should be removed 
	 */
	rewriteLinkTarget : function(href) {
	   return href;
	},

    /**
     * Based on mobilize options, rewrite link targets with mobile ones 
     * or hide links.
     * 
     * @param callback to be called if the link is to be removed
     */
    remapLinks : function(selection, removeCallback) {
		selection.each(function() {
			 var input = jq(this);
			 output = mobilize.rewriteLink(input);
			 if(!output) {
			 	if(removeCallback) {
					removeCallback(input);
				}
			 }
		});
	},
	
	/**
	 * 
	 * @param {Object} a DOM node or jQuery object of <a>
	 * 
	 * @returns null if the link is to be discarded
	 */
	rewriteLink : function(a) {
		var a = jq(a);
		
		var href = a.attr("href");
	
	    if(!href) {
            // Not a link
            return null;  
        } 
          
		href = mobilize.rewriteLinkTarget(href);
		a.attr("href", href);
		
		return a;
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
	 * Create jQuery Mobile navigation links out of arbitary link list.
	 * 
	 * Creates navigation or news box from existing jQuery content selection.
	 * The selection can be list or arbitary elements or list of a a hrefs.
	 * 
	 * @param {Object} selection jQuery selection which to transform
	 * 
	 * @param title If present add a link box with a title using ui-list
	 * 
	 * @returns Constructed jQuery tree, ready to place to the document
	 */
	createNavigationBox : function(selection, title, outputter) {
		
		var list;
		
		list = jq("<ul data-inset='true' data-role='listview'>");
		selection.each(function() {
			 
			 var input = jq(this);
			 var a;
			 var contentish;
			 
			 mobilize.log("Creating navigation box link " + this);
			 
			 // We can be iterating through <a> or <li> element
			 if(this.tagName.toLowerCase() == 'a') {
                a = input;         
				contentish = false;          			 	
			 } else {
			 	var content = input;
				
				// Assume we have 0 or 1 links in the content HTML
			 	a = content.find("a");
				if(a.size() == 0) {
					a = null;
				}
				contentish = true;
			 }
			 
			 if (a) {
			 	var a = mobilize.rewriteLink(a);
			 }
			 
			 if (outputter) {
			     outputter(list, input, a)			 
			 } else {
			 	
				// Create normal bulleted lists
				var output = jq("<li role='option'>");
				
			 	if (a) {
			 		output.append(a).appendTo(list);
			 	}
			 	
			 	if (contentish) {
			 		// Format link content
					output.append(content.children());
				}
			}
		});
		
		if(title) {
			list.prepend("<li data-role='list-divider'>" + title + "</li>");
		}
		
		return list;
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
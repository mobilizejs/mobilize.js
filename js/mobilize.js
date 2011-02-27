/**
 * @fileoverview Pure Javascript mobilization solution
 * 
 * @module mobilize.core
 *   
 */

/**
 * @namespace mobilize.js core
 * <p>
 * <i>mobilize</i> is a core class of mobilize.js. 
 * <p>
 * You only want to use this class directly if you are developing mobilization
 * for your own framework. Otherwise use one of the stock CMS classes supplied with
 * mobilize.js. 
 * <p>
 * mobilize does not need to be instiated and it's a static singleton. Instead,
 * the functionality is extended by an <i>extender</i>. 
 * Extender is a Javascript which directly overrides mobilize member functions
 * in mobilize namespace.
 * <p> 
 * @author Mikko Ohtamaa, Jussi Toivola
 *
 */
var mobilize = {
	
	/**
	 * @class 
	 * 
	 * <p>
	 * Options and their default values.
	 * <p>
	 * These default values can be overriden by extender getExtendedOptions()
	 * or user supplied parameters to init().
	 * <p>
	 * 
	 * 
	 * @see mobilize.init
	 * 
	 * @see mobilize.getExtendedOptions
	 */
	options : {
                	    
	    /**
	     * 
	     * &lt;script src=""&gt; whitelist for filtering web specific 
         * elements from &lt;head&gt;
         * <p>
	     * If src attribute has substring match of any list element,
	     * the tag is left to mobile version also. 
	     * <p>
	     * @default allow scripts which have mobilize in their name.
	     */
	    whitelistScriptSrc : ["mobilize"],
	    
	    /** 
	     * &lt;style type="text/css&gt; @import whitelist for filtering web specific 
         * elements from &lt;head&gt;
         * <p>
         * If CSS @import content has substring match of any list element,
         * the tag is left to mobile version also. 
         * <p>	     
         * 
         * @see mobilize.options.inlineStyleMaxCheckLength
         * 
         * @default empty list
	     */
	    whitelistStyleImport : [],
	    
	    // <link rel="stylesheet"> href whitelist 
	    whitelistCSSLinks : [],
	    	    
	    /** How many characters &lt;style&gt; inner text may contain it to be run through inline CSS importer check */
	    inlineStyleMaxCheckLength : 256,
	    
	    // Go always with mobile rendering path (useful for testing)
	    forceMobilize : false,
	    
	    // Force user agent
	    forceUserAgent : null,
	    	     
	     // Which HTTP GET parameter we can use to forc mobilization
	    mobilizeQueryParameter : "mobilize"
    },
    
    /**
     * Content delivery options for mobilize.js resource loading,
     * error reporting and user agent sampling.
     * 
     * @class
     */
    cdnOptions : {

	    /**
	     * Use mobilize.js clouad service for scripts sources.
	     * <p>
	     * If you need to host all files yourself, set this to false.
	     * 
	     * @default  true
	     */
	    cloud : true,
	    
		/**
		 * You need to set this value in order to 
		 * cache mobile page template in localStorage.
		 * <p>
		 * Every time template is upgraded this values must
		 * be changed within your construction script tag.	
		 * <p>
		 * If value is null caching is not used.
		 * <p>
		 * @default null		 
		 */
	    localCacheVersion : null,
	    
	    
	   /**
	    * URL used for CDN download, error reporting and user agent sampling services.
	    * 
	    * @default Extract from <script class="mobilize-js-source"> 
	    */
	    baseURL: null,
	    
	    /**
	     * Javascript and resources bundle which download from the cloud service. 
	     * <p>
	     * Set to null to not try to do bundled script downloading
	     * 
	     * @example moblize.wordpress
	     * 
	     * @default null
	     */
	    bundleName : null,
	    
	    /**
	     * Filenames of Javascript files to load after bootstrap.
	     * <p>
	     * Template variable <code>$bundleName</code> can be used in the strings.
	     * </p>
	     * 
	     * @see mobilize.bootstrap
	     * 
	     * @default null
	     */
	    javascriptBundles : ["js/jquery+jquerymobile.js"],
	    
	    /**
	     * Filenames of CSS files to load after bootstrap.
	     * <p>
	     * 
	     * </p>
	     * 
	     * 
	     */
	    cssBundles : ["css/jquerymobile+$bundleName.css"],
	    
	    /** 
	     * Which HTML template to use for the mobile page 
	     * <p>
	     * Extenders usually override this.
	     */
	    template : "templates/core.html",

	    
	    /**
	     * mobilize.js version. 
	     * <p>
	     * Used in cloud error reporting and user agent sampling.
	     * <p>
	     * Note that this variable will be updated by release scripts 
	     * for bundle creation.
	     * 
	     * @private
	     */
	    version : "0.1dev", // $$VERSION_LINE
    },

    /** Async flag indicating that jQuery Mobile has been loaded */
    jQueryMobileLoaded : false,

    /** Async flag indicating that mobile page transform is complete */
    transformComplete : false,
    
	/**
	 * Initialize mobilize class.
	 * 
	 * <h2>Options<h2>
	 * 
	 * <table><tbody>
	 * 
	 * <tr><th>resourceWhitelist</th>
	 * <td>String tags which mark head tag JS and CSS resources not to be purged</td></tr>
	 * 
	 * 
	 * @static
	 * 
	 * @param options Javsacript object to override mobilize.options
	 * 
	 * @param cdnOptions Javascript object to override mobilize.cdnOptions
	 */
	init : function(options, cdnOptions) {
	    	    
	    // Override default parameters with user supplied versions
	    
	    if(!options) {
	        options = {};
	    }
	    
	    if(!cdnOptions) {
	    	cdnOptions = {};
	    }
	
        // Extend global options with subclass supplied ones
        mobilize.initPlugins();
	
		// Extend global options with user supplied ones
		mobilize.extend(mobilize.options, options);

        mobilize.extend(mobilize.cdnOptions, cdnOptions);
        
        mobilize.initCloud();
				
	},
	
	/**
	 * Initialize CDN locations where to load Javascript files.
	 * 
	 * Deliver download URLs for various scripts and resources based
	 * on 
	 * 
	 * @see mobilize.cdnOptions
	 * 
	 * @private 
	 */
	initCloud : function() {
		
		var opts = mobilize.cdnOptions;
		
		if(!opts.cloud) {
			// Cloud services have been disabled
			return;
		}
		
		
		if(!opts.cloudBaseURL) {
			// Try to extract cloud URL from our <script> tag
			var scripts = document.getElementsByTagName("script");
			var src = null;
			for(var i=0; i<scripts.length; i++) {
				var script = scripts[i];
				var klass = script.getAttribute("class");
				
				if(klass == "mobilize-js-source") {
					
					// Found our script tag
					src = script.getAttribute("src");
					
					if(!src) {
						// Inline script tag
						continue;
					}
					
					var base = mobilize.baseurl(src);
					
					mobilize.log("Found script source URL" + base);
					
					// Remove /js/ from the end of the URL
					base = base.substring(0, base.length-4);
					
					opts.baseURL = base;		
					
					break;
				}
			}
			if(!src) {
				throw "Could not found <script class='mobilize.js.source'> in HTML to defined mobilize.js hosting location";
			}
		}
		
	},
	
	/**
	 * Simple shallow copy from an object to another.
	 * <p>
	 * 
	 *  
	 * @param {Object} target Javascript object to receive new members
	 * 
	 * @param {Object} source Javascript object to source new members
	 */
	extend : function(target, source) {
        for(name in source) {
            var val = source[name];
            target[name] = val;
        }   		
	},
	
	/**
	 * Run plug-in specific options overrides.	
	 * <p>
	 * The plug-in overriding mobilize.js default options
	 * by overriding this method and manipulating
	 * options and cdnOptions. 
	 * <p>
	 * At least mobilize.cdnOptions.bundleName must be set.
	 * <p>
	 * 
	 * @see mobilize.options
	 */
	initPlugins : function() {
		
	},
	
    /**
     * Entry point to mobilize.js machinery.
     * <p>
     * Stop loading current HTML resources, start async processes
     * to get the page mobilized.
     * 
     */
    bootstrap : function() {
        
		mobilize.log("Bootstrap");
        if(mobilize.checkMobileBrowser(mobilize.options)) {
            mobilize.renderAsMobile();
        } else {
			mobilize.log("Web mode wanted");
		}
    },

	
	/** 
	 * Utility for internal debug logging 
	 * 
	 * @param msg: message to log
	 * */
	log : function(msg) {
		if(window.console) {
			if(console.log) {
				console.log(msg);
			}
		}
	},
	
	/** 
	 * <p>Get baseurl from url by ignoring file and url parameters</p> 
	 * 
	 * <b>Example</b>
	 * <pre>
	 * mobilize.baseurl(window.location.href)
	 * </pre>
	 * @param url : Url to parse
	 * 
	 * */
	baseurl : function (aUrl) {
		
		var end;
		var url;
		
		end = aUrl.indexOf('?');
		
		if(end <= 0) {
			end = aUrl.length-1;
		}
		
		url = aUrl.slice(0, end);
		// Ignore slash at the end of url
		if(url[url.length-1] == "/" ) {
			url = url.slice(0,url.length-2);
		}
		
		// But add the slash to result for convenient concat
		end = url.lastIndexOf("/") + 1;
		url = url.slice(0,end);
		
		return url;
	},
	
	/** Make a function call and report possible exceptions back to a centralized server.
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
	 * Read URL parameters to dict.
	 * 
	 * See: http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
	 */
	getUrlVars : function ()
	{
		// Cache this call results
		if(this._urlvars) {
			return this._urlvars;
		}
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    
	    this._urlvars = vars;
	    return vars;
	},

	/**
	 * Create a new cookie 
	 * 
	 * @see http://www.quirksmode.org/js/cookies.html 	
	 */
	createCookie : function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	},
	
	/**
	 * Get a cookie value by name 
	 * 
	 * @see http://www.quirksmode.org/js/cookies.html 	
	 */
	readCookie : function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	/** 
	 * See: http://www.quirksmode.org/js/cookies.html 	
	 */
	eraseCookie : function(name) {
		createCookie(name,"",-1);
	},
	
	/** Check if browser is running on mobile platform
	 * 
	 * @param userAgent   = userAgent name. Uses browser's userAgent by default
	 *  
	 * @param forceMobilize = Force detection to mobile to true or false regardless of real type
	 * 
	 * URL parameter mobilize=<true,1> can also be used to force mobile.
	 * 
	 * The state is also stored to 'mobilize-mobile' cookie this
	 * information is passed to server for the following requests. 
	 * URL and options.force paremeters 
	 * override cookie and detection.
	 * 
	 * @return: true if browser is considered as mobile browser.
	 * 
	 * @see: http://detectmobilebrowser.com/ for the detection code.
	 */ 
	checkMobileBrowser : function (opts)
	{
		var forced;
		var name;
		if(!opts) {
			opts = {};
		}
		
		// Using cookie by default
		// forced = mobilize.readCookie("mobilize-mobile");

        // For user agent testing
		name = opts.forceUserAgent;
		
		// Note: URL parameter and option overrides cookie		
		// Get URL var to mobilize page
		forced = mobilize.getUrlVars()[mobilize.options.mobilizeQueryParameter];
		
		// Javascript option to always render in mobile mode
		if(opts.forceMobilize) {
			forced = true;
		}
		
		if(forced !== undefined && forced !== null ) {
			result = (forced == "true" || forced == "1" || forced === true || forced === 1);
		}
		else {
			if(!name) {
				name = (navigator.userAgent || navigator.vendor || window.opera);
			}
			
			result = (function(a) {
				if (/android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
						.test(a)
						|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i
								.test(a.substr(0, 4)))
					return true;
				else
					return false;
			})(name);
		}
		
		// Update cookie
		var cookie = result ? "1" : "0";
		mobilize.createCookie("mobilize-mobile", cookie);
		
		return result;
	},
	
	/**
	 * Clear conflicting jQuery objects
	 * <p>
	 * jQuery might ill behave if we overlay it with a different version
	 * 
	 * @private 
	 */
	clearConflictingJQuery : function() {
		
		// - if two jQuery instances are loaded then event handlers do not function 
		// properly
		
		if(window.jQuery !== undefined) {
			delete window.jQuery;			
		}
		
		if(window.$ !== undefined) {
			delete window.$;		
		}	
	},
	    	
	/**
	 * Reconstruct page HTML code for mobile presentation.
	 * <p>
	 * Stop loading all web page resources until mobile template is properly placed
	 * and template transformation has taken place.
	 * 
	 */
	renderAsMobile : function() {
	    
		mobilize.log("Enabling mobile rendering");
		
	    mobilize.suspendRendering();
	    
	    mobilize.cleanHead();
	    
		mobilize.loadMobileResources();

	},
	
	/**
	 * Convert relative paths to full CDN URLs if they are relative
	 * 
	 * @param uri Relative URI or full URL
	 * 
	 * @returns Full URL
	 * 
	 * @private
	 */
	toFullCDNURL : function(uri) {
		if(uri.indexOf("http") >= 0) {
			return uri;
		} else {
			return mobilize.cdnOptions.baseURL + "/" + uri;
		}
	},
	
	/**
	 * Load JS and CSS files needed on the mobile page.
	 * <p>
	 * This function provides some logic for caching 
	 * the result, so that the files are not reloaded again.
	 * <p>
	 * Note that Javascript is loaded synchronously
	 * and transform() won't proceed until Javascript
	 * (jQuery) is completely loaded.
	 * <p>
	 * CSS are loaded asyncrhonously.
	 */
	loadMobileResources : function() {		
		var i;
		var self = this;
		var cdn = mobilize.cdnOptions;
		
		var jsCompleteCount = 0;
		
		mobilize.log("Constructing mobile <head>");
		
		function onJSComplete() {
			jsCompleteCount++;
			
			if(jsCompleteCount == 1) {
				// Assume jQuery loaded
			}
			
			// Proceed to tempalte transform
			if(jsCompleteCount >= cdn.javascriptBundles.length) {							
				self.loadMobileTemplate();
			}						
		}
				
		for(i=0; i<cdn.javascriptBundles.length; i++) {
			var js = cdn.javascriptBundles[i];
			mobilize.log("Loading js:" + js);
			mobilize.loadScript(mobilize.toFullCDNURL(js), onJSComplete);
		}

		for(i=0; i<cdn.cssBundles.length; i++) {
			var css = cdn.cssBundles[i];
			mobilize.log("Loading CSS:" +css);
			mobilize.loadCSS(mobilize.toFullCDNURL(css));
		}
			
		mobilize.log("Syncronous boostrap done");
	},
			

    /**
     * Helper function to do AJAXy requests before jQuery has been loaded.
     * 
     * @param {String} url
     * 
     * @param callback(payload)
     */
    getAJAX : function(url, callback) {
		var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.onreadystatechange = function (aEvt) {
           if(req.readyState == 4) {
		       if (req.status == 200) {
			   	callback(req.responseText);
			   }  else {
			   	mobilize.log("Could not AJAX url:" + url + " got status:" + req.status);
			   }
		   }
	    };
        req.send(null);
	},
	
	/**
	 * Magical script loader.
	 * 
	 * Use AJAX to load Javascript code, then eval() it.
	 * This ensures that code is executed (not just loaded)
	 * when triggering the callback.
	 * 
	 * http://blog.client9.com/2008/11/javascript-eval-in-global-scope.html
	 * 
	 * @param {String} url
	 * 
	 * @param {Object} callbacl
	 */
	loadScript : function(url, callback) {
        
		function loaded(javascript) {
			mobilize.log("Loaded payload for " + url + ", now evaling() it ");
			eval.call(null, javascript);
			callback();
		}
		
		mobilize.getAJAX(url, loaded);
	},
	
	/**
	 * Load a CSS file for the mobile page.
	 * <p>
	 * The file is loaded asynchronously 
	 * and inserted as <link> tag to the head.
	 * <p>
	 * TODO: Check from the cache from the existing version
	 * 
	 * @param url CSS url.
	 */
	loadCSS : function(url) {		
		var link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", url);		
		document.head.appendChild(link);
	},
		
	/**
	 * Check if a given link is on resource whitelist.
	 * 
	 * @param src URL
	 * 
	 * @param list List of substring matches. If matches do not remove the element.
	 * 
	 * @returns true if the src string has substring match of any list element
	 */
	checkResourceWhitelist : function(src, list) {
        for(var i=0; i<list.length; i++) {
            var matcher = list[i];
			if(src.indexOf(matcher) >= 0) {
				return true;
			}
        }	
		return false;
	},
	
	/**
	 * Remove unnecessary script tags if not needed for mobile.
	 * 
	 * Use options.resourceWhitelist matching.
	 */
	cleanJavascript : function() {
		
		mobilize.log("Cleaning <script>s");
		
		var tags = document.getElementsByTagName("script");

		for(var i=0; i<tags.length; i++) {
		    var script = tags[i];
			var src = script.getAttribute("src");
			
			if(!src) {
				// TODO: Inline script
				continue;
			}
			
		    if(!mobilize.checkResourceWhitelist(src, mobilize.options.whitelistScriptSrc)) {
				mobilize.log("Cleaning script tag");
				mobilize.log(script);
				var parent = script.parentNode;
				parent.removeChild(script);
			}
		}
	},

    /**
     * Remove web only <link rel="stylesheet"> tags
     * 
     */
    cleanCSSLink : function() {
        
        mobilize.log("Cleaning <link rel='stylesheet'>s");
        
        var tags = document.getElementsByTagName("link");

        for(var i=0; i<tags.length; i++) {
            script = tags[i];
			
			var rel = script.getAttribute("rel");
			if(rel != "stylesheet") {
				continue;
			}          
			
            var src = script.getAttribute("href");
            if(!mobilize.checkResourceWhitelist(src, mobilize.options.whitelistCSSLinks)) {
                var parent = script.parentNode;
                parent.removeChild(script);
            }
        }
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
	cleanCSSStyle : function() {
		
		mobilize.log("Cleaning <style>s");
		
		var tags = document.getElementsByTagName("style");
		
		for(var i=0; i<tags.length; i++) {
		  var style = tags[i];
		  
		  // http://bytes.com/topic/javascript/answers/600139-get-file-name-style-tag

          function remove() {
		      var parent = style.parentNode;
			  parent.removeChild(style);	
		  }
		  
          var text = style.textContent;
		  
		  if(!text) {
		  	mobilize.log("Interesting style node:");
		  	mobilize.log(style);
		  	continue;
		  }
          
          // Make sure we don't start searching through very long
		  // inline CSS
		  if(text.length < mobilize.options.inlineStyleMaxCheckLength) {
		  	
			// This is inline CSS import
			var matches = text.match(/@import url\(.*\);?/mg);
			
		  	if(matches != null) {
			  	for(var i=0; i<matches.length; i++) {
					if(!mobilize.checkResourceWhitelist(matches[i], mobilize.options.whitelistStyleImport)) {
						remove();
						break;
					}
				} 
		  	}
		  } else {
			// too long CSS snippet, drop unconditionally
			remove();
		  }
		}
	},

    /**
     * Stop loading Javascripts and CSS we do not need in mobile mode.
     */
    cleanHead : function() {
        mobilize.cleanJavascript();    
		mobilize.cleanCSSLink();    
        mobilize.cleanCSSStyle();    

    },


    /**
     * Make sure the browser does not load anything extra before mobile transform has taken place
     */
	suspendRendering : function() {
    	
		mobilize.log("Suspending page rendering");
		
	    if(!document.body) {
	        // DOM tree loading, couldn't get hang off it
	        throw "Could not find body while loading?";
	    }
	    
	    document.body.style.display = "none";
	},
	
	
	/**
	 * Start loading mobile template to DOM tree.
	 * 
	 * Check possible mobile template cache places.
	 */
	loadMobileTemplate : function() {
	    
	    var self = this;
	    
	    // Create the element which will hold the mobile template
	    // + transformation result
	    $("body").append("<div id='mobile-template-holder'>");
	    		
	    
	    var url = mobilize.toFullCDNURL(mobilize.cdnOptions.template);
	    $("#mobile-template-holder").load(url, function() {
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
	
	
	prepareTransform : function() {

	    if(!jQuery) {
            throw "jQuery needed in order to run content transform";
        }
    	
	},
	
	/**
	 * Transform the web page content to mobile frame.
	 * 
	 * Subclasses must override this.
	 * 
	 * After the function has been finished mobilize.completeTransform() must
	 * be called to allow async handlers to proceed. 
	 */
	transform : function() {
        mobilize.constructHead();		    
		mobilize.constructBody();
	    mobilize.completeTransform();
	},
	
	/**
	 * We can proceed with the page visual enhancements
	 */
	completeTransform : function() {
		mobilize.transformComplete = true;
		mobilize.prepareFinish();
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
			 var input = $(this);
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
		var a = $(a);
		
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
	    $("head").append($("#mobile-head").children());
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

		list = $("<ul data-inset='true' data-role='listview'>");
		selection.each(function() {
			 
			 var input = $(this);
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
			     outputter(list, input, a);	 
			 } else {
			 	
				// Create normal bulleted lists
				var output = $("<li role='option'>");
				
			 	if (a) {
			 		output.append(a).appendTo(list);
			 	}
			 	
			 	if (contentish) {
			 		// Format link content
					output.appendTo(content.children());
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
	    var mobileBody = $("#mobile-body").detach();
	    $("body").empty();
	    $("body").append(mobileBody.children());
	},
	
	/**
	 * Check that all async conditions have been completed allowing us to finish the page.
	 */
	prepareFinish : function() {
		
		mobilize.log("prepareFinish()");
		if(!mobilize.jQueryMobileLoaded) {
			mobilize.log("Waiting for jQuery Mobile to load");			
		}
		
		if(!mobilize.transformComplete) {
			mobilize.log("Waiting transform() to complete");
		}
		
		if(mobilize.jQueryMobileLoaded && mobilize.transformComplete) {
			mobilize.finish();
		}
	},

	/**
	 * Mobile transformation is done. Show mobile site to the user.
	 */
	finish : function() {
	   
	    this.swapBody();
	   
        // Draw jQuery Mobile chrome
		try{
			$.mobile.initializePage();
		}catch(e){
			mobilize.log("mobilize::finish initializePage failed>" + e);
		}

        // Show constructed page to the user
	    $("body").show();
		
		// Execute handlers which can be run
		// after jQuery Mobile has completed its internal transforms
		mobilize.log("Triggering mobilizefinish");
		//$(document).trigger("mobilizefinish");

        mobilize.bindEventHandlers();
	},
	
	/**
	 * Subclass may override.
	 * 
	 * This is called after jQuery Mobile has been set up.
	 * You can now attach event handlers to jQuery UI elements.
	 * 
	 */
	bindEventHandlers : function() {
		
	}
};

if(typeof(exports) !== "undefined")
	exports.mobilize = mobilize;

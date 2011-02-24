/**
 * Pure Javascript mobilization solution
 * 
 * @copyright 2011 Mikko Ohtamaa, Jussi Toivola
 * 
 */

(function( $, undefined ) {

window.mobilize = mobilize = {
	
	/**
	 * Instiate Mobilizer class in inheritance safe manner.
	 */
	init : function(options) {
	
	    if(!$) {
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
				
				// Go always with mobile rendering path (useful for testing)
				forceMobile : false,
				
				// Force user agent
				userAgent : null
	    };
	    
	    // Override default parameters with user supplied versions
	    
	    if(!options) {
	        options = {};
	    }
	    
	    $.extend(mobilize.options, options);
	
	},
	
	log : function(msg) {
		if(window.console) {
			if(console.log) {
				console.log(msg);
			}
		}
	},
	
	/** Get baseurl from url by ignoring file and url parameters 
	 * 
	 * Usage
	 * -----
	 * baseurl(url);
	 * 
	 * Example
	 * -------
	 * mobilize.baseurl(window.location.href)
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
	    
	    if(mobilize.isMobile(mobilize.options)) {
	    	mobilize.enableMobileRendering();
	    }
	},
	/** 
	 * Read URL parameters to dict.
	 * 
	 * See: http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
	 */
	getUrlVars : function ()
	{
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
	 * See: http://www.quirksmode.org/js/cookies.html 	
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
	 * See: http://www.quirksmode.org/js/cookies.html 	
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
	 * Usage
	 * -----
	 * 
	 * isMobileBrowser([options])
	 * 
	 * options
	 * -------
	 * 	userAgent   = userAgent name. Uses browser's userAgent by default
	 *  forceMobile = Force detection to mobile to true or false regardless of real type
	 * 
	 * URL parameter mobilize=<true,1> can also be used to force mobile.
	 * 
	 * The state is also stored to 'mobilize-mobile' cookie and is used 
	 * to skip detection if set to '1'. URL and options.force paremeters 
	 * override cookie and detection.
	 * 
	 * @return: true if browser is considered as mobile browser.
	 * @see: http://detectmobilebrowser.com/ for the detection code.
	 */ 
	isMobileBrowser : function (opts)
	{
		var forced;
		var name;
		if(!opts) {
			opts = {};
		}
		
		// Using cookie by default
		forced = mobilize.readCookie("mobilize-mobile");
		name = opts.userAgent;
		
		// Note: URL parameter and option overrides cookie		
		if(opts.forceMobile === undefined) {
			opts.forceMobile = mobilize.getUrlVars()["mobilize"];
		}
		
		if(opts.forceMobile !== undefined) {
			forced = opts.forceMobile;
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
	 * Detect a mobile browser.
	 * 
	 * @returns True if the page should be rendered in mobile mode
	 */
	isMobile : function() {
		var mobile = mobilize.isMobileBrowser();
		
		return mobile;
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
	    $(document).ready(function() { self.loadMobileTemplate(); } );
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
		$("head script").each(function() {
		    var script = $(this);
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
	
		$("head style").each(function(){
          var style = $(this);
		  // http://bytes.com/topic/javascript/answers/600139-get-file-name-style-tag

          var text = style.text(); // TODO: optimize?
          
          // Make sure we don't start searching through very long
		  // inline CSS
		  if(text.length < mobilize.options.inlineStyleMaxCheckLength) {
		  	var matches = text.match(/@import url\(.*\);?/mg);
			
		  	if(matches != null) {
			  	for(var i=0; i<matches.length; i++) {
					if(!mobilize.checkResourceWhistlist(matches[i])) {
						style.remove();
						break;
					}
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
	    var body = $("body");
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
        $(window.document).bind("mobileinit", mobilize.onMobileInit);
	},
	
	/**
	 * Start loading mobile template to DOM tree.
	 * 
	 * Check possible mobile template cache places.
	 */
	loadMobileTemplate : function () {
	    
	    var self = this;
	    
	    // Create the element which will hold the mobile template
	    // + transformation result
	    $("body").append("<div id='mobile-template-holder'>");
	    
		mobilize.bindTemplateEventHandlers();
		
	    $("#mobile-template-holder").load(mobilize.options.template, function() {
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

        mobilize.constructHead();		    
		mobilize.constructBody();
	    mobilize.finish();
		
		// TODO: How to add onload event handler for jquery.mobile. Possible?
		// TODO: Is this needed now that we have onload stuff in loadMobileTemplate
		// Assign jQuery Mobile event handlers
		/*function checkLoaded(){
			// Wait for all dependencies to load
			mobilize.log("jQuery.mobile", window.jQuery.mobile)
			if(window.jQuery.mobile){
				doTransform();
				return;
			}

			setTimeout(checkLoaded, 100);
		}
	    
		setTimeout(checkLoaded, 0);*/
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
	 * Mobile transformation is done. Show mobile site to the user.
	 */
	finish : function() {
	   
	    this.swapBody();
	   
        // Enable jQuery Mobile effects
		try{
			$.mobile.initializePage();
		}catch(e){
			mobilize.log("mobilize::finish initializePage failed>" + e);
		}

	    $("body").show();
	},
	
	/**
	 * jQuery mobile initializer handler 
	 * 
	 * @param {Object} e
	 */
	onMobileInit : function(e) {
		
		// We'll manage our own workflow and don't want to jQuery Mobile
		// start doing things instantly when the script is loaded
		mobilize.log("Disabling autoInitialize, was:" + $.mobile.autoInitialize);
		$.mobile.autoInitialize = false;
		$.mobile.ajaxEnabled = false;
	}
};

if(typeof(exports) !== "undefined")
	exports.mobilize = mobilize;

})(jQuery);

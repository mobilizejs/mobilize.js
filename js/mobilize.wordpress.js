/**
 * Wordpress CMS mobilization using mobilization.js.
 * <p>
 * This functionality is retrofitted to core <i>mobilize</i> class.
 * <p>
 * @namespace Wordpress mobilization
 * <p>
 * @extends mobilize
 */
var mobilizeWordpress = {
	
	/**
	 * Wordpress specific default options setter.
	 * <p>
	 * This sets default download locations for files using
	 * minified bundles and CDN URI layout. Override
	 * this in init() call if you want to do something else.
	 * <p>
	 * @see mobilize.init
	 * 
	 */
	initPlugins : function() {			   
	
	   mobilize.extend(mobilize.cdnOptions, {
		   bundleName : "mobilize.wordpress",
		   cssBundles : ["css/mobilize.wordpress.mobile.min.css"],
		   javascriptBundles : ["js/mobilize.wordpress.mobile.min.js"],
		   template : "templates/wordpress.html"
	   });
	   
	},
	
	constructBody : function() {
		
		mobilize.log("Wordpress constructBody()");
				
		if($("body").hasClass("single-post")) {
			// Post type page
			this.constructPostPage();
		} else {
			// Front page
			this.constructFrontPage();
		}
		this.constructHeader();
		this.constructFooter();
		
	},
	
	constructHeader : function() {
        // Set page heading from <title> tag
		
		var header;
        header = $("#mobile-body div[data-role=header]");
		
        var title = $("head title").text();
        header.append("<h1>" + title + "</h1>");	
		
		mobilize.constructBackButton(header);
	},
	
	constructFooter : function() {
	    //$("#mobile-body div[data-role=footer]").append($("#site-info"));     	
		
		// Put site slogan to footer 
		$("#mobile-body div[data-role=footer]").append($("#site-description"));         
	},

    /**
     * Create back button
     * 
     * Point to Home if not already there
     */	
	constructBackButton : function(header) {
		
		if (!$("body").hasClass("home")) {
			header.prepend("<a data-icon=home href='/'>Home</a>");
		}
	},
	
	constructPostPage : function(){
		
		// Add back button to header
		// The header is defined in to template.html(core.html)
		var header;
		header = $("#mobile-body div[data-role=header]");
								
		var content = $("#mobile-body div[data-role=content]");
		var entry_content = $(".entry-content");
		content.append(entry_content);
		
		// Add comment area which can be hidden.
		
		// jQuery element which controls the collapsiple section
		var collapsible = $('<div id="comment-collapsible" data-role="collapsible" data-collapsed="true">');
		collapsible.appendTo(content);
				
		var header = $('<h3>');
		// TODO: Get from page for localization
		header.text("Comments");
		header.appendTo(collapsible);
		
		var comments = $("<p>");
		comments.append($("#comments"));
		comments.appendTo(collapsible);
		
	},
	
	/**
	 * This is a nasty one
	 */
	constructFrontPage : function() {
	
		var baseurl = mobilize.baseurl(window.location.href);
	    
		// Move box on the left hand to body first
		var content = $("#mobile-body div[data-role=content]");
		if(content.size() == 0) {
			throw "No template content section to fill in";
		}
		
		content.append($("#current"));
		
		var entries = $(".post");
		function outputter(list, input, a) {
			
			var output = $("<li role='option'>");
			var title = input.find(".entry-title");
			
			// Add mobilize=true to get the new page show mobile version
			// This is mainly for testing on pc
			var href = title.find("a").attr("href");
			if(href) {
				if(href.indexOf("http://") != 0) {
					title.find("a").attr("href", href + "?mobilize=true");
				}
			}
			
			var text = title.text();
			title = $("<div class='ui-btn-text'>")
			var tmp = $("<h3 class='ui-li-heading'>")
			tmp.text(text);
			
			var date = input.find(".entry-date").text();
			var info = $('<p class="ui-li-aside">');
			info.text(date);
			tmp.append(info);
			
			title.append(tmp);
			output.append(title);
			
			var entry_content = input.find(".entry-content");
			output.append(entry_content);
			
			output.appendTo(list);
		}
		
		var mainNavigation = mobilize.createNavigationBox(entries, "Recent headlines", outputter);
		content.append(mainNavigation);		
	},
	
	/**
	 * This is called when jQuery Mobile internal transform is done.
	 * 
	 * We can start binding jQuery Mobile UI elements
	 * @param {Object} event
	 * @param {Object} data
	 */
	 bindEventHandlers : function(event, data) {
	 	
		// XXX: Something is wrong with $ shortcut in this point
		// jQuery() event bindings work, but not when using $
		
		mobilize.log("Installing Wordpress event handlers");
	    var collapsible = jQuery("#comment-collapsible");

		mobilize.log("Found collapsible:" + collapsible.size());
		collapsible.bind("expand", mobilize.onCommentsOpen);	    
     },
	
	/**
	 * Special handler which will move focus to comments when comment button is pressed
	 */
	onCommentsOpen : function(event, data) {

	   	mobilize.log("comments open");
        
		var x = 0;
		var y = event.target.offsetTop;
		window.scrollTo(x, y);
        console.log(event);
	}
};

mobilize.extend(mobilize, mobilizeWordpress);


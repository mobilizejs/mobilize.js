/**
 * This is an example how to override bits of of Wordpress mobile UI using mobilize.js.
 * <p>
 * This example is in real-world usage in http://mobilizejs.com
 * 
 */

/**
 * Add our own overlay layer for Wordpress mobile UI constructions by
 * overriding some functions in mobilize namespace.
 * <p>
 * These functions are originally defined in mobilize.wordpress.js
 * 
 */
mobilize.extend(mobilize, {
    
    constructHeader: function () {
        // Override header title with a custom shorter title,
		// don't use <title> tag from website
        var header;
        header = $("#mobile-body div[data-role=header]");
        header.append("<h1>mobilize.js</h1>");
        mobilize.constructBackButton(header);
    },

    /**
     * Include Go to web site and Contact us buttons in the footer.
     */	
    constructFooter: function () {
        
		var footer = $("#mobile-body div[data-role=footer]");
		
		// Put site slogan to footer 		 
        footer.append($("#site-description"));

        footer.append('<p><a data-icon="twitter" data-role="button" href="http://twitter.com/mobilizejs">Follow in Twitter</a></p>');        

    },
	
	
	/**
	 * <p>
	 * Create about splash box at the top of the front page
	 * </p>
	 */
	constructAboutBox : function(content) {
		content.append("<img class='mobilize-no-resize' src='http://mobilizejs.com/wp-content/themes/love-the-orange/images/logo_60.png' />");
	},

    /**
     * Mobilize Wordpress front page.
     * <p>
     * Create recent blog post navigation and pages navigation.
     * <p>
     * As a custom feature, add about box and our logo.
     * <p>
     * 
     */
    constructFrontPage: function (content) {

        // Create About splash
		this.constructAboutBox(content);
		
        // Recent headlines       
        var headlines = this.constructBlogRollNavigation("Recent headlines");
        // Add some space between about and headlines
		headlines.css("margin-top", "15px");
		content.append(headlines);        
		
        // Then pages navigation
        var pages = this.consructPageNavigation("Pages");
        content.append(pages);
		
    }
	
});                 

 
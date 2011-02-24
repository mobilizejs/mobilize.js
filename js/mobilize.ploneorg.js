/**
 * plone.org site specific mobilization.
 *
 */


(function( jq, undefined ) {

var mobilizePloneOrg = {
	
	constructBody : function() {
		
		// Move body to jQuery template
		//if(window.location.pathname == "/") {
		//}
		
		this.constructFrontPage();
		
		this.constructHeader();
		this.constructFooter();
	},
	
	constructHeader : function() {
        // Set page heading from <title> tag
        var title = jq("head title").text();
        jq("#mobile-body div[data-role=header]").append("<h1>" + title + "</h1>");		
	},
	
	constructFooter : function() {
	    jq("#mobile-body div[data-role=footer]").append(jq("#footer p"));     	
	},
	
	
	/**
	 * This is a nasty one
	 */
	constructFrontPage : function() {
	
		
		// Move box on the left hand to body first
		var content = jq("#mobile-body div[data-role=content]");
		if(content.size() == 0) {
			throw "No template content section to fill in";
		}
		
		content.append(jq("#current"));
		
		var mainNavigation = mobilize.createNavigationBox(jq("#main-nav a"), "Site sections");
		content.append(mainNavigation);
		
		var news = mobilize.createNavigationBox(jq("#news li").not(":contains('Add news')"), "News", mobilize.outputCollectionLink);
		content.append(news);
		
		var events = mobilize.createNavigationBox(jq("#events li").not(":contains('Add event')"), "Events", mobilize.outputCollectionLink);
        content.append(events);
		       	
	}
};

jq.extend(mobilize, mobilizePloneOrg);

})(jQuery);


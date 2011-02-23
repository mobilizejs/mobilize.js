/**
 * plone.org site specific mobilization.
 *
 */

(function( $, undefined ) {

var mobilizeWordpress = {
	
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
        var title = $("head title").text();
        $("#mobile-body div[data-role=header]").append("<h1>" + title + "</h1>");		
	},
	
	constructFooter : function() {
	    $("#mobile-body div[data-role=footer]").append($("#footer p"));     	
	},
	
	/**
	 * This is a nasty one
	 */
	constructFrontPage : function() {
	
		
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
			var text = title.text();
			title = $("<div class='ui-btn-text'>")
			var tmp = $("<h3 class='ui-li-heading'>")
			tmp.text(text);
			title.append(tmp);
			output.append(title);
			output.append(a).appendTo(list);
		}
		
		var mainNavigation = mobilize.createNavigationBox(entries, "Posts", outputter);
		content.append(mainNavigation);
		
		/*
		var news = mobilize.createNavigationBox($("#news li").not(":contains('Add news')"), "News", mobilize.outputCollectionLink);
		content.append(news);
		
		var events = mobilize.createNavigationBox($("#events li").not(":contains('Add event')"), "Events", mobilize.outputCollectionLink);
        content.append(events);
		*/     	
	},

	/**
	 * createNavigationBox() helper function to turn Plone news / event content 
	 * to sane jQuery Mobile mark up
	 */
	outputCollectionLink : function(list, input, a) {
	    
	    var output = $("<li>"); 
	    
	    var heading = $("<h3>");
	    a.appendTo(heading);
	    heading.appendTo(output);
	    
	    var info = $('<p class="ui-li-aside">');
	    $(input).find(".info").appendTo(info);
	    info.appendTo(output);
		
		list.append(output);
	}
};

$.extend(mobilize, mobilizeWordpress);

})(jQuery);

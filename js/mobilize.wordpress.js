/**
 * plone.org site specific mobilization.
 *
 */

(function( $, undefined ) {

var mobilizeWordpress = {
	
	getExtendedOptions : function() {			   
	   return {};
	},
	
	constructBody : function() {
		
		// Need to hack this to not show the link as blue.
		// Set by wordpress style
		var str= "a.ui-btn-left:link{color : white;}";
		var head= $('head');
		var style= $('<style>');
		
		style.attr("type", "text/css");
		style.text(str);
		head.append(style);
		
		// Move body to jQuery template
		//if(window.location.pathname == "/") {
		//}
		if($("body").hasClass("single-post")) {
			this.constructPostPage();
		}
		else {
			this.constructFrontPage();
		}
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
	
	constructPostPage : function(){
		
		// Add back button to header
		// The header is defined in to template.html(core.html)
		var backbtn;
		var header;
		header = $("#mobile-body div[data-role=header]");
		
		backbtn = $('<a class="ui-btn-left ui-btn ui-btn-icon-left ui-btn-corner-all ui-shadow ui-btn-up-a" data-icon="arrow-l" data-rel="back" href="#">');
		backbtn.appendTo(header);
		
		var backbtn_content = $('<span class="ui-btn-inner ui-btn-corner-all">');
		backbtn_content.appendTo(backbtn);
		
		var label = $('<span class="ui-btn-text">');
		label.text("Back")
		label.appendTo(backbtn_content);
		var icon  = $('<span class="ui-icon ui-icon-arrow-l ui-icon-shadow">');
		icon.appendTo(backbtn_content);
		
		
		var content = $("#mobile-body div[data-role=content]");
		var entry_content = $(".entry-content");
		content.append(entry_content);
		
		// Add comment area which can be hidden.
		
		var collapsible = $('<div data-role="collapsible" data-collapsed="true">');
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
		
		var mainNavigation = mobilize.createNavigationBox(entries, "Posts", outputter);
		content.append(mainNavigation);		
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

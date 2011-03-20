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
    initPlugins: function () {
		
		mobilize.extend(mobilize.options, {
			 reloadOnMobile : true // Assume we have some sort of server-side support running on Wordpress
		});

        mobilize.extend(mobilize.cdnOptions, {
            bundleName: "mobilize.wordpress",
            cssBundles: ["css/mobilize.wordpress.mobile.min.css"],
            javascriptBundles: ["js/mobilize.wordpress.mobile.min.js"],
            template: "templates/wordpress.html"
        });
		
    },

    /**
     * Construct mobile page body according different Wordpress template formats.
     */
    constructBody: function () {

        mobilize.log("Wordpress constructBody()");
						
        var body = $(document.body);

        // Get the content element
		// If we don't get it here it means that template injection is not done yet
        var content = $("#mobile-body div[data-role=content]");
        if (content.size() === 0) {
            throw "No template content section to fill in";
        }
		
        if (body.hasClass("single-post")) {
            // Post type page
            this.constructPost(content);
        } else if(body.hasClass('page')) {
            this.constructPage(content);			
        } else if(body.hasClass('home')){
            // Assume front page
            this.constructFrontPage(content);
		} else if(body.hasClass("archive")) {
			this.constructArchive(content);
        } else {
			throw "Unknown Wordpress page class:" + body.attr("class");
		}
		
		// These elements are shared between different page types
        this.constructHeader();
        this.constructFooter();

    },

    /**
     * Create jQuery Mobile header with buttons
     */
    constructHeader: function () {
        // Set page heading from <title> tag
        var header;
        header = $("#mobile-body div[data-role=header]");

        var title = $("head title").text();
        header.append("<h1>" + title + "</h1>");

        mobilize.constructBackButton(header);
    },

    /**
     * Create jQuery Mobile footer
     */
    constructFooter: function () {
        //$("#mobile-body div[data-role=footer]").append($("#site-info"));         
        // Put site slogan to footer 
        $("#mobile-body div[data-role=footer]").append($("#site-description"));
    },

    /**
     * Create back button
     * 
     * Point to Home if not already there
     */
    constructBackButton: function (header) {

        if (!$("body").hasClass("home")) {
            header.prepend("<a data-icon=home href='/'>Home</a>");
        }
    },
	

    /**
     * Transform Wordpress info page to a mobiel format.
     * <p>
     * Simply copy over all content HTML.
     * <p>
     * @param content: Target content element
     * 
     */
    constructPage : function (content) {
        var entry_content = $(".entry-content");
        content.append(entry_content);		
	},

    /**
     * Transform wordpress blog post page
     * <p>
     * @param content: Target content element
     */
    constructPost: function (content) {

        // Copy post content
        var postBody = $(".post");
		
		if(postBody.size() == 0) {
			throw new "Did not understand post page mark-up";
		}
		
		content.append(postBody);

        // The header is defined in to template.html(core.html)
        var header;
        header = $('<h3>');

        //header = $("#mobile-body div[data-role=header]");
		
        // Add comment area which can be hidden.
        // jQuery element which controls the collapsiple section
        var collapsible = $('<div id="comment-collapsible" data-role="collapsible" data-collapsed="true">');
        collapsible.appendTo(content);

        // TODO: Get from page for localization
        header.text("Comments");
        header.appendTo(collapsible);

        var comments = $("<p>");
        comments.append($("#comments"));
        comments.appendTo(collapsible);

    },
	
	/**
	 * Create a title + description link list for posts.
	 * <p>
	 * Do not show post bodies as they might take little too much
	 * space on mobile devices.
	 * <p>
	 * We are not using inset lists here, as we want to maximize
	 * available horizontal space for headlines.
	 * <p>
	 * @param content  jQuery element which will receive the navigation
	 * 
	 * @param title: Blog roll box title
	 */
	constructBlogRollNavigation : function(title) {
       
		var list = $("<ul class='blogroll' data-role='listview'>");
        
		list.prepend("<li data-role='list-divider'>" + title + "</li>");
		
		// Iterate through every visible post on the page 
		// and add its title + link to the navigation box
		$(".post").each(function() {
			
			var input = $(this);
			
            var output = $("<li role='option'>");
			
			var heading = input.find(".entry-title");
			var link = heading.find("a");
			var href = link.attr("href");
			// XXX: call mobilize.rewriteLink for link here
            
            var text = heading.text();
			
            var newHeading = $("<h3 class='ui-li-heading'>");
            newHeading.text(text);

            button = $("<div>");
						
            var date = input.find(".entry-date").text();
            var info = $('<p class="ui-li-desc">');
            info.text(date);
            button.append(newHeading);
            button.append(info);
			
			
			link = $("<a href='" + href + "'></a>");
            link.append(button);
            output.append(link);
			

            // XXX: Include excerpt here? 		
            //var entry_content = input.find(".entry-content");
            //output.append(entry_content);

            output.appendTo(list);
        
		});
        
	   return list;	
	},
	
	/**
	 * Transform the top horizontal navigation (pages links) to a mobile navigation box.
	 * <p>
	 * @return jQuery model for the navigation box 
	 */
	consructPageNavigation : function(title) {
		
        // Pages
        var menu = $(".menu");
        var items = menu.find("li");
        list = $("<ul class='page-list' data-role='listview'>");
        list.prepend("<li data-role='list-divider'>" + title + "</li>"); // TODO: Localization
        items.each(function () {
            var output = $("<li role='option'>");
            output.append($(this).find("a"));
            output.appendTo(list);
        });
        return list;
	},

    /**
     * Mobilize Wordpress front page.
     * <p>
     * Create recent blog post navigation and pages navigation.
     * <p>
     * 
     */
    constructFrontPage: function (content) {
		// First Recent headlines		
		var headlines = this.constructBlogRollNavigation("Recent headlines");
        content.append(headlines);
		
        // Then pages navigation
        var pages = this.consructPageNavigation("Pages");
		content.append(pages);
    },
	
	
	/**
	 * Mobile version of tags, archive, search, etc. listing pages.
	 * 
	 */
	constructArchive : function(content) {		
		var title = $(".page-title").text();
        // First Recent headlines       
        var headlines = this.constructBlogRollNavigation(title);
        content.append(headlines);	
    },

    /**
     * This is called by mobilize.js when jQuery Mobile internal transform is done.
     * <p>
     * We can start binding jQuery Mobile UI elements
     * <p>
     * @param {Object} event
     * @param {Object} data
     */
    bindEventHandlers: function (event, data) {

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
    onCommentsOpen: function (event, data) {
        mobilize.log("comments open");
        var x = 0;
        var y = event.target.offsetTop;
        window.scrollTo(x, y);
        mobilize.log(event);
    }
};

mobilize.extend(mobilize, mobilizeWordpress);


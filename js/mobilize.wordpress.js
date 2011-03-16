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
		
		// Assume the first <link> in <head> points to the theme CSS
		mobilize.log("Mobilizing Wordpress theme:" + $("head link[type=text/css]:first").attr("href"));

        var body = $(document.body);
		
        if (body.hasClass("single-post")) {
            // Post type page
            this.constructPost();
        } else if(body.hasClass('page')) {
            this.constructPage();			
        } else if(body.hasClass('home')){
            // Assume front page
            this.constructFrontPage();
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
     * Transform Wordpress info page
     */
    constructPage : function () {
        var content = $("#mobile-body div[data-role=content]");
        var entry_content = $(".entry-content");
        content.append(entry_content);		
	},

    /**
     * Transform wordpress blog post page
     */
    constructPost: function () {

        // The header is defined in to template.html(core.html)
        var header;
        //header = $("#mobile-body div[data-role=header]");

        var content = $("#mobile-body div[data-role=content]");
        var entry_content = $(".entry-content");
        content.append(entry_content);

        // Add comment area which can be hidden.
        // jQuery element which controls the collapsiple section
        var collapsible = $('<div id="comment-collapsible" data-role="collapsible" data-collapsed="true">');
        collapsible.appendTo(content);

        header = $('<h3>');
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
    constructFrontPage: function () {

        var baseurl = mobilize.baseurl(window.location.href);

        // Move box on the left hand to body first
        var content = $("#mobile-body div[data-role=content]");
        if (content.size() === 0) {
            throw "No template content section to fill in";
        }

        content.append($("#current"));

        var entries = $(".post");

        function outputter(list, input, a) {

            var output = $("<li role='option'>");
            var title = input.find(".entry-title");

            var text = title.text();
            var tmp = $("<h3 class='ui-li-heading'>");

            var link = title.find("a");
            if (link) {
                var href = link.attr("href");
                // Add mobilize=true to get the new page show mobile version
                // This is mainly for testing on pc as the mobile detection 
                // should handle this automatically when the page is loaded.
                if (href && mobilize.getUrlVars().mobilize !== undefined) {
                    if (href.indexOf("http://") >= 0) {
                        var newurl = mobilize.addUrlVar(href, "mobilize=" + mobilize.getUrlVars().mobilize);
                        link.attr("href", newurl);
                    }
                }
                link.text(text);
                tmp.append(link);
            }
            title = $("<div class='ui-btn-text'>");

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

        // Pages
        var menu = $(".menu");
        var items = menu.find("li");
        list = $("<ul data-inset='true' data-role='listview'>");
        list.prepend("<li data-role='list-divider'>Pages</li>"); // TODO: Localization
        items.each(function () {
            var output = $("<li role='option'>");
            output.append($(this).find("a"));
            output.appendTo(list);
        });
        content.append(list);

    },

    /**
     * This is called when jQuery Mobile internal transform is done.
     * 
     * We can start binding jQuery Mobile UI elements
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
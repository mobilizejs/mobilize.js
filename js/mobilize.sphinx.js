/**
 * Sphinx mobilization using mobilization.js.
 * <p>
 * This functionality is retrofitted to core <i>mobilize</i> class.
 * <p>
 * @namespace Sphinx mobilization
 * <p>
 * @extends mobilize
 */
var mobilizeSphinx= {
    
    /**
     * Sphinx specific default options setter.
     * <p>
     * This sets default download locations for files using
     * minified bundles and CDN URI layout. Override
     * this in init() call if you want to do something else.
     * <p>
     * @see mobilize.init
     * 
     */
    initPlugins : function() {             
    
	   mobilize.log("Setting up Sphinx extender");
       mobilize.extend(mobilize.cdnOptions, {
           bundleName : "mobilize.sphinx",
           cssBundles : ["css/mobilize.sphinx.mobile.min.css"],
           javascriptBundles : ["js/mobilize.sphinx.mobile.min.js"],
           template : "templates/sphinx.html"
       });
       
    },
    
    constructBody : function() {
        
        mobilize.log("Sphinx constructBody()");
                
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
         
        var title = $("h2.heading").find("span").text();
        header.append("<h1>" + title + "</h1>");
        
        mobilize.constructBackButton(header);
    },
    
    constructFooter : function() {
        // Put site slogan to footer 
        $("#mobile-body div[data-role=footer]").append($(".footer"));         
    },

    /**
     * Create back button
     * 
     * Point to Home if not already there
     */ 
    constructBackButton : function(header) {
        
        if(window.location.href.indexOf("/index.html") < 0) {
            header.prepend("<a data-icon=back href='/'>Back</a>");
        }
    },
     
    /**
     * This is a nasty one
     */
    constructFrontPage : function() {
    
        var baseurl = mobilize.baseurl(window.location.href);
        
        // Move box on the left hand to body first
        var content = $("#mobile-body div[data-role=content]");
        if(content.size() === 0) 
        {
            throw "No template content section to fill in";
        }
        content.append($(".content"));
		
        /*
        var newcontent = $("<div>");
        
        var c = $(".section");
        c.find(".toctree-l1").each(function(){
            var newh = $('<div data-role="collapsible" data-collapsed="true">');
            //var ul = $("<ul>");
            //ul.append($(this));
            
            var header = this.firstChild.innerText;
            var content = $("<p>");
            content.append(this);
            
            newh.append("<h3>" + header + "</h3>");
            newh.append(content);
            
            newcontent.append(newh);
        });
        
        content.append(newcontent);
        */
         
    },
    
    /**
     * This is called when jQuery Mobile internal transform is done.
     * 
     * We can start binding jQuery Mobile UI elements
     * @param {Object} event
     * @param {Object} data
     */
     bindEventHandlers : function(event, data) {
         
     }
     
};

mobilize.extend(mobilize, mobilizeSphinx);


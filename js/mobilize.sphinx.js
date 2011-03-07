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

        // Cache the content area selector
        this.content = $("#mobile-body div[data-role=content]");
        if (this.content.size() === 0) {
            throw "No template content section to fill in";
        }

        this.cleanBacklinks();                				

        this.constructHeader();
        this.constructText();
		this.constructContents();

        this.constructFooter();
		
		// Just remove this for now
		$("#indices-and-tables").remove();
        
    },
	
	/**
	 * Create jQuery Mobile navigation out of TOC
	 */
	constructContents : function() {
		// <li class="toctree-l1"><a href="installation.html" class="reference internal ui-link">Installation</a></li>
		var toc = this.createNavigationBox($(".toctree-l1 > a"), "Contents");
		
		// Replace the existing TOC with pimped version
		var oldTOC = $(".toctree-wrapper");
		
		// Delete <p>Contents:</p>
		oldTOC.prev().remove();
		// this.content.append(toc);
		
		var parent = oldTOC.parent();
		
		parent.after(oldTOC, toc);
		
		oldTOC.remove();
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
     * Move Sphinx main text to the mobile template.
     */
    constructText : function() {
    
        // Move box on the left hand to body first
        this.content.append($(".content"));
		         
    },
    
    /**
     * This is called when jQuery Mobile internal transform is done.
     * 
     * We can start binding jQuery Mobile UI elements
     * @param {Object} event
     * @param {Object} data
     */
     bindEventHandlers : function(event, data) {
         
     },
	 
	 /**
	  * Remove Sphinx permalinks and bacl to TOC links 
	  * 
	  * a title="Permalink to this headline" href="#welcome-to-mobilize-js-s-documentation" class="headerlink"
	  */
	 cleanBacklinks : function() {
	 	$("a.headerlink").remove();
	 }
     
};

mobilize.extend(mobilize, mobilizeSphinx);


/**
 * <h1>Mobitube.js</h1>
 * <p>
 * Mobilize YouTube and other videos found on HTML page.
 * <p>
 * This script is designed to scan HTML content for desktop video embeds (iframe, flash)
 * and convert them to mobile versions.
 * <p>
 * Target is to support all popular video services.
 * <p>
 * @author Mikko Ohtamaa 
 * 
 */

function mobitube($) {

	module = {
			
		options : {
		
		  youTubeTemplate : '<div class="mobile-youtube"> <a class="image-link" href="http://m.youtube.com/watch?v=VIDEOID"><img src="http://i.ytimg.com/vi/VIDEOID/default.jpg" > </a> <p><a href="http://m.youtube.com/watch?v=VIDEOID" class="text-link">LABEL</a></p></div>', 
	
    	  youTubeLabel : "Watch on YouTube",
		
		},
					
		/**
		 * Process selected HTML content and convert all video embeds there to mobile versions.
		 * <p>
		 * @param {Object} content: jQuery selection of th 
		 */
		process : function(content) {
		   	this.processYouTubeIFrames(content);			
			this.cleanSignatures(content);
		},

        processYouTubeIFrame : function(frame) {
			var url = frame.attr("src");
			if(!url || url.length == 0) return; 
			
			var parts = url.split("/");
			var videoId = parts[parts.length-1];
			
			console.log("Detected YouTube video id:"+ videoId);
			
			var html = this.options.youTubeTemplate.replace(/VIDEOID/g, videoId);
			html = html.replace(/LABEL/g, this.options.youTubeLabel);
			
			console.log("Constructing YouTube emded:" + html);
			
			var node = $(html);
			
			console.log("Got:" + node.size());		
			
			frame.after(node);
			frame.remove();
		},
		
		processYouTubeIFrames : function(selection) {
		   
		   var iframes = selection.find("iframe");
		   
		   var self = this;
		   
		   iframes.each(function() {
		       var frame = $(this);
			   var src = frame.attr("src");
			   if(src && src.indexOf("youtube.com") >= 0) {
			   	  self.processYouTubeIFrame(frame);
			   }
		   });
		},
		
		/**
		 * Clean various plug-in advertisements from mobile pages.
		 * 
		 * @param {Object} selection
		 */
		cleanSignatures : function(selection) {
			
            // YouTube IFrame for Wordpress			
			var a = selection.find("a[href='http://www.clickonf5.org/']");
			a.parent().remove();
		}
		
	};

    return module;
}


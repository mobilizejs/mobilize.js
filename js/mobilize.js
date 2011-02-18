/**
 * Pure Javascript mobilization solution
 * 
 * @copyright 2011 Mikko Ohtamaa
 * 
 */


var jq = jQuery;

/**
 * Create a Mobilizer
 * 
 * @param options Mobilizer extra fine tuning options as a JS object
 * 
 * @constructor
 */
function Mobilizer() {
	this.init();
}

/**
 * Instiate Mobilizer class in inheritance safe manner.
 */
Mobilizer.prototype.init = function(options) {

	if(!jq) {
		throw "jQuery needed in order to run mobilize.js";
	}
	
	// Default options
	this.options = {
			cacheTemplate : false,
			
			// String tags which mark <head> JS and CSS resources not to be purged
			resourceWhitelist : [],
			
			// Which template file to use - relative file or URL
			template : "template.html"
	};
	
	// Override default parameters with user supplied versions
	
	if(!options) {
		options = {};
	}
	
	jq.extend(this.options, options);

	if(console.log) {
		this.log = console.log();
	} else {
		this.log = function(x) {};
	}	
}

/**
 * Make a function call and report possible exceptions back to a centralized server.
 * 
 * We use this to track problems with possible not-so-well-implemented mobile browsers.
 */
Mobilizer.prototype.callSafe = function(func) {
	try {
		func();
	} catch(e) {
		// 
	}
}
	
/**
 * Enable mobile mode if mobile browser is detectd.
 */
Mobilizer.prototype.bootstrap = function() {
	
	if(this.isMobile()) {
		this.enableMobileRendering();
	}
}
	
/**
 * Detect a mobile browser.
 * 
 * @returns True if the page should be rendered in mobile mode
 */
Mobilizer.prototype.isMobile = function() {
	return true;
}


/**
 * 
 * Stop loading all web page resources until mobile template is properly placed
 * and template transformation has taken place.
 * 
 */
Mobilizer.prototype.enableMobileRendering = function() {
	
	this.suspendLoading();
	
	this.cleanHead();
	
	// We cannot directly load template, since <body> has not been constructed
	var self = this;
	jq(document).ready(function() { self.loadMobileTemplate() } );
}

/**
 * Stop loading Javascripts and CSS we do not need in mobile mode.
 */
Mobilizer.prototype.cleanHead = function() {
}

Mobilizer.prototype.suspendLoading = function() {
	var body = jq("body");
	if(body.size() == 0) {
		// DOM tree loading, couldn't get hang off it
		throw "Could not find body while loading?";
	}
	
	body.hide();
	
}

/**
 * Start loading mobile template to DOM tree.
 * 
 * Check possible mobile template cache places.
 */
Mobilizer.prototype.loadMobileTemplate = function () {
	
	var self = this;
	
	jq("body").append("<div id='mobile-template-holder'></div>");
	
	jq("#mobile-template-holder").load(this.options.template, function() {
		self.transform();
	});
}

/**
 * Put mobile template to DOM tree
 */
Mobilizer.prototype.prepareMobileTemplate = function() {
	
}

/**
 * Get rid of mobile template
 */
Mobilizer.prototype.closeMobileTemplate = function() {
}

/**
 * Move content from the orignal web page to mobile template by the user rules.
 */
Mobilizer.prototype.transform = function() {

	this.constructHead();
	this.constructBody();
	
	this.finish();
}

/**
 * Create <head> section of a mobile rendered version.
 * 
 * The default transform is just to copy everything
 * in #mobile-head from template to <head> of the page.
 */
Mobilizer.prototype.constructHead = function() {	
	jq("head").append(jq("#mobile-head").children());

	// Make events to be fired when each CSS/Javascript has been loadeds
}


/**
 * Create <body> section of a mobile rendered version.
 * 
 * This transformation is always CMS specific 
 * and your subclass must override this function.
 */
Mobilizer.prototype.constructBody = function() {	
	
}

/**
 * Make the transformed mobile template body visible and remove the other body data.
 */
Mobilizer.prototype.swapBody = function() {	
	var mobileBody = jq("#mobile-body").detach();
	jq("body").empty();
	jq("body").append(mobileBody.children());
}


/**
 * Mobile transformation is done. Show mobile site to the user.
 */
Mobilizer.prototype.finish = function() {
	this.swapBody();
	jq("body").show();
}
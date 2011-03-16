/**
 * This is a debug script for Wordpress integration.
 * 
 * It sets parameters to be loaded from localhost:8080, no compress or merge
 */

// Setup mobilize.js to load files from local development server
function setupMobilizeForWordpressDevelopment(){

	mobilize.init({
		// Make the page load as mobile always
		forceMobilize: undefined // true: always mobile  
	}, {
		// Additional CDN options here
		cloud: false, // Disable automatic JS + CSS resolving
		// Don't do cloud error reporting
		// (it would useful for production deployment only)
		errorReportingURL: false,
		
		baseURL: "http://localhost:8080", // Test server
		// Load JS files locally
		javascriptBundles: ["js/jquery.js", "js/mobilize.onjq.js", "js/jquery.mobile.js"],
		
		// Load CSS files locally
		cssBundles: ["css/jquery.mobile.css", "css/wordpress.css"],
		
		template: "../templates/wordpress.html"
	});
	
	// Since we are not in auto-run mode,
	// we start doing the stuff after we have set-up
	// our options for development correctly
	mobilize.bootstrap();
	
}

setupMobilizeForWordpressDevelopment();

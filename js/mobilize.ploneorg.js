/**
 * plone.org site specific mobilization.
 *
 */

function PloneOrgMobilizer() {
}

PloneOrgMobilizer.prototype.constructBody = function() {
	
	// Move body to jQuery template
	if(window.location.pathname == "/") {
		this.constructFrontPage();
	}
}

/**
 * This is a nasty one
 */
PloneOrgMobilizer.prototype.constructFrontPage = function() {
	
	// Move box on the left hand to body first
	jq("#mobile-body").append(jq("div[data-role=content]"));
	
}

jq.extend(PloneOrgMobilizer.prototype, PloneMobilizer.prototype);


/** Tests for detectmobilebrowser.js
 */
var assert = require('assert');
var jsdom  = require('jsdom').jsdom

global.window = jsdom().createWindow();
global.jQuery = require("jquery");


var mobilize = require("../js/mobilize.js").mobilize;

function testDetect(expect, name) {
	var detected;
	detected = mobilize.isMobileBrowser({name : name});
	assert.equal(expect, detected, name);
}

var browserAgent = "Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.597.98 Safari/534.13";

testDetect(false, browserAgent);
testDetect(true, "symbian");
testDetect(true, "android");

// Test forcing
detected = mobilize.isMobileBrowser({name : "symbian", force : false});
assert.equal(false, detected);

detected = mobilize.isMobileBrowser({name : browserAgent, force : true});
assert.equal(true, detected);

console.log("test_detectmobilebrowser.js passed");

/** Tests for detectmobilebrowser.js
 */
var assert = require('assert');
var detect = require("../js/detectmobilebrowser");

function testDetect(expect, name) {
	var detected;
	detected = detect.isMobileBrowser(name);
	assert.equal(expect, detected, name);
}

testDetect(false, "Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.597.98 Safari/534.13");
testDetect(true, "symbian");
testDetect(true, "android");

console.log("test_detectmobilebrowser.js passed");

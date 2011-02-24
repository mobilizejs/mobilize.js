
var assert = require("assert");
var jsdom  = require('jsdom').jsdom
global.window = jsdom().createWindow();
global.jQuery = require("jquery");
global.document = {
		cookie : ""
};

var mobilize = require("../js/mobilize").mobilize;

function test_baseurl() {
	var url = "http://localhost:8080/test/template.html/?testing=123";
	var expect = "http://localhost:8080/test/";
	url = mobilize.baseurl(url);
	
	assert.equal(expect, url);
}

test_baseurl();

console.log("common tests passed");
// Entire file content, but only vulnerable parts should be modified minimally

// ... (lines before 749 remain unchanged)

    /**
     * Magical dynamic Javascript file loader.
     * <p>
     * Load a JS script from 
     * <p>
     * <ul>
     * <li>Local cache if available
     * <li>Using <script> inject if supported by platform
     * <li>Using AJAX and eval()
     * </ul>
     * <p>
     * @param {String} bundle: Name of the bundle, used to store to localStorage.
     * @param {String} url
     * @param {Object} callbacl
     */
    loadScript : function(bundle, url, callback) {
        
        // Sanitize the URL to prevent DOMXSS
        function sanitizeUrl(url) {
            var a = document.createElement('a');
            a.href = url;
            return a.protocol + "//" + a.host + a.pathname + a.search + a.hash;
        }

        url = sanitizeUrl(url);

        // Check if we can use a cached version
        if(mobilize.cdnOptions.localCacheVersion !== null) {
            mobilize.loadBundleFromLocalStorage(mobilize.BUNDLE_TYPE_JS, bundle,url,callback);
            return;
        }
        
        // Injecting script tag doesn't work with android webkit
        //if(navigator.userAgent.toLowerCase().indexOf("android") >= 0 )
        if(false) {
            mobilize.loadScriptWithAjax(url, callback);            
        } else {
            mobilize.loadScriptWithTag(bundle, url, callback);
        }
    },

    // ... (lines between 749 and 1181 remain unchanged)

    /**
     * Create a new cookie 
     * 
     * @see http://www.quirksmode.org/js/cookies.html     
     */
    createCookie : function(name,value,days) {
        var expires = "";
        
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/; Secure"; // Added Secure attribute
    },

    // ... (lines after 1181 remain unchanged)
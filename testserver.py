#!/usr/bin/python
"""
    
    Test web server for mobilize.js

"""

import os
import SimpleHTTPServer
import SocketServer
import urllib
import Cookie

PORT = 8080

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    base = SimpleHTTPServer.SimpleHTTPRequestHandler
    
    def send_head(self):
        """Common code for GET and HEAD commands.

        This sends the response code and MIME headers.

        Return value is either a file object (which has to be copied
        to the outputfile by the caller unless the command was HEAD,
        and must be closed by the caller under all circumstances), or
        None, in which case the caller has nothing further to do.

        """
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)
        ctype = self.guess_type(path)
        if ctype.startswith('text/'):
            mode = 'r'
        else:
            mode = 'rb'
        try:
            f = open(path, mode)
        except IOError:
            self.send_error(404, "File not found")
            return None
        self.send_response(200)
        self.send_header("Content-type", ctype)
        # Allow AJAXy from directly opened test files
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        return f
    
    def do_proxy(self):
        import urllib2
        
        url = urllib.unquote(self.path.split("url=")[-1])
        if "localhost" in url:
            i = 0
            i = url.index("://",i) + 3
            i = url.index("/", i)
            #self.path = url[i:]
            url = url.split("?")[0]
            url  = "." + url[i:]
            f = open(url);data=f.read();f.close()
        else:
            print "url", url
            resp = urllib2.urlopen(url)
            data = resp.read();
        
        if "mobilize.init" not in data:
            i = 0;
            i = data.index("head", i)
            i = data.index("body", i)
            i = data.index(">", i)
            i += 1
            
            injected = """
            
            <script type="text/javascript">
            function mobilize_init(){
                    mobilize.init({
                    forceMobilize : true,
                    haveRemoteDebugLogging : true,
                    remoteDebugLogBaseUrl : "http://localhost:8080/"
                });
                mobilize.bootstrap();
            }
            </script>
            
            <script  class="mobilize-js-source" 
                      type="text/javascript" 
                       src="http://localhost:8080/js/mobilize.wordpress.min.js"
                       onload="mobilize_init();">
            </script>
            
            """
            
            data = data[:i] + injected + data[i:]
            
        self.send_response(200)
        self.end_headers()
        
        self.wfile.write(data)
        
        return 
        
    def do_GET(self):
        #print "doGET", self.path
        #if "logo_238.png" in self.path:
        #    pass
        if "/proxy" in self.path:
            self.do_proxy()
            return
        
        if "/log?msg" in self.path:
            msg = urllib.unquote(self.path.split("msg=")[-1])
            while msg.endswith("/"):
                msg = msg[:-1]
            print msg
            self.send_response(200)
            self.end_headers()
            return
        
        if "cookie" in self.headers.dict:
            cookies = Cookie.SimpleCookie()
            cookies.load(self.headers.dict["cookie"])       
            mobilize = cookies.get("mobilize-mobile",None)
            if mobilize:
                if mobilize.value == "1":
                    print "Cookie says client is mobile"
       
        # Bundle to single file
        if "mobile" not in self.path \
        and "mobilize" in self.path \
        and "js" in self.path \
        and "min" in self.path:
            parts = self.path.split("/")
            filename = parts[-1]
            without_min = filename.replace(".min", "")
            f = open("js/mobilize.js"); data = f.read(); f.close()
            f = open("js/" + without_min); data += f.read(); f.close()
            
            ctype = self.guess_type("js/mobilize.js")
            self.send_response(200)
            self.send_header("Content-type", ctype)
            # Allow AJAXy from directly opened test files
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
                    
            #f = self.send_head()
            
            self.wfile.write(data)
            
            f.close()
            return
            
        
        return self.base.do_GET(self)

    def log_request(self,code):
        if "/log" in self.path:
            return
        return self.base.log_request(self, code)
    
    

def main():
    
    from optparse import OptionParser
    parser = OptionParser()
    parser.add_option("-p", "--port",
                      help="Server port. Default: %default",
                      default = PORT )
    (options, args) = parser.parse_args()
    
    port = int(options.port)
    
    SocketServer.TCPServer.allow_reuse_address = True
    SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map.update({
           ".png" : "image/png"
        })
    
    httpd = SocketServer.TCPServer(("", port), Handler)
    
    print "serving at port", port
    
    # This is handy if your terminal supports double clicking of the linkss
    for file in os.listdir(os.path.join(os.getcwd(), "tests")):
        if file.endswith(".html"):
            print "Open test page http://localhost:%d/tests/%s?mobilize=true" % (port, file)
    
    httpd.serve_forever()

if __name__ == "__main__":
    main()



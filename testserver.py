import SimpleHTTPServer
import SocketServer
import urllib

PORT = 8080

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
	def do_GET(self):
		#print "doGET", self.path
		if "/log" in self.path:
			print urllib.unquote(self.path.split("msg=")[-1]).replace("/","")
			return self.send_head()
			
		return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)



httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()


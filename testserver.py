import SimpleHTTPServer
import SocketServer
import urllib

PORT = 8081

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
	base = SimpleHTTPServer.SimpleHTTPRequestHandler
	def do_GET(self):
		#print "doGET", self.path
		if "/log" in self.path:
			msg = urllib.unquote(self.path.split("msg=")[-1])
			while msg.endswith("/"):
				msg = msg[:-1]
			print msg
			self.send_response(200)
			self.end_headers()
			return
		
		return self.base.do_GET(self)

	def log_request(self,code):
		if "/log" in self.path:
			return
		return self.base.log_request(self, code)

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()


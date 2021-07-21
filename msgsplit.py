import sys, os, random, http.server, socketserver

# python3 msgsplit.py 80
try:
    PORT        = int(sys.argv[1])
except:
    PORT        = 8080

env_prefix  = 'msgsplit_'

class write_read(http.server.SimpleHTTPRequestHandler):
    ## this is a wedged CRUD
    ## Create a env (max 256)
    ## Read AND Delete
    ## no Update

    def _set_headers(self,content_length_response):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Strict-Transport-Security', 'max-age=31536000')
        self.send_header('Content-Security-Policy', "script-src 'self'")
        self.send_header('Content-Length', content_length_response)
        self.end_headers()

    def do_POST(self):
        try :
            content_length  = int(self.headers['Content-Length'])
            post_body       = str(self.rfile.read(content_length).decode('utf-8'))

            ## stores _ciphertext_ on the server in a key-value storage
            if self.path == "/writeserver" :
                if (content_length > 256 ):
                    self.send_error(413) # 413 Payload Too Large
                    return
                storage_key             = str( random.randrange(1000, 1000000000000, 1) )
                os.environ[ env_prefix + storage_key ] = post_body

                self._set_headers(len(storage_key))
                self.wfile.write(storage_key.encode("utf-8")) ## to Alice
                return

            ## server reads the _ciphertext_
            ## TODO with GET https://github.com/klml/msgsplit/issues/11
            if self.path == "/readserver" :
                env_prefix_storage_key  = env_prefix + post_body
                ## server reads the ciphertext
                ciphertext              = os.environ[ env_prefix_storage_key ]
                # overwrite env, just to be sure
                os.environ[ env_prefix_storage_key ] = ''
                # delete the _ciphertext_
                os.environ.pop( env_prefix_storage_key )

                self._set_headers(len(ciphertext))
                self.wfile.write(ciphertext.encode("utf-8"))  # to Bobs Browser
                return
        except:
            self.send_error(404) # 404 Not Found
            return


with socketserver.TCPServer(("", PORT), write_read) as httpd:
    print("Http Server Serving at port", PORT)
    httpd.serve_forever()
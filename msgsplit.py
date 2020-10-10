import os, web, random

env_prefix = 'msgsplit_'

urls = (
    '/',                'index',
    '/writeread',       'writeread'
)
app = web.application(urls, globals())

class index:
    # [webpy staticfiles](http://webpy.org/cookbook/staticfiles) demands the directory /static/, index.html should be on webroot
    # [index as static #3 ](https://github.com/klml/msgsplit/issues/3)
    def GET(self):
        web.header('Content-Type', 'text/html')
        return open(os.path.dirname(os.path.realpath(__file__)) + '/index.html', 'r')

class writeread:
    ## this is a wedged CRUD
    ## Create a env (max 256)
    ## Read AND Delete
    ## no Update
    def POST(self):
        postparam       = web.input(_method='post')

        ## stores _ciphertext_ on the server in a key-value storage
        if hasattr(postparam, 'ciphertext_base64'):
            if (len(postparam['ciphertext_base64']) > 256 ):
                web.ctx.status = '413 Payload Too Large'
                return

            storage_key             = str( random.randrange(1000, 1000000000000, 1) )
            os.environ[ env_prefix + storage_key ] = postparam['ciphertext_base64']
            return storage_key ## to Alice

        ## server reads the _ciphertext_
        if hasattr(postparam, 'storage_key'):
            env_prefix_storage_key = env_prefix + postparam['storage_key']
            try:
                ## server reads the ciphertext
                ciphertext  = os.environ[ env_prefix_storage_key ]
                # overwrite env, just to be sure
                os.environ[ env_prefix_storage_key ] = ''
                # delete the _ciphertext_
                os.environ.pop( env_prefix_storage_key )

                return ciphertext ## to Bobs Browser
            except:
                web.ctx.status = '404 Not Found'
                return


if __name__ == "__main__":
    app.run()
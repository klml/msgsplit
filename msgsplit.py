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
        
        if hasattr(postparam, 'encrypted'):
            key             = str( random.randrange(1000, 1000000000000, 1) )
            if (len(postparam['encrypted']) > 256 ):
                web.ctx.status = '413 Payload Too Large'
                return

            os.environ[ env_prefix + key ] = postparam['encrypted']
            return key

        if hasattr(postparam, 'key'):
            env_prefix_key = env_prefix + postparam['key']
            try:
                cipher      = os.environ[ env_prefix_key ]
                # overwrite env to DELETE
                os.environ[ env_prefix_key ] = ''
                return cipher
            except:
                web.ctx.status = '404 Not Found'
                return


if __name__ == "__main__":
    app.run()
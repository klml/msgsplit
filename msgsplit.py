import os, web, random

env_prefix = 'msgsplit_'

urls = (
    '/',                'index',
    '/writeread',       'writeread'
)
app = web.application(urls, globals())

class index:
    # [webpy staticfiles](http://webpy.org/cookbook/staticfiles) demand a directory, index should be on webroot
    # [ index as static #3 ](https://github.com/klml/msgsplit/issues/3)
    def GET(self):
        with open('index.html', 'r') as file:
            data = file.read()
        return data


class writeread:
    def POST(self):
        postparam       = web.input(_method='post')
        
        if hasattr(postparam, 'encrypted'):
            key             = str( random.randrange(1000, 1000000000000, 1) )
            if (len(postparam['encrypted']) > 256 ):
                return 'encrypted too long'
            os.environ[ env_prefix + key ] = postparam['encrypted']

            return key

        if hasattr(postparam, 'key'):
            env_prefix_key = env_prefix + postparam['key']
            try:
                cipher      = os.environ[ env_prefix_key ]
                # overwrite env
                os.environ[ env_prefix_key ] = ''
            except:
                cipher      = ''

            return cipher


if __name__ == "__main__":
    app.run()
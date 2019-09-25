import os, web, random

env_prefix = 'msgsplit_'

urls = (
    '/',                'index',
    '/writeread',       'writeread'
)
app = web.application(urls, globals())

class index:
    def GET(self):
        with open('index.html', 'r') as file:
            data = file.read()
        return data


class writeread:
    def POST(self):
        postparam       = web.input(_method='post')
        
        if hasattr(postparam, 'encrypted'):
            key             = str( random.randrange(1000, 1000000000000, 1) )
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
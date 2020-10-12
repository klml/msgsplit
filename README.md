# message split

This is _experimental_.

message split allows you to send messages (passwords etc.) to another person without having the message decrypted on the server or in the email.

Workflow:

* msgsplit encrypts the message in Alices browser into a _ciphertext_ and _cryptographic-key_
* sends the _ciphertext_ to the server
  * stores _ciphertext_ on the server in a key-value storage
  * returns the _storage-key_ to Alice
* Alices browser creates a hyperlink with the _storage-key_ as URL-query (''?'') and the _cryptographic-key_ as URL-Fragment (''#'')
* Alices sends this link via email or messenger to Bob
* Bob opens the Link 
* Bobs browser requests the _ciphertext_ with the _storage-key_ from server
  * server reads the _ciphertext_
  * server deletes the _ciphertext_
  * now server returns the _ciphertext_ to Bobs Browser
* Bob decrypts the the message with _ciphertext_ and the _cryptographic-key_

As encryption method, msgsplit uses [one-time-pad](https://en.wikipedia.org/wiki/One-time_pad), its very secure and very easy to implement.


Bob gets the link and and can get the cipher from the server and decrypt the message in his browser, only one time.
The cipher gets deleted from the server.

## security

Of course this procedure is not safe, there are several __security concerns__: 

* The link get caught on his way, the offender could steal your message. 
* If the server is compromised: 
  * the stored cipher is useless, but you could manipulate the javascript.
  * if ciphers don't get deleted and the offender got your mail, your message is disclosed   
* The browser generates the key for the message, if your browsers [Math.random](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/math.random) is compromised, everything is worthless.
* Only the transmitted message is encrypted. The receiver is not authenticated. The first one who receives the link, has the message.
* brutforce all ciphertexts (`for i in {1..99999999999} ; do curl -s -X POST http://msg.exmple.net:8080/writeread --form "storage_key=$1" ; done ;`): a ciphertext is still useless without the cryptographic-key.

## discalimer

Only transmit messages that can get disclosed (inital passwords, etc )
Do not use msgsplit for current used passwords.
If the hyperlink gets stolen, this message is disclosed.


## demo

Working demo, you can use it, but there is no safety guarantee!

[msgsplit.klml.de](https://msgsplit.klml.de)

hostet on [uberspace.de](https://uberspace.de) with [supervisord](https://manual.uberspace.de/daemons-supervisord.html) `msgsplit.py` as [web backend](https://manual.uberspace.de/web-backends.html), static files (index.html, css, js) as default apache and [access log is disabled](https://manual.uberspace.de/web-logs).

```
[msgsplit@erinome ~]$ cat ~/etc/services.d/msgsplit.ini 
[program:msgsplit]
command=python3 /home/msgsplit/msgsplit/msgsplit.py 
autostart=yes
autorestart=yes
[msgsplit@erinome ~]$ supervisorctl status
msgsplit                         RUNNING   pid 29057, uptime 0:25:35
[msgsplit@erinome ~]$ uberspace web backend list
/writeread http:8080 => OK, listening: PID 29057, python3 /home/msgsplit/msgsplit/msgsplit.py
/ apache (default)

[msgsplit@erinome ~]$ uberspace web log access status
access log is disabled
```

## better 

There are better ways for real crypto:

* [openpgp.org](https://www.openpgp.org)

## install

msgsplit uses [web.py](https://webpy.org/)

```
pip3 install -r requirements.txt
python3 msgsplit.py
```

## Similar

* windmemo.com was a service to send messages you [could real only once](https://www.sebastian-kraus.com/windmemo-nur-der-erste-kann-es-lesen/).
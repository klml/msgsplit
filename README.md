# message split

This is _experimental_.

message split allows you to send messages (passwords etc.) to another person without having the message decrypted on the server or in the email.

## Workflow

* msgsplit encrypts the message with a [one-time-pad](https://en.wikipedia.org/wiki/One-time_pad) in Alices browser into a _ciphertext_ and _cryptographic-key_
* sends the _ciphertext_ to the server
  * the server stores the _ciphertext_ in a key-value storage
  * returns the _storage-key_ to Alice
* Alices browser creates a hyperlink with the _storage-key_ as URL-query (''?'') and the _cryptographic-key_ as URL-Fragment (''#'')
* Alices sends this link via email or messenger to Bob
* Bob opens the Link 
* Bobs browser requests the _ciphertext_ with the _storage-key_ from server
  * the server reads the _ciphertext_
  * the server deletes the _ciphertext_
  * now the server returns the _ciphertext_ to Bobs Browser
* Bob decrypts the the message with _ciphertext_ from the server and the _cryptographic-key_ from the URL-Fragment.


## security

There are several __security concerns__: 

* The link get caught on his way, the offender could steal your message. 
* If the server is compromised: 
  * the stored cipher is useless, but you could manipulate the javascript.
  * if ciphers don't get deleted and the offender gets your mail, your message is disclosed   
* The browser [generates](https://github.com/klml/msgsplit/blob/master/static/msgsplit.js#L6) the key for the message, if your browsers [Crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) is compromised, everything is worthless.
* Only the transmitted message is encrypted. The receiver is not authenticated. The first one who receives the link, has the message.
* brutforce all ciphertexts (`for i in {1..99999999999} ; do curl -s -X POST http://msg.exmple.net:8080/writeread --form "storage_key=$1" ; done ;`): a ciphertext is still useless without the cryptographic-key.

## persistent storage

Too be sure all ciphertexts stay out of every backup, log or any other datatrace, msgsplit needs the weakest persistent storage.
There should be no external dependency filesystemmounts, database or object store.

So msgsplit uses environment variables to "store" ciphertexts.
This is at the expense of usability: msgsplits data does __not__ survive a reboot.


## disclaimer

Only transmit messages that can get disclosed (inital passwords, etc).
Do not use msgsplit for current used passwords.
If the hyperlink gets stolen, this message is disclosed.


## tech stack

msgsplit uses no dependencies (like [web.py](https://webpy.org/) oder bottle)
But plain [http.server](https://docs.python.org/3/library/http.server.html).


run with:

```
python3 msgsplit.py
```

Alternative:
Use plain image [klml/msgsplit](https://hub.docker.com/r/klml/msgsplit) or with [msgsplit-kubernetes](https://github.com/klml/msgsplit-kubernetes).


## demo

Working demo, you can use it, but there is no safety guarantee!

[msgsplit.klml.de](https://msgsplit.klml.de)

Hostet on [uberspace.de](https://uberspace.de) with [supervisord](https://manual.uberspace.de/daemons-supervisord.html) `msgsplit.py` as [web backend](https://manual.uberspace.de/web-backends.html), static files (index.html, css, js) as default apache and [access log is disabled](https://manual.uberspace.de/web-logs).

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


## Similar

* windmemo.com was a service to send messages you [could read only once](https://www.sebastian-kraus.com/windmemo-nur-der-erste-kann-es-lesen/).
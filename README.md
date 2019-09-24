# message split

This is _experimental_.

message split allows you to send messages (passwords etc.) to another person without having the message decrypted on the server or in the email.

It will decrypt the message in Alices browser with an [one-time-pad](https://en.wikipedia.org/wiki/One-time_pad).
Stores the cipher on a server and provides Alice a link with the ciphers filename and the key in the URL-hash.

Bob gets the link and and can get the cipher from the server and decrypt the message in his browser, only one time.
The cipher gets deleted from the server.


Of course this procedure is not safe, there are several __security concerns__: 

* The link get caught on his way, the offender could steal your message. 
* If the server is compromised: 
  * the stored cipher is useless, but you could manipulate the javascript.
  * if ciphers don't get deleted and the offender got your mail, your message is disclosed   
* The browser generates the key for the message, if your browsers [Math.random](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/math.random) is compromised, everything is worthless.



## better 

There are better ways for real crypto:

* [openpgp.org](https://www.openpgp.org)

## Todo

* escape special chars (`123456789021234567890` will result `12345678902123567890`)



## Similar

* windmemo.com was a service to send messages you [could real only once](https://www.sebastian-kraus.com/windmemo-nur-der-erste-kann-es-lesen/).
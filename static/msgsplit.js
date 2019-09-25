// https://github.com/ikcede/JS-One-Time-Pad/blob/master/onetimepad.js
function generateKey (messageLength) {
    var key = "";
    for(var i=0; i < messageLength ;i++) {
        key = key.concat(String.fromCharCode(Math.floor(Math.random()*26) + 65));
    }
    return key;
}

// called by encrypt and decrypt
function deEnCrypt ( message, messageKey ) {
    var encrypted = "";
    for(var i=0; i < message.length ; i++) {
        // XOR each character together and build cipher
        var code = ((messageKey.charCodeAt(i)-65) ^ (message.charCodeAt(i)-65)) + 65;
        encrypted = encrypted.concat(String.fromCharCode(code));
    }
    return encrypted;
}


// TODO use fetch

// send message or messageKey  and get back ciperfile or encrypted message 
// from https://stackoverflow.com/a/9713078/2248997
function writeRead( key, value, callbackFunction ) {

    var http = new XMLHttpRequest();
    http.open('POST', 'writeread', true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            if (typeof callbackFunction === "function") {
                callbackFunction( http.responseText );
            }
        }
    }
    http.send( key + '=' + value  );
}


function encrypt ( message ) {
    messageKey      = generateKey( message.length );
    encrypted       = deEnCrypt( message, messageKey );
    return encrypted ;
}

// output to html inputs
function make_link ( file ) {
    document.getElementById("linktobob").value  =  window.location.href + '?' + file + '#'+ messageKey ;
}

function decrypt( encrypted ) {
    var encrypted = window.atob( encrypted  );
    decryptedmsg = deEnCrypt( encrypted ,  decodeURIComponent(window.location.hash).substring(1) ) ;
    if ( decryptedmsg.length > 0 ) {
        document.getElementById("message").value = decryptedmsg ;
    } else {
        document.getElementById("message").value = "no message here";
    }
}


// user input 
function send() {
    message     = document.getElementById("messagetosend").value;
    var encrypted = window.btoa( encrypt( message ) );
    writeRead( 'encrypted', encrypted, make_link );
    document.getElementById('sendmessage').style.display = 'block';
    document.getElementById('linktobob').focus();
    document.getElementById('setmessage').style.display = 'none';
}

function getmessage() {
    var search = decodeURIComponent(window.location.search).substring(1)  ;
    writeRead( 'key', search, decrypt );
    document.getElementById('getmessagebtn').style.display = 'none';
    document.getElementById('message').focus();
}

// on load with ?cipher#messagekey: show get message button
window.onload = function() {
    if ( decodeURIComponent(window.location.search).substring(1).length > 1 ) {
        document.getElementById('setmessage').style.display = 'none';
        document.getElementById('getmessage').style.display = 'block';
    }
};
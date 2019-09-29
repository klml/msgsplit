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


// send message or messageKey  and get back ciperfile or encrypted message 

function writeRead( key, value, callbackFunction ) {

    var formData = new FormData();
    formData.append( key , value);

    fetch( 'writeread', { method: "POST", body: formData }  ).then(
        function(response) {
            if (response.status !== 200) {
                console.log('ERROR Status Code: ' + response.status);
                return;
            }
            response.text().then(function(data) {
                callbackFunction(data);
            });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}


function encrypt ( message ) {
    messageKey      = generateKey( message.length );
    encrypted       = deEnCrypt( message, messageKey );
    return encrypted ;
}

// output to html inputs
function make_link ( file ) {
    const linktobob = document.getElementById('linktobob');
    linktobob.value  =  window.location.href + '?' + file + '#'+ messageKey ;
    linktobob.select();
}

function decrypt( encrypted ) {
    var encrypted = window.atob( encrypted  );
    decryptedmsg = deEnCrypt( encrypted ,  decodeURIComponent(window.location.hash).substring(1) ) ;
    const input_message = document.getElementById('message');

    if ( decryptedmsg.length > 0 ) {
        input_message.value = decryptedmsg ;
        message.select();
    } else {
        input_message.value = "no message here";
    }
}


// user input 
function send() {
    message     = document.getElementById("messagetosend").value;
    var encrypted = window.btoa( encrypt( message ) );
    writeRead( 'encrypted', encrypted, make_link );
    document.getElementById('sendmessage').style.display = 'block';
    document.getElementById('setmessage').style.display = 'none';
}

function getmessage() {
    var search = decodeURIComponent(window.location.search).substring(1)  ;
    writeRead( 'key', search, decrypt );
    document.getElementById('getmessagebtn').style.display = 'none';
}

// on load with ?cipher#messagekey: show get message button
window.onload = function() {
    if ( decodeURIComponent(window.location.search).substring(1).length > 1 ) {
        document.getElementById('setmessage').style.display = 'none';
        document.getElementById('getmessage').style.display = 'block';
    }
};
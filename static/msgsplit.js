// https://github.com/ikcede/JS-One-Time-Pad/blob/master/onetimepad.js
function generate_cryptographic_key (messageLength) {
    var cryptographic_key = "";
    for(var i=0; i < messageLength ;i++) {
        cryptographic_key = cryptographic_key.concat(String.fromCharCode(Math.floor(Math.random()*26) + 65));
    }
    return cryptographic_key;
}

// called by encrypt and decrypt
function de_en_crypt ( message, cryptographic_key ) {
    var encrypted = "";
    for(var i=0; i < message.length ; i++) {
        // XOR each character together and build cipher
        var code    = ((cryptographic_key.charCodeAt(i)-65) ^ (message.charCodeAt(i)-65)) + 65;
        encrypted   = encrypted.concat(String.fromCharCode(code));
    }
    return encrypted;
}


// send message or messageKey and get back cipherfile or encrypted message
function write_read_server( formData, callbackFunction ) {

    fetch( 'writeread', { method: "POST", body: formData }  ).then(
        function(response) {
            if (response.status !== 200) {
                console.log('ERROR Status Code: ' + response.status);
                return;
            }
            response.text().then(function(response_data) {
                callbackFunction(response_data);
            });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}


function encrypt ( plaintext ) {
    cryptographic_key   = generate_cryptographic_key( plaintext.length );
    var ciphertext          = de_en_crypt( plaintext, cryptographic_key );
    return ciphertext ;
}

// output to html inputs
function make_linktobob ( storage_key ) {
    const linktobob     = document.getElementById('linktobob');
    linktobob.value     = window.location.href + '?' + storage_key + '#'+ cryptographic_key ;
    linktobob.select();
}

function decrypt( ciphertext ) {
    var ciphertext_base64   = window.atob( ciphertext  );
    var cryptkey            = decodeURIComponent(window.location.hash).substring(1) ;
    var decryptedmsg        = de_en_crypt( ciphertext_base64 , cryptkey ) ;

    const input_message = document.getElementById('message');
    if ( decryptedmsg.length > 0 ) {
        input_message.value = decryptedmsg ;
        message.select();
    } else {
        input_message.value = "no message here";
    }
}


// user input 
function create_plaintext2ciphertext() {
    var plaintext           = document.getElementById("plaintext").value;
    var ciphertext          = encrypt( plaintext ) ;
    var ciphertext_base64   = window.btoa( ciphertext );

    var formData = new FormData();
    formData.append( 'encrypted', ciphertext_base64 );

    write_read_server( formData, make_linktobob );
    document.getElementById('sendmessage').style.opacity = 1.0;
    document.getElementById('setmessage').style.opacity = 0.8;
}

function get_ciphertext2plaintext() {
    var search = decodeURIComponent(window.location.search).substring(1)  ;
    var formData = new FormData();
    formData.append( 'key', search );
    write_read_server( formData , decrypt );
    document.getElementById('getmessagebtn').disabled = true ;
}

// on load with ?cipher#messagekey: show get message button
window.onload = function() {
    if ( decodeURIComponent(window.location.search).substring(1).length > 1 ) {
        document.getElementById('setmessage').style.display = 'none';
        document.getElementById('sendmessage').style.display = 'none';
        document.getElementById('getmessage').style.display = 'block';
    }
};
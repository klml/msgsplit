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
    var encrypted   = "";

    for(var i=0; i < message.length ; i++) {
        // XOR each character together and build cipher
        var code    = ((cryptographic_key.charCodeAt(i)-65) ^ (message.charCodeAt(i)-65)) + 65;
        encrypted   = encrypted.concat(String.fromCharCode(code));
    }
    return encrypted;
}


// send ciphertext or storage_key and get back cipherfile or encrypted message
function write_read_server( write_read_server_path , callbackFunction, post_data , cryptographic_key ) {
    fetch( write_read_server_path, { method: "POST", body: post_data }  ).then(
        function(response) {
            if (response.status !== 200) {
                console.log('ERROR Status Code: ' + response.status);
                callbackFunction(response.status)
                return;
            }
            response.text().then(function(response_data) {
                callbackFunction(response.status, cryptographic_key, response_data);
            });
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}


function encrypt ( plaintext ) {
    var cryptographic_key   = generate_cryptographic_key( plaintext.length );
    var ciphertext          = de_en_crypt( plaintext, cryptographic_key );

    return [ciphertext, cryptographic_key];
}

// output to html inputs
function make_linktobob ( http_status, cryptographic_key , storage_key ) {
    linktobob               = document.getElementById('linktobob');

    if ( http_status == "200" ) {
        linktobob.value     = window.location.href + '?' + storage_key + '#'+ cryptographic_key ;
        linktobob.select();
    } else {
        linktobob.value     = 'HTTP response status codes: ' + http_status
    }
}

function decrypt( http_status, cryptographic_key , ciphertext ) {
    input_message               = document.getElementById('message');

    if ( http_status == "200" ) {
        var ciphertext_base64   = window.atob( ciphertext );
        // remove ? from window.location.hash
        var cryptkey            = decodeURIComponent(window.location.hash).substring(1) ;
        var decryptedmsg        = de_en_crypt( ciphertext_base64 , cryptkey ) ;

        input_message.value     = decryptedmsg ;
        input_message.select();
    } else {
        input_message.value     = "no message here, request the message again from your sender";
    }
}


// user input 
function create_plaintext2ciphertext() {
    var plaintext                       = document.getElementById("plaintext").value;
    var [ciphertext, cryptographic_key] = encrypt( plaintext ) ;

    // send proper characters to server
    var ciphertext_base64               = window.btoa( ciphertext );

    write_read_server( 'writeserver', make_linktobob, ciphertext_base64, cryptographic_key );

    document.getElementById('sendmessage').style.opacity = 1.0;
    document.getElementById('setmessage' ).style.opacity = 0.8;
}

function get_ciphertext2plaintext() {
    // remove ? from window.location.search
    var storage_key = decodeURIComponent(window.location.search).substring(1)  ;
    write_read_server( 'readserver' , decrypt, storage_key );

    document.getElementById('getmessagebtn').disabled = true ;
}

// on load with ?cipher#messagekey: show get message button
window.onload = function() {
    if ( decodeURIComponent(window.location.search).substring(1).length > 1 ) {
        document.getElementById('setmessage' ).style.display = 'none';
        document.getElementById('sendmessage').style.display = 'none';
        document.getElementById('getmessage' ).style.display = 'block';
    }
};
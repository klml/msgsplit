package main
 
import (
    "fmt"
    "os"
    "net/http"
    crypto_rand "crypto/rand"
    "encoding/binary"
    math_rand "math/rand"
)

// seed rand
// wanted to use https://github.com/google/uuid , but modules are a bigger thread 
// from https://stackoverflow.com/a/54491783/2248997
func init() {
    var b [8]byte
    _, err := crypto_rand.Read(b[:])
    if err != nil {
        panic("cannot seed math/rand package with cryptographically secure random number generator")
    }
    math_rand.Seed(int64(binary.LittleEndian.Uint64(b[:])))
}

func main() {
    // this is a wedged CRUD
    // Create a env (max 256)
    // Read AND Delete
    // no Update

    http.HandleFunc("/writeread", func(w http.ResponseWriter, r *http.Request) {
        if r.Method != "POST" {
            w.Header().Set("Allow", "POST")
            http.Error(w, "Method Not Allowed", 405)
            return
        }
        // prefix ENV prevent reading system ENVs
        storage_key := "msgsplit_"
        r.ParseForm()

        // stores _ciphertext_ on the server in env
        if cipher, found := r.Form["cipher"]; found {

            if len(cipher[0]) > 256 {  
                http.Error(w, "Payload Too Large", 413)
            }
            storage_rand := fmt.Sprintf("%d", math_rand.Int())  // example:          6334824724549167320
            storage_key  += storage_rand                        // example: msgsplit_6334824724549167320
            os.Setenv(storage_key, cipher[0])
    
            fmt.Fprintf(w, storage_rand)                        // example:          6334824724549167320
        // server reads the _ciphertext_
        } else if key, found := r.Form["key"]; found {
            storage_key += key[0]                               // example: msgsplit_6334824724549167320
            cipher, cipher_exists := os.LookupEnv(storage_key)
            if !cipher_exists {  
                http.Error(w, "Gone", 410)
            }
            // delete cipher
            os.Unsetenv(storage_key)                            // example: msgsplit_6334824724549167320
            fmt.Fprintf(w, cipher)
        } else {
            http.Error(w, "Not Found", 404)
        }
    })

    http.Handle("/", http.FileServer(http.Dir("./")))


    httpPort, Port_exist := os.LookupEnv("PORT")
	if !Port_exist {
		httpPort = "8080"
	}
    fmt.Println("Start msgsplit server at port " + httpPort)
    http.ListenAndServe(":" + httpPort, nil)
}

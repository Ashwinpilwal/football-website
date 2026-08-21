# Where we save JWT, so that we can verify it?
>   We save JWT in Frontend(At client side in the form of cookie, localstorage, or memory), and avoid saving it in backend.

# Why JWT should not be stored in the backend and only be stored in frontend?
>   If backend stored tokens:
        signIn for 100 users = store 100 tokens
        multiple servers → very hard

# How to verify the JWT token in another file?
    The token comes from the client (frontend → backend)
    The frontend sends the token in headers
    The file (middleware) receives that token
    That file has access to the same secret (process.env.JWT_SECRET)
    It can verify using that secret
    
    Done.

# Use of Payload in JWT?
>   JWT contains a snapshot of the data at the time the token was created.
    Common Flow:-    JWT -> get _id -> find user in DB -> get latest user data
    

# why cb in multer?
    const storage = multer.diskStorage({
        destination: function(req, file, cb){
                cb(null, '/public/temp')
        },
        filename: function(req, file, cb){
                
                cb.apply(null, file.fieldname)
                console.log(file.filename)
        }
    })

    Suppose Multer asks you: "Where should I save this file?"

    You have to somehow tell Multer the answer.

    One way could have been: return "/tmp/uploads";
    But Multer's creators decided to use a callback instead.

    So they say: "When you know the answer, call cb()."

    Like this: cb(null, "/tmp/my-uploads");

    which means: "No error, save it in /tmp/my-uploads."



# Middleware is like: Jaane se pehle mujhse mil kar jaana 😂😂
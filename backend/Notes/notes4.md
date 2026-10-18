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



# MULTER NOTES:

So these two are essentially:

1. Without Multer
Frontend → Backend → Cloudinary

2. With Multer
Frontend → Backend → Multer → Cloudinary

For a typical MERN application, I'd prefer #2 when your backend is responsible for handling uploads.

> Why use Multer?

When the frontend sends a file using multipart/form-data, Express doesn't automatically give you the file in a convenient form.

Multer parses that request and gives you: 
req.file

or for multiple files:
req.files

Then your backend can send that file to Cloudinary.

> Why is this useful?

Your backend gets a chance to:

✅ Check file type (jpg, png, pdf, etc.)
✅ Limit file size
✅ Reject unwanted files
✅ Process/transform the file if needed
✅ Authenticate the user before uploading
✅ Decide where/how the file should be stored
✅ Upload securely to Cloudinary without exposing sensitive Cloudinary credentials

So the architecture becomes:

React
  ↓
multipart/form-data
  ↓
Express
  ↓
Multer
  ↓
req.file
  ↓
Cloudinary
  ↓
URL
  ↓
MongoDB

One important correction

Don't think:
"Multer stores my file."

- Multer's main job is parsing the incoming multipart request and making the uploaded file accessible to your backend.

It can temporarily store the file on disk or in memory, depending on how you configure it.
Cloudinary is the actual long-term storage/CDN.

> What I'd use in your MERN project

For something like your FacelessBook/social-media app, I'd generally use:

React → Node/Express → Multer → Cloudinary
                              ↓
                         Cloudinary URL
                              ↓
                           MongoDB

That's a very common and clean architecture.

However, for large files or performance-sensitive applications, direct frontend → Cloudinary uploads can be better because the file doesn't have to travel through your backend server.
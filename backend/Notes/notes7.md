# Notice I also changed:

>   req.files?.coverImage[0]?.path ---> req.files?.coverImage?.[0]?.path

    Why?

    Suppose the user does not upload a cover image.

    Without: ?.[0]

    JavaScript will try to do: undefined[0]

# Note:
>   throw new ApiError(...) or new ApiResponse(...)
    Here we are making new object everytime we write new.
    
    
# When to use [form-data] and when to use [json-raw] in postman
>   Quick Decision Table

Situation                    |    Body Type
Login                        |    JSON
Logout                       |    JSON
Change Password              |    JSON
Create Post (text only)      |    JSON
Update Profile (text only)   |    JSON
Register with Avatar         |    form-data
Upload Image                 |    form-data
Upload Video                 |    form-data
Upload PDF/Resume            |    form-data


>   Rule of Thumb        

Ask yourself: "Am I sending a file?"

No file? : Use raw → JSON

At least one file?: Use form-data + multer


# Checking if the fucntion is Synchronous of Asynchronous(Async):

>   1. Look for the async keyword
    async function getUser() {
        return "Ashwani";
    }

    or

    const getUser = async () => {
        return "Ashwani";
    }

This function always returns a Promise, so you can use: const user = await getUser();

>   2. Check what it returns

>   Synchronous function:
function add(a, b) {
    return a + b;
}

const result = add(2, 3);
console.log(result); // 5

Returns the actual value immediately.

>   Asynchronous function
async function add(a, b) {
    return a + b;
}

1. const result = await add(2, 3);
console.log(result);

Output: 5
Returns the final value

2. const result = add(2, 3);
console.log(result);

Output: Promise { 5 }
Returns a Promise, not the final value.

>  In async function use await , and in sync function don't use it. Like we didn't use "await" in generateAccessToken call. user.controller:16/17


# Decoding Access Token:
>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTMwNzFiMjdiNDk3OTk0OGNhZDMyMDgiLCJlbWFpbCI6Im9uZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im9uZSIsImZ1bGxOYW1lIjoiQXNod2FuaSBQaWx3YWwiLCJpYXQiOjE3ODE2MDczNDcsImV4cCI6MTc4MTY5Mzc0N30.NMTbklhGGJcDkdESgFqDIkN9wmWJolSwul2HuCOx4B0 

1. Decoded Header
{
  "alg": "HS256",
  "typ": "JWT"
}

2. Decoded Payload:
{
  "_id": "6a3071b27b4979948cad3208",
  "email": "one@gmail.com",
  "username": "one",
  "fullName": "Ashwani Pilwal",
  "iat": 1781607347, // 16-Jun 16:25  
  "exp": 1781693747  // 17-Jun 16:25  
}

3. JWT Signature Verification(Secret)

signature verification failed
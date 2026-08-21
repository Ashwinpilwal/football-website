i am sending res.status(...).setCookies from backend but how in the frontend it is saving, all I did is let response = await axiox.login...

This is a really good question. The important thing is that Axios is not saving the cookie. The browser is.

Let's go through it step by step.

Step 1: Frontend sends login request
const response = await api.post("/users/login", data);

This is just a normal HTTP request.

Step 2: Backend responds

Suppose your backend does:

return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, user, "Login successful")
    );

The HTTP response looks something like this:

HTTP/1.1 200 OK

Set-Cookie: accessToken=eyJhbGc...; HttpOnly; Secure; SameSite=Lax
Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Lax

Content-Type: application/json

Notice those Set-Cookie headers.

Step 3: Browser receives response

The browser sees:

Set-Cookie: accessToken=...

and automatically stores it.

You never write:

document.cookie = ...

The browser does it automatically.

Step 4: Future requests

Later you do:

await api.get("/users/current-user");

If your Axios instance has:

const api = axios.create({
    baseURL: "...",
    withCredentials: true,
});

then the browser automatically attaches the stored cookies.

The request becomes:

GET /users/current-user

Cookie:
accessToken=eyJh...
refreshToken=eyJh...

Again, Axios isn't manually adding the cookie. It simply tells the browser:

"Include credentials (cookies) with this request."

The browser reads its cookie storage and attaches them.

So who is responsible?
Backend

Sends:

Set-Cookie
Browser

Stores:

accessToken
refreshToken
Axios

Says:

withCredentials: true

which means:

"Browser, if you have cookies for this server, please include them."

Why can't you see them?

If you used:

console.log(document.cookie);

you'll probably get:

""

or you won't see the tokens.

That's because you likely set:

httpOnly: true

An HttpOnly cookie cannot be accessed by JavaScript.

That's a security feature that protects against XSS attacks.

Where are they actually stored?

Open Chrome DevTools:

Application
    ↓
Storage
    ↓
Cookies
    ↓
http://localhost:8000

You'll see something like:

accessToken
refreshToken

with flags like:

HttpOnly ✅
Secure
SameSite
Expires
The complete lifecycle
Frontend
    │
    │ POST /login
    ▼
Backend
    │
    │ Set-Cookie(accessToken)
    │ Set-Cookie(refreshToken)
    ▼
Browser
    │
    │ Stores cookies automatically
    ▼
Later...
    │
    │ GET /current-user
    ▼
Browser
    │
    │ Reads stored cookies
    │
    ▼
Request contains:

Cookie:
accessToken=...
refreshToken=...
    ▼
Backend verifies JWT

So the key idea is:

Backend creates the cookies using Set-Cookie.
Browser stores them automatically.
Axios doesn't save cookies; with withCredentials: true, it tells the browser to send any relevant cookies on future requests.
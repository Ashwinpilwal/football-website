# JWT-cookie flow
After a user logs in, I'll generate a JWT and store it in an HTTP cookie. 
I'll use the cookie-parser middleware so Express can read incoming cookies and place them on req.cookies. 
For protected routes, I'll extract the token from req.cookies, 
verify it using jwt.verify(), decode the payload, and then identify the authenticated user


# How request contain the cookie? When user open the website, how is the cookie automatically included in the request?

>   Step 1: User logs in

Your backend sends a response like:

res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true
});

Behind the scenes, Express sends an HTTP header:

Set-Cookie: accessToken=eyJhbGciOiJIUzI1Ni...;

>   Step 2: Browser stores the cookie

The browser receives:

Set-Cookie: accessToken=... and saves it.
You don't manually store it.

>   Step 3: User visits another page

Suppose the browser now requests: GET /api/v1/users/current-user

The browser automatically attaches the cookie: accessToken=eyJhbGciOiJIUzI1Ni...
No JavaScript code needed.

>   Step 4: Express receives the request

Request arrives: req.headers.cookie

contains: accessToken=eyJhbGciOiJIUzI1Ni...

Then cookie-parser converts it into:

req.cookies = {
    accessToken: "eyJhbGciOiJIUzI1Ni..."
};

Now you can do: const token = req.cookies.accessToken;


>   Visual Flow
LOGIN
  |
  v
Backend generates JWT
  |
  v
Backend sends Set-Cookie header
  |
  v
Browser stores cookie
  |
  v
User makes another request
  |
  v
Browser automatically sends Cookie header
  |
  v
cookie-parser reads it
  |
  v
req.cookies.accessToken
  |
  v
jwt.verify(token)

>   Why does it happen automatically?

Because cookies are a browser feature.

Once a cookie is stored for: https://mywebsite.com

every future request to that domain automatically includes the cookie.
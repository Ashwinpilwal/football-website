# Common Question: Why Try-Catch around jwt.verify(), it never return error?

>   Actually, jwt.verify() can definitely throw errors.
Many people assume it always returns the decoded payload because they usually test with valid tokens.
Example:

>   Valid token
eyJhbGciOiJIUzI1Ni...

Output:
{
    _id: "123",
    email: "abc@gmail.com",
    iat: 123456,
    exp: 123999
}

>   Expired token

Suppose the token expired yesterday.

jwt.verify(token, secret);

Throws: TokenExpiredError: jwt expired
It does not return anything.

>   Wrong secret
jwt.verify(token, "wrong_secret");

Throws:
JsonWebTokenError: invalid signature

>   Modified token

If someone changes even one character: abc.def.xyz

Throws: 
JsonWebTokenError: invalid token




# Refresh Token flow will be:

1. Get Refresh Token
   ↓
   From:
   - req.cookies.refreshToken
   - OR req.body.refreshToken

2. Verify JWT Signature & Expiry
   ↓
   jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)

3. Extract User ID from Decoded Token
   ↓
   decodedToken._id

4. Find User in Database
   ↓
   User.findById(decodedToken._id)

5. Validate Refresh Token
   ↓
   Compare:
   DB Refresh Token === Incoming(Cookie) Refresh Token

6. Generate New Tokens
   ↓
   - New Access Token
   - New Refresh Token

7. Store New Refresh Token in Database
   ↓
   user.refreshToken = newRefreshToken
   user.save()

8. Send New Tokens
   ↓
   Set Cookies:
   - accessToken
   - refreshToken

9. User Continues Without Logging In Again
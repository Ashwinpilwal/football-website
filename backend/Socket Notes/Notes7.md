# Socket.IO Authentication Notes (Before vs After Middleware)

> Problem Statement

Our cafeteria website uses:

1. JWT Authentication
2. HTTP-only Cookies
3. Socket.IO for Chat

> Question:
How does the server know who is sending a message?

> # 1. Before Socket Middleware

Data Flow: 

Browser  
      │  
socket.connect()  
      │  
Connection Established  
      │  
send-message  
      │  
Read Cookie  
      │  
Extract accessToken  
      │  
Verify JWT  
      │   
Decode JWT  
      │  
Use decoded user  
      │  
Emit Message  


> Code Flow:

Every event looked like this:

socket.on("send-message", () => {

    Read Cookie

    Extract Token

    jwt.verify()

    decodedToken  
    ...

});

> What happened?

1. First message required

      Read Cookie  
      ↓  
      Extract Token  
      ↓  
      Verify JWT   
      ↓  
      Decode JWT  

      Again...

2. Second message

      Read Cookie
      ↓
      Verify JWT

3. Third message

      Read Cookie
      ↓
      Verify JWT

100 messages
↓
100 JWT Verifications


> Problems

1. Repeated Work

JWT was verified  
Every Message

instead of Every Connection

2. Duplicate Code

Every event needed:  

Read Cookie
Verify JWT
Decode Token

3. Hard to Maintain

Imagine adding send-message   
typing join-room leave-room  
video-call notification  
Every event would need authentication code.  

4. Violates Separation of Concerns

Chat Handler  
↓  
Should only handle Chat  

NOT  
Authentication


> # 2. After Socket Middleware

> We moved authentication to

io.use(...)

> Data Flow:  

Browser  
    ↓  
socket.connect()  
    ↓  
Browser Automatically Sends Cookie  
    ↓  
Socket Middleware  
    ↓  
Read Cookie  
    ↓  
Extract accessToken  
    ↓  
Verify JWT  
    ↓  
Find User  
    ↓  
socket.user = user  
    ↓  
next()  
    ↓  
Connection Accepted  
    ↓  
send-message  
    ↓  
socket.user
    ↓  
Emit Message  

> Notice:

JWT verification happens  
ONE TIME


> Code Flow: 

1. Middleware:

io.use(async(socket,next)=>{

    Read Cookie

    Verify JWT

    socket.user=user

    next()

})

2. Chat Handler:

socket.on("send-message",()=>{

    socket.user

})

Authentication completely disappeared from Chat.



> What Changed?

Before: 

Every event  
↓  
Read Cookie  
↓  
Verify JWT  
↓  
Decode JWT  

After: 

Connection  
↓  
Read Cookie  
↓  
Verify JWT  
↓  
socket.user  

Only once.

----------------------

> ## 1. Why attach user to socket?

> After verification: 

Instead of decodedToken being local

We store  
socket.user=user

Now every event can simply do  
socket.user

without authentication again.


> Why socket.user?

Exactly like Express


- Express:  
      verifyJWT()  
      ↓  
      req.user   

- Controller:  
      req.user

- Socket.IO:  
      socketAuth()  
      ↓  
      socket.user  

- Event:  
      socket.user


Same architecture.

-----

> ## 2. Browser Socket vs Server Socket

Browser:  
const socket=io(...)

Server:  
io.on("connection",(socket)=>{...

Different objects.

Server socket has  
socket.user

Browser does NOT.

-----

> Why not trust frontend?

Suppose browser sends

{  
  sender:"Messi"  
}  

Can server trust it?  
NO.

Instead:

sender=socket.user._id  
Always.

> ## 3. JWT's Role:  

JWT answers ONE question
Who owns this socket connection?

After that

Server already knows  
This connection belongs to Ashwin

No more verification needed.

HTTP vs Socket Authentication

> HTTP

Request  
  ↓  
Verify JWT  
  ↓  
Response  
  ↓  
New Request  
  ↓  
Verify JWT    

> Socket

Connect
  ↓
Verify JWT
  ↓
Authenticated Socket
  ↓
Message
  ↓
Typing
  ↓
Join Room
  ↓
Leave Room

One authentication,   
Many events.

> ## 4. Why Middleware?

> Middleware runs before connection

Therefore

Every connected socket already has:  
socket.user available.

> Final Architecture:

React     
   ↓  
socket.connect()  
   ↓  
Browser sends Cookie  
   ↓  
io.use()  
   ↓  
Extract Cookie  
   ↓  
Verify JWT  
   ↓  
Find User  
   ↓  
socket.user=user   
   ↓  
next()  
   ↓  
connection  
   ↓  
chatSocketHandler()  
   ↓  
send-message  
   ↓  
socket.user  
   ↓  
Save Message  
   ↓  
Emit to Receiver  

> Advantages of Middleware

✅ JWT verified only once.

✅ Faster than verifying every message.

✅ No duplicated authentication code.

✅ Chat handler only handles chat.

✅ Authentication is centralized.

✅ Every future socket event automatically gets socket.user.

> Golden Rule: 

Authenticate the connection, not every message.

Once a socket is authenticated:

Connection  
  ↓  
Trusted  
  ↓  
All future events trust 

socket.user

instead of trusting anything sent by the client.


> Interview One-Liner: 

If an interviewer asks:

"Why do you authenticate in io.use() instead of inside send-message?"

A concise answer would be:

"Because Socket.IO uses a persistent connection. I authenticate the connection once during the handshake, attach the authenticated user to socket.user, and then all subsequent events reuse that trusted identity. This avoids repeated JWT verification, keeps authentication separate from business logic, and prevents trusting client-supplied identity data."
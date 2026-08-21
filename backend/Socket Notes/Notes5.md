Socket.IO + JWT Authentication Notes (Your Cafeteria Project)

These notes explain what happens, why it happens, and what would go wrong if we didn't do it this way.

1. Browser opens the website

The React application starts.

main.jsx
    │
    ▼
Provider
    │
    ▼
AuthInitializer
    │
    ▼
RouterProvider

Nothing is connected yet.

2. AuthInitializer runs
api.get("/users/current-user")

Why?

To know whether the user is already logged in.

Since we use HTTP-only cookies, the browser automatically sends

Cookie:
accessToken=eyJhbGc...

Server verifies the JWT.

If valid:

req.user = Ashwin

Server returns:

Current User

React stores:

Redux

auth.userData
3. Connect Socket

After authentication succeeds

socket.connect()

This DOES NOT immediately connect.

Instead

socket.connect()

↓

Handshake starts

↓

Server

↓

Connection established

That's why

console.log(socket.connected)

may initially print

false

because the handshake hasn't finished yet.

4. Socket Handshake

Since

withCredentials: true

Browser automatically sends cookies.

Browser

Cookie:
accessToken=...

Notice

React NEVER sends

token

manually.

Browser does it.

5. Socket Middleware

Before accepting connection

io.use(...)

runs.

Exactly like

verifyJWT

for Express.

Flow

Handshake

↓

Read Cookie

↓

Extract JWT

↓

jwt.verify()

↓

Find User

↓

socket.user = user

↓

next()

↓

Connection accepted
Why do we verify JWT here?

Because we must answer

Who owns this socket?

Suppose

socket.id

=

abc123

Does server know

Ashwin?

No.

Only after verifying JWT.

Then

socket.id

abc123

belongs to

Ashwin
Why attach
socket.user

instead of using JWT every time?

Because

Connection

↓

Verified once

↓

Trusted connection

Instead of

Message 1

Verify JWT

Message 2

Verify JWT

Message 3

Verify JWT

which is unnecessary.

6. Connection Event

Now

io.on("connection", (socket)=>{

runs.

Now

socket.user

already exists.

So

console.log(socket.user.username)

works.

Client Socket vs Server Socket

Many people confuse these.

Browser

const socket = io(...)

Server

io.on("connection",(socket)=>{

These are TWO different objects.

Browser

socket

id

connected

Server

socket

id

connected

user

Browser CANNOT access

socket.user

because it exists only on server.

Why don't we attach user on frontend?

Suppose frontend does

socket.user={
username:"Messi"
}

Can server trust it?

NO.

User can open DevTools.

Change it.

Pretend to be anyone.

Never trust frontend.

Why server attaches user?

Because server verified JWT.

Only server knows

This connection belongs to Ashwin
7. Send Message

Client

socket.emit("send-message",{
message:"Hello"
})

Notice

No sender.

No username.

No userId.

Only

message
Server receives
socket.on("send-message",(data)=>{

Need sender?

Don't use

data.sender

Instead

socket.user._id

Why?

Because

socket.user

=

Verified user
What if client sends
{
sender:"Messi"
}

Server ignores it.

Instead

const sender=socket.user._id

So database stores

Sender

Ashwin

NOT

Messi
Why?

Because sender is determined by

Connection

NOT

Client data
HTTP vs Socket

HTTP

GET /profile

↓

Verify JWT

↓

Response

Next request

POST /upload

↓

Verify JWT

↓

Response

Every HTTP request is independent.

Socket

Connect

↓

Verify JWT

↓

socket.user

↓

Message

↓

Typing

↓

Join Room

↓

Leave Room

One verification.

Many events.

What if there is NO JWT?

Suppose

withCredentials:true

but browser has no cookie.

Browser sends

Nothing

Server

No Token

↓

Reject Connection

Socket never connects.

One Browser = One Socket

Current architecture

Browser Tab

↓

One Socket

↓

Server

Every component

Chat

Map

Upload

Navbar

shares SAME socket.

Two Browser Tabs
Tab 1

↓

Socket A

Server

Socket B

↓

Tab 2

Same user.

Different sockets.

Should Chat disconnect socket?

NO.

Why?

Because socket belongs to application.

NOT Chat.

Chat only listens.

Bad

Chat unmount

↓

socket.disconnect()

Everything disconnects.

Good

Login

↓

socket.connect()

↓

Navigate anywhere

↓

Socket stays alive

↓

Logout

↓

socket.disconnect()
What are Listeners?

Connection

socket.connect()

Listener

socket.on("receive-message",callback)

Listener means

Whenever this event happens,
run this function.

It DOES NOT create a connection.

Why remove listeners?

Suppose

Visit Chat

↓

socket.on()

↓

Leave Chat

↓

Visit Chat

↓

socket.on()

Now

Listener 1

Listener 2

Listener 3

Server emits once.

Output

Hello

Hello

Hello

Memory leak.

Duplicate execution.

Solution

return()=>{
socket.off(...)
}
Difference

Connection

socket.connect()

One time.

Listener

socket.on(...)

Many.

Why server has
socket.on("disconnect")

Server is NOT disconnecting.

Server is LISTENING.

Meaning

Tell me whenever this client leaves.

Useful for

Offline Status

Last Seen

Typing Stop

Remove from Map

Cleanup
Complete Flow
User Login
      │
      ▼
JWT Created
      │
      ▼
HTTP-only Cookie Stored
      │
      ▼
React Starts
      │
      ▼
AuthInitializer
      │
      ▼
current-user API
      │
      ▼
Redux Stores User
      │
      ▼
socket.connect()
      │
      ▼
Browser sends Cookie automatically
      │
      ▼
Socket.IO Middleware
      │
      ├── Read Cookie
      ├── Extract JWT
      ├── Verify JWT
      ├── Find User
      └── socket.user = User
      │
      ▼
Connection Accepted
      │
      ▼
User Sends Message
      │
      ▼
socket.user determines Sender
      │
      ▼
Save to MongoDB
      │
      ▼
Emit to Receiver
      │
      ▼
Receiver gets Message  


> Golden Rules (Remember Forever)

1. Never trust the frontend for identity.
2. Authenticate the socket once during the handshake.
3. Use socket.user, not data.sender.
4. One browser tab = one socket connection.
5. One connection can have many event listeners.
6. Components remove listeners (socket.off()), not the shared connection.
7. Disconnect the socket when the user logs out (or the app truly ends), not when a page changes.
8. HTTP authenticates every request; Socket.IO authenticates the connection once, then trusts that connection for all future events.

These principles are the foundation of how real-time applications like WhatsApp, Discord, Slack, and similar systems securely identify users and process events.
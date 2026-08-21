🟢 Online / Offline Status — Detailed Notes
1. What are we actually trying to achieve?

Suppose there are two users:

Ashwin
Levi

Ashwin opens the Messages page.

He should see:

Levi
🟢 Online

If Levi closes his browser:

Levi
⚪ Offline

And Ashwin should see the change without refreshing the page.

That is what real-time presence means.

2. The main technology: Socket.IO

Normally, HTTP works like this:

Frontend → Request → Backend
Frontend ← Response ← Backend

For example:

GET /users/profile/levi

The server responds and the request is finished.

But online/offline status needs something different.

We want:

Server
  ↓
"Levi just went offline!"
  ↓
Ashwin's browser

The server needs to be able to push information to the frontend whenever something happens.

That's where Socket.IO comes in.

3. What happens when a user logs in?

Imagine Levi logs into your application.

The frontend creates a Socket.IO connection:

Levi's Browser
      │
      │ socket.connect()
      ↓
Socket.IO Server

The connection stays open.

Unlike a normal HTTP request, this connection remains active.

Conceptually:

Levi Browser
      │
      │══════════════════════╗
      │                      ║
      ↓                      ║
Socket.IO Server             ║
                             ║
      connection stays open ═╝

As long as that connection exists, the server knows:

"Levi currently has an active connection."

4. But how does the server know WHO connected?

This is extremely important.

A socket connection by itself isn't enough.

The server needs to know:

This socket belongs to Levi.

Your authentication system handles this.

For example, the user has a JWT:

JWT → user ID = 123

When Socket.IO connects, the backend verifies the authentication information.

Then the server can identify:

socket.user._id
       ↓
    Levi's ID

So now the server knows:

Socket ABC123 → Levi
5. The onlineUsers Map

Your backend maintains something like:

const onlineUsers = new Map();

Think of this as a database-like structure in memory:

User ID       Socket ID
--------------------------
Levi          abc123
Ashwin        xyz456
Ronaldo       pqr789

So:

onlineUsers.set(userId, socketId);

means:

"This user currently has an active socket connection."

6. Why use a Set instead of just one socket ID?

This is an important detail.

A user might open your website in multiple places:

Levi
 ├── Chrome tab
 ├── Chrome second tab
 └── Mobile phone

That means Levi could have:

Socket A
Socket B
Socket C

If you only stored one socket:

Map<UserId, SocketId>

you could accidentally mark Levi offline when one tab closes.

Instead:

Map<UserId, Set<SocketId>>

can represent:

Levi
 ↓
{
   socketA,
   socketB,
   socketC
}

Now if Socket A disconnects:

socketA ❌


remaining:
socketB
socketC

Levi is still online.

Only when the last socket disappears:

socketA ❌
socketB ❌
socketC ❌

does the backend consider Levi offline.

7. The server now knows who is online

Suppose the server currently has:

onlineUsers


Levi
Ashwin
Ronaldo
Messi

The backend can get their IDs:

Array.from(onlineUsers.keys())

which gives something conceptually like:

[
    "leviId",
    "ashwinId",
    "ronaldoId",
    "messiId"
]

This is the online users list.

8. How does Ashwin receive this information?

This is where Socket.IO becomes powerful.

The server can broadcast:

io.emit(
    "get-online-users",
    Array.from(onlineUsers.keys())
);

Meaning:

Send the current online-user list to all connected clients.

So:

                 SERVER
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     Ashwin      Levi       Messi

Everyone receives something like:

[
    "leviId",
    "ashwinId",
    "messiId"
]
9. Frontend listens for the event

On Ashwin's frontend, you have something like:

socket.on("get-online-users", (userIds) => {
    setOnlineUserIds(
        new Set(userIds.map(id => id.toString()))
    );
});

This means:

"Whenever the server sends get-online-users, update my frontend state."

Suppose the server sends:

[
    "123",
    "456",
    "789"
]

The frontend stores:

Set {
    "123",
    "456",
    "789"
}
10. Why use a Set on the frontend?

Because you frequently want to ask:

"Is this particular user online?"

For example:

onlineUserIds.has(leviId)

If the answer is:

true

then:

🟢 Online

If:

false

then:

⚪ Offline

So your UI can basically do:

const isOnline = onlineUserIds.has(
    activeOtherUser._id.toString()
);
11. The complete online flow

Let's follow Levi from beginning to end.

Step 1 — Levi logs in
Levi
 ↓
Login
 ↓
JWT authentication
Step 2 — Socket connects
Levi Browser
 ↓
socket.connect()
 ↓
Socket.IO Server
Step 3 — Server authenticates socket
JWT
 ↓
User ID
 ↓
Levi
Step 4 — Server adds Levi
onlineUsers


Levi → socket123
Step 5 — Server broadcasts
io.emit(
    "get-online-users",
    onlineUsers
);
Step 6 — Ashwin receives it
Ashwin Browser
 ↓
socket.on("get-online-users")
 ↓
update onlineUserIds
Step 7 — UI checks Levi
onlineUserIds.has(leviId)

Result:

true

Therefore:

Levi
🟢 Online
12. Now the important part: Levi goes offline

Suppose Levi closes his browser.

The Socket.IO connection is broken:

Levi Browser
      X
      │
      │ disconnect
      ↓
Socket.IO Server

Socket.IO triggers:

socket.on("disconnect", () => {
    // remove user
});

The server now realizes:

"Levi's socket has disconnected."

13. Server removes Levi's socket

Suppose:

onlineUsers


Levi → socket123
Ashwin → socket456

Levi disconnects.

The server removes:

Levi → socket123 ❌

Now:

onlineUsers


Ashwin → socket456

Levi is no longer considered online.

14. Server broadcasts again

The server sends the updated list:

io.emit(
    "get-online-users",
    Array.from(onlineUsers.keys())
);

Now the list might be:

[
    "ashwinId"
]

Notice:

leviId

is gone.

15. Ashwin receives the update

Ashwin's existing listener receives:

socket.on("get-online-users", (userIds) => {
    setOnlineUserIds(
        new Set(userIds.map(id => id.toString()))
    );
});

Before:

onlineUserIds


{
    ashwinId,
    leviId
}

After:

onlineUserIds


{
    ashwinId
}
16. React automatically updates the UI

Now React checks:

onlineUserIds.has(leviId)

Result:

false

So React renders:

Levi
⚪ Offline

And you didn't refresh the page.

That's the magic of the real-time connection.

17. What if Levi signs out normally?

Ideally your logout code does something like:

socket.disconnect();

Then:

Logout button
      ↓
socket.disconnect()
      ↓
Server receives "disconnect"
      ↓
Remove Levi
      ↓
Broadcast updated users
      ↓
Ashwin receives update
      ↓
React updates UI

So:

🟢 Online

becomes:

⚪ Offline
18. What if Levi doesn't click Logout?

This is an important question.

What if he simply:

closes the tab
closes the browser
loses internet
shuts down his laptop
switches network

Socket.IO detects the connection being lost.

Eventually:

disconnect

is triggered.

The server can then remove that socket.

So you don't need the user to explicitly press Logout for presence to work.

19. The entire architecture

The easiest way to remember it is:

                 ┌──────────────────┐
                 │   Socket.IO      │
                 │     Server       │
                 └────────┬─────────┘
                          │
                 onlineUsers Map
                          │
              ┌───────────┼───────────┐
              ↓           ↓           ↓
           Ashwin        Levi        Messi
           Socket        Socket       Socket
              │           │           │
              ↓           ↓           ↓
           Browser      Browser      Browser

When someone connects:

CONNECT
   ↓
Identify user
   ↓
Add socket to onlineUsers
   ↓
Broadcast online users

When someone disconnects:

DISCONNECT
   ↓
Identify user
   ↓
Remove socket
   ↓
If no sockets remain → user offline
   ↓
Broadcast online users
20. Very important distinction: Login ≠ Online

This is one of the most important concepts.

A user can be:

Logged in

but:

Offline

For example:

Levi logged into the website
        ↓
Closes browser
        ↓
JWT still exists
        ↓
But Socket.IO connection is gone
        ↓
Levi = Offline

So:

Authentication answers:

"Who are you?"

JWT handles this.

Presence answers:

"Are you currently connected?"

Socket.IO handles this.

These are two different concepts.

21. Why don't we store online status directly in MongoDB?

You might wonder:

User {
    isOnline: true
}

Why not just do that?

You can, but it isn't ideal for real-time presence.

Imagine:

10,000 users

connecting and disconnecting frequently.

You'd constantly perform:

MongoDB UPDATE
MongoDB UPDATE
MongoDB UPDATE
MongoDB UPDATE
...

That's unnecessary overhead for temporary state.

Online status is usually better maintained in something like:

Memory
Redis
Socket.IO adapter

For a single backend server, your:

Map()

is perfectly reasonable for learning/small projects.

For a production system with multiple backend servers, Redis or another shared presence store is commonly used because every server needs to know about connections handled by the other servers.

22. The role of React

React isn't responsible for figuring out whether someone is online.

React's job is simply:

Receive information
       ↓
Store information
       ↓
Render UI

For example:

Socket.IO
   ↓
"Levi is online"
   ↓
React state
   ↓
isOnline = true
   ↓
🟢 Online

And:

Socket.IO
   ↓
"Levi is offline"
   ↓
React state
   ↓
isOnline = false
   ↓
⚪ Offline
23. The 4 pieces you should remember

If you forget everything else, remember these four things:

① Socket connection
Browser ↔ Socket.IO Server

A persistent connection tells the server that the client is connected.

② User identification
Socket → JWT → User ID

The backend knows which user owns the socket.

③ Online users store
onlineUsers

The backend tracks currently connected users.

④ Real-time event
io.emit("get-online-users", onlineUsers);

The server tells every frontend about changes.

24. One-line mental model

Think of your server as a receptionist maintaining a live attendance sheet:

                 SERVER
            "Who is connected?"
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
      Ashwin       Levi        Messi
       🟢           🟢           ⚪

Levi closes his browser:

Levi
  ↓
Socket disconnects
  ↓
Receptionist removes Levi
  ↓
Tells everyone
  ↓
Ashwin's screen changes

So the key idea is:

Online/offline status is not detected by the UI. The backend infers presence from active Socket.IO connections and continuously broadcasts the current presence state to connected clients.
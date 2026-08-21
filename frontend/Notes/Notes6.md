# When i am reloading on that upload page then its is returning false and null, but when i am navigating from different page to upload page then it is returning true with not nukk

This screenshot is actually very helpful. Your Socket.IO setup is working correctly.

Here's what's happening.

When you reload /upload

Timeline:

Browser reloads
        │
AuthInitializer mounts
        │
socket.connect() starts
        │
Upload page renders immediately
        │
Chat mounts
        │
socket.connected === false   ✅ (still connecting)
        │
Socket handshake finishes
        │
"connect" event fires
        │
socket.connected === true
socket.id === F34GPS...

That's exactly what your console shows:

On mount
connected: false
id: undefined

Connected event
connected: true
id: F34GPS...

This is expected behavior.

When you navigate from another page

The socket is already connected.

Timeline:

Home page
      │
socket already connected
      │
Navigate to Upload
      │
Chat mounts
      │
socket.connected === true
socket.id === F34GPS...

So you immediately get:

On mount
connected: true
id: F34GPS...

Again, this is expected.

The important takeaway

socket.connect() is asynchronous.

This:

socket.connect();

console.log(socket.connected);

does not mean:

connect
↓
connected = true

It actually means:

socket.connect()
        │
        ├── Starts handshake
        │
Immediately returns
        │
socket.connected === false
        │
(100–500 ms later)
        │
Handshake completes
        │
connect event
        │
socket.connected === true


Think of it like:

fetch("/api");

console.log("Done");

console.log("Done") runs before the network request finishes.



> Summary: 

useEffect runs after the first render.
api.get(...) is asynchronous.

So the sequence is actually:

<App renders>

Provider
│
├── AuthInitializer renders
│      └── returns children immediately
│
├── RouterProvider renders
│
└── Chat renders
something is strange, only tabs on edit profile are recieveing messages but others are not recieving, may they only connect to socket when they are on that page

Exactly. That's expected behavior with your current code.

Let's see why.

Right now

Only the EditProfile page renders:

<Chat />

That means only on this page does React execute:

useEffect(() => {
    socket.on("receive-message", (data) => {
        console.log(data);
    });
}, []);

When you leave EditProfile:

EditProfile
    │
Chat component unmounts
    │
receive-message listener disappears (or at least no new one exists)

So on the Home page there is no code listening for "receive-message".

Think of it like this

Your socket connection is alive for the entire app:

Browser
    │
Socket ✅ Connected

But event listeners only exist where you register them.

Home page:

Socket
   │
❌ No receive-message listener

Edit Profile:

Socket
   │
✅ receive-message listener

The server still sends:

io.emit("receive-message", data);

but if nobody is listening in that page, nothing happens.
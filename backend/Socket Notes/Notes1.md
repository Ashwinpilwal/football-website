# Socket Handler vs Controller

> ## Controllers

Controllers handle HTTP requests.

Example:

POST /users/login

↓

user.controller.js

↓

Login user

↓

Return JSON response

Example:

const loginUser = asyncHandler(async (req, res) => {
    ...
    res.status(200).json(...)
})

Controllers always receive:

req
res
Socket handlers

Socket handlers handle WebSocket events.

Example:

Client

↓

socket.emit("send-message")

↓

chat.socket.js

↓

Save message

↓

Emit to receiver

Instead of req and res, they receive a socket.

Example:

export const registerChatEvents = (socket) => {

    socket.on("send-message", async (data) => {

        console.log(data);

    });

};

There is no req or res.

Think of it like this
HTTP
Frontend
     |
POST /login
     |
Routes
     |
Controller
     |
Database
     |
JSON Response
Socket.IO
Frontend
     |
socket.emit("send-message")
     |
Socket Handler
     |
Database
     |
socket.emit("receive-message")

No routes.

No controllers.

Just events.

Your project architecture
src/

controllers/
    user.controller.js
    cafe.controller.js
    booking.controller.js

routes/
    user.routes.js
    cafe.routes.js
    booking.routes.js

socket/
    index.js
    chat.socket.js
    notification.socket.js
    booking.socket.js

models/

middlewares/

Notice there are two entry points into your backend.

HTTP requests
React

↓

POST /api/v1/users/login

↓

user.routes.js

↓

user.controller.js
WebSocket events
React

↓

socket.emit("send-message")

↓

chat.socket.js
Can socket handlers call controllers?

Technically yes, but it's not recommended.

A better pattern is:

Controller
        \
         \
      Service Layer
         /
        /
Socket Handler

Both the controller and the socket handler reuse the same business logic.

For example:

createBookingService()

↑                    ↑

booking.controller    booking.socket

This avoids duplicating code.
> First you need you RECALL...
# What actually is a server?
A computer or software system that stores and shares data, resources, or services with other computers, known as clients, over a network

# What is HTTP(Hypertext Transfer Protocol)?
the foundational set of rules used by web browsers and servers to exchange data, request web pages, and transfer files across the internet

> The network (TCP/IP) transfers the data. HTTP only defines what the data should look like.


# What are these SET of Rules?
> The rules of HTTP are things like:

> 1. Rule 1: Every request must have a method.

GET, POST, PUT, DELETE

Example: GET /users

The server knows you're asking to fetch users.

> 2. Rule 2: Every request must specify what resource it wants.
GET /users
GET /products
POST /login

The /users or /login part is the target resource.

> 3. Rule 3: Headers follow a specific format.
Content-Type: application/json
Authorization: Bearer abc123

The client and server both know that a header is written as:

Key: Value

> 4. Rule 4: If you're sending data, it goes in the body.
POST /login

{
  "email": "a@gmail.com",
  "password": "123456"
}

The server knows the JSON after the blank line is the request body.

> 5. Rule 5: The server must respond in a specific format.
HTTP/1.1 200 OK
Content-Type: application/json

{
  "name": "Ashwin"
}

The first line contains:

HTTP version
Status code
Status message

> 6. Rule 6: Status codes have agreed meanings.
200 → Success
201 → Created
400 → Bad Request
404 → Not Found
500 → Internal Server Error

Everyone using HTTP agrees on these meanings.

> HTTP is a standard format for requests and responses between a client and a server.
Client
   │
   │ HTTP Request
   │ (method, URL, headers, body)
   ▼
Server
   │
   │ HTTP Response
   │ (status code, headers, body)
   ▼
Client


# And how these Request/Response Transfers?

> These request/response tranfers through devices using TCP/IP

Browser
   │
   │ Creates an HTTP request
   ▼
TCP/IP
   │
   │ Breaks the request into packets and sends them
   ▼
Internet (routers, switches, cables, Wi-Fi)
   ▼
Server
   │
   │ Reassembles the packets
   │ Reads the HTTP request
   ▼
Express/Node.js
   │
   │ Creates an HTTP response
   ▼
TCP/IP
   │
   │ Sends the response back as packets
   ▼
Browser


HTTP → Defines what the request and response look like (method, URL, headers, body, status code).
TCP/IP → Carries those HTTP messages across the network.


# What is Express?

> Express is a JavaScript library (framework) for Node.js that helps you handle HTTP requests and create HTTP responses easily.

1. Without Express, Node.js gives you the raw HTTP server:

const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Hello");
  }
});

server.listen(8000);
Notice you're working directly with the HTTP request (req) and response (res).

2. With Express:

import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(8000);

Much shorter and easier.


> What does Express actually do?

When an HTTP request reaches your server:

Browser
   │
HTTP Request
   ▼
TCP/IP
   ▼
Node.js HTTP Server
   ▼
Express
   │
   ├── Checks the URL
   ├── Checks the method (GET, POST...)
   ├── Runs middleware
   ├── Calls the correct route handler
   ▼
Your Code
   │
res.send(...)
   ▼
Express
   ▼
HTTP Response


# Big Confusion:
> HTTP is NOT a server. It never becomes a server.

There are three different things:

HTTP → A message format (the rules for requests and responses).
Server → A machine or program that listens for requests.
Express → A library running on the server that helps process HTTP requests.


A server is a program running on a machine that listens for requests. Express gives me tools and functionality to easily handle those requests. An HTTP request is a standardized message format, and it travels over TCP/IP from the browser to the Node.js HTTP server, where Express processes it.




# When we open /register multer middleware will run, but we haven't input the data yet and what multer will upload?

>   Multer does NOT run when you open /register. It runs only when a request actually reaches that route.

    Suppose your route is:

    router.route("/register").post(
        upload.fields([
            {
                name: "avatar",
                maxCount: 1
            }
        ]),
        registerUser
    )

    Now imagine this flow:

1.  Step 1: User opens the registration page: 
        GET /register

        This is usually served by the frontend (React, HTML, etc.).

        No file is being sent. Multer does nothing.
2.  Step 2: User fills the form
        Name: Ash
        Email: ash@gmail.com
        Avatar: photo.jpg

        Still, Multer does nothing. The data is only inside the browser.
3.  Step 3: User clicks Submit

        The browser sends:

        POST /api/v1/users/register

        with multipart/form-data

        containing:

        fullName = Ash
        email = ash@gmail.com
        avatar = photo.jpg

    Now Express receives the request.

    Request
    │
    ▼
    upload.fields(...)
    │
    ▼
    Multer extracts the file [middleware]
    │
    ├── req.body
    └── req.files
    │
    ▼
    registerUser() [controller]

    Only at this moment does Multer work.


# Very Important Concept:
>   /register on react is different than /register of node. 

In full-stack development, it is very common to have:

Frontend
----------
/login
/register
/profile

Backend
----------
/api/v1/users/login
/api/v1/users/register
/api/v1/users/profile

This separation keeps the frontend and backend independent.


>   The difference between them...
1.  React /register 🖥️

Its job is to show a page.

User clicks Register
        │
        ▼
http://localhost:5173/register
        │
        ▼
React Router
        │
        ▼
Displays RegisterForm component

2.  Node /api/v1/users/register ⚙️

Its job is to process data.

POST http://localhost:8000/api/v1/users/register
        │
        ▼
Multer
        │
        ▼
registerUser Controller
        │
        ▼
MongoDB 


# Note: Kill node everywhere:
>   taskkill /F /IM node.exe 
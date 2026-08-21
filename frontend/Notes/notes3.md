but option will run on every time we switch route,and also we already have auth Layout

Good question. The answer is no, if you structure it correctly.

Let's distinguish between re-rendering and re-mounting.

If you do this:
<Provider store={store}>
    <AuthInitializer>
        <RouterProvider router={router} />
    </AuthInitializer>
</Provider>

AuthInitializer is above the router.

Its useEffect(() => {}, []) runs only once when the application first mounts.

When you navigate:

/home
    ↓
/profile
    ↓
/upload

React Router only changes the page inside RouterProvider. It does not unmount and remount AuthInitializer.

So the auth check does not run again on every route change.

Why isn't AuthLayout enough?

Because AuthLayout and auth initialization have different responsibilities.

AuthInitializer

Runs once.

Application Starts
        │
        ▼
GET /current-user
        │
        ▼
Update Redux

Its only job is:

"Figure out who the current user is."

AuthLayout

Runs whenever a protected route is rendered.

Reads Redux

↓

status = true ?

↓

Allow

or

Redirect

It doesn't fetch anything.

It simply checks the state that already exists.

Think of it like this
App Starts
        │
        ▼
AuthInitializer
        │
        ▼
Redux

status = true

        │
        ▼
Profile

AuthLayout checks Redux

↓

Allow

When you go to another page:

Upload

↓

AuthLayout

↓

Checks Redux

↓

Allow

No API call happens because Redux already knows who the user is.

For your project, I'd organize it like this:
src
│
├── main.jsx
│
├── App.jsx              // Header, Footer, Outlet
│
├── components
│     ├── AuthLayout.jsx
│     └── AuthInitializer.jsx
│
├── features
│     └── authSlice.js
│
└── pages
      ├── Login.jsx
      ├── Profile.jsx
      └── ...

This separation makes each piece do one job:

AuthInitializer → initialize authentication once when the app starts.
authSlice → store authentication state.
AuthLayout → protect routes based on that state.

That's a clean, scalable architecture used in many React applications.
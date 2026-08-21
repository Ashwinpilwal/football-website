# When i am redirecting "http://localhost:5173/profile/ashwin" through button then it's working, but when i am typing that same url "http://localhost:5173/profile/ashwin" then it's getting redirected to '/'


> ChatGpt Response:
🎯 BROOOOO. THIS CHANGES EVERYTHING.
This is the most important clue you've given.

✅ Clicking a button to go to /profile/ashwin works.
❌ Typing http://localhost:5173/profile/ashwin in the address bar redirects.

This is not a React Router bug and not your Profile component.

Here's what's happening

When you type: http://localhost:5173/profile/ashwin

the browser does a full page reload.

> On a fresh reload:

Redux Store created
↓
AuthLayout renders with
status = false
↓
App.jsx starts authentication check
↓
Before authentication finishes,
AuthLayout thinks the user is logged out
↓
Redirect happens

>Only after that, your App.jsx calls: api.get("/users/current-user")
gets the user and dispatches: sliceLogin(...)


But it's already too late. The redirect has already happened.

> Why clicking works:
When you click: Link to="/profile/ashwin" />

React Router does client-side navigation.

Your Redux store is already populated: status = true
So AuthLayout allows access.

This is the classic React auth problem.

> Your AuthLayout is checking authentication before your app finishes checking if the user is logged in.

Your AuthLayout

Right now you have: 
const [loading, setLoading] = useState(true);

useEffect(() => {

    if(!authStatus && authentication){
        navigate("/login")
    }

    ...

    setLoading(false);

}, [authStatus]);

This is wrong because authStatus starts as false.

> Proper solution: You need a third state.

Instead of: false && true

you need:
loading, authenticated, unauthenticated

For example:

authLoading = true
While checking

GET /current-user
don't render anything.

After it finishes: loading = false
Then AuthLayout decides.

> This is how professionals do it.

Example:

1. App starts
        ↓
2. loading = true
        ↓
3. GET /current-user
        ↓
4. success
        ↓
5. status = true
        ↓
6. loading = false
        ↓
7. AuthLayout renders

> instead of

1. App starts
        ↓
2. status = false
        ↓
3. AuthLayout redirects ❌
        ↓
4. GET /current-user
        ↓
5. status = true

Too late.

> This is actually a very common interview question

Many junior React developers make this mistake.

The fix is to have three auth states, not two.




> After Fixes:

Website opens
        │
        ▼
Redux created

status = false
loading = true
        │
        ▼
AuthLayout renders

loading == true

↓

Don't redirect.
Show Loading...

        │
        ▼

App.jsx calls

GET /users/current-user

        │
        ├──────────────┐
        │              │
        ▼              ▼

    Success          Failed

        │              │

sliceLogin()      sliceLogout()

status=true       status=false

loading=false     loading=false

        │              │
        ▼              ▼

AuthLayout runs again

        │
        ├──────────────┐
        │              │

status=true      status=false

        │              │

Show Page       Redirect Login



> Before Changes:
Browser Requests Page
        │
        ▼
React Application Starts
        │
        ▼
Redux Store is Created

status = false
        │
        ▼
React Renders Components
        │
        ├─────────────────────────────┐
        │                             │
        ▼                             ▼

App.jsx                       AuthLayout.jsx

Starts API Call               Reads authStatus

GET /users/current-user       authStatus = false

        │                             │
        │                             ▼
        │                     Assumes user is
        │                     not authenticated
        │                             │
        │                             ▼
        │                     navigate("/login")
        │
        ▼
Server Responds

status = true

dispatch(sliceLogin())

        │
        ▼

❌ Too Late

User has already been redirected.
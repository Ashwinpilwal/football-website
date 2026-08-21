# Make folders in powershell:
    -mkdir db middlewares models routes utils.

# Important Precautions:
1.  Whenever you talk to database, wrap that code in try-catch/promises
2.  Database is always in another continent - so always use async-await


# What is IIFE?
    That pattern is called an Immediately Invoked Function Expression (IIFE) — and because of async, more specifically an async IIFE. This immediately calls function.

    Basic Structure:

    (function () {
        // code here
    })();

    Or using an arrow function:

    (() => {
        // code here
    })();

# NOTE:
    After making some changes in .env, we have to manually restart server...
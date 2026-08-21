# Why sometimes we return and sometimes we don't?
>   1. Why do we return here?
    const asyncHandler = (requestHandler) => {
        return (req, res, next) => {
            Promise.resolve(requestHandler(req, res, next))
                .catch((err) => next(err))
        }
    }

    asyncHandler is a function that returns another function.

    When you write:

    const registerUser = asyncHandler(async (req, res) => {
        res.status(200).json({
            message: "Ok"
        })
    })

    it is actually doing this:

    const registerUser = (req, res, next) => {
        Promise.resolve(
            (async (req, res) => {
                res.status(200).json({
                    message: "Ok"
                })
            })(req, res, next)
        ).catch(err => next(err))
    }

    Without return, asyncHandler() would return undefined.

    For example:

    const test = () => {
        return () => {
            console.log("Hello")
        }
    }

    const x = test()
    x() // Hello

    But without return:

    const test = () => {
        () => {
            console.log("Hello")
        }
    }

    const x = test()
    console.log(x) // undefined

    So the return is necessary because Express needs an actual middleware function.

>   2. Why don't we return inside registerUser?
    const registerUser = asyncHandler(async (req, res) => {
        res.status(200).json({
            message: "Ok"
        })
    })

    Because this callback's job is simply to send a response.

    res.status(200).json({
        message: "Ok"
    })

    After sending the response, the function ends naturally.

>   3. When do we use return in Express?

    Suppose you have:

    const registerUser = asyncHandler(async (req, res) => {

        if (!req.body.email) {
            return res.status(400).json({
                message: "Email required"
            })
        }

        res.status(200).json({
            message: "Success"
        })
    })

    The return here prevents the rest of the function from running.

    Without it:

    if (!req.body.email) {
        res.status(400).json({
            message: "Email required"
        })
    }

    res.status(200).json({
        message: "Success"
    })

    Express would try to send two responses, causing:
    Error: Cannot set headers after they are sent to the client


>   Simple rule to remember 📌
    1. return (req, res, next) => { ... }
        Needed because asyncHandler must return a middleware function.
    2. res.status(...).json(...)
        No return needed if it's the last line.
    3. return res.status(...).json(...)
        Used when you want to stop further execution of the function.
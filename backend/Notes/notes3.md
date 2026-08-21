# Why wrap with asyncHandler in the first place?
Because async route functions can throw errors, and Express doesn’t always catch them automatically.

const asyncHandler = (fn) => {
    return (req, res) => {
        try{

        }catch(error){
            console.log(error)
        }
    }
}


# Custom Error Class
>   1. Why make a custom error class?

JavaScript already has: throw new Error("Something went wrong")

But normal Error only gives basic info:

1. message
2. name
3. stack

In backend/API we usually need more:

HTTP status code (404, 500)
success status
extra validation errors
consistent response format

That's why me make Custom Class.

>   2. class ApiError extends Error

Means: “Create my custom error using JavaScript’s built-in Error as base.”


>   3. Why super(message)?

Its' like “pass the message to parent Error so it can set itself up.”

super("wrong message")
this.message = "new message" -----> We can do this, only after super(...)

    # Why this.message only after super(message)?
    >   Because before super() there is no "this" yet.
        Parent Error must get first chance to create the object.

        This line: super(message)

        runs parent constructor: Error(message)

        Parent creates: this
        and adds: message, stack, name

        Now object exists. Now you can write this.message

1. this object is actually created by the parent (Error) constructor. Until super() runs, this doesn't exist yet.

>  Notice: Your ApiResponse class is different

    class ApiResponse {
        constructor(
            statusCode,
            data,
            message = "Success"
        ) {
            this.statusCode = statusCode;
            this.data = data;
            this.message = message;
        }
    }

Notice: class ApiResponse does not extend another class.

So there is no parent constructor to call.
That's why there is no super() at all.


# videoSchema.plugin(mongooseAggregatePaginate), what is this shit?

>   Simple meaning: 👉 “Attach the aggregate pagination feature to this schema.”

    So after this, your Video model gets extra powers.

    Example:

        Without plugin:

            const videos = await Video.aggregate([
            { $match: { isPublished: true } }
            ])

            This gives all results.

        With plugin:

            const videos = await Video.aggregatePaginate(
            Video.aggregate([
                { $match: { isPublished: true } }
            ]),
            {
                page: 1,
                limit: 10
            }
            )

            Now you get:

            {
                docs: [...10 videos],
                totalDocs: 50,
                page: 1,
                totalPages: 5
            }


# userSchema.pre("save", ...), userSchema.methods.isPasswordCorrect = ..., why schema, not model?

>   Answer: Because model is made from schema.

    First: const userSchema = new mongoose.Schema({...})

    Then add extra things:  userSchema.pre(...)
                            userSchema.methods...

    Then create model: const User = mongoose.model("User", userSchema)

    Now User gets all of that.

>   userSchema.pre("save", ...) 
        means: Just before saving the user to the database, this function will run

>   We can call schema methods from any file, as long as you have the User model and a document instance(basically declared on top).
    const user = await User.findOne({ username: "john" });

    The variable user now contains only John's document:

        {
            _id: 2,
            username: "john",
            password: "xyz789"
        }

    When you call:

        await user.save();
        await user.isPasswordCorrect(password);


# Note:
>   We cannot use this. in arrow functions. To use this. we must use normal function: function(){}


# How to import Another Schema into the Schema?

    This Schema exists Somewhere: const videoSchema = mongoose.Schema(...)

    watchHistory: [
        {
            type: Schema.types.ObjectId,
            ref: "Video"
        }
    ],
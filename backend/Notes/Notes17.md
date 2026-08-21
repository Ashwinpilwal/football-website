# Express Route Order Bug — CastError: Cast to ObjectId failed
The Problem

Suppose you have these two routes:

router.route("/:postId").get(getPostById);


router.route("/all").get(getAllPosts);

You make this request:

GET /posts/all

You expect:

/all → getAllPosts

But Express matches:

/:postId

first.

So Express interprets:

postId = "all"

and calls:

getPostById(req, res)

Inside the controller:

const { postId } = req.params;


const post = await Post.findById(postId);

MongoDB/Mongoose receives:

Post.findById("all");

But MongoDB _id is an ObjectId, and "all" is not a valid ObjectId.

Therefore:

CastError: Cast to ObjectId failed for value "all"
Why does Express do this?

Express matches routes from top to bottom.

This route:

/:postId

is a dynamic route.

It matches almost any single path segment:

/123
/abc
/all
/hello
/football

So if it appears before /all, Express doesn't know that "all" was supposed to be a special endpoint.

It simply thinks:

/all
 ↓
postId = "all"
❌ Wrong
router.route("/:postId").get(getPostById);


router.route("/all").get(getAllPosts);

Request:

/posts/all

Flow:

/posts/all
      ↓
/:postId
      ↓
postId = "all"
      ↓
getPostById()
      ↓
Post.findById("all")
      ↓
❌ CastError
✅ Correct

Put specific/static routes before dynamic routes:

router.route("/all").get(getAllPosts);


router.route("/:postId").get(getPostById);

Now:

/posts/all
      ↓
/all
      ↓
getAllPosts()
      ↓
✅ Works

And:

/posts/66c8f2...
      ↓
/all ❌
      ↓
/:postId ✅
      ↓
getPostById()
      ↓
Post.findById("66c8f2...")
      ↓
✅ Works
🧠 Rule to remember

In Express, define specific/static routes before dynamic parameter routes.

Good:
router.get("/all", getAllPosts);
router.get("/create", createPost);
router.get("/featured", getFeaturedPosts);


router.get("/:postId", getPostById);
Bad:
router.get("/:postId", getPostById);


router.get("/all", getAllPosts);
router.get("/create", createPost);
router.get("/featured", getFeaturedPosts);

Because /:postId can accidentally capture:

all
create
featured
Easy mental model

Think of:

/:postId

as a wildcard for one path segment.

So always put:

Specific routes
      ↓
Dynamic routes
      ↓
Catch-all routes

This is a very common Express bug and definitely worth remembering when you build larger APIs.
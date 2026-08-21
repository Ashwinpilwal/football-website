import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))   //parse json data
app.use(express.urlencoded({extended: true, limit: "16kb"}))  //parse url data
app.use(express.static("public")) //you to access public folder
app.use(cookieParser())


// Routes import

import userRouter from "./routes/user.routes.js"
import followRouter from "./routes/follow.routes.js"
import videoRouter from "./routes/video.routes.js"

import playlistRouter from "./routes/playlist.routes.js"
import commentRouter from "./routes/comment.routes.js"

import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"


import pitchRouter from "./routes/pitch.routes.js";
import chatRouter from "./routes/chat.routes.js"
import messageRouter from "./routes/message.route.js"

import turfRouter from "./routes/turf.routes.js"
import bookingRouter from "./routes/booking.routes.js"
import ratingRouter from "./routes/rating.routes.js"

import sectionRouter from "./routes/section.routes.js"
import postRouter from "./routes/post.routes.js"
import footballAiRouter from "./routes/footballAi.routes.js"



// Routes declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/videos", videoRouter)


app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/comments", commentRouter)

app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/tweets", tweetRouter)


app.use("/api/v1/pitches", pitchRouter);

app.use("/api/v1/chats", chatRouter)
app.use("/api/v1/messages", messageRouter)

app.use("/api/v1/turfs", turfRouter)
app.use("/api/v1/bookings", bookingRouter)
app.use("/api/v1/ratings", ratingRouter)

app.use("/api/v1/sections", sectionRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/ai", footballAiRouter)



export {app}
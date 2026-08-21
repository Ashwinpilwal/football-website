# Note:
>   Req.files look like this:
 
  [Object: null prototype] {
    avatar: [
        {
            fieldname: 'avatar',
            originalname: '_arnav_0_9__AQPIRKMClBSmaLWsB4yuoQevTBijZ6aFsBnjQ1VRFG_r1fG5IMcwXLNgUZUlAFXtz1tlOV_uWUF5rXaxiuTHv9Ox.mp4',
            encoding: '7bit',
            mimetype: 'video/mp4',
            destination: 'public/temp',
            filename: '_arnav_0_9__AQPIRKMClBSmaLWsB4yuoQevTBijZ6aFsBnjQ1VRFG_r1fG5IMcwXLNgUZUlAFXtz1tlOV_uWUF5rXaxiuTHv9Ox.mp4',
            path: 'public\\temp\\_arnav_0_9__AQPIRKMClBSmaLWsB4yuoQevTBijZ6aFsBnjQ1VRFG_r1fG5IMcwXLNgUZUlAFXtz1tlOV_uWUF5rXaxiuTHv9Ox.mp4',
            size: 3043823
        }
    ]
  }
>   That's why we do:
    const avatarLocalPath = req.files?.avatar?.[0]?.path 
    const avatar = await uploadOnCloudinary(avatarLocalPath)





# i some entry where only like the comment , comment field is there but video field is not there, similarly when i like video, comment field is not there, how can i get all the video from dB where req.user.Id ==" " and video field exists

You're thinking in the right direction. Since your Like collection stores video likes, comment likes, and tweet likes in the same collection, you need to filter out only the documents where the video field exists.

For example, your collection might look like this:

// Video like
{
    _id: 1,
    video: ObjectId("v1"),
    likedBy: ObjectId("u1")
}

// Comment like
{
    _id: 2,
    comment: ObjectId("c1"),
    likedBy: ObjectId("u1")
}

// Tweet like
{
    _id: 3,
    tweet: ObjectId("t1"),
    likedBy: ObjectId("u1")
}

To get only the videos liked by the current user, you can query like this:

const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true }
});

or even better:

const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $ne: null }
});
But here's the catch...

This query returns Like documents, not Video documents.

Example result:

[
    {
        _id: "...",
        video: ObjectId("v1"),
        likedBy: ObjectId("u1")
    },
    {
        _id: "...",
        video: ObjectId("v2"),
        likedBy: ObjectId("u1")
    }
]
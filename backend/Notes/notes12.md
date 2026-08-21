# Note:
1. Aggregation Pipeline code directly goes to MongoDB, because mongoose doesn't do work in pipeline.

>   That's why we do:
    _id = new mongoose.Types.ObjectId(req.user._id )

    instead of: _id = req.user._id

2. $lookup: {
        from: "video",
    ...}
    > means kahan se lookup karna ha,  


# returned dummy data of getWatchHistory: 

{
    _id: ObjectId("u1"),
    username: "ashwin",

    watchHistory: [
        {
            _id: ObjectId("v1"),
            title: "NodeJS Tutorial",

            owner: [
                {
                    fullName: "Hitesh",
                    username: "chaiaurcode",
                    avatar: "avatar.jpg"
                }
            ]
        },

        {
            _id: ObjectId("v2"),
            title: "MongoDB Tutorial",

            owner: [
                {
                    fullName: "Piyush",
                    username: "piyush",
                    avatar: "avatar2.jpg"
                }
            ]
        }
    ]
}

# Note:
If two $lookup stages are placed one after another, the second $lookup does not automatically use the filtered data produced inside the first $lookup. However, if the second $lookup is nested within the first $lookup's pipeline, it operates on the documents already filtered by the first $lookup.
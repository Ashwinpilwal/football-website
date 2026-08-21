    
> 1. fetching all the comments of the video   

    const comments = await Comment.find({
        video: videoId
    }).select("_id")

    

    "data": [
        {
            "_id": "6a43e385452a47bf8ac616cf"
        },
        {
            "_id": "6a43e389452a47bf8ac616d0"
        },
        {
            "_id": "6a43e38c452a47bf8ac616d1"
        },
        {
            "_id": "6a43e390452a47bf8ac616d2"
        },
        {
            "_id": "6a43e393452a47bf8ac616d3"
        }
    ],


> 2. Extracting all the ids of comments using Mapping 

    const commentsIds = comments.map((comment) => comment._id)

    "data": [
        "6a43e385452a47bf8ac616cf",
        "6a43e389452a47bf8ac616d0",
        "6a43e38c452a47bf8ac616d1",
        "6a43e390452a47bf8ac616d2",
        "6a43e393452a47bf8ac616d3"
    ],




# I can delete all the comments and likes on the video, but how will I delete all the likes on the comments of the video.


When you delete a video, you should also delete:

1. ✅ The video itself.
2. ✅ All comments on that video.
3. ✅ All likes on that video.
4. ✅ All likes on those comments.

> Step 1: Delete the video

You're already doing this.

await Video.findByIdAndDelete(videoId);

> Step 2: Delete all comments

await Comment.deleteMany({
    video: videoId
});

> Step 3: Delete likes on the video

Since your Like schema has video: ObjectId

you can simply do

await Like.deleteMany({
    video: videoId
});

> Step 4: Delete likes on comments


Suppose your comments are

Comment 1
Comment 2
Comment 3

Each has its own _id.

Your Like documents look like

{
    comment: commentId,
    likedBy: ...
}

1. So first get all comment IDs.

const comments = await Comment.find(
    {
        video: videoId
    }
).select("_id");

Now you'll have

[
    { _id: 1 },
    { _id: 2 },
    { _id: 3 }
]

2. Extract the IDs.

const commentIds = comments.map(comment => comment._id);

3. Now delete likes whose comment is one of those IDs.

await Like.deleteMany({
    comment: {
        $in: commentIds
    }
});

 $in means: 
Delete likes whose comment is in this array.


> So the correct order is

1. Find comments
        ↓
2. Extract IDs
        ↓
3. Delete comment likes
        ↓
4. Delete comments
        ↓
5. Delete video likes
        ↓
6. Delete video
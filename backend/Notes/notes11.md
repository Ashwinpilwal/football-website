# Why we using Joined? We can do find number of subscribers = (no of fields find from Subscription model where channel  == req.params.channename), why we even need User model here and join it?

>   Response:

{
  fullName: "Ashwin",
  username: "ashwin",
  avatar: "...",
  coverImage: "...",
  subscribersCount: 120,
  channelsSubscribedToCount: 45,
  isSubscribed: true
}

Notice that:

1. fullName, username, avatar, coverImage → come from User
2. subscribersCount, channelsSubscribedToCount, isSubscribed → comes from Subscription

# Misunderstanding: I thought channel in Subscription Schema is "Channel Name" like "Zeastien"/"Mr. Least"

>   No. Let's say you have:

1. Users
{
    _id: ObjectId("111"),
    username: "ashwin",
    fullName: "Ashwin"
}
{
    _id: ObjectId("222"),
    username: "mrbeast",
    fullName: "Mr Beast"
}

2. Subscription

Ashwin subscribes to MrBeast:
{
    subscriber: ObjectId("111"),
    channel: ObjectId("222")
}

>   Notice:
subscriber stores User _id
channel stores User _id

No usernames are stored.


# Dummy data Returned in each Aggregation Step:

> User collection
    {
        _id: ObjectId("555"),
        username: "mrbeast",
        fullName: "Mr Beast",
        avatar: "avatar.jpg",
        coverImage: "cover.jpg"
    }

> Subscription collection
    {
        subscriber: ObjectId("201"),
        channel: ObjectId("555")
    }
    {
        subscriber: ObjectId("202"),
        channel: ObjectId("555")
    }
    {
        subscriber: ObjectId("203"),
        channel: ObjectId("555")
    }

> And Mr Beast himself subscribes to 2 channels:

    {
        subscriber: ObjectId("555"),
        channel: ObjectId("301")
    }
    {
        subscriber: ObjectId("555"),
        channel: ObjectId("302")
    }

> Assume the logged-in user is:
    req.user._id = ObjectId("202")
    

---------------------------------------------------
> After $match
  [
    {
        _id: ObjectId("555"),
        username: "mrbeast",
        fullName: "Mr Beast",
        avatar: "avatar.jpg",
        coverImage: "cover.jpg"
    }
  ]
> After first $lookup
  [
    {
        _id: ObjectId("555"),
        username: "mrbeast",
        fullName: "Mr Beast",

        subscribers: [     //$lookup explicitly added this field 
            {
                subscriber: ObjectId("201"),
                channel: ObjectId("555")
            },
            {
                subscriber: ObjectId("202"),
                channel: ObjectId("555")
            },
            {
                subscriber: ObjectId("203"),
                channel: ObjectId("555")
            }
        ]
    }
  ]

> After second $lookup
  [
    {
        _id: ObjectId("555"),
        username: "mrbeast",

        subscribers: [
            { subscriber: ObjectId("201"), channel: ObjectId("555") },
            { subscriber: ObjectId("202"), channel: ObjectId("555") },
            { subscriber: ObjectId("203"), channel: ObjectId("555") }
        ],

        subscribedTo: [
            { subscriber: ObjectId("555"), channel: ObjectId("301") },
            { subscriber: ObjectId("555"), channel: ObjectId("302") }
        ]
    }
  ]
> After $addFields
  [
    {
        _id: ObjectId("555"),
        username: "mrbeast",

        subscribersCount: 3,
        channelsSubscribedToCount: 2,
        isSubscribed: true,

        subscribers: [...],
        subscribedTo: [...]
    }
  ]

> Why isSubscribed: true?

Because: req.user._id = ObjectId("202")

and

"$subscribers.subscriber"

becomes:

[
  ObjectId("201"),
  ObjectId("202"),
  ObjectId("203")
]

So:

-> $in: [
    ObjectId("202"),
    [
      ObjectId("201"),
      ObjectId("202"),
      ObjectId("203")
    ]
]

returns: true

> After $project (final result)
  [
    {
        fullName: "Mr Beast",
        username: "mrbeast",
        subscribersCount: 3,
        channelsSubscribedToCount: 2,
        isSubscribed: true,
        avatar: "avatar.jpg",
        coverImage: "cover.jpg"
    }
  ]

Then: channel[0] becomes:

{
  fullName: "Mr Beast",
  username: "mrbeast",
  subscribersCount: 3,
  channelsSubscribedToCount: 2,
  isSubscribed: true,
  avatar: "avatar.jpg",
  coverImage: "cover.jpg"
}

which is what gets sent in the API response.
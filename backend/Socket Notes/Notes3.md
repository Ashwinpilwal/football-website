# can we make a common model with sender, participents, messgageand ...

Yes, you can, and many beginners start that way. For a small project it works.

For example:

const messageSchema = new Schema(
{
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    message: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

Then every message looks like:

{
    "sender": "Ashwin",
    "participants": [
        "Ashwin",
        "Rahul"
    ],
    "message": "Hi"
}

The next message:

{
    "sender": "Rahul",
    "participants": [
        "Ashwin",
        "Rahul"
    ],
    "message": "Hello"
}

For a group:

{
    "sender": "Ashwin",
    "participants": [
        "Ashwin",
        "Rahul",
        "Priya",
        "Aman"
    ],
    "message": "Exam postponed!"
}

This works.

Why isn't this used in production?

Imagine a chat with 50,000 messages.

Every single message stores:

Ashwin
Rahul
Priya
Aman

again and again.

Message1
participants
    Ashwin
    Rahul
    Priya
    Aman

Message2
participants
    Ashwin
    Rahul
    Priya
    Aman

Message3
participants
    Ashwin
    Rahul
    Priya
    Aman

...
50000 messages

You're repeating the same data 50,000 times.

With a Chat model:

Chat
participants
    Ashwin
    Rahul
    Priya
    Aman

Every message only stores:

chat = chat123
sender = Ashwin
message = "Hi"

Much smaller.

Another problem

Suppose Rahul leaves the group.

With your schema, you'd have to update the participants array in every old message if you wanted them to reflect the current group membership.

With a Chat model, you update one document:

Chat
participants
    Ashwin
    Priya
    Aman

Done.

Which should you choose?
If this is a learning project with only private chat:

Your single-schema idea is perfectly acceptable and easier to understand.

If you want your project to resemble WhatsApp, Discord, or Messenger:

Use two models:

Chat
Message

It's more scalable, avoids duplicated data, and makes advanced features (group chats, chat settings, unread counts, last message, pinned chats) much easier to build.

So your idea is correct and will work. The reason experienced developers separate Chat and Message isn't because your design is wrong—it's because they optimize for scalability, maintainability, and future features.
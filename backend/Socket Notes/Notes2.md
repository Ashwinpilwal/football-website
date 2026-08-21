# Different Approaches of Storing messages in DB

Approach 1: sender + receiver

Message:

{
    "sender": "Ashwin",
    "receiver": "Rahul",
    "message": "Hi"
}

Works perfectly.

Now suppose you create a group:

College Friends

Ashwin
Rahul
Priya
Aman

Ashwin sends:

"Let's meet tomorrow."

Who is the receiver?

{
    "sender": "Ashwin",
    "receiver": ???,
    "message": "Let's meet tomorrow."
}

Is the receiver:

Rahul?
Priya?
Aman?
All three?

The schema doesn't support it.

Approach 2: Using Chat

First create a chat.

{
    "_id": "chat123",

    "participants": [
        "Ashwin",
        "Rahul",
        "Priya",
        "Aman"
    ]
}

Now every message is simply:

{
    "chat": "chat123",

    "sender": "Ashwin",

    "message": "Let's meet tomorrow."
}

Now everyone inside participants receives the message.

No need for a receiver field.

Visualize it
Chat
│
├── Name: College Friends
│
├── Participants
│      ├── Ashwin
│      ├── Rahul
│      ├── Priya
│      └── Aman
│
└── Messages
       │
       ├── Ashwin : Hi
       ├── Rahul : Hello
       ├── Priya : Good morning
       └── Aman : Let's meet tomorrow

Notice every message has only one sender.

The receiver is automatically:

Everyone else in that chat.

That's why the message schema becomes simple
{
    chat,
    sender,
    message
}

No receiver.

Because the receiver is determined by:

Chat.participants




The Chat document defines who is in the conversation, and each Message simply belongs to that conversation.

That's why almost every modern messaging system (WhatsApp, Discord, Slack, Messenger, Telegram) has the concept of a conversation/chat separate from messages. It scales naturally from one-to-one chats to groups without changing the message schema.



# so there will be two documents created for each message send ? 

This is a common misconception. No.

A new Chat document is not created for every message.

Let's walk through it.

First message ever

Ashwin sends Rahul:

Hi

Since no conversation exists yet:

Chat Collection

Create one document.

{
    "_id": "chat123",
    "participants": ["Ashwin", "Rahul"],
    "lastMessage": "message1"
}
Message Collection

Create one document.

{
    "_id": "message1",
    "chat": "chat123",
    "sender": "Ashwin",
    "message": "Hi"
}

So for the very first message, you create:

✅ 1 Chat document
✅ 1 Message document
Second message

Rahul replies:

Hello

Do we create another Chat?

No.

The conversation already exists.

Only create:

{
    "_id": "message2",
    "chat": "chat123",
    "sender": "Rahul",
    "message": "Hello"
}

Then update the Chat document:

{
    "_id": "chat123",
    "participants": ["Ashwin", "Rahul"],
    "lastMessage": "message2"
}

Notice the Chat document is updated, not recreated.

Third message

Ashwin:

How are you?

Again:

Only create

{
    "_id": "message3",
    "chat": "chat123",
    "sender": "Ashwin",
    "message": "How are you?"
}

Update:

lastMessage = message3
After 1000 messages
Chats Collection

Only one document.

chat123
Messages Collection
message1
message2
message3
...
message1000

Every message points to:

chat123
Visual
Chat
│
└── chat123
     │
     ├── participants
     │      ├── Ashwin
     │      └── Rahul
     │
     └── lastMessage
            │
            ▼
         message1000

Messages

message1 ───────► chat123
message2 ───────► chat123
message3 ───────► chat123
...
message1000 ────► chat123
Typical flow

When the user clicks "Send":

User clicks Send
        │
        ▼
Does a chat already exist?
        │
   ┌────┴────┐
   │         │
  No        Yes
   │         │
Create Chat  │
   │         │
   └────┬────┘
        ▼
Create Message
        ▼
Update lastMessage in Chat

So the Chat is created once per conversation, while Message documents are created once per message. That's the design used by most modern messaging systems because it scales efficiently.





# How we gonna fetch the chats between users?

You don't fetch messages by checking chat.participants inside the Message collection.

Instead, you do it in two steps.

Step 1: Find the chat

Suppose Ashwin opens Rahul's chat.

First find the chat document:

Chat.findOne({
    participants: {
        $all: [ashwinId, rahulId]
    }
});

This returns:

{
    "_id": "chat123",
    "participants": ["ashwinId", "rahulId"]
}

Now you know the chat's ID is:

chat123
Step 2: Fetch all messages of that chat

Now query the Message collection:

Message.find({
    chat: "chat123"
}).sort({ createdAt: 1 });

MongoDB returns:

Hi
Hello
How are you?
Let's meet tomorrow
Why not query participants every time?

Imagine you have 1 million messages.

Each message only stores:

{
    "chat": "chat123",
    "sender": "...",
    "message": "..."
}

If every message also stored participants, you'd be repeating the same participant information millions of times.

Instead, every message simply points to its chat:

message1 ───► chat123
message2 ───► chat123
message3 ───► chat123

Much cleaner.

The complete flow
User clicks Rahul
        │
        ▼
Find Chat
participants = [Ashwin, Rahul]
        │
        ▼
Found chat123
        │
        ▼
Find all Messages
where chat = chat123
        │
        ▼
Display conversation

This is the standard pattern used by chat applications.

Tip: To make Step 1 fast, create the chat once when the first message is sent. After that, the frontend usually already knows the chatId. When the user clicks a conversation in their chat list, you can simply call:

GET /messages/chat/:chatId

and fetch:

Message.find({ chat: chatId })

without searching by participants every time. This is one of the main reasons the Chat model exists.
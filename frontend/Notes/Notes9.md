# Compare emit vs on

> ## emit

socket.emit("send-message", data);

Means:

"Send this event once."

After sending, it's finished.

No cleanup needed.

on
socket.on("receive-message", handleReceiveMessage);

Means:

"Whenever this event happens in the future, call this function."

This listener stays alive until you remove it.

That's why we do:

socket.off("receive-message", handleReceiveMessage);
Analogy
emit

Like making a phone call.

Dial
↓

Talk

↓

Hang up

Done

Nothing to clean up.

> ## on

Like subscribing to a YouTube channel.

Subscribe

↓

Every new video
↓

Notification
↓

Notification
↓

Notification

If you no longer want notifications:

Unsubscribe

That's what socket.off() does.

Rule to remember
Method	Cleanup Needed?
socket.emit()	❌ No
socket.on()	✅ Yes
socket.once()	❌ No (automatically removes itself after the first event)

So your handleSendMessage is perfectly fine. The duplicate messages you're seeing are almost certainly coming from multiple socket.on("receive-message", ...) listeners being registered, not from socket.emit().
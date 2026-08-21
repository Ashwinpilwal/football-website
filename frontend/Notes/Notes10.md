# Common Mistake

❌ This is wrong
socket.on("receive-message", (data) => {
    console.log(data)
})

return () => {
    socket.off("receive-message", (data) => {
        console.log(data)
    })
}

The function inside on() and the function inside off() are different functions.

JavaScript sees them like this:

// Function #1
(data) => {
    console.log(data)
}

Later

// Function #2
(data) => {
    console.log(data)
}

They look identical, but they are not the same object.

So Socket.IO says:

"I don't have this function registered."

Nothing gets removed.

Correct way
useEffect(() => {

    const getUserData = async () => {
        try {
            const response = await api.get(`/users/channel/${username}`);
            setReceiverId(response.data.data._id);
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    getUserData();

    const handleReceiveMessage = (data) => {
        console.log(data);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
        socket.off("receive-message", handleReceiveMessage);
    };

}, [username]);

Now the same function reference is passed to both on() and off().
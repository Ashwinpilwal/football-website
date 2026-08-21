# Big Security Bug Fix:

> ## Code 1: 
const groupChatDetails = await Chat.findById(chatId)

> ## Code 2:  
const groupChatDetails = await Chat.find({  
    _id: chatId,  
    participants: {  
        $in: [req.user._id]  
    }  
})  


> The difference is:

Lets say the members in Group Chat is:   
{  
    Ashwin,  
    Messi,  
    Neymar  
}  

And group chat  id is:   
{ http://localhost:5173/chat/group/6a7ac4355c8136b28583472f }


The Some Uninvited Guy(Ronaldo) is trying to break in:   
1.  Ronaldo is Logged so he will Not get any JWT error
2.  code 1 is not validating if ronalso is in particiation of group or not
3. He will get all group data
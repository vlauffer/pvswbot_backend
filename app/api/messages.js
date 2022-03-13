const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');
const Graphemer = require('graphemer').default;
const splitter = new Graphemer();

const router = new Router();


router.post('/', (req, res)=> {
    // if there are no messages in the request, send "no messages" and return empty
    if (req.body.messages<1) {
        res.send("no messages")
        return;
    }

    var messageArray = populateMessageArray(req.body.messages);
    var userArray = [];
    var emojiArray = [];
    var userMap = new Map();

    //insert all of our messages, and if there are any duplicates, do not add their corresponding user and emoji data into the db
    MessageManager.insertMessages(messageArray)
        .then(({duplicates})=>{
            var duplicatesMap = new Map()
            duplicates.forEach(duplicate => {
                duplicatesMap.set(duplicate.message_id,duplicate.source)
            });

            req.body.messages.forEach(message => {
                // if message is a duplicate, move on to the next message
                if(duplicatesMap.get(message.message_id)=='s') return;

                //splits message content into characters, where each character can also be an emoji (takes into account compound emojis)
                var emojis = splitter.splitGraphemes(message.content);
                
                //if character is emoji, then add it to the emojiArray
                if (emojis!=null ){
                    emojis.forEach(emoji => {
                        if(/\p{Extended_Pictographic}/u.test(emoji)){
                            emojiArray.push(
                                [
                                    message.channel_id,
                                    message.message_id,
                                    message.user_id,
                                    emoji
                                ]
                            )
                        }
                    });
                }

                // if the user has already been added to the userMap, do not add them again
                if(!userMap.has(message.user_id)){
                    userMap.set(message.user_id, true);
                    userArray.push(
                        [
                            message.user_id,
                            message.username,
                        ]
                    )
                }
            });

            //insert the users and emojis into their corresponding tables
            
            UserManager.insertUsers(userArray)
                .then()
                .catch(error=>console.error(error));

            EmojiManager.insertEmojis(emojiArray)
                    .then()
                    .catch(error=>console.error(error));
        
        }).catch(error=>console.error(error));

    

    res.send("Inserting messages")

    
});

//for each message, populate an array of user_id, channel_id, message_id, and message content, and append this array to the arrayPlaceholder.
//returns fully populated array of messages
function populateMessageArray(messages){
    var arrayPlaceholder =[];
    messages.forEach(message => {
        arrayPlaceholder.push(
            [

                message.user_id,
                message.channel_id,
                message.message_id,
                message.content

            ]
        );
    });
    return arrayPlaceholder;
}


module.exports= router;
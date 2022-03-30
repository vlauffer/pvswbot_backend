const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');
const Graphemer = require('graphemer').default;
const splitter = new Graphemer();
const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');
const router = new Router();

router.post('/add', (req, res)=> {
    parseAndInsertMessages(req.body.messages).then(()=>{
        // console.log("Successful insertion");
        res.send("Successful insertion");
    }).catch(err=>{
        console.error(err)
        res.send(err)
    });

    // pool.query(finalQuery).then(()=>{
    //     console.log("Successful insertion");
    //     res.send("Successful insertion");
    // }).catch(err=>{
    //     console.error(err)
    //     res.send(err)
    // });



    
});

router.post('/edit', (req, res)=> {

    var message = req.body.message;
    deleteMessage(message.message_id)
    .then(()=>{
        parseAndInsertMessages([message]).then(()=>{
            res.send("edit successful");
        })
        .catch(err=>{
            console.error(err);
            res.send(err);
        });
    })
    .catch(err=>{
        console.error(err);
        res.send(err);
    });

});

router.post('/delete', (req, res)=> {

    var message = req.body.message;
    deleteMessage(message)
    .then(()=>{
        res.send("deletion of " + req.body.message+ " successful");
    })
    .catch(err=>{
        console.error(err);
        res.send(err);
    });

});


function parseAndInsertMessages(messages){

    // if there are no messages in the request, send "no messages" and return empty
    if (messages.length<1) {
        res.send("no messages")
        return Promise.resolve(true);
    }

    var messageArray = populateMessageArray(messages);
    var userArray = populateUserArray(messages);
    var emojiArray = populateEmojiArray(messages);

    if(emojiArray.length<1){
        return Promise.resolve(true);
    }

    var emojiQuery = format(`
    INSERT INTO emojis(message_id, emoji) SELECT message_id, emoji FROM 
        (SELECT message_id, emoji FROM emojis WHERE internal_emojis_id='0' 
        UNION ALL VALUES %L ) sub1 
        WHERE message_id NOT IN (SELECT message_id FROM messages);
     `, emojiArray);

    var messageQuery = format(`
    INSERT IGNORE INTO messages(user_id, channel_id, message_id, message_content, created_at) VALUES %L
        RETURNING message_id;
     `, messageArray);
    var userQuery = format(` 
    INSERT INTO discord_users (user_id, username) 
        VALUES %L ON DUPLICATE KEY UPDATE user_id=user_id;
     `, userArray);

    var finalQuery = `BEGIN; `+ emojiQuery + messageQuery + userQuery + ` COMMIT;`

    console.log(finalQuery)


    return new Promise((resolve, reject)=>{


        pool.query(finalQuery).then(rows=>{
            
            resolve(true);
            // conn.end();


        }).catch(err=> {
            return reject(err)
        });

        
    });


}

function deleteMessage(message_id){
    var removeMessageQuery = format(`DELETE FROM messages WHERE message_id=%L; `, message_id);
    var removeEmojisQuery = format(`DELETE FROM emojis WHERE message_id=%L; `, message_id);
    
    var finalQuery = `BEGIN; ` + removeMessageQuery +removeEmojisQuery+  ` COMMIT;`

    console.log(finalQuery)

    return new Promise((resolve, reject)=>{
        pool.query(finalQuery).then(()=>{
            // parse
            resolve(true)
        })
        .catch(err=>{
            console.error(err);
            return reject(err)
        })
    });
    
}

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
                message.content,
                message.created_at
            ]
        );
    });
    return arrayPlaceholder;
}

function populateEmojiArray(messages){
    var emojiArray =[];
    messages.forEach(message => {

        //splits message content into characters, where each character can also be an emoji (takes into account compound emojis)
        var emojis = splitter.splitGraphemes(message.content);
                        
        //if character is emoji, then add it to the emojiArray
        if (emojis!=null ){
            emojis.forEach(emoji => {
                if(/\p{Extended_Pictographic}/u.test(emoji)){
                    emojiArray.push(
                        [
                            message.message_id,
                            emoji
                        ]
                    )
                }
            });
        }
    });

    return emojiArray;
}

function populateUserArray(messages){
    var userMap = new Map();
    var userArray=[];

    messages.forEach(message => {
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
    
    return userArray;
}


module.exports= router;
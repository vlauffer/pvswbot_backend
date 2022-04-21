const Graphemer = require('graphemer').default;
const splitter = new Graphemer();
const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');
const emojiToUnicodeConverter = require('../helper/emojiToUnicodeConverter');

/**
 * extracts emojis from each message, then inserts the messages, emojis, and users
 * @param  {
 *      [
 *          {
 *              channel_id: string, 
 *              content: string,
 *              created_at: string,
 *              message_id: string,
 *              user_id: string, 
 *              username: string
 *          }, ...
 *      ]
 * } messages
 */
function parseAndInsertMessages(messages){

    // if there are no messages in the request, send "no messages" and return empty
    if (messages.length<1) {
        res.send("no messages")
        return Promise.resolve(true);
    }

    //next 3 lines format message, emoji, and user information into arrays that MariaDB can read.
    var messageArray = populateMessageArray(messages);
    var userArray = populateUserArray(messages);
    var emojiArray = populateEmojiArray(messages);

    //check to see if there are any emojis in the messages
    if(emojiArray.length<1){
        return Promise.resolve(true);
    }

    //insert a given emoji into the emojis table if the message_id does not already exist in the messages table
    var emojiQuery = format(`
    INSERT INTO message_emojis(message_id, emoji, ucode) SELECT message_id, emoji, ucode FROM 
        (SELECT message_id, emoji, ucode FROM message_emojis WHERE internal_emojis_id='0' 
        UNION ALL VALUES %L ) sub1 
        WHERE message_id NOT IN (SELECT message_id FROM messages);
     `, emojiArray);

    //insert message into message table where message_id is unique
    var messageQuery = format(`
    INSERT IGNORE INTO messages(user_id, channel_id, message_id, message_content, created_at) VALUES %L
        RETURNING message_id;
     `, messageArray);

    //insert users where used_id is unique
    var userQuery = format(` 
    INSERT INTO discord_users (user_id, username) 
        VALUES %L ON DUPLICATE KEY UPDATE user_id=user_id;
     `, userArray);

    var finalQuery = `BEGIN; `+ emojiQuery + messageQuery + userQuery + ` COMMIT;`

    return new Promise((resolve, reject)=>{
        pool.query(finalQuery).then(rows=>{
            resolve(true);
        }).catch(err=> {
            return reject(err)
        });
    });
}


/**
 * deletes all messages, emojis, and reactions for a given message_id
 * @param  {string} message_id
 */
 function deleteMessage(message_id){
    var removeMessageQuery = format(`DELETE FROM messages WHERE message_id=%L; `, message_id);
    var removeEmojisQuery = format(`DELETE FROM message_emojis WHERE message_id=%L; `, message_id);
    var removeReactionsQuery = format(`DELETE FROM reactions WHERE message_id=%L; `, message_id);
    var finalQuery = `BEGIN; ` + removeMessageQuery + removeEmojisQuery+ removeReactionsQuery + ` COMMIT;`

    return new Promise((resolve, reject)=>{
        pool.query(finalQuery).then(()=>{
            resolve(true)
        })
        .catch(err=>{
            console.error(err);
            return reject(err)
        })
    });
    
}

/**
 * for each message, populate an array of user_id, channel_id, message_id, and message content, and append this array to the arrayPlaceholder.
 * returns fully populated array of messages. 
 * @param  {
 *      [
 *          {
 *              channel_id: string, 
 *              content: string,
 *              created_at: string,
 *              message_id: string,
 *              user_id: string, 
 *              username: string
 *          }, ...
 *      ]
 * } messages
 * @return {
 *      [
 *          [
 *              string (user_id),
 *              string (channel_id),
 *              string (message_id),
 *              string (content),
 *              string (created_id)
 *          ], ... 
 *      ]
 * } arrayPlaceholder
 */
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


/**
 *  takes an array of messages and extracts all emojis into a new array
 * @param  {
 *      [
 *          {
 *              channel_id: string, 
 *              content: string,
 *              created_at: string,
 *              message_id: string,
 *              user_id: string, 
 *              username: string
 *          }, ...
 *      ]
 * } messages
 * 
 * @return {
 *      [
 *          [
 *              string (message_id),
 *              string (emoji),
 *              string (ucode)
 *          ], ...
 *      ]
 * } emojiArray
 */
 function populateEmojiArray(messages){
    var emojiArray =[];
    messages.forEach(message => {

        //splits message content into characters, where each character can also be an emoji (takes into account compound emojis)
        var emojis = splitter.splitGraphemes(message.content);
                        
        //if character is emoji, then add it to the emojiArray
        if (emojis!=null ){
            emojis.forEach(emoji => {
                if(/\p{Extended_Pictographic}/u.test(emoji) || /\p{Emoji}/u.test(emoji)){
                    emojiArray.push(
                        [   
                            message.message_id,
                            emoji,
                            emojiToUnicodeConverter.emojiToUnicode(emoji)

                        ]
                    )
                }

                
            });
        }
    });

    return emojiArray;
}

/**
 * creates array of unique users 
 * @param  {
 *      [
 *          {
 *              channel_id: string, 
 *              content: string,
 *              created_at: string,
 *              message_id: string,
 *              user_id: string, 
 *              username: string
 *          }, ...
 *      ]
 * } messages
 * @returns {
 *      [
 *          [
 *              string (user_id),
 *              string (username) 
 *          ], ...
 *      ]
 * }
 */
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


module.exports = {parseAndInsertMessages,
    deleteMessage,
    populateMessageArray,
    populateEmojiArray,
    populateUserArray};


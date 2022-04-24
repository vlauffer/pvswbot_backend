const Graphemer = require('graphemer').default;
const splitter = new Graphemer();
const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');
const emojiToUnicodeConverter = require('../helper/emojiToUnicodeConverter');
const superParser = require('../helper/superParser');
const reactionManager = require('../reactions/reactionManager');
const res = require('express/lib/response');

/** 
 * controls the insertion of inbound messages: 
 * Parse messages -> delete reactions -> add messages, message emojis, and users -> add reactions
 * The reactions-related functions are split from the other because insertMessagesEmojisUsers()
 * is also used to edit messages, and reactions need to be preserved during edits due to limitations
 * of the discord bot
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
function insertionController(messages){
    // if there are no messages in the request, send "no messages" and return empty
    if (messages.length<1) {
        return Promise.resolve(true)
        
    }

    return new Promise((resolve, reject)=>{
        var parsedData = superParser.superParse(messages);

        reactionManager.deleteReactions(parsedData.messageIDs)
        .then(()=>{
            insertMessagesEmojisUsers(parsedData)
            .then(()=>{
                reactionManager.addReactions(parsedData.reactionsArray).then(()=>{
                    return resolve(true);
                })



                .catch(err=>{
                    console.error(err);
                    return reject(err)
                });
            }).catch(err=>{
                console.error(err);
                return reject(err)
            });
        }).catch(err=>{
            console.error(err);
            return reject(err)
        });
    });

    

    
}

/**
 * 
 * @param {*} messages 
 */
function editController(messages){

    if (messages.length<1) {
        return Promise.resolve(true)
        
    }

    return new Promise((resolve, reject)=>{
        var parsedData = superParser.superParse([messages]);

        deleteMessage(parsedData.messageIDs[0]).then(()=>{
            insertMessagesEmojisUsers(parsedData).then(()=>{
                resolve(true);
            })
            .catch(err=>{
                console.error(err);
                return reject(err)
            });
        }).catch(err=>{
            console.error(err);
            return reject(err)
        });

    });

}

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
function insertMessagesEmojisUsers(parsedData){

    // if there are no messages in the request, send "no messages" and return empty
    if (parsedData.messageArray.length<1) {
        res.send("no messages")
        return Promise.resolve(true);
    }

    // TODO: check to see what happens when no emojis are present in users or emojis

    //insert a given emoji into the emojis table if the message_id does not already exist in the messages table
    var emojiQuery = format(`
    INSERT INTO message_emojis(message_id, emoji, ucode) SELECT message_id, emoji, ucode FROM 
        (SELECT message_id, emoji, ucode FROM message_emojis WHERE internal_emojis_id='0' 
        UNION ALL VALUES %L ) sub1 
        WHERE message_id NOT IN (SELECT message_id FROM messages);
     `, parsedData.emojiArray);

    //insert message into message table where message_id is unique
    var messageQuery = format(`
    INSERT IGNORE INTO messages(user_id, channel_id, message_id, message_content, created_at) VALUES %L
        RETURNING message_id;
     `, parsedData.messageArray);

    //insert users where used_id is unique
    var userQuery = format(` 
    INSERT INTO discord_users (user_id, username) 
        VALUES %L ON DUPLICATE KEY UPDATE user_id=user_id;
     `, parsedData.userArray);

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
 * deletes all messages and emojis for a given message_id
 * @param  {string} message_id
 */
 function deleteMessage(message_id){
    var removeMessageQuery = format(`DELETE FROM messages WHERE message_id=%L; `, message_id);
    var removeEmojisQuery = format(`DELETE FROM message_emojis WHERE message_id=%L; `, message_id);
    var finalQuery = `BEGIN; ` + removeMessageQuery + removeEmojisQuery + ` COMMIT;`

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


module.exports = {insertMessagesEmojisUsers,
    insertionController,
    editController,
    deleteMessage,
    populateMessageArray,
    populateEmojiArray,
    populateUserArray};


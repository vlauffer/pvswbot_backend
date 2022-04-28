const Graphemer = require('graphemer').default;
const splitter = new Graphemer();
const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');
const emojiToUnicodeConverter = require('../helper/emojiToUnicodeConverter');
const superParser = require('../helper/superParser');
const reactionManager = require('../reactions/reactionManager');
const res = require('express/lib/response');

/** 
 * controls the insertion of inbound messages 
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
 *              username: string,
 *              reactions: [{reactionsStruct}]  //see readme
 *              
 *          }, ...
 *      ]
 * } messages
 * 
 * @returns {true} if resolved, {error} if rejected
 */
function insertionController(messages){
    // if there are no messages in the request, send "no messages" and return empty
    if (messages.length<1) {
        return Promise.resolve(true);
    }

    return new Promise((resolve, reject)=>{
        //extract all of the necessary data in a single function
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
                    return reject(err);
                });
            }).catch(err=>{
                console.error(err);
                return reject(err);
            });
        }).catch(err=>{
            console.error(err);
            return reject(err)
        });
    });   
}

/**
 * edits a given message by deleting the message and re-inserting it. 
 * This method is helpful because we need to reparse the new message anyway, and allows
 * us to reuse code from the normal insertion method
 * @param {messages w/out reactions} messages       //see structures.md
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

    // if there are no emojis in the set of messages, set emojiQuery to "". Otherwise,
    // insert a given emoji into the emojis table if the message_id does not already exist in the messages table
    var emojiQuery = parsedData.emojiArray.length < 1 ? "" : format(`
    INSERT INTO message_emojis(message_id, emoji, ucode) SELECT message_id, emoji, ucode FROM 
        (SELECT message_id, emoji, ucode FROM message_emojis WHERE internal_emojis_id='0' 
        UNION ALL VALUES %L ) sub1 
        WHERE message_id NOT IN (SELECT message_id FROM messages);
     `, parsedData.emojiArray);;
   
    // if there are no messages in the set of messages, set messageQuery to "". Otherwise,
    // insert message into message table where message_id is unique
    var messageQuery = parsedData.messageArray.length < 1 ? "" : format(`
    INSERT IGNORE INTO messages(user_id, channel_id, message_id, message_content, created_at) VALUES %L
        RETURNING message_id;
     `, parsedData.messageArray);


    // if there are no users in the set of messages, set userQuery to "". Otherwise,
    //insert users where used_id is unique
    var userQuery = parsedData.userArray.length < 1 ? "" : format(` 
    INSERT INTO discord_users (user_id, username) 
        VALUES %L ON DUPLICATE KEY UPDATE user_id=user_id;
     `, parsedData.userArray);

    var finalQuery = `BEGIN; `+ emojiQuery + messageQuery + userQuery + ` COMMIT;`;
    console.log(finalQuery)
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

module.exports = {insertMessagesEmojisUsers,
    insertionController,
    editController,
    deleteMessage};


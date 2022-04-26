const Graphemer = require('graphemer').default;
const splitter = new Graphemer();
const emojiToUnicodeConverter = require('../helper/emojiToUnicodeConverter');
const stripper = require('../helper/stripper');

/**
 * parses all information into sql queries
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
 * @returns {               
 *      messageArray: [message-SQL, ... ],
 *      emojiArray: [emoji-SQL, ...],
 *      messageIDs: [string, ...],
 *      reactionsArray: [reaction-SQL, ...],
 *      userArray: [user-SQL, ...]
 * } parsedData
 */

function superParse(messages){

    var emojiArray = [];
    var messageArray = [];
    var messageIDs=[];
    var reactionsArray =[];
    
    var userArray = [];
    var userMap = new Map();

    messages.forEach(message => {

        //get messages for insertion into messages
        messageArray.push(
            [
                message.user_id,
                message.channel_id,
                message.message_id,
                message.content,
                message.created_at
            ]
        );
        
        //get messageIDs into order to delete all reactions from db
        messageIDs.push(message.message_id);

        // Avoids duplicating users into array: if user has not yet been set in userMap, add it to the map and userArray
        if(!userMap.has(message.user_id)){
            userMap.set(message.user_id, true);
            userArray.push(
                [
                    message.user_id,
                    message.username,
                ]
            )
        }

        //extracts all emojis from a message
        emojiArray.push(...emojiParse(message.content, message.message_id));

        if(message.reactions!=null){
            reactionsArray.push(...reactionParse(message.reactions))
            
        }
    });

    var parsedData = {
        messageArray: messageArray,
        emojiArray: emojiArray,
        messageIDs: messageIDs,
        reactionsArray: reactionsArray,
        userArray: userArray
    };

    return parsedData;
}


/**
 * extracts reactions from messages and translates them into SQL format
 * @param {reactions} reactions 
 * @returns {
 *      [reaction-SQL, ...]
 * }
 */
function reactionParse(reactions){
    var reactionsArray = [];
    reactions.forEach(reaction => {
                
        var emoji = stripper.strip(reaction.content);
        reactionToAdd = [
            reaction.channel_id, 
            reaction.message_id,
            reaction.user_id, 
            emoji, 
            emojiToUnicodeConverter.emojiToUnicode(emoji),
            reaction.created_at 
        ]
        reactionsArray.push(reactionToAdd);
    });

    return reactionsArray;
}

/**
 * gets all emojis from a string and translates them into emoji-SQL objects
 * @param {string} content 
 * @param {string} message_id 
 * @returns {
 *      [emoji-SQL, ...]
 * }
 */
function emojiParse(content, message_id){

    var emojiArray = [];
    //splits message content into characters, where each character can also be an emoji (takes into account compound emojis)
    var emojis = splitter.splitGraphemes(content);
                            
    //if character is emoji, then add it to the emojiArray
    if (emojis!=null ){
        emojis.forEach(emoji => {
            if(/\p{Extended_Pictographic}/u.test(emoji) || /\p{Emoji}/u.test(emoji)){
                emojiArray.push(
                    [   
                        message_id,
                        emoji,
                        emojiToUnicodeConverter.emojiToUnicode(emoji)

                    ]
                )
            }

            
        });
    }

    return emojiArray
}

module.exports = {superParse};
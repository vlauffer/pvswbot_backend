const pool = require('../../MARIAdatabasePool');

const format = require('pg-format');
const stripper = require('../helper/stripper');
const emojiToUnicodeConverter = require('../helper/emojiToUnicodeConverter');

/**
 * insert a reaction into the db
 * @param {reaction-add} reaction            //see structures.md 
 * 
 */
function insertReaction(reaction){
    
    var emoji = stripper.strip(reaction.content);
    if (emoji==null) return;

    reaction = {
        channel_id: reaction.channel_id, 
        message_id: reaction.message_id,
        user_id: reaction.user_id, 
        content: emoji, 
        ucode: emojiToUnicodeConverter.emojiToUnicode(emoji),
        created_at: reaction.created_at 
    }

    var query = `
        INSERT IGNORE INTO reactions(channel_id, message_id, user_id, emoji, ucode, created_at)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    console.log("inserting reaction: " + reaction.content)

    return new Promise((resolve, reject)=>{
        pool.query(query, [
            reaction.channel_id, reaction.message_id, reaction.user_id, reaction.content, reaction.ucode, reaction.created_at 
        ]).then(()=>{
            resolve(true);
        }).catch(err=>{
            console.error(err);
            return reject(err)
        });
    });   
}

/**
 * delete a reaction
 * @param {
 *      message_id: string,
 *      user_id: string, 
 *      content: string, 
 * } reaction  
 */
function removeReaction(reaction){
    var query = `
        DELETE FROM reactions WHERE message_id=? AND user_id=? AND ucode=?;
    `;

    console.log("removing reaction: " + reaction.content)

    return new Promise((resolve, reject)=>{
        pool.query(query, [
            reaction.message_id, reaction.user_id, emojiToUnicodeConverter.emojiToUnicode(reaction.content)
        ]).then(()=>{
            resolve(true);
        }).catch(err=>{
            console.error(err);
            return reject(err)
        });
    });
}    
/**
 * adds multiple reactions to the reactions table
 * @param {reactions-add}           //see structures.md
 */
function addReactions(reactions){

    if(reactions.length<1) return Promise.resolve(true);
    
    var query = format(`
        INSERT IGNORE INTO reactions(channel_id, message_id, user_id, emoji, ucode, created_at)
        VALUES %L;
    `, reactions);
    
    return new Promise((resolve, reject)=>{
        pool.query(query).then(()=>{
            resolve(true);
        }).catch(err=>{
            console.error(err);
            return reject(err)
        });
    });

}

/**
 * deletes all reactions for a given set of message ids
 * @param  {[string, ...]} message_ids
 */
 function deleteReactions(message_ids){
    

    var finalQuery = format(`DELETE FROM reactions WHERE message_id IN (%L); `, message_ids);

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




module.exports = {insertReaction,

    addReactions,
    deleteReactions,
    removeReaction};

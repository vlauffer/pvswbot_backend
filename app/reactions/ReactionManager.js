const pool = require('../../MARIAdatabasePool');

const format = require('pg-format');
const stripper = require('../helper/stripper');
const emojiToUnicodeConverter = require('../helper/emojiToUnicodeConverter');



/**
 * insert a reaction into the db
 * @param {
 *      channel_id: string, 
 *      message_id: string,
 *      user_id: string, 
 *      emoji: string, 
 *      ucode: string, 
 *      created_at: string
 * } reaction 
 * 
 */
function insertReaction(reaction){

    var emoji = stripper.strip(reaction.content);
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

module.exports = {insertReaction,
    removeReaction};
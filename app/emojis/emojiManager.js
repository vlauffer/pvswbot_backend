
const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');
const { response } = require('express');

/**
 * gets the totals for the combined entries in the emojis table and the reactions table
 * @returns {
 *  [
 *      {
 *          emoji: string,  
 *          ucode: string, 
 *          count: int,
 *      }, ...
 *  ]
 * }
*/
function getMessageAndReactionEmojis(){

    var query = `SELECT sub.emoji, sub.ucode, CAST(COUNT(sub.ucode) AS VARCHAR(64)) AS count
        FROM (SELECT emoji, ucode FROM message_emojis UNION ALL SELECT emoji, ucode from reactions) as sub GROUP BY sub.ucode;`;

    return new Promise((resolve, reject)=>{

        pool.query(query).then(rows=>{
            var emojiCounts = rows;
            resolve({emojiCounts})

        }).catch(err=> {
            return reject(err)
        });

    });
}

/**
 * queries db for an array that lists the reccurance of a given emoji for each user in the db correlated with each emoji image
 * @returns {
 *  [
 *      {
 *          count: int,
 *          emoji: string,
 *          ucode: string,
 *          uid: string
 *      }, ...
 *  ]
 * }
 */
function getAllUsersEmojis(){

    var query = `SELECT sub.uid, discord_users.username, sub.emoji, sub.ucode, CAST(COUNT(sub.ucode) AS VARCHAR(64)) AS count
    FROM (SELECT message_emojis.emoji AS emoji, message_emojis.ucode, messages.user_id AS uid, messages.message_id AS mid FROM message_emojis
        INNER JOIN messages ON message_emojis.message_id=messages.message_id UNION ALL 
        SELECT reactions.emoji as emoji, reactions.ucode, reactions.user_id as uid, reactions.message_id as mid FROM reactions) as sub 
        LEFT JOIN discord_users ON sub.uid=discord_users.user_id 
        
        GROUP BY uid, sub.ucode;`

    return new Promise((resolve, reject)=>{

        pool.query(query).then(rows=>{
            var emojiCounts = rows;
            resolve({emojiCounts})
        }).catch(err=> {
            return reject(err)
        });

    });
}

module.exports = {getMessageAndReactionEmojis,
    getAllUsersEmojis};

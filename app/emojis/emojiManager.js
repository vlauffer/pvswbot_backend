// const pool = require('../../PSQLdatabasePool.js');
const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');
const { response } = require('express');

/**
 * gets the totals for the combined entries in the emojis table and the reactions table, grouped with the base image of each emoji
 * @returns {
 *  [
 *      {
 *          emoji: string,  
 *          ucode: string, 
 *          count: int,
 *          base: string
 *      }, ...
 *  ]
 * }
*/
function getMessageAndReactionEmojis(){

    var query = `SELECT sub.emoji, sub.ucode, CAST(COUNT(sub.ucode) AS VARCHAR(64)) AS count, LEFT(emoji_images.base, LENGTH(emoji_images.base )) AS base
        FROM (SELECT emoji, ucode FROM emojis UNION ALL SELECT emoji, ucode from reactions) as sub LEFT JOIN emoji_images
        ON sub.ucode=emoji_images.ucode GROUP BY sub.ucode;`;

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
 *          base: string,
 *          count: int,
 *          emoji: string,
 *          ucode: string,
 *          uid: string
 *      }, ...
 *  ]
 * }
 */
function getAllUsersEmojis(){

    var query = `SELECT sub.uid, discord_users.username, sub.emoji, sub.ucode, CAST(COUNT(sub.ucode) AS VARCHAR(64)) AS count, 
    LEFT(emoji_images.base, LENGTH(emoji_images.base )) AS base
    FROM (SELECT emojis.emoji AS emoji, emojis.ucode, messages.user_id AS uid, messages.message_id AS mid FROM emojis
        INNER JOIN messages ON emojis.message_id=messages.message_id UNION ALL 
        SELECT reactions.emoji as emoji, reactions.ucode, reactions.user_id as uid, reactions.message_id as mid FROM reactions) as sub 
        LEFT JOIN discord_users ON sub.uid=discord_users.user_id 
        LEFT JOIN emoji_images ON sub.ucode=emoji_images.ucode
        GROUP BY uid, sub.ucode;`

    return new Promise((resolve, reject)=>{

        pool.query(query).then(rows=>{
            var emojiCounts = rows;
            resolve({emojiCounts})
            // conn.end();


        }).catch(err=> {
            return reject(err)
        });

    });
}

module.exports = {getMessageAndReactionEmojis,
    getAllUsersEmojis};
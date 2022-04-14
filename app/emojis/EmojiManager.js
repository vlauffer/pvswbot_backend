// const pool = require('../../PSQLdatabasePool.js');
const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');
const { response } = require('express');


class EmojiManager{

    //emojis is an array of arrays, where each index is an array of emoji data (channel_id, message_id,  user_id, emoji)
    //returns true if insertion is successful
    static insertEmojis(emojis){
        if(emojis.length<1) return Promise.resolve(true);
        var query = format("INSERT INTO emojis (message_id, emoji) VALUES %L;", emojis)
        console.log(query)
        return new Promise((resolve, reject)=>{

            pool.query(query).then(rows=>{
                resolve(true)
                // conn.end();

            }).catch(err=> {
                return reject(err)
            });

            // pool.query(
            //     query,
            //     (error,response)=>{
            //         if (error) return reject(error);
            //         resolve(true)
            //     }
            // )
        });
    }

    static getMessageAndReactionEmojis(){

        // var query = `SELECT sub.emoji, CAST(COUNT(sub.emoji) AS VARCHAR(64)) AS count, emoji_images.base          
        // FROM (SELECT emoji FROM emojis UNION ALL SELECT emoji from reactions) as sub LEFT JOIN emoji_images 
        // ON sub.emoji=emoji_images.emoji GROUP BY sub.emoji;`;
        var query = `SELECT sub.emoji, sub.ucode, CAST(COUNT(sub.ucode) AS VARCHAR(64)) AS count, LEFT(emoji_images.base, LENGTH(emoji_images.base )) AS base
            FROM (SELECT emoji, ucode FROM emojis UNION ALL SELECT emoji, ucode from reactions) as sub LEFT JOIN emoji_images
            ON sub.ucode=emoji_images.ucode GROUP BY sub.ucode;`;
        // var query = format(`SELECT emoji, CAST(COUNT(emoji) AS VARCHAR(64)) AS count, emoji_images.base 
        // FROM (SELECT emoji FROM emojis UNION ALL SELECT emoji from reactions) as sub GROUP BY emoji;`);
        console.log(query);

        return new Promise((resolve, reject)=>{

            pool.query(query).then(rows=>{
                var emojiCounts = rows;
                resolve({emojiCounts})
                // conn.end();


            }).catch(err=> {
                return reject(err)
            });

            // pool.query(
            //     query,
            //     (error,response)=>{
            //         if (error) return reject(error);
            //         var emojiCounts = response.rows;
            //         resolve({emojiCounts})
            //     }
            // )
        });
    }

    //returns total counts for each emoji in the db
    static getEmojis(){
        var query = format("SELECT emoji, CAST(COUNT(*) AS VARCHAR(64)) AS count FROM emojis GROUP BY emoji;")
        console.log(query)

        return new Promise((resolve, reject)=>{

            pool.query(query).then(rows=>{
                var emojiCounts = rows;
                resolve({emojiCounts})
                // conn.end();


            }).catch(err=> {
                return reject(err)
            });

            // pool.query(
            //     query,
            //     (error,response)=>{
            //         if (error) return reject(error);
            //         var emojiCounts = response.rows;
            //         resolve({emojiCounts})
            //     }
            // )
        });
    }


    //returns an array that lists the amount of reccurance of a given emoji for each user in the db
    static getAllUsersEmojis(){

        // var query = `
        //     SELECT  discord_users.username, emojis.emoji, COUNT(emojis.emoji) FROM emojis 
        //     INNER JOIN discord_users ON emojis.user_id=discord_users.user_id 
        //     GROUP BY discord_users.username, emojis.emoji
        // ;`;

        var query = `SELECT sub.uid, discord_users.username, sub.emoji, sub.ucode, CAST(COUNT(sub.ucode) AS VARCHAR(64)) AS count, 
        LEFT(emoji_images.base, LENGTH(emoji_images.base )) AS base
        FROM (SELECT emojis.emoji AS emoji, emojis.ucode, messages.user_id AS uid, messages.message_id AS mid FROM emojis
            INNER JOIN messages ON emojis.message_id=messages.message_id UNION ALL 
            SELECT reactions.emoji as emoji, reactions.ucode, reactions.user_id as uid, reactions.message_id as mid FROM reactions) as sub 
            LEFT JOIN discord_users ON sub.uid=discord_users.user_id 
            LEFT JOIN emoji_images ON sub.ucode=emoji_images.ucode
            GROUP BY uid, sub.ucode;`

        // var query = `SELECT emoji, CAST(COUNT(emoji) AS VARCHAR(64)) AS count, discord_users.username, discord_users.user_id FROM 
        //     (SELECT emojis.emoji AS emoji, messages.user_id AS uid, messages.message_id AS mid 
        //     FROM emojis INNER JOIN messages ON emojis.message_id=messages.message_id) AS sub 
        //     INNER JOIN discord_users ON sub.uid=discord_users.user_id 
        //     GROUP BY discord_users.username, emoji;`
        //

        console.log(query)

        return new Promise((resolve, reject)=>{

            pool.query(query).then(rows=>{
                var emojiCounts = rows;
                resolve({emojiCounts})
                // conn.end();


            }).catch(err=> {
                return reject(err)
            });

            // pool.query(
            //     query,
            //     (error,response)=>{
            //         if (error) return reject(error);
            //         var emojiCounts = response.rows;
            //         resolve({emojiCounts})
            //     }
            // )
        });
    }
}


module.exports = EmojiManager;
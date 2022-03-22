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

    //returns total counts for each emoji in the db
    static getEmojis(){
        var query = format("SELECT emoji, COUNT(*) FROM emojis GROUP BY emoji;")
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

        var query = `
            SELECT  discord_users.username, emojis.emoji, COUNT(emojis.emoji) FROM emojis 
            INNER JOIN discord_users ON emojis.user_id=discord_users.user_id 
            GROUP BY discord_users.username, emojis.emoji
        ;`;

        console.log(query)

        return new Promise((resolve, reject)=>{
            pool.query(
                query,
                (error,response)=>{
                    if (error) return reject(error);
                    var emojiCounts = response.rows;
                    resolve({emojiCounts})
                }
            )
        });
    }
}


module.exports = EmojiManager;
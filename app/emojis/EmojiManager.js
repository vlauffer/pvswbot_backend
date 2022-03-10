const pool = require('../../databasePool.js');
const format = require('pg-format');
const { response } = require('express');


class EmojiManager{
    static insertEmojis(emojis){
        if(emojis.length<1) return Promise.resolve(true);
        var query = format("INSERT INTO emojis (channel_id, message_id,  user_id, emoji) VALUES %L;", emojis)
        console.log(query)
        return new Promise((resolve, reject)=>{
            pool.query(
                query,
                (error,response)=>{
                    if (error) return reject(error);
                    resolve(true)
                }
            )
        });
    }

    static getEmojis(){
        var query = format("SELECT emoji, COUNT(*) FROM emojis GROUP BY emoji;")
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

    static getAllUsersEmojis(){
        // var query = format(`WITH v1 AS (
        //     SELECT user_id FROM discord_users WHERE username=%L)
        // SELECT emoji, COUNT(*) FROM emojis WHERE user_id=v1.user_id GROUP BY emoji;`,username)

        var query = `
            SELECT  discord_users.username, emojis.emoji, COUNT(emojis.emoji) FROM emojis 
            INNER JOIN discord_users ON emojis.user_id=discord_users.user_id 
            GROUP BY discord_users.username, emojis.emoji
            
            
        ;`;

        // var query = format(`
        //     SELECT user_id, emoji FROM emojis
            
            
        // ;`,username);

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
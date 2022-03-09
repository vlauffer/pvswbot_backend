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
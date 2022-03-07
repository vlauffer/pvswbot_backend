const pool = require('../../databasePool.js');
const format = require('pg-format');
const { response } = require('express');


class EmojiManager{
    static insertEmojis(emojis){
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

    static getMessages(){
        
    }
}


module.exports = EmojiManager;
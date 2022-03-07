const pool = require('../../databasePool.js');
const format = require('pg-format');
const { response } = require('express');


class MessageManager{
    static insertMessages(messages){
        var query = format("INSERT INTO messages (user_id, channel_id, message_id,  message_content) VALUES %L ON CONFLICT DO NOTHING;", messages)
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


module.exports = MessageManager;
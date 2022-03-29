// const pool = require('../../PSQLdatabasePool.js');
// const pool = require('../../MYSQLdatabasePool')
const pool = require('../../MARIAdatabasePool')
const format = require('pg-format');
const { response } = require('express');



class MessageManager{

    /* takes array of array where each index holds message information (user_id, channel_id, message_id, message_content).
    the query inserts these message information arrays into the db, unless there already exists a message with the same 
    message_id. In this case, the duplicate message is not inserted. The response from this query returns all message_id s
    but if the message at that given id was not inserted, its corresponding source column is marked with an 's'. Otherwise
    if the message at that given id was inserted, the source column is marked with an 'i'. This insertMessages function returns
    an array of objects {message_id: "string", source: "i" or "s"}
    */
    static insertMessages(messages){
        if(messages.length<1)  return Promise.resolve(true);

        // var query = format(` CREATE TEMPORARY TABLE dup (
        //     internal_message_id SERIAL PRIMARY KEY,
        //     channel_id VARCHAR(64),
        //     message_id VARCHAR(64) NOT NULL UNIQUE,
        //     user_id VARCHAR(64),
        //     message_content TEXT
        
        // ) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
        // INSERT INTO dup(user_id, channel_id, message_id, message_content) VALUES %L;
        // SELECT user_id, channel_id, message_id, message_content FROM dup WHERE message_id IN (SELECT message_id FROM messages);
        // INSERT INTO messages(user_id, channel_id, message_id, message_content)
        // SELECT user_id, channel_id, message_id, message_content FROM dup WHERE message_id NOT IN (SELECT message_id FROM messages);
        
        // `, messages);

        var query = format(`
        INSERT IGNORE INTO messages(user_id, channel_id, message_id, message_content) VALUES %L
            RETURNING message_id;
        `, messages);

        console.log(query)

        return new Promise((resolve, reject)=>{


            pool.query(query).then(rows=>{
                var newMessages = rows
                resolve({newMessages});
                // conn.end();


            }).catch(err=> {
                return reject(err)
            });

            
        });

        
    }

    static editMessage(message){
        
    }

    static getMessages(){
        
    }
}


module.exports = MessageManager;
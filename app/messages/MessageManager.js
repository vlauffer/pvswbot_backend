const pool = require('../../databasePool.js');
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

        var query = format(` WITH input_rows(user_id, channel_id, message_id, message_content) AS (
            VALUES
                %L
        ), 
        ins AS (
            INSERT INTO messages (user_id, channel_id, message_id, message_content)
            SELECT * FROM input_rows
            ON CONFLICT (message_id) DO NOTHING
            RETURNING message_id
        )
        SELECT 'i' AS source, message_id
        FROM ins
        UNION ALL
        SELECT 's' AS source, c.message_id
        FROM input_rows
        JOIN messages c USING (message_id)


        ;`, messages);
        console.log(query)
        return new Promise((resolve, reject)=>{
            pool.query(
                query,
                (error,response)=>{
                    if (error) return reject(error);

                    var duplicates = response.rows;

                    resolve({duplicates})
                }
            )
        });
        
    }

    static getMessages(){
        
    }
}


module.exports = MessageManager;
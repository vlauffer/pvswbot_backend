const pool = require('../../databasePool.js');
const format = require('pg-format');
const { response } = require('express');


class MessageManager{
    static insertMessages(messages){
        if(messages.length<1)  return Promise.resolve(true);

        // var query = format(`INSERT INTO messages (user_id, channel_id, message_id,
        //      message_content) VALUES %L ON CONFLICT 
        //      (message_id) DO NOTHING;`, messages)
        var query = format(` WITH input_rows(user_id, channel_id, message_id, message_content) AS (
            VALUES
                %L
        ), ins AS (
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
                    // console.log(duplicates)
                    resolve({duplicates})
                }
            )
        });
        
    }

    static getMessages(){
        
    }
}


module.exports = MessageManager;
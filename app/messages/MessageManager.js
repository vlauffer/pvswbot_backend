const pool = require('../../MARIAdatabasePool')
const format = require('pg-format');
const { response } = require('express');



class MessageManager{

    //takes array of messages, inserts each into db
    static insertMessages(messages){
        if(messages.length<1)  return Promise.resolve(true);

        var query = format(`
        INSERT IGNORE INTO messages(user_id, channel_id, message_id, message_content) VALUES %L
            RETURNING message_id;
        `, messages);

        console.log(query);

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

}


module.exports = MessageManager;
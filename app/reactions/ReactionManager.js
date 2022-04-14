const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');


class ReactionManager{
    static insertReaction(reaction){

        var query = `
            INSERT IGNORE INTO reactions(channel_id, message_id, user_id, emoji, ucode, created_at)
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        console.log("inserting reaction: " + reaction.content)

        return new Promise((resolve, reject)=>{
            pool.query(query, [
                reaction.channel_id, reaction.message_id, reaction.user_id, reaction.content, reaction.ucode, reaction.created_at 
            ]).then(()=>{
                resolve(true);
            }).catch(err=>{
                console.error(err);
                return reject(err)
            });
        });
        
    }

    static removeReaction(reaction){
        
        // var query = `
        //     INSERT IGNORE INTO reactions(channel_id, message_id, user_id, emoji, created_at)
        //     VALUES (?, ?, ?, ?, ?);
        // `;

        var query = `
            DELETE FROM reactions WHERE message_id=? AND user_id=? AND emoji=?;
            
        `;

        console.log("removing reaction: " + reaction.content)

        return new Promise((resolve, reject)=>{
            pool.query(query, [
                reaction.message_id, reaction.user_id, reaction.content
            ]).then(()=>{
                resolve(true);
            }).catch(err=>{
                console.error(err);
                return reject(err)
            });
        });
    }

    
}

module.exports = ReactionManager;
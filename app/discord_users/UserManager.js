// const pool = require('../../PSQLdatabasePool.js');
const pool = require('../../MARIAdatabasePool')
const format = require('pg-format');
const { response } = require('express');



class UserManager{

    //takes an array of arrays, where each index contains user information (user_id and username) and inserts each into into the db
    static insertUsers(users){

        if(users.length<1)  return Promise.resolve(true);
        var query = format("INSERT INTO discord_users (user_id, username) VALUES %L ON DUPLICATE KEY UPDATE user_id=user_id;", users);
        console.log(query);
        return new Promise((resolve, reject)=>{


            pool.query(query).then(rows=>{
                resolve(true);

            }).catch(err=> {
                return reject(err);
            });

        });
        
    }
}


module.exports = UserManager;
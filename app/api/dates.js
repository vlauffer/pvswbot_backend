const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');
const Graphemer = require('graphemer').default;
const splitter = new Graphemer();
const pool = require('../../MARIAdatabasePool');
const format = require('pg-format');



const router = new Router();

router.get('/',(req,res)=>{

    if (Object.keys(req.query).length===0){
        res.send("Invalid request: no params found");
        return;
    }
    var date1 = req.query.date1;
    var date2 = req.query.date2;



    var finalQuery =format(`
    SELECT emoji, CAST(COUNT(emoji) AS VARCHAR(64)) AS count, created_at FROM (SELECT emojis.emoji, messages.created_at 
        FROM emojis INNER JOIN messages on emojis.message_id=messages.message_id 
        WHERE created_at BETWEEN %L AND %L) sub1 GROUP BY emoji, DAY(created_at);

    `, date1,date2);


    pool.query(finalQuery).then((rows)=>{
        res.send({
            dates: rows
        });
    }).catch(err=>{
        console.error(err);
    })
    // console.log(finalQuery)
    
});


module.exports = router
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



    var finalQuery =`
    SELECT sub.emoji, sub.ucode, CAST(COUNT(sub.ucode) AS VARCHAR(64)) AS count, created_at, 
    LEFT(emoji_images.base, LENGTH(emoji_images.base ) -1) AS base 
    FROM (SELECT emojis.emoji, emojis.ucode, messages.created_at as created_at 
        FROM emojis INNER JOIN messages on emojis.message_id=messages.message_id 
        WHERE created_at BETWEEN ? AND ? UNION ALL 
        SELECT reactions.emoji, reactions.ucode, reactions.created_at as created_at 
        FROM reactions WHERE created_at BETWEEN ? AND ? ) sub 
        LEFT JOIN emoji_images ON sub.ucode=emoji_images.ucode
        GROUP BY DAY(created_at), sub.ucode ;

    `;


    pool.query(finalQuery, [date1, date2, date1, date2]).then((rows)=>{
        res.send({
            dates: rows
        });
    }).catch(err=>{
        console.error(err);
    })
    // console.log(finalQuery)
    
});


module.exports = router;
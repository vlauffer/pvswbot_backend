const {Router} = require('express');
const pool = require('../../MARIAdatabasePool');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 10} );
const router = new Router();

/**
 *  uses the date1 and date2 parameters from the query in order to fetch all emoji totals between
the given dates
 *  @param {string} req.query.date1, the first date 
 *  @param {string} req.query.date1, the second date
 *  @return  {
 *      dates: 
 *          [ 
 *              { 
 *                  emoji: string, 
 *                  ucode: string, 
 *                  count: int, 
 *                  created_at: string  
 *              }, ... 
 *          ] 
 * }
*/
router.get('/',(req,res)=>{
    

    //check that date1 and date2 parameters are in query
    if (req.query.date1==null||req.query.date2==null){
        res.send("Invalid request: date params not found");
        return;
    }

    //check to see if emojiTotals is already cached. If so, send cached emojiTotals
    var emojiTotals = myCache.get('emojiTotals:'+req.query.date1+"-"+req.query.date1);
    if (emojiTotals!=null){
        res.send({
            dates: emojiTotals
        });
        return;
    }

    var date1 = req.query.date1;
    var date2 = req.query.date2;

    var finalQuery =`
    SELECT sub.emoji, sub.ucode, CAST(COUNT(sub.ucode) AS VARCHAR(64)) AS count, created_at, 
    LEFT(emoji_images.base, LENGTH(emoji_images.base )) AS base 
    FROM (SELECT message_emojis.emoji, message_emojis.ucode, messages.created_at as created_at 
        FROM message_emojis INNER JOIN messages on message_emojis.message_id=messages.message_id 
        WHERE created_at BETWEEN ? AND ? UNION ALL 
        SELECT reactions.emoji, reactions.ucode, reactions.created_at as created_at 
        FROM reactions WHERE created_at BETWEEN ? AND ? ) sub 
        LEFT JOIN emoji_images ON sub.ucode=emoji_images.ucode
        GROUP BY DAY(created_at), sub.ucode ;

    `;

    pool.query(finalQuery, [date1, date2, date1, date2]).then((rows)=>{
        myCache.set('emojiTotals:'+req.query.date1+"-"+req.query.date1, rows ,10 );
        res.send({
            dates: rows
        });
    }).catch(err=>{
        console.error(err);
    })
    
});


module.exports = router;
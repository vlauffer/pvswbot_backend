const {Router} = require('express');
const EmojiManager = require('../emojis/emojiManager');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 10} );
const router = new Router();

/**
 * gets the total counts of each emoji per user
 * @returns {
 *      Totals: [
 *          { 
 *              uid: string,
 *              username: string,
 *              base: string,
 *              count: int,
 *              emoji: string,
 *              ucode: string
 *          }, ...
 *      ]
 * } 
 */
router.get('/',(req,res)=>{

    var emojiTotals= myCache.get('emojiTotals');

    if (emojiTotals!=null){
        res.send({
            "Totals": emojiTotals
        });
        return;
    }

    EmojiManager.getAllUsersEmojis()
        .then(({emojiCounts})=>{
            myCache.set('emojiTotals', emojiCounts, 10);
            res.send({
                "Totals": emojiCounts
            });
        })
        .catch(error=>console.error(error));

});

module.exports= router; 
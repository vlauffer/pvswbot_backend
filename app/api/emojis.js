const {Router} = require('express');
const emojiManager = require('../emojis/emojiManager');
const NodeCache = require( "node-cache" );
const cacheRate = require('../../globalVariables').cacheRate;
const myCache = new NodeCache( { stdTTL: cacheRate} );
const router = new Router();

/**
 * gets overall totals of each emoji
 * @returns {
 *  Total: 
 *      [
 *          {
 *              emoji: string, 
 *              ucode: string, 
 *              count: int, 
 *          }, ...
 *      ]
 * }
 */
router.get('/',(req,res)=>{

    var emojiTotals = myCache.get('emojiTotals');
    if (emojiTotals==null){

        emojiManager.getMessageAndReactionEmojis()
        .then(({emojiCounts})=>{
            myCache.set('emojiTotals', emojiCounts, cacheRate);
            res.send({
                "Total": emojiCounts
            })
        })
        .catch(error=>console.error(error));
    } else{
        res.send({
            "Total": emojiTotals
        });
    }
});

module.exports= router;
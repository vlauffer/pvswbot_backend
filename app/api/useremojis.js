const {Router} = require('express');
const cacheRate = require('../../globalVariables').cacheRate;
const emojiManager = require('../emojis/emojiManager');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: cacheRate} );
const router = new Router();

/**
 * gets the total counts of each emoji per user
 * @returns {
 *      Totals: [
 *          { 
 *              uid: string,
 *              username: string,
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

    emojiManager.getAllUsersEmojis()
        .then(({emojiCounts})=>{
            myCache.set('emojiTotals', emojiCounts, cacheRate);
            res.send({
                "Totals": emojiCounts
            });
        })
        .catch(error=>console.error(error));

});

module.exports= router; 
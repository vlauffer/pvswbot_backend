const {Router} = require('express');
const EmojiManager = require('../emojis/EmojiManager');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 10} );
const router = new Router();
const baseShortener = require('../helper/baseShortener'); 

// gets overall totals of each emoji and their images
router.get('/',(req,res)=>{

    var emojiTotals = myCache.get('emojiTotals');
    if (emojiTotals==null){

        EmojiManager.getMessageAndReactionEmojis()
        .then(({emojiCounts})=>{
            myCache.set('emojiTotals', emojiCounts,10);
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
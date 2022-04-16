const {Router} = require('express');
const EmojiManager = require('../emojis/EmojiManager');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 10} );
const router = new Router();

const baseShortener = require('../helper/baseShortener'); 

// gets total count of each emoji and returns json
router.get('/',(req,res)=>{

    var emojiTotals = myCache.get('emojiTotals');
    if (emojiTotals==null){
        console.log("miss")
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
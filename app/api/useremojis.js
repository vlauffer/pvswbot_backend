const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 10} );


const router = new Router();


//gets the total counts of each emoji per user and returns object {Totals: [[username, emoji, count of this emoji by user], ...] }
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
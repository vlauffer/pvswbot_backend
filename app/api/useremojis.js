const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');


const router = new Router();


//gets the total counts of each emoji per user and returns object {Totals: [[username, emoji, count of this emoji by user], ...] }
router.get('/',(req,res)=>{

    EmojiManager.getAllUsersEmojis()
        .then(({emojiCounts})=>res.send({
            "Totals": emojiCounts
        }))
        .catch(error=>console.error(error));

});

module.exports= router;
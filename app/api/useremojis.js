const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');


const router = new Router();

router.get('/',(req,res)=>{


    EmojiManager.getAllUsersEmojis()

        .then(({emojiCounts})=>res.send({
            "Totals": emojiCounts
        }))
        .catch(error=>console.error(error));

});

module.exports= router;
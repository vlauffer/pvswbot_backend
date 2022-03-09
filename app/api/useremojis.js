const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');


const router = new Router();

router.get('/',(req,res)=>{


    EmojiManager.getUserEmojis(req.body.username)

        .then(({emojiCounts})=>res.send({
            "Total": emojiCounts
        }))
        .catch(error=>console.error(error));

});

module.exports= router;
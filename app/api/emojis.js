const {Router} = require('express');
const EmojiManager = require('../emojis/EmojiManager');
const router = new Router();

// gets total count of each emoji and returns json
router.get('/',(req,res)=>{

    EmojiManager.getEmojis()
        .then(({emojiCounts})=>res.send({
            "Total": emojiCounts
        }))
        .catch(error=>console.error(error));

});

module.exports= router;
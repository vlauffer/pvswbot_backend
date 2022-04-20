const {Router} = require('express');
const ReactionManager = require('../reactions/ReactionManager');
const stripper = require('../helper/stripper');
const emojiToUnicodeConverter = require('../helper/emojiToUnicodeConverter');
const router = new Router();


// adds a reaction to the db
router.post('/add',(req,res)=>{

    var emoji = stripper.strip(req.body.reaction.content);
    var reactionData = {
        channel_id: req.body.reaction.channel_id, 
        message_id: req.body.reaction.message_id,
        user_id: req.body.reaction.user_id, 
        content: emoji, 
        ucode: emojiToUnicodeConverter.emojiToUnicode(emoji),
        created_at: req.body.reaction.created_at 
    }

    ReactionManager.insertReaction(reactionData)
        .then(()=>{
            res.send('reaction insertion complete')
        })
        .catch(err=>{
            console.error(err)
        });

});


//removes a reaction
router.post('/remove',(req,res)=>{

    ReactionManager.removeReaction(req.body.reaction)
        .then(()=>{
            res.send('reaction deletion complete')
        })
        .catch(err=>{
            console.error(err)
        });

});

module.exports= router;
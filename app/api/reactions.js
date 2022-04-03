const {Router} = require('express');
const ReactionManager = require('../reactions/ReactionManager');
const stripper = require('../helper/stripper');
const router = new Router();


// gets total count of each emoji and returns json
router.post('/add',(req,res)=>{

    var emoji = stripper.strip(req.body.reaction.content);


    ReactionManager.insertReaction(req.body.reaction)
        .then(()=>{
            res.send('reaction insertion complete')
        })
        .catch(err=>{
            console.error(err)
        });

});

router.post('/remove',(req,res)=>{

    ReactionManager.removeReaction(req.body.reaction)
        .then(()=>{
            res.send('reaction insertion complete')
        })
        .catch(err=>{
            console.error(err)
        });

});

module.exports= router;
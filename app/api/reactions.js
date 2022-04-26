const {Router} = require('express');
const reactionManager = require('../reactions/reactionManager');
const router = new Router();



/**
 * adds a reaction to the db
 * @param {
 *      channel_id: string,
 *      content: string, 
 *      created_at: string, 
 *      message_id: string, 
 *      user_id: string, 
 *      username: string
 * } req.body.reaction
 */
router.post('/add',(req,res)=>{

    

    reactionManager.insertReaction(req.body.reaction)
        .then(()=>{
            res.send('reaction insertion complete')
        })
        .catch(err=>{
            console.error(err)
        });

});

/**
 * removes a reaction from the db
 * @param {
 *      user_id: string,
 *      message_id: string,
 *      content: string
 * } req.body.reaction
 */
router.post('/remove',(req,res)=>{

    reactionManager.removeReaction(req.body.reaction)
        .then(()=>{
            res.send('reaction deletion complete')
        })
        .catch(err=>{
            console.error(err)
        });

});

module.exports= router;
const {Router} = require('express');
const router = new Router();
const messageManager = require('../messages/messageManager');
const reactionManager = require('../reactions/reactionManager');

/**
 * add messages to the db
 * @param {
 *      [
 *          {
 *              channel_id: string, 
 *              content: string, 
 *              reactions: [string, ...]
 *              created_at: string, 
 *              message_id: string, 
 *              user_id: string, 
 *              username: string
 *          }, ...
 *      ]
 * } req.body.messages
 */
router.post('/add', (req, res)=> {

    if (req.body.messages==null){
        res.send("Invalid request: messages param not found");
        return;
    }

    messageManager.insertionController(req.body.messages).then(()=>{
        res.send("good job!");
    })
    .catch(err=>{
        console.error(err);
        res.send(err);
    });;

    
});


/**
 * edits a given message (did you forget to include a pancake in your message?)
 * @param {
 *      channel_id: string,
 *      content: string, 
 *      created_at: string, 
 *      message_id: string, 
 *      user_id: string, 
 *      username: string
 *  } req.body.message
 */
router.post('/edit', (req, res)=> {

    if (req.body.message==null){
        res.send("Invalid request: messages param not found");
        return;

        
    }

    messageManager.editController(req.body.message).then(()=>{
        res.send("good job!");
    }).catch(err=>{
        console.error(err);
        res.send(err);
    });;

    // var message = req.body.message;
    // var messageArray = [];
    // messageArray.push(message);

    // messageManager.deleteMessage(message.message_id)
    // .then(()=>{
    //     messageManager.parseAndInsertMessages(messageArray).then(()=>{
    //         res.send("edit successful");
    //     })
    //     .catch(err=>{
    //         console.error(err);
    //         res.send(err);
    //     });
    // })
    // .catch(err=>{
    //     console.error(err);
    //     res.send(err);
    // });

});




/**
 * deletes message, reactions, and emojis with a given id
 * @param {string} body.message_id
 */
router.post('/delete', (req, res)=> {
    if (req.body.message_id==null){
        res.send("Invalid request: messages param not found");
        return;
    }
    var message_id = req.body.message_id;
    messageManager.deleteMessage(message_id)
    .then(()=>{
        reactionManager.deleteReactions(message_id)
        .then(()=>{
            res.send("deletion of " + message_id+ " successful");
        })
        
        .catch(err=>{
            console.error(err);
            res.send(err);
        });
        
    })
    .catch(err=>{
        console.error(err);
        res.send(err);
    });
});






module.exports= router;
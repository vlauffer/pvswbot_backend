const {Router} = require('express');
const pool = require('../../MARIAdatabasePool');
const stripper = require('../helper/stripper');
const format = require('pg-format');
const router = new Router();
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 86400} );

/**
 *  gets all entries from emoji_images table
 *  @return  {
 *      emoji_images: 
 *          [ 
 *              { 
 *                  emoji: string, 
 *                  ucode: string, 
 *                  base: string 
 *              }, ... 
 *          ] 
 * }
*/

router.get('/',(req,res)=>{

    //check cache for emoji images
    var allEmojiImages = myCache.get('allEmojiImages');
    if(allEmojiImages!=null){
        res.send({
            emoji_images: allEmojiImages
        });
        return;
    }

    var finalQuery =`
    SELECT ucode, emoji, LEFT(emoji_images.base, LENGTH(emoji_images.base)) as base FROM emoji_images;
    `;

    pool.query(finalQuery).then((rows)=>{
        
        myCache.set('allEmojiImages',rows, 86400);
        res.send({
            emoji_images: rows
        });
    }).catch(err=>{
        console.error(err);
    });

    
});


/**
 *  get a list of selected emoji images from the emoji_images table
 *  @param {
 *      emoji_list: '[string, ...]'
 *  } req.query.emoji_list
 *  @return  {
 *      emoji_images: 
 *          [ 
 *              { 
 *                  emoji: string, 
 *                  ucode: string, 
 *                  base: string 
 *              }, ... 
 *           ] 
 * }
*/
//TODO: uncached atm
router.get('/get_batch',(req,res)=>{

    if(req.query.emoji_list==null){
        res.send("no emojis found in query");
        return;
    }

    var emoji_list = JSON.parse(req.query.emoji_list);
    var trimmedEmojiList = [];
    emoji_list.forEach(emoji => {
        trimmedEmojiList.push(stripper.strip(emoji))
    });
    
    var finalQuery =format(`
    SELECT ucode, emoji, LEFT(emoji_images.base, LENGTH(emoji_images.base )) as base FROM emoji_images WHERE emoji IN (%L);
    `, trimmedEmojiList);


    pool.query(finalQuery).then((rows)=>{
        res.send({
            emoji_images: rows
        });
    }).catch(err=>{
        console.error(err);
    });
    
});


module.exports = router;
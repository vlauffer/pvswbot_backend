const {Router} = require('express');

const Graphemer = require('graphemer').default;
const splitter = new Graphemer();
const pool = require('../../MARIAdatabasePool');
const stripper = require('../helper/stripper');

const format = require('pg-format');
const categoryNames = ["Apple", "Google", "FB", "Wind", "Twitter", "Joy", "Sams"];

const baseShortener = require('../helper/baseShortener');




const router = new Router();

router.get('/',(req,res)=>{

    var category;

    if (Object.keys(req.query).length===0){
        console.log("no params found, making Apple default category");
        category = "Apple";
        // return;
    }else{
        if(categoryNames.includes(req.query.category)){
            category = req.query.category;
        } else{
            console.log("category not recognized, making Apple default category");
            category = "Apple";

        }
        
    }
    
    



    var finalQuery =`
    SELECT * FROM emoji_images WHERE category=?;

    `;


    pool.query(finalQuery, category).then((rows)=>{

        rows = baseShortener.shorten(rows)
        res.send({
            emoji_images: rows
        });
    }).catch(err=>{
        console.error(err);
    })
    // console.log(finalQuery)
    
});

router.get('/get_batch',(req,res)=>{

    var category;
    var emojis;

    if (Object.keys(req.query).length===0){
        console.log("no params found, making Apple default category");
        category = "Apple";
        // return;
    }else{
        if(categoryNames.includes(req.query.category)){
            category = req.query.category;
        } else{
            console.log("category not recognized, making Apple default category");
            category = "Apple";

        }
        
    }

    var emoji_list = JSON.parse(req.query.emoji_list);
    var trimmedEmojiList = [];
    emoji_list.forEach(emoji => {
        trimmedEmojiList.push(stripper.strip(emoji))
    });
    
    



    var finalQuery =format(`
    SELECT * FROM emoji_images WHERE category=%L AND emoji IN (%L);

    `, category, trimmedEmojiList);


    pool.query(finalQuery, category).then((rows)=>{

        
        res.send({
            emoji_images: rows
        });
    }).catch(err=>{
        console.error(err);
    })
    // console.log(finalQuery)
    
});


module.exports = router;
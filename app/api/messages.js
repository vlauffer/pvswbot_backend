const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');
const { user } = require('pg/lib/defaults');
const Graphemer = require('graphemer').default;
const splitter = new Graphemer();
// const graphemes = splitter.splitGraphemes(string);
// const axios = require('axios').default;
// const TOKEN = process.env.TOKEN; 

// const GUILD_ID = '905487315982495765'
// const GUILD_URL = `guilds/${GUILD_ID}/channels`

// const DISCORD_BASEURL = "https://discord.com/api/v9/";
// const headers = {
//   "Authorization": TOKEN,

// }

const router = new Router();

// const regex = /\p{Extended_Pictographic}/ug
// const family = '👨‍👩‍👧' // "family 
// console.log(family.length) // not 1, but 8!
// console.log(regex.test(family)) // true, as expected
// console.log(family.match(regex)) // not [family], but [man, woman, girl]

router.post('/', (req, res)=> {

    if (req.body.messages<1) {
        res.send("no messages")
        return;
    }
    var messageArray = [];
    var userArray = [];
    var emojiArray = [];
    var userMap = new Map();

    req.body.messages.forEach(message => {
        messageArray.push(
            [
                // message.username,
                message.user_id,
                message.channel_id,
                message.message_id,
                message.content

            ]
        );
    });

    MessageManager.insertMessages(messageArray)
        .then(({duplicates})=>{
            var duplicatesMap = new Map()
            duplicates.forEach(duplicate => {
                duplicatesMap.set(duplicate.message_id,duplicate.source)
            });
            // console.log(duplicatesMap)
            // halp();

            req.body.messages.forEach(message => {
                if(duplicatesMap.get(message.message_id)=='s') return;
                // var messageContentSpacer = message.content.replaceAll("", " ");

                // var emojis= message.content.match(/[\p{Emoji}\u200d]+/gu);
                
                // emojis = emojis.split("");

                var emojis = splitter.splitGraphemes(message.content);

                if (emojis!=null ){
                    emojis.forEach(emoji => {
                        if(/\p{Extended_Pictographic}/u.test(emoji)){
                            emojiArray.push(
                                [
                                    message.channel_id,
                                    message.message_id,
                                    message.user_id,
                                    emoji
                                ]
                            )
                        }
                    });
                }

                if(!userMap.has(message.user_id)){
                    // console.log('adding '+ message.username);
                    userMap.set(message.user_id, true);
                    userArray.push(
                        [
                            message.user_id,
                            message.username,
                        ]
                    )
                }
            });

            UserManager.insertUsers(userArray)
                .then()
                .catch(error=>console.error(error));

            EmojiManager.insertEmojis(emojiArray)
                    .then()
                    .catch(error=>console.error(error));
        
        }).catch(error=>console.error(error));

    

    res.send("insterting")

    // const resy = await axios.get(DISCORD_BASEURL+CHANNEL_URL,
    //     {
    //     headers: headers
    //     });
    // console.log(resy)

//   axios.get(
//     DISCORD_BASEURL+GUILD_URL,
//     {
//       headers:headers
//     })
//     .then(res=>
//     {
//       res.data.forEach(element => {

//         var channelsToSearch = [];
//         if(element.hasOwnProperty('last_message_id')){
//           if(element.last_message_id!=null){
//             console.log("found text channel: " + element.name);
//             channelsToSearch.push(element.id);
//           }
//         }
//       });
//       // console.log(res);
//     })
//     .catch(error=>{
//       console.error(error)
//     })
    
});

// function halp(){
//     console.log("halp")
// }

// const halp = () =>{
//     console.log("halp")
// }

module.exports= router;
const {Router} = require('express');
const MessageManager = require('../messages/MessageManager');
const UserManager = require('../discord_users/UserManager');
const EmojiManager = require('../emojis/EmojiManager');
const { user } = require('pg/lib/defaults');
// const axios = require('axios').default;
// const TOKEN = process.env.TOKEN; 

// const GUILD_ID = '905487315982495765'
// const GUILD_URL = `guilds/${GUILD_ID}/channels`

// const DISCORD_BASEURL = "https://discord.com/api/v9/";
// const headers = {
//   "Authorization": TOKEN,

// }

const router = new Router();

router.get('/',(req,res)=>{


    EmojiManager.getEmojis()

        .then(({emojiCounts})=>res.send({
            "Total": emojiCounts
        }))
        .catch(error=>console.error(error));

});

module.exports= router;
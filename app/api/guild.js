const {Router} = require('express');
const axios = require('axios').default;


const TOKEN = process.env.TOKEN; 

const GUILD_ID = '905487315982495765'
const GUILD_URL = `guilds/${GUILD_ID}/channels`

const DISCORD_BASEURL = "https://discord.com/api/v9/";
const headers = {
  "Authorization": TOKEN,

}

const router = new Router();


router.get('/', (req, res)=> {

    // const resy = await axios.get(DISCORD_BASEURL+CHANNEL_URL,
    //     {
    //     headers: headers
    //     });
    // console.log(resy)

  axios.get(
    DISCORD_BASEURL+GUILD_URL,
    {
      headers:headers
    })
    .then(res=>
    {
      res.data.forEach(element => {

        var channelsToSearch = [];
        if(element.hasOwnProperty('last_message_id')){
          if(element.last_message_id!=null){
            console.log("found text channel: " + element.name);
            channelsToSearch.push(element.id);
          }
        }
      });
      // console.log(res);
    })
    .catch(error=>{
      console.error(error)
    })
  res.send("yellow")
});

module.exports= router;
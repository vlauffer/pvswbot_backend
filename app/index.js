require('dotenv').config();
const channelRouter = require('./api/channel');
const guildRouter = require('./api/guild');
const insertMessagesRouter = require('./api/messages');


const axios = require('axios').default;

const TOKEN = process.env.TOKEN; 
const express = require('express');
const { Client, Intents } = require('discord.js');
const { header } = require('express/lib/request');

const CHANNEL_ID = "905487315982495769";
const CHANNEL_URL = `channels/${CHANNEL_ID}/messages`;

const GUILD_ID = '905487315982495765'
const GUILD_URL = `guilds/${GUILD_ID}/channels`

const DISCORD_BASEURL = "https://discord.com/api/v9/";
const headers = {
  "Authorization": TOKEN,

}


/////////////////////


var bodyParser = require('body-parser')
// var cors = require('cors');
// var origins = process.env.NODE_ENV==='production'?':(': 'http://localhost:8080/';

const app = express();
// app.use(cors({origin: origins}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const port = process.env.NODE_ENV==="production"? process.env.PORT: 3000;




// app.use('/guildchannels', guildRouter);
app.use('/insertmessages', insertMessagesRouter);


app.get('/', (req, res) => {
  console.log(req.headers)
  
  res.send("Yeet ur here")
});
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`)
// });

app.listen(process.env.PORT||port, ()=>console.log(`listening ${port}`));



  // axios
  //   .get(DISCORD_BASEURL+CHANNEL_URL,
  //     {
  //       headers: headers
  //     })
  //   .then(res=>{
  //     res.data.forEach(element => {
  //       if(element.content=="🍕") console.log("got some za!");

  //     });
  //     // console.log(res)
  //   })
  //   .catch(error =>{
  //     console.error(error)
  //   })



// app.get('/guildchannels', (req,res)=>{

//   // const resy = await axios.get(DISCORD_BASEURL+CHANNEL_URL,
//   //   {
//   //     headers: headers
//   //   });
//   // console.log(resy)

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
//   res.send("yellow")
// });

// const client = new Client({
//   intents: [Intents.FLAGS.GUILDS],
// });

// client.once('ready', ()=>{
//   console.log("bot online");
// });

// client.login(TOKEN);

// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
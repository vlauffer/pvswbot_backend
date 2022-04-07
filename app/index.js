
require('dotenv').config();

//establish api functions
const insertMessagesRouter = require('./api/messages');
const getEmojisRouter = require('./api/emojis');
const getUserEmojisRouter = require('./api/useremojis');
const getDatesRouter = require('./api/dates');
const insertReactionRouter = require('./api/reactions');
const emojiImagesRouter = require('./api/emoji_images');


//set up express server
const express = require('express');
var bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const port = process.env.NODE_ENV==="production"? process.env.PORT: 3000;

//establish routes to api functions
app.use('/messages', insertMessagesRouter);
app.use('/getemojis', getEmojisRouter);
app.use('/getallusersemojis', getUserEmojisRouter);
app.use('/getemojidates', getDatesRouter);
app.use('/reaction', insertReactionRouter);
app.use('/emoji_images', emojiImagesRouter);

app.get('/', (req, res) => {
  res.send("base request hit")
});

//start server
app.listen(process.env.PORT||port, ()=>console.log(`listening on port ${port}`));


require('dotenv').config();

//establish api functions
const insertMessagesRouter = require('./api/messages');
const getEmojisRouter = require('./api/emojis');
const getUserEmojisRouter = require('./api/useremojis');

//set up express server
const express = require('express');
var bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const port = process.env.NODE_ENV==="production"? process.env.PORT: 3000;

//establish routes to api functions
app.use('/insertmessages', insertMessagesRouter);
app.use('/getemojis', getEmojisRouter);
app.use('/getallusersemojis', getUserEmojisRouter);

app.get('/', (req, res) => {
  res.send("base request hit")
});

//start server
app.listen(process.env.PORT||port, ()=>console.log(`listening on port ${port}`));

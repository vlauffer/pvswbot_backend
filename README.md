# Welcome to Pancakes vs Waffles Bot's (pvswbot) Backend!

This backend serves as an intermediary between the pvswbot and a Tidbyt. The bot sends messages from the Tidbyt Discord guild to this backend, which is parsed for emoji data. The Tidbyt app can then call functions on this database via http request for data on emoji usage in the guild.

## This backend has 3 primary requests

### /getemojis 
Get the total count of each emoji in the database. (takes no parameters)

### /getallusersemojis
Get the counts of every emoji used by each user in the database. (takes no parameters)

### / insertmessages
Inserts messages into the database, requires a raw json object in the following format:

```
{
    "username": string,
    "user_id": string,
    "channel_id": string,
    "message_id": string,
    "content": string,
}   
```

## What am I currently working on?
• Creating an additional table in the database that stores base64 encoded emojis and their corresponding title
• Adding a column on the messages table that will label when each message was sent


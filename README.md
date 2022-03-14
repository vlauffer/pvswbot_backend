# Welcome to Pancakes vs Waffles Bot's (pvswbot) Backend!
Pancakes vs Waffles is a project that collects information on emoji usage from the Tidbyt Discord guild for display on a Tidbyt. The project is made up of a Discord bot that sends message information, a backend that stores and fetches emoji data via http requests, and a Tidbyt app that gets and displays emoji data.

This backend serves as an intermediary between the pvswbot and a Tidbyt. The bot sends messages from the Tidbyt Discord guild to this backend, which is parsed for emoji data and stored in the db. The Tidbyt app can then call endpoints on the api via http request in order to receive data on emoji usage in the guild.

## This backend has 3 primary endpoints

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
- Creating an additional table in the database that stores base64 encoded emojis and their corresponding title
- Adding a column on the messages table that will label when each message was sent
- Create table and api request for adding reactions
- Adding functionality for editing messages and updating all tables based off edits/deletions
- Adding functionality for discarding reactions


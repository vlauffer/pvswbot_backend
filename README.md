# Welcome to Pancakes vs Waffles Bot's (pvswbot) Backend!
Pancakes vs Waffles is a project that collects information on emoji usage from the Tidbyt Discord guild for display on a Tidbyt. The project is made up of a Discord bot that sends message information, a backend that stores and fetches emoji data via http requests, and a Tidbyt app that gets and displays emoji data.

This backend serves as an intermediary between the pvswbot and a Tidbyt. The bot sends messages from the Tidbyt Discord guild to this backend, which is parsed for emoji data and stored in the db. The Tidbyt app can then call endpoints on the api via http request in order to receive data on emoji usage in the guild.

## This backend has 3 primary endpoints

### /getemojis 

Get the total count of each emoji in the database. (takes no parameters)

Response:
```
{
    Total: 
        [
            {
                emoji: string, 
                ucode: string, 
                count: int, 
                base: string
            }, ...
        ]
}
``` 

### /getallusersemojis

Get the counts of every emoji used by each user in the database. (takes no parameters)

Response:
```
{
    Totals: 
        [
            { 
                uid: string,
                username: string,
                base: string,
                count: int,
                emoji: string,
                ucode: string
            }, ...
        ]
} 
```

### /getemojidates

Get emoji totals between 2 dates. Takes parameters `date1 (TIMESTAMP)` and  `date2 (TIMESTAMP)`.

Response:
```
{
    dates: 
        [ 
            { 
                emoji: string, 
                ucode: string, 
                count: int, 
                created_at: string  
            }, ... 
        ] 
}
```





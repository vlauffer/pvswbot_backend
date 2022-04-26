# Structures used in this project


## message

```

 *          {
 *              channel_id: string, 
 *              content: string,
 *              created_at: string,
 *              message_id: string,
 *              user_id: string, 
 *              username: string,
 *              reactions: [reaction, ...] 
 *              
 *          }

 *
```


## messages

```
{
 *      [message, message, ...]
 * }
```

## message-SQL

```
[
    message.user_id,
    message.channel_id
    message.message_id
    message.content,
    message.created_at
]
```

## emoji-SQL

```
[
    message_id (string),
    emoji (string),
    ucode (string),
]
```

## emojis-SQL

```
[emoji-SQL, ...]
```

## reaction-add

```
{
 *      channel_id: string, 
 *      message_id: string,
 *      user_id: string, 
 *      emoji: string, 
 *      created_at: string
 * } 
```


## reactions-add

```
{
    [reaction, reaction, ...]
}
```

## reaction-SQL

```
[
    channel_id: string,
    message_id: string,
    user_id: string, 
    emoji: string, 
    ucode: string, 
    created_at: string
]

```

## user-SQL

```
[
    message.user_id,
    message.username
]
```

## superParseOutput

```
{
    messageArray: [message-SQL, ... ],
    emojiArray: [emoji-SQL, ...],
    messageIDs: [string, ...],
    reactionsArray: [reaction-SQL, ...],
    userArray: [user-SQL, ...]
}
```


CREATE TABLE emojis (
    internal_emojis_id SERIAL PRIMARY KEY,
    channel_id VARCHAR(64),
    message_id VARCHAR(64),
    user_id VARCHAR(64),
    emoji TEXT

);
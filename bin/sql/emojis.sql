CREATE TABLE emojis (
    internal_emojis_id SERIAL PRIMARY KEY,
    message_id VARCHAR(64),
    emoji TEXT

);
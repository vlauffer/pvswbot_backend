CREATE TABLE emojis (
    internal_emojis_id SERIAL PRIMARY KEY,
    message_id VARCHAR(64),
    emoji TEXT,
    ucode TEXT,

) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE TABLE reactions (
    internal_reaction_id SERIAL PRIMARY KEY,
    channel_id VARCHAR(64),
    message_id VARCHAR(64),
    user_id VARCHAR(64),
    emoji TEXT,
    ucode TEXT
    created_at TIMESTAMP

) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
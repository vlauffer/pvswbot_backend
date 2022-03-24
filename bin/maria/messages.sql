CREATE TABLE messages (
    internal_message_id SERIAL PRIMARY KEY,
    channel_id VARCHAR(64),
    message_id VARCHAR(64) NOT NULL UNIQUE,
    user_id VARCHAR(64),
    message_content TEXT,
    created_at TIMESTAMP

) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
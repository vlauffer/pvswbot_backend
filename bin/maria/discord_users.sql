CREATE TABLE discord_users (
    internal_user_id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    username VARCHAR(64)

) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
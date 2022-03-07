CREATE TABLE discord_users (
    internal_user_id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    username VARCHAR(64)

);
#!/bin/bash


echo "Configuring pvswbotdb"

# brew services start postgresql

dropdb -U postgres pvswbotdb
createdb -U postgres pvswbotdb

psql -U postgres pvswbotdb < ./bin/sql/messages.sql
psql -U postgres pvswbotdb < ./bin/sql/discord_users.sql
psql -U postgres pvswbotdb < ./bin/sql/emojis.sql

# brew services stop postgresql

echo "pvswbotdb Configured"
#!/bin/bash
MAINDB="pvswbotdb"

echo "Configuring pvswbotdb - mysql"

# brew services start adminql

echo "Please enter root user MySQL password!"
echo "Note: password will be hidden when typing"
echo -n "ENTER PASSWORD:"
read -s pass

mysql -uadmin -p$pass -e "DROP DATABASE IF EXISTS pvswbotdb;"
mysql -uadmin -p$pass -e "CREATE DATABASE $MAINDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
mysql -uadmin -p$pass pvswbotdb < ./bin/mysql/discord_users.sql
mysql -uadmin -p$pass pvswbotdb < ./bin/mysql/messages.sql
mysql -uadmin -p$pass pvswbotdb < ./bin/mysql/emojis.sql


# dropdb -U admin pvswbotdb
# createdb -U admin pvswbotdb

# mysql -U admin pvswbotdb < ./bin/mysql/messages.sql
# mysql -U admin pvswbotdb < ./bin/mysql/discord_users.sql
# mysql -U admin pvswbotdb < ./bin/mysql/emojis.sql

# brew services stop adminql

echo "pvswbotdb Configured"
#!/bin/bash
MAINDB="pvswbotdb"

echo "Configuring pvswbotdb - mariadb"


echo "Please enter root user MySQL password!"
echo "Note: password will be hidden when typing"
echo -n "ENTER PASSWORD:"
read -s pass

mysql -uadmin -p$pass -e "DROP DATABASE IF EXISTS pvswbotdb;"
mysql -uadmin -p$pass -e "CREATE DATABASE $MAINDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
mysql -uadmin -p$pass pvswbotdb < ./bin/maria/discord_users.sql
mysql -uadmin -p$pass pvswbotdb < ./bin/maria/messages.sql
mysql -uadmin -p$pass pvswbotdb < ./bin/maria/emojis.sql
mysql -uadmin -p$pass pvswbotdb < ./bin/maria/reactions.sql


echo "pvswbotdb Configured"
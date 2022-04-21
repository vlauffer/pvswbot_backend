#!/bin/bash
MAINDB="pvswbotdb"

echo "Configuring pvswbotdb - mariadb"

echo "Please enter root user MySQL password!"
echo "Note: password will be hidden when typing"
echo -n "ENTER PASSWORD:"
read -s pass

mysql -h pvswbotdb-instance.ce6gmhlvdbti.us-east-1.rds.amazonaws.com -u admin -p

mysql -h pvswbotdb-instance.ce6gmhlvdbti.us-east-1.rds.amazonaws.com -u admin -p$pass -e "DROP DATABASE IF EXISTS pvswbotdb;"
mysql -h pvswbotdb-instance.ce6gmhlvdbti.us-east-1.rds.amazonaws.com -u admin -p$pass -e "CREATE DATABASE $MAINDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
mysql -h pvswbotdb-instance.ce6gmhlvdbti.us-east-1.rds.amazonaws.com -u admin -p$pass pvswbotdb < ./bin/maria/discord_users.sql
mysql -h pvswbotdb-instance.ce6gmhlvdbti.us-east-1.rds.amazonaws.com -u admin -p$pass pvswbotdb < ./bin/maria/messages.sql
mysql -h pvswbotdb-instance.ce6gmhlvdbti.us-east-1.rds.amazonaws.com -u admin -p$pass pvswbotdb < ./bin/maria/message_emojis.sql

echo "pvswbotdb Configured"
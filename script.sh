#!/bin/bash

## MongoDB réplication
docker exec mongo-master bash -c 'cd script/ ; mongo --port 27017 < mongo.js'


## Master mysql

docker exec mysql-master mysql -uroot -proot -e "CREATE DATABASE decollages;"
docker exec mysql-master mysql -uroot -proot -e "USE decollages;"
docker exec -i mysql-master mysql -uroot -proot decollages < decollages.sql
docker exec mysql-master mysql -uroot -proot -e "GRANT REPLICATION SLAVE ON *.* TO 'repluser'@'%' IDENTIFIED BY 'root';"
docker exec mysql-master mysql -uroot -proot -e "FLUSH PRIVILEGES;"
docker exec mysql-master mysql -uroot -proot -e "FLUSH TABLES WITH READ LOCK;"

sleep 5

#Dump
docker exec mysql-master mysqldump -uroot -proot decollages > decollages.sql

#Vérif status
STATUS=$(docker exec mysql-master mysql -uroot -proot -ANe "SHOW MASTER STATUS;" | awk '{print $1 " " $2}')
LOG_FILE=$(echo $STATUS | cut -f1 -d ' ')
LOG_POS=$(echo $STATUS | cut -f2 -d ' ')


## Slave mysql

#Creer DB
docker exec mysql-slave mysql -uroot -proot -ANe "CREATE DATABASE decollages;"
#Insert Dump
docker exec -i mysql-slave mysql -uroot -proot decollages < decollages.sql

#Init replication
docker exec mysql-slave mysql -uroot -proot decollages -e "STOP SLAVE;"
docker exec mysql-slave mysql -uroot -proot decollages -e "CHANGE MASTER TO MASTER_HOST='mysql-master', MASTER_USER='repluser', MASTER_PASSWORD='root', MASTER_LOG_FILE='$LOG_FILE', MASTER_LOG_POS=$LOG_POS;"
docker exec mysql-slave mysql -uroot -proot decollages -e "START SLAVE;"

sleep 5

#Vérif status
SLAVE_OK=$(docker exec mysql-slave mysql -uroot -proot -e "SHOW SLAVE STATUS\G;" | grep 'Waiting for master')
if [ -z "$SLAVE_OK" ]; then
	echo "  - Error ! Wrong slave IO state."
else
	echo "  - Slave IO state OK"
fi


















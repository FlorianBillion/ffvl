var dotenv = require('dotenv');
var mongoose = require('mongoose');
const mysql = require('mysql')
const Promise = mongoose.Promise = require('bluebird')

dotenv.config();

mongoose.connect('mongodb://' + process.env.MongoDB_HOST +
        ':' + process.env.MongoDB_PORT +
        '/' + process.env.MongoDB_NAME)
    .then(() => {
        console.log("mongo connect");
    })
    .catch((err) => {
        console.log(err);
    });


const mysqlConnect = mysql.createConnection({
    host: process.env.MySQL_HOST,
    port: process.env.MySQL_PORT,
    database: process.env.MySQL_NAME,
    user: process.env.MySQL_USER,
    // password: process.env.MySQL_PWD
})

mysqlConnect.connect((err) => {
    if (err) {
        console.log(err);
        return
    }
    console.log("MySQL connect");
})

module.exports = mysqlConnect;

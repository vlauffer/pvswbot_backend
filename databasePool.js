require('dotenv').config();

const {Pool} = require ('pg');
const {Client} = require ('pg');

const databaseConfiguration = require('./secrets/dbConfig');

var mypool;
if(process.env.NODE_ENV==="production"){
    mypool = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });

    mypool.connect().then(console.log("db connected")).catch(error=>console.error(error));

}else{
    mypool = new Pool(databaseConfiguration);
}

module.exports = mypool;

require('dotenv').config();

const {Pool} = require ('pg');
const {Client} = require ('pg');

var mypool;
if(process.env.NODE_ENV==="production"){
    mypool = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: false}
    });

    mypool.connect().then(console.log("db connected")).catch(error=>console.error(error));

}else{
    const databaseConfiguration = require('./secrets/dbConfig');
    mypool = new Pool(databaseConfiguration);
    
}

module.exports = mypool;
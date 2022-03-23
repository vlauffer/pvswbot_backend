
const mariadb = require('mariadb');
var pool = null;

if(process.env.NODE_ENV==="production"){
    pool = mariadb.createPool({
        host: process.env.AWS_URL, 
        user: process.env.AWS_USER,
        password: process.env.AWS_PASS,
        database: process.env.AWS_DB,
        charset: 'utf8mb4',
        multipleStatements: true
    });

    pool.getConnection()
    .then(conn => {
        console.log("connected ! connection id is " + conn.threadId);
    })
    .catch(err => {
        console.log("not connected due to error: " + err);
    });

}else{
    const databaseConfiguration = require('./secrets/newdbConfig');
    pool = mariadb.createPool({
        host: databaseConfiguration.host,
        user: databaseConfiguration.user,
        password: databaseConfiguration.password,
        database: databaseConfiguration.database, 
        charset: 'utf8mb4',
        multipleStatements: true

    });
    pool.getConnection().then(console.log("local db connected")).catch(error=>console.error(error));
    
    // pooly.getConnection().then().catch(err=> console.error(err));
}

module.exports = pool;



const mariadb = require('mariadb');
var pool = null;

if(process.env.NODE_ENV==="production"){
    mariadb.createConnection({
        host: 'pvswbotdb-instance.ce6gmhlvdbti.us-east-1.rds.amazonaws.com', 
        user:'admin',
        password: 'Ilovemaria09=',
        charset: 'utf8mb4',
        multipleStatements: true
    })
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
    pool.getConnection().then(console.log("db connected")).catch(error=>console.error(error));
    
    // pooly.getConnection().then().catch(err=> console.error(err));
}

module.exports = pool;


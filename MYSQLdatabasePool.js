
var mysql = require('mysql');
const Pool = require('mysql/lib/Pool');
var pool = null;
var conn;

if(process.env.NODE_ENV==="production"){

    //FIXME: make new rds db
    mysql.createConnection({
        host: 'pvswbotdb-instance.ce6gmhlvdbti.us-east-1.rds.amazonaws.com', 
        user:'admin',
        password: 'Ilovemaria09='
    })
    .then(conn => {
        console.log("connected ! connection id is " + conn.threadId);
    })
    .catch(err => {
        console.log("not connected due to error: " + err);
    });

}else{
    const databaseConfiguration = require('./secrets/mysqldbConfig');
    // pool = mysql.createPool({
    //     host: databaseConfiguration.host,
    //     user: databaseConfiguration.user,
    //     password: databaseConfiguration.password,
    //     database: databaseConfiguration.database, 
        

    // });
    // pool.getConnection((err, conn)=>{
    //     if(err) console.error(err);


    // })
    conn = mysql.createConnection({
        host: databaseConfiguration.host,
        user: databaseConfiguration.user,
        database: databaseConfiguration.database,
        password: databaseConfiguration.password,
        charset : 'utf8mb4',
        multipleStatements: true

    });
    conn.connect((err)=>{
        if (err) console.error(err);
        
    })
    
    // pooly.getConnection().then().catch(err=> console.error(err));
}

module.exports = conn;



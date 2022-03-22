var fs = require('fs');


const pool = require('../../MARIAdatabasePool');
const sqlFolder = require('../bin/maria/')

const discord_users = require('../bin/maria/discord_users.sql');
var discord_users = fs.readFileSync('../bin/maria/discord_users.sql').toString();





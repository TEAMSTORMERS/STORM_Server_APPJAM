const mysql = require('promise-mysql');

const dbConfig ={
    host : 'db-our-sopt.cde4yt85a07o.ap-northeast-2.rds.amazonaws.com',
    port : 3306,
    user : 'admin',
    password : 'Gozldss^^1',
    database : 'Storm',
    dateString : 'date'
}

module.exports = mysql.createPool(dbConfig);
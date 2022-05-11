const mysql = require('mysql')

// create connection
const pool = mysql.createPool({ 
    host : 'us-cdbr-east-05.cleardb.net',
    user : 'b5f8bfe1de3b3f', 
    password : 'fb26353d',
    database : 'heroku_4d7a7ecebc52925'
})

module.exports = pool



  
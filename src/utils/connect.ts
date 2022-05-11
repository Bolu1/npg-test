const mysql = require('mysql')

// create connection
const pool = mysql.createPool({ 
    host : 'localhost',
    user : 'guest', 
    password : '1234',
    database : 'esusu'
})

module.exports = pool



  
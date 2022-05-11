"use strict";
const mysql = require('mysql');
// create connection
const db = mysql.createConnection({
    host: 'sql4.freesqldatabase.com',
    user: 'sql4479503',
    password: 'w6dFP8rxpL',
    database: 'sql4479503'
});
module.exports = db;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'money-bunny-instance-1.c8zbm7k90fa0.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    port: '3306',
    database: 'MoneyBunny'
})

connection.connect()

const app = express().use(cors()).use(bodyParser.json());

// connection.query('SELECT * FROM Tabela;', function(err, rows, fields) {
//     rows.forEach(function (row) {
//         console.log(JSON.parse(JSON.stringify(row)));
//     })
// })

connection.end()
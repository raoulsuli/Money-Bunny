const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'money-bunny-instance-1.c8zbm7k90fa0.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    port: '3306',
    database: 'MoneyBunny'
})

app.post('/login', function(req, res) {
    const query = "SELECT * FROM users WHERE username=? AND parola=?";
    db.query(query, [req.body.user, req.body.pass], (err, result) => {
        if (err) res.send("Error");
        else if (result.length != 0) res.send(result);
    });
})

app.listen(8080);

// -- INSERT INTO users
// -- (nume, username, email, CNP, numar_telefon,
// -- data_nasterii, adresa, parola, tip_utilizator, nume_firma)
// -- VALUES ("user name", "user", "user@yahoo.com", "1950321112567",
// -- "0728993456", STR_TO_DATE("22-04-1995", "%d-%m-%Y"), "Str mosilor 34", "pass",
// -- "Pfizica", NULL);users
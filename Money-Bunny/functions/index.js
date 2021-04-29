const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use('/api', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

const db = admin.firestore();
const userCollection = 'testTable';

app.post('/login', function(req, res) {
    const query = "SELECT * FROM users WHERE username=? AND parola=?";
    db.query(query, [req.body.user, req.body.pass], (err, result) => {
                if (err) res.send("Error");
                else if (result.length != 0) res.send(result);
            });
})

export const webApi = functions.https.onRequest(main);
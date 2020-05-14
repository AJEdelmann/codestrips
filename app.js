const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sqlite3 = require('sqlite3');
// in order to tests run correctly
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 8001;

app.use(express.static('public')); // serve codestripes website with
app.use(morgan('dev')); // middleware to log
app.use(bodyParser.json()); // middleware to parse JSON bodies

app.get('/strips', (req, res, next) => {
    db.all('SELECT * FROM Strip', (err, rows) => {
        if(err) {
            res.sendStatus(500);
        } else {
            res.send({strips: rows});
        }
    });
});

app.listen(PORT, () => {
    console.log('Server is listening on PORT:'+PORT);
});

module.exports = app;
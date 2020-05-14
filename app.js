const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sqlite3 = require('sqlite3');
// in order to tests run correctly
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 4001;

app.use(express.static('public')); // serve codestripes website with
app.use(morgan('dev')); // middleware to log
app.use(bodyParser.json()); // middleware to parse JSON bodies

app.get('/strips', (req, res, next) => {
    db.all('SELECT * FROM Strip', (err, rows) => {
        if(err) {
            res.sendStatus(500); // internal server error
        } else {
            res.send({strips: rows});
        }
    });
});

const validateStrip = (req, res, next) => {
    const stripToCreate = req.body.strip;
    // If none of those exists, send a send status
    if(
        !stripToCreate.head || 
        !stripToCreate.body || 
        !stripToCreate.background || 
        !stripToCreate.bubbleType 
    ) {
        return res.sendStatus(400); // bad request
    }
    next();
}

app.post('/strips', validateStrip, (req, res, next) => {
    const stripToCreate = req.body.strip;
    db.run(`
    INSERT INTO Strip(head, body, background, bubble_type, bubble_text, caption)
    VALUES($head, $body, $background, $bubbleType, $bubbleText, $caption)
    `,
    {
        $head: stripToCreate.head,
        $body: stripToCreate.body,
        $background: stripToCreate.background,
        $bubbleType: stripToCreate.bubbleType,
        $bubbleText: stripToCreate.bubbleText,
        $caption: stripToCreate.caption
    },
    function(err) {
        if(err) {
            res.sendStatus(500); // internal server error
        } 
    // this.lastID get the last object inserted
        db.get(`SELECT * FROM Strip WHERE id = ${this.lastID}`, (err, row) => {
            if(!row) {
                return res.sendStatus(500); // internal server error
            }
            res.status(201).send({ strip: row });
        });
    }
    )
});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

module.exports = app;
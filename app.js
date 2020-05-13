const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 4001;


// middleware to parse JSON bodies
app.use(bodyParser.json());

// middleware to log
app.use(morgan('dev'));

// serve codestripes website with
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log('Server is listening on PORT 4001');
});

module.exports = app;
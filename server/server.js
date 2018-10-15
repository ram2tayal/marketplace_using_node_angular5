const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const conf = require('./config');
const mongo = require('mongodb');
const cors = require('cors');

const app = express();

mongoose.connect(conf.url, (err, db) => {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res, next) => {
    res.json({
        'name': 'shyam tayal'
    })
});

app.listen(3030, err => {
    console.log("Server started at 3030 port");
});
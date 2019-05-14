// LIB REQUIRED
require('./server/config/server-config');

const express = require('express');
const mongoose = require('mongoose');

// INIT EXPRESS
const app = express();

const bodyParser = require('body-parser');

// BODY PARSER
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


// IMPORT ROUTES
var routes = require('./server/routes/server-routes');
app.use(routes);


// DATA BASE CONNECTION
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Data Base ONLINE');
});


// SERVER READY
app.listen(process.env.PORT, () => {
    console.log('PORT Listening: ', process.env.PORT);
});
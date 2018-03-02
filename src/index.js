const express = require('express');
const bodyParser = require('body-parser');
require("./config.js");

const app = express();

app.use(bodyParser.json());
app.use('/api', require('./api'));

app.listen(process.env.PORT, () => {
    console.log("Server run on " + process.env.PORT);
})

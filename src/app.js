const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const routes = require('./route/route')
const bodyParser = require("body-parser")
const cookieparser = require("cookie-parser");
process.env.PWD = process.cwd();
const fileUpload = require("express-fileupload");


const app = express();

// enable cors
// app.use(cors());
app.options('*', cors());

app.use(express.static(`${process.env.PWD}/public`));

// app.use(express.urlencoded({ extended: true }));

app.use(fileUpload())
// app.use(express.json());
app.use(bodyParser.json());
app.use(cookieparser());
// jwt authentication

app.get('/', async (req, res) => {
    res.status(200).send('Congratulations! API is working!');
});
app.use('/api', routes);



// handle error
const db = require('./models');

db.sequelize.sync();

app.listen(config.port, () => {
    console.log('SERVER');
    console.log(`Listening to port ${config.port}`);
});
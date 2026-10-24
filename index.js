const express = require('express');
const dbConnect = require('./config/database');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
dbConnect.connect();

app.listen(PORT, () => {
    console.log(`App is running as port ${PORT}`)
})
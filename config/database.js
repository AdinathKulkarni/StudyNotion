const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.DB_URL)
    .then( () => {
        console.log("Db connection successful✅");
    })
    .catch((error) => {
        console.log("Error connecting to Database❌");
        process.exit(1);
    })
}
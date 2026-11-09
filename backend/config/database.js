const mongoose = require('mongoose');

exports.connect = async() => {
    if(!process.env.DB_URL){
        throw new Error('DB_URL is not configured');
    }

    await mongoose.connect(process.env.DB_URL);
    console.log("Database connection successful");
};
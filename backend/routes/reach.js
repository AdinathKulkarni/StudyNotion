const express = require('express');
const {contactUs} = require('../controllers/contact');

const router = express.Router();

router.post('/contact', contactUs);

module.exports = router;

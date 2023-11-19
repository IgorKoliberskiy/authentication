const express = require('express');
const userRoute = require('./user/user');

const router = express.Router();

router.use('/user', userRoute);

module.exports = router;
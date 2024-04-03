const express = require('express');
const router = express.Router();
const Admincontroller = require("../Controllers/AdminController");
const TrycatchMiddleware = require('../Middlewares/Trycatchmiddleware');

router.post('/login', TrycatchMiddleware(Admincontroller.login));

module.exports = router;

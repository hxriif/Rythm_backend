const express = require('express');
const router = express.Router();
const Admincontroller = require("../Controllers/AdminController");
const TrycatchMiddleware = require('../Middlewares/Trycatchmiddleware');
const verifyToken=require("../Middlewares/adminAuthMiddleware")

router.post('/login', TrycatchMiddleware(Admincontroller.login));

router.use(verifyToken)

router.get('/allusers',TrycatchMiddleware(Admincontroller.getallusers))



module.exports = router;

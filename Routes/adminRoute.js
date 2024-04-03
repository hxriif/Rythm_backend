const express = require('express');
const router = express.Router();
const Admincontroller = require("../Controllers/AdminController");
const TrycatchMiddleware = require('../Middlewares/Trycatchmiddleware');
const verifyToken = require("../Middlewares/adminAuthMiddleware")
const imageuploader = require('../Middlewares/Image_uploader/Img_uploader');



router.post('/login', TrycatchMiddleware(Admincontroller.login));

router.use(verifyToken)

router.get('/allusers', TrycatchMiddleware(Admincontroller.getallusers))
router.get('/userById/:id', TrycatchMiddleware(Admincontroller.getUserbyId))
router.post('/user/addproduct',imageuploader,TrycatchMiddleware(Admincontroller.addMusic))



module.exports = router;

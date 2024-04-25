const express = require('express');
const router = express.Router();
const Admincontroller = require("../Controllers/AdminController");
const TrycatchMiddleware = require('../Middlewares/Trycatchmiddleware');
const verifyToken = require("../Middlewares/adminAuthMiddleware")
const imageuploader = require('../Middlewares/Image_uploader/Img_uploader');
const musicuploader=require("../Middlewares/Music_uploader/Music_uploader")


router.post('/login', TrycatchMiddleware(Admincontroller.login));

router.use(verifyToken)

router.get('/allUsers', TrycatchMiddleware(Admincontroller.getallusers))
router.get('/userById/:id', TrycatchMiddleware(Admincontroller.getUserbyId))
router.post('/addMusic',imageuploader,TrycatchMiddleware(Admincontroller.addMusic))
router.delete('/deleteMusic/:id',TrycatchMiddleware(Admincontroller.deleteMuisc))
router.get('/getAllMusics',TrycatchMiddleware(Admincontroller.getAllMusics))
router.put('/updateUserStatus/:id',TrycatchMiddleware(Admincontroller.enableUserStatus))



module.exports = router;

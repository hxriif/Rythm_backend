const express = require('express')
const router = express.Router()
const userController = require("../Controllers/UserController")
const TrycatchMiddleware = require("../Middlewares/Trycatchmiddleware")
const verifyToken=require("../Middlewares/userAuthMiddleware")
const imageuploader=require("../Middlewares/Image_uploader/Img_uploader")


router.post("/Register",imageuploader,TrycatchMiddleware(userController.register))
router.post("/login", TrycatchMiddleware(userController.login))

router.use(verifyToken)
router.get('/getallMusics',TrycatchMiddleware(userController.getAllsongs))
router.get('/getmusicByid/:id',TrycatchMiddleware(userController.musicById))
router.get('/getmusicByCategory/:categoryname',TrycatchMiddleware(userController.musicByCategoryName))
router.post('/addToLikedSongs/:id',TrycatchMiddleware(userController.addToLikedSongs))



module.exports = router;
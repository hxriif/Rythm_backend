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
router.get('/viewLikedSongs/:id',TrycatchMiddleware(userController.viewLikedSongs))
router.delete('/deleteFromLikedSongs/:id',TrycatchMiddleware(userController.deleteFromLikedSongs))
router.post('/createPlaylist/:id',TrycatchMiddleware(userController.createPlaylist))
router.post('/addMusicToPlaylist/:playlistId',TrycatchMiddleware(userController.addSongToPlaylist))



module.exports = router;
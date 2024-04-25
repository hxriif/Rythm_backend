const express = require('express')
const router = express.Router()
const userController = require("../Controllers/UserController")
const TrycatchMiddleware = require("../Middlewares/Trycatchmiddleware")
const verifyToken = require("../Middlewares/userAuthMiddleware")
const imageuploader = require("../Middlewares/Image_uploader/Img_uploader")

// authentication & authorization
router.post("/Register", imageuploader, TrycatchMiddleware(userController.register))
router.post("/login", TrycatchMiddleware(userController.login))

router.use(verifyToken)
// fetching music
router.get('/getallMusics', TrycatchMiddleware(userController.getAllsongs))
router.get('/getmusicByid/:id', TrycatchMiddleware(userController.musicById))
router.get('/getmusicByCategory/:categoryname', TrycatchMiddleware(userController.musicByCategoryName))

// liked songs setup
router.post('/addToLikedSongs/:id', TrycatchMiddleware(userController.addToLikedSongs))
router.get('/viewLikedSongs/:id', TrycatchMiddleware(userController.viewLikedSongs))
router.delete('/deleteFromLikedSongs/:id', TrycatchMiddleware(userController.deleteFromLikedSongs))

// playlist setup
router.post('/createPlaylist/:id', TrycatchMiddleware(userController.createPlaylist))
router.delete('/deletePlaylist/:id', TrycatchMiddleware(userController.deletePlaylist))
router.get('/getUserPlaylists/:id', TrycatchMiddleware(userController.getUserPlaylist))
router.post('/addMusicToPlaylist/:playlistId', TrycatchMiddleware(userController.addSongToPlaylist))
router.delete('/deletePlaylisSong/:id', TrycatchMiddleware(userController.deletePlaylistSongs))
router.get('/playlistSongs/:id', TrycatchMiddleware(userController.viewPlaylistSongs))



module.exports = router;
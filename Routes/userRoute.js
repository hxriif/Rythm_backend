const express = require('express')
const router = express.Router()
const userController = require("../Controllers/UserController")
const TrycatchMiddleware = require("../Middlewares/Trycatchmiddleware")


router.post("/Register",TrycatchMiddleware(userController.register))
router.post("/login",TrycatchMiddleware(userController.login))


module.exports = router;
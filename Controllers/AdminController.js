const jwt = require("jsonwebtoken")
const usercollection = require("../Models/userSchema")
const Musics = require("../Models/musicSchema")
const { musicJoiSchema } = require("../Models/validationSchema")


module.exports = {


    login: async (req, res) => {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.ADMIN_ACCESS_TOKEN_SECRET);
            return res.status(200).json({
                status: "success",
                message: "successfully admin registered",
                data: token
            })
        }
        else {
            return res.status(404).json({
                status: "not found",
                message: "Invalid admin",
            });
        }
    },


    getallusers: async (req, res) => {
        const allusers = await usercollection.find();
        if (allusers.length === 0) {
            return res.status(404).json({
                status: "not found",
                message: "user list is empty"
            })
        }
        else {
            return res.status(200).json({
                status: "success",
                message: "user's fetched sucessfully",
                data: allusers
            })
        }
    },


    getUserbyId: async (req, res) => {
        const userId = req.params.id;
        const user = await usercollection.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: "not found",
                message: "user not found"
            })
        }
        else {
            return res.status(200).json({
                status: "success",
                message: "user fetched success",
                data: user
            })
        }
    },


    addMusic: async (req, res) => {
        const { value, error } = musicJoiSchema.validate(req.body)
console.log(req.body,'body');
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { name, image, category, description, artist, song } = value

        try {
            const addedMusic = await Musics.create({
                name,
                image,
                category,
                description,
                artist,
                song,
            })
            return res.status(201).json({
                status: "success",
                message: "product added successfully",
                data: addedMusic,
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },



}
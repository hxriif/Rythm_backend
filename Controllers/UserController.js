const jwt = require("jsonwebtoken")
const { userjoiSchema } = require("../Models/validationSchema")
const userschema = require("../Models/userSchema")
const bcrypt = require('bcrypt')
const MusicCollections = require("../Models/musicSchema")




module.exports = {



    register: async (req, res) => {
        const { value, error } = userjoiSchema.validate(req.body)
        if (error) {
            return (
                res.status(400),
                json({
                    status: "Error",
                    message: "invalid user input data,please enter a valid data",
                })
            );
        }

        const existinguser = await userschema.findOne({ username: value.username })
        if (existinguser) {
            return res.status(409).json({
                status: "Error",
                message: "user name already exists"
            })
        }

        const { name, email, username, password } = value;
        await userschema.create({
            name,
            email,
            password,
            username,
        });
        return res.status(201).json({
            status: "success",
            message: "user registered successfully✅",
        });
    },




    login: async (req, res) => {
        const { value, error } = userjoiSchema.validate(req.body);
        if (error) {
            return res.json(error.message);
        }

        const { email, password } = value;
        const user = await userschema.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "user not found",
            });
        }

        const id = user.id;


        if (!password || !user.password) {
            return res.status(400).json({
                status: "error",
                message: "invalid input",
            });
        }

        const passwordmatch = await bcrypt.compare(password, user.password);
        if (!passwordmatch) {
            return res.status(401).json({
                status: "error",
                message: "incorrect password",
            });
        }

        const Token = jwt.sign(
            { email: user.email },
            process.env.USER_ACCES_TOKEN_SECRET,
            {
                expiresIn: 8500,
            }
        );
        return res.status(200).json({
            status: "success",
            message: "Login Successful✅",
            data: { id, email, Token },
        });
    },



    getAllsongs: async (req, res) => {
        const allsongs = await MusicCollections.find();
        if (!allsongs) {
            return res.status(404).json({
                status: "error",
                message: "no music found"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "music fetched successfully✅",
            data: allsongs
        })
    },



    musicById: async (req, res) => {
        const Id = req.params.id;
        const music = await MusicCollections.findById(Id)
        if (!music) {
            return res.status(404).json({
                status: "error",
                message: "music not found"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "music fetched successfully✅",
            data: music
        })
    },



    musicByCategoryName: async (req, res) => {
        const musicCategory = req.params.categoryname;
        const category = await MusicCollections.find({ category: musicCategory })
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "not found",
            })
        }
        return res.status(200).json({
            status: "success",
            message: "music fectched by category✅",
            data: category
        })
    }



}
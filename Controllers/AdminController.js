const jwt = require("jsonwebtoken")
const usercollection = require("../Models/userSchema")


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

    }



}
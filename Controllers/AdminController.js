const jwt = require("jsonwebtoken")
const usercollection = require("../Models/userSchema")
const MusicsCollection = require("../Models/musicSchema")
const {musicJoiSchema}=require("../Models/validationSchema")
const musicSchema = require("../Models/musicSchema")
const userSchema = require("../Models/userSchema")

module.exports = {


    login: async (req, res) => {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.ADMIN_ACCESS_TOKEN_SECRET);
            return res.status(200).json({
                status: "success",
                message: "successfully admin registered✅",
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
                message: "user's fetched sucessfully✅",
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
                message: "user fetched success✅",
                data: user
            })
        }
    },


    addMusic: async (req, res) => {
        const { value, error } = musicJoiSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { name, image, category, description, artist, song } = value
        const addedMusic = await MusicsCollection.create({
            name,
            image,
            category,
            description,
            artist,
            song,
        })
        return res.status(201).json({
            status: "success",
            message: "Music added successfully✅",
            data: addedMusic,
        });
    },


    deleteMuisc: async (req, res) => {
        const Id = req.params.id;

        const deletemusic = await MusicsCollection.findOneAndDelete({ _id: Id })
        if (!deletemusic) {
            return res.status(404).json({
                status: "error",
                message: "Music  Not Found in Database",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "music deleted successfully",
        });
    },


    getAllMusics:async(req,res)=>{
       const musics =await MusicsCollection.find()
        if(!musics||musics.length===0){
            return res.status(404).json({
              status:"error",
              message:"no music find in music collection"
            })
        }

        return res.status(200).json({
            status:"success",
            message:"successfully music fetched ",
            data:musics
        })
    },



    enableUserStatus:async(req,res)=>{
     const userId=req.params.id;
     const user=await userSchema.findById(userId)
     if(!user){
        return res.status(404).json({
            status:"error",
            message:"user not found"
        })
     }

     await userSchema.updateOne({_id:userId},{$set:{status:"enabled"}})
    },

}
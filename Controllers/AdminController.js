const jwt = require("jsonwebtoken")
const usercollection = require("../Models/userSchema")
const MusicsCollection = require("../Models/musicSchema")
const { musicJoiSchema } = require("../Models/validationSchema")
const MusicUploadRequest = require("../Models/MusicUploadRequest")
const userMusics = require("../Models/userUploadingMusic")

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



    getAllMusics: async (req, res) => {
        const musics = await MusicsCollection.find()
        if (!musics || musics.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "no music find in music collection"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "successfully music fetched ",
            data: musics
        })
    },






    pendingMusicRequest: async (req, res) => {
        const pendingRequest = await MusicUploadRequest.find({ status: "pending" }).populate('creator')
        if (pendingRequest.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "no pending request found"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "succeessfully fetched pending requests",
            data: pendingRequest
        })
    },



    approvePendigRequest: async (req, res) => {
        const requestId = req.params.id;
        const request = await MusicUploadRequest.findById(requestId).populate('creator')
        if (!request) {
            return res.status(404).json({
                status: "error",
                message: "request not found"
            })
        }

        request.status = 'approved';
        await request.save();
               


        const approvedMusic = await userMusics.create({
            name: request.name,
            image: request.image,
            category: request.category,
            description: request.description,
            artist: request.artist,
            song: request.song,
            creator:request.creator.id,
        })



        return res.status(200).json({
            status: "success",
            message: "song request approved",
            data: approvedMusic
        })
    },



    rejectPendingRequest:async(req,res)=>{
        const requestId=req.params.id
        const request=await MusicUploadRequest.findById(requestId)
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = 'rejected';
        await request.save();
        res.json({ message: 'uploading request rejected' });
    }

}
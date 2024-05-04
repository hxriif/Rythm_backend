const jwt = require("jsonwebtoken")
const { userjoiSchema, musicJoiSchema } = require("../Models/validationSchema")
const userschema = require("../Models/userSchema")
const bcrypt = require('bcrypt')
const MusicCollections = require("../Models/musicSchema")
const { ObjectId } = require("mongoose").Types;
const Playlist = require("../Models/playlistSchema")
const { playlistJoiSchema } = require("../Models/validationSchema")
const musicRequest = require("../Models/MusicUploadRequest")
const userMusicCollection = require("../Models/userUploadingMusic")




module.exports = {



    register: async (req, res) => {
        const { value, error } = userjoiSchema.validate(req.body)
        if (error) {
            return (
                res.status(400).
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

        const { name, email, username, password, image } = value;
        await userschema.create({
            name,
            email,
            username,
            password,
            image,
        });
        return res.status(201).json({
            status: "success",
            message: "user registered successfully✅",
        });
    },




    login: async (req, res) => {
        const { value, error } = userjoiSchema.validate(req.body);
        console.log(req.body,'body');
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
                expiresIn: 86400,
            }
        );
        return res.status(200).json({
            status: "success",
            message: "Login Successful✅",
            data: { id, email, Token },
        });
    },




    getDetails:async(req,res)=>{
        const userId=req.params.id;
        const user=await userschema.findById(userId);
        if(!user){
            return res.status(404).json({
                status:"error",
                message:"user nof found"
            })
        }
        return res.status(200).json({
            status:"success",
            message:"successfully fetched your details",
            data:[user]
        })

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
            data: [music]
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
    },




    addToLikedSongs: async (req, res) => {
        const userId = req.params.id
        const user = await userschema.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }

        const { musicId } = req.body;
        if (!musicId) {
            return res.status(404).json({
                status: "error",
                message: "music not found in database"
            })
        }
        const existingSong = user.Likedsongs.find(song => song.musicsId.toString() === musicId);
        if (existingSong) {
            return res.status(409).json({
                status: "error",
                message: "music already in liked songs"
            });
        }

        const musicobject = {
            musicsId: new ObjectId(musicId)
        };

        await userschema.updateOne(
            { _id: user.id },
            { $push: { Likedsongs: musicobject } }
        );

        return res.status(200).json({
            status: "success",
            message: "successfully music added to Liked songs"
        })
    },




    viewLikedSongs: async (req, res) => {
        const userId = req.params.id;
        const user = await userschema.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        const userLikedSongs = user.Likedsongs
        if (userLikedSongs.length === 0) {
            return res.status(204).json({   
                status: "success",
                message: "user likedsongs is empty",
                data: []
            })
        }
        const likedSongs = await userschema.findOne
            ({ _id: userId }).
            populate("Likedsongs.musicsId");

            const userLikedSongsData = likedSongs.Likedsongs;

        return res.status(200).json({
            status: "success",
            message: "successfully fetched user LikedSongs",
            data: userLikedSongsData
        })
    },




    deleteFromLikedSongs: async (req, res) => {
        const userId = req.params.id;
        const user = await userschema.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }

        const { musicId } = req.body
        console.log(musicId,'muss');
        if (!musicId) {
            return res.status(404).json({
                status: "error",
                message: "music not found"
            })
        }

        await userschema.updateOne(
            { _id: userId },
            { $pull: { Likedsongs: { musicsId: musicId } } }
        );
        return res.status(200).json({
            status: "success",
            message: "succesfully music deleted from LikedSongs"
        })
    },



    createPlaylist: async (req, res) => {
        const userId = req.params.id;
        const user = await userschema.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }

        const { value, error } = playlistJoiSchema.validate(req.body);
        if (error) {
            return (
                res.status(400).
                    json({
                        status: "Error",
                        message: "invalid user input data,please enter a valid data",
                    })
            );
        }

        const { name, description } = value;
        const newPlaylist = new Playlist({
            name,
            description,
            creator: userId,
        })
        await newPlaylist.save();

        await userschema.findByIdAndUpdate(userId, { $addToSet: { createdPlaylists: newPlaylist._id } });

        return res.status(200).json({
            status: "success",
            message: "playlist created successfully",
            data: newPlaylist
        })
    },



    deletePlaylist: async (req, res) => {
        const userId = req.params.id;
        const { playlistId } = req.body;

        const user = await userschema.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        const updatedUser = await userschema.findByIdAndUpdate(
            userId,
            { $pull: { createdPlaylists: playlistId } },
        );
        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: "Playlist not found in user's created playlists"
            });
        }

        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
        if (!deletedPlaylist) {
            return res.status(404).json({
                status: "error",
                message: "Playlist not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Playlist deleted successfully",
            deletedPlaylist: deletedPlaylist
        });
    },



    getUserPlaylist: async (req, res) => {
        const userId = req.params.id;
        const user = await userschema.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }

        const playlists = await Playlist.find({ creator: userId })
        if (!playlists) {
            return res.status(404).json({
                status: "error",
                message: "no playlist found for this user"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "palylist fetched successfully",
            data: playlists
        })
    },




    addSongToPlaylist: async (req, res) => {
        const playlistId = req.params.playlistId;
        const { songId } = req.body;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({
                status: 'error',
                message: 'Playlist not found'
            });
        }

        const song = await MusicCollections.findById(songId);
        if (!song) {
            return res.status(404).json({
                status: "error",
                message: 'No such music found'
            });
        }


        await Playlist.updateOne({ _id: playlistId }, { $addToSet: { songs: song } });

        return res.status(200).json({
            status: "success",
            message: "Successfully music added to playlist",
            data: { playlist }
        });
    },



    viewPlaylistSongs: async (req, res) => {
        const userId = req.params.id;
        const playlists = await Playlist.find({ creator: userId }).populate('songs')
        if (!playlists || playlists.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No playlists found for this user"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "fetched success",
            data: playlists
        })
    },



    deletePlaylistSongs: async (req, res) => {
        const userId = req.params.id;
        const user = await userschema.findById(userId);
        if (!user) {
            res.status(404).json({
                status: "error",
                message: 'user not found'
            })
        }

        const { musicId } = req.body;
        const music = await Playlist.findOneAndUpdate({ creator: userId }, { $pull: { songs: musicId } })
        if (!music) {
            return res.status(404).json({
                status: "error",
                message: "music not found "
            })
        }
        return res.status(200).json({
            status: "success",
            message: "successfully music deleted from playlist"
        })
    },


    musicUploadrequest: async (req, res) => {
        const userId = req.params.id;
        const user = await userschema.findById(userId)
        console.log(user, 'usss');
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }
        const { value, error } = musicJoiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const existingname= await userMusicCollection.findOne({name:value.name})
        if(existingname){
            return res.status(409).json({
                status:"error",
                message:"music name already exists"
            })
        }
        const { name, image, category, description, artist, song } = value
        const requestedMusic = await musicRequest.create({
            name,
            image,
            category,
            description,
            artist,
            song,
            creator: userId,
        })

        return res.status(200).json({
            status: "success",
            message: "successfully music added to pending request",
            data: requestedMusic
        })

    },



    deleteUploadedMusic: async (req, res) => {
        const userId = req.params.id;
        const user = await userschema.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "user not found"
            })
        }

        const { musicId } = req.body;
        const deletedMusic = await userMusicCollection.findOneAndDelete({ _id: musicId }, { creator: userId })
        if (!deletedMusic) {
            return res.status(404).json({
                status: "error",
                message: "no such music find in user collection"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "successfully music deleted from  collection",
            data: deletedMusic
        })
    },


    

}





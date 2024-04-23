const mongoose = require('mongoose')


const playlistSchema= new mongoose.Schema({
    name:String,
    description:String,


    songs:[{
        songsId: { type: mongoose.Schema.ObjectId, ref: "song" },
    }]
})


module.exports=mongoose.model('Playlist', playlistSchema)
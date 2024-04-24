const mongoose = require('mongoose')


const playlistSchema= new mongoose.Schema({
    name:String,
    description:String,

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
     
    songs:[{
        songsId: { type: mongoose.Schema.ObjectId, ref: "song" },
    }]
})


module.exports=mongoose.model('Playlist', playlistSchema)
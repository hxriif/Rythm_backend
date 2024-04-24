const mongoose = require('mongoose')


const playlistSchema= new mongoose.Schema({
    name:String,
    description:String,

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
     
    songs:[{
          type: mongoose.Schema.Types.ObjectId, ref: "musics" ,
    }]
})


module.exports=mongoose.model('Playlist', playlistSchema)
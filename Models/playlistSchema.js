const mongoose = require('mongoose')


const playlistSchema = new mongoose.Schema({
    name: String,
    description: String,

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    songs: [{
        type: mongoose.Schema.Types.ObjectId, ref: "musics",
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Playlist', playlistSchema)
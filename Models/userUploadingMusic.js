const mongoose = require('mongoose')

const userMusicsSchema = new mongoose.Schema({
    name: String,
    image: String,
    category: String,
    description: String,
    artist: String,
    song: String,


    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    uploadedAt: {
        type: Date,
        default: Date.now
    },
})


module.exports = mongoose.model("UserMusics", userMusicsSchema)
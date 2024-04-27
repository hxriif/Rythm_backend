const mongoose = require('mongoose')


const musicUploadRequestSchema = new mongoose.Schema({

    name: String,
    image: String,
    category: String,
    description: String,
    artist: String,
    song: String,


    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },


    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
})


module.exports = mongoose.model("PendingRequest", musicUploadRequestSchema)
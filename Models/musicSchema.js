const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
    name: String,
    image: String,
    category: String,
    description: String,
    artist: String,
    song: String,
})

module.exports = mongoose.model("musics", musicSchema)
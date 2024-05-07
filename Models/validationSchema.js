const joi = require("joi")

const userjoiSchema = joi.object({
    name: joi.string(),
    email: joi.string().email().required(),
    username: joi.string().alphanum().min(3).max(30),
    password: joi.string().required(),
    image: joi.string(),

});



const musicJoiSchema = Joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    artist: joi.string().required(),
    song: joi.string().required(),
});


const playlistJoiSchema=joi.object({
    name:joi.string().required(),
    description:joi.string().required(),
    image:Joi.string().required()
})



module.exports = { userjoiSchema, musicJoiSchema,playlistJoiSchema };

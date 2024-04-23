const joi = require("joi")

const userjoiSchema = joi.object({
    name: joi.string(),
    email: joi.string().email().required(),
    username: joi.string().alphanum().min(3).max(30),
    password: joi.string().required(),
    image: joi.string(),

});

const Joi = require('joi');

const musicJoiSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    artist: Joi.string().required(),
    song: Joi.string().required(),
});


const playlistJoiSchema=joi.object({
    name:joi.string().required(),
    description:joi.string().required()
})



module.exports = { userjoiSchema, musicJoiSchema,playlistJoiSchema };

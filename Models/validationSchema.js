const joi = require("joi")

const userjoiSchema = joi.object({
    name: joi.string(),
    email: joi.string().email().required(),
    username: joi.string().alphanum().min(3).max(30),
    password: joi.string().required(),
});

module.exports = { userjoiSchema };

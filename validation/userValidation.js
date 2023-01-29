const Joi = require("joi");


const createUserSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().valid("admin", "resepsionis")
})

module.exports = {createUserSchema};
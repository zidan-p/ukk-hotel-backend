const Joi = require("joi");


const createUserSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().valid("admin", "resepsionis")
})


const updateUserSchema = Joi.object({
    username : Joi.string(),
    email: Joi.string().email(),
    password : Joi.string().min(4).allow(null, ''),
    role: Joi.string().valid("admin","resepsionis"),
    foto: Joi.string().allow(null, '')
})

module.exports = {createUserSchema, updateUserSchema};
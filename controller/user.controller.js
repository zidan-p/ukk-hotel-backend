const sequelize = require("./../database");
const handleSequelizeError = require("./../database/handleError");
const fs = require("fs/promises")
const path = require("path");

const models = sequelize.models;
const User = models.User


function handleServerError(err,res){
    console.error(new Error(`maaf, kami tidak bisa menyimpan ${err.name}`));
    console.error(err);
    return res.status(500).json({
        success: false,
        error: [
            {server : "maaf, server bermasalah"}
        ]
    })
}


const createUser = async (req,res) => {
    const data = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
    }
    if(req.files?.foto || req.file?.foto){
        data.foto = req.files.foto[0].filename
    }
    try{
        let result = await User.create(data);
        return res.status(200).json({
            success : true,
            result : result
        });
    }catch (err) {
        console.error(err);
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
            success: false,
            error: handleSequelizeError(err)
        })} 
        else {
            handleServerError(err,res)
        }
    }
}

const getAllUser = async (req, res) => {
    try {
        const { count, rows } = await User.findAndCountAll();
        return res.status(200).json({
            success: true,
            result: {
                data : rows,
                count : count
            }
        })
    } catch (err) {
        handleServerError(err,res)
    }
}


const getAllAdmin = async (req,res) => {
    try{
        const {count, rows} = await User.findAndCountAll({
            where: {role: "admin"}
        })
        return res.status(200).json({
            success : true,
            result: {
                data: rows,
                count : count
            }
        })
    }catch(err){
        handleServerError(err,res)
    }
}

const getAllResepsionis = async (req,res) => {
    try{
        const {count, rows} = await User.findAndCountAll({
            where: {role: "resepsionis"}
        })
        return res.status(200).json({
            success : true,
            result: {
                data: rows,
                count : count
            }
        })
    }catch(err){
        handleServerError(err,res)
    }
}


const getUser = async (req,res) => {
    try {
        const result = await User.findOne({
            where: {id: req.params.id}
        })
        return res.status(200).json({
            success : true,
            result: {
                data : result,
            }
        })
    } catch (error) {
        handleServerError(err,res);
    }
}


const getUserByUsername = async (req,res) => {
    try {
        const result = await User.findOne({
            where: {username : req.params.username}
        })
        return res.status(200).json({
            success : true,
            result : {
                data : result
            }
        })
    } catch (err) {
        handleServerError(err,res);
    }
}


const updateUser = async (req,res) => {
    const data = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
    }
    if(req.files?.foto || req.file?.foto){
        data.foto = req.files.foto[0].filename;
        await fs.unlink(path.resolve("storage", "images", data.foto));
    }

    try {
        let result = await User.update(data, {
            where: {id : req.params.id}
        })
        return res.status(200).json({
            success : true,
            result : {
                data : result
            }
        })
    } catch (err) {
        handleServerError(err,res)
    }
}


const deleteUser = async (req.res) => {
    //cari data yg akan dihapus
    let {foto} = await User.findByPk(req.param.iid)
}








module.exports = {
    createUser, 
    getAllUser, 
    getAllAdmin, 
    getAllResepsionis,
    getUser,
    getUserByUsername,
    updateUser
}
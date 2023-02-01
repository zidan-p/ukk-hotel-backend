const sequelize = require("./../database");
const handleSequelizeError = require("./../database/handleError");
const fs = require("fs/promises")
const path = require("path");

const models = sequelize.models;
const User = models.User


function handleServerError(err,res){
    console.error(new Error(`maaf, kami tidak bisa menyimpan ${err.name}`));
    console.error(err);
    // return res.status(500).json({
    //     success: false,
    //     error: [
    //         {server : "maaf, server bermasalah"}
    //     ]
    // })
    return res.status(500).json({
        success : false,
        error : err.message
    })

}


const endHandler = async (req, res) => {
    try {
        return res.status(200).json({
            success : true,
            result : req.UKK_BACKEND
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "saya tidak tahu apa yg error"
        })
    }
}


const createUser = async ( req, res, next ) => {
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
        req.UKK_BACKEND.createUser ={data : result};
        return next();
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

const getAllUser = async (req, res, next) => {
    try {
        const { count, rows } = await User.findAndCountAll();
        req.UKK_BACKEND.getAllUser = {
            data : rows,
            count : count
        }
        return next();
    } catch (err) {
        handleServerError(err,res)
    }
}


const getAllAdmin = async (req, res, next) => {
    try{
        const {count, rows} = await User.findAndCountAll({
            where: {role: "admin"}
        })
        req.UKK_BACKEND.getAllUser = {
            data: rows,
            count : count
        }
        return next()
    }catch(err){
        handleServerError(err,res)
    }
}

const getAllResepsionis = async (req,res) => {
    try{
        const {count, rows} = 
        await User.findAndCountAll({
            where: {role: "resepsionis"}
        })
        req.UKK_BACKEND.getAllResepsionis = {
            data: rows,
            count : count
        }
        return next();
    }catch(err){
        handleServerError(err,res)
    }
}


const getUser = async (req,res) => {
    try {
        const result = await User.findOne({
            where: {id: req.params.id}
        })
        if (result === null) throw new Error("user tidak ditemukan")
        req.UKK_BACKEND.getUser = {data : result}
        return next();
    } catch (error) {
        handleServerError(err,res);
    }
}


const getUserByUsername = async (req,res) => {
    try {
        const result = await User.findOne({
            where: {username : req.params.username}
        })
        if (result === null) throw new Error("user tidak ditemukan")
        req.UKK_BACKEND.getUserByUsername = {data : result}
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
        req.UKK_BACKEND.updateUser = {data : result}
        return next();
    } catch (err) {
        handleServerError(err,res)
    }
}


const deleteUser = async (req, res) =>  {
    try {
        await User.destroy({where : {id : req.params.id}});
        await fs.unlink(path.resolve("storage", "images", req.getUser.foto));
        req.UKK_BACKEND.deleteUser = {
            data : null
        }
        return next()
    } catch (error) {
        handleServerError(err,res)
    }
}








module.exports = {
    endHandler,
    deleteUser,
    createUser, 
    getAllUser, 
    getAllAdmin, 
    getAllResepsionis,
    getUser,
    getUserByUsername,
    updateUser
}
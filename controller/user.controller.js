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
        success : false,
        error : err.message
    })

}


async function deleteFileIfExist(path){
    try {
        await fs.access(fotoPath)
        fs.unlink(path);
    } catch (error) {
        console.error("error untuk admin")
        console.error(error);
    }
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

const firstHandler = async ( req, res, next ) => {
    req.UKK_BACKEND = {}
    next();
}


const createUser = async ( req, res, next ) => {
    const data = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
    }
    if(req.file){
        data.foto = req.file.filename
    }
    try{
        let result = await User.create(data);
        req.UKK_BACKEND.createUser = {data : result};
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
        req.UKK_BACKEND.getAllAdmin = {
            data: rows,
            count : count
        }
        return next()
    }catch(err){
        handleServerError(err,res)
    }
}

const getAllResepsionis = async ( req, res, next ) => {
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


const getUser = async ( req, res, next ) => {
    try {
        const result = await User.findOne({
            where: {id: req.params.id}
        })
        if (result === null) throw new Error("user tidak ditemukan")
        req.UKK_BACKEND.getUser = {data : result}
        return next();
    } catch (err) {
        handleServerError(err,res);
    }
}


const getUserByUsername = async ( req, res, next ) => {
    try {
        const result = await User.findOne({
            where: {username : req.params.username}
        })
        if (result === null) throw new Error("user tidak ditemukan")
        req.UKK_BACKEND.getUserByUsername = {data : result}
        return next()
    } catch (err) {
        handleServerError(err,res);
    }
}


const updateUser = async ( req, res, next ) => {
    const data = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
    }
    if(req.file){
        data.foto = req.file.filename;
    }
    let oldFoto = req.UKK_BACKEND.getUser.foto;
    try {
        let result = await User.update(data, {
            where: {id : req.params.id}
        })
        if(req.file && oldFoto) await deleteFileIfExist(path.resolve("storage", "images", oldFoto))
        req.UKK_BACKEND.updateUser = {data : result}
        return next();
    } catch (err) {
        handleServerError(err,res)
    }
}


const deleteUser = async ( req, res, next) =>  {
    try {
        await User.destroy({where : {id : req.params.id}});
        const fotoPath = path.resolve("storage", "images", req.UKK_BACKEND.getUser.data.foto)
        deleteFileIfExist(fotoPath);
        delete req.UKK_BACKEND.getUser
        req.UKK_BACKEND.deleteUser = {
            data : null
        }
        return next()
    } catch (err) {
        console.log(err);
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
    updateUser,
    firstHandler
}
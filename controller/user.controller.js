const sequelize = require("./../database");
const models = sequelize.models;
const User = models.User

// feature
const {
    deleteFileIfExist,
    getFilePath
} = require("./../feature/handleFile");
const {
    handleServerError,
    handleSequelizeError
} = require("./../feature/handleError");


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
        if (err.name === 'SequelizeValidationError') handleSequelizeError(res, err);
        else handleServerError(res,err);
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
        handleServerError(res,err)
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
        handleServerError(res,err)
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
        handleServerError(res,err)
    }
}


const getUser = async ( req, res, next ) => {
    try {
        const result = await User.findOne({
            where: {id: req.params.user_id}
        })
        if (result === null) throw new Error("user tidak ditemukan")
        req.UKK_BACKEND.getUser = {data : result.dataValues}
        return next();
    } catch (err) {
        handleServerError(res,err);
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
        handleServerError(res,err);
    }
}


const updateUser = async ( req, res, next ) => {
    const data = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
    }
    if(req.file)data.foto = req.file.filename; // ini foto yag belumd i format
    let oldFoto = getFilePath(req.UKK_BACKEND.getUser.data.foto); //ini sudah diformat dan akan di resolve
    try {
        let result = await User.update(data, {
            where: {id : req.params.id}
        })
        if(req.file && oldFoto) await deleteFileIfExist(oldFoto)
        req.UKK_BACKEND.updateUser = {data : result}
        return next();
    } catch (err) {
        if(err.name === 'SequelizeValidationError') handleSequelizeError(res,err);
        else handleServerError(res,err);
    }
}


const deleteUser = async ( req, res, next) =>  {
    try {
        await User.destroy({where : {id : req.params.id}});
        const fotoPath = getFilePath(req.UKK_BACKEND.getUser.data.foto)
        deleteFileIfExist(fotoPath);
        delete req.UKK_BACKEND.getUser
        req.UKK_BACKEND.deleteUser = {
            data : null
        }
        return next()
    } catch (err) {
        handleServerError(res,err)
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
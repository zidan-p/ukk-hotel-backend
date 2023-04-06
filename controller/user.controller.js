const sequelize = require("./../database");
const { Op } = require("sequelize");
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


const createUser = async ( req, res, next ) => {
    console.log(req.body);
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
        req.UKK_BACKEND.userOne = {data : result};
        return next();
    }catch (err) {
        if (err.name === 'SequelizeValidationError') handleSequelizeError(res, err);
        else handleServerError(res,err,req);
    }
}

const findUser = async (req,res,next) => {
    const UserId = req.body.UserId;
    try {
        const result = await User.findByPk(UserId)
        if (result === null) throw new Error("user tidak ditemukan")
        req.UKK_BACKEND.getUserOne = {data : result}
        return next();
    } catch (err) {
        handleServerError(res,err,req);
    }
}


const getAllUser = async (req, res, next) => {
    try {
        const { count, rows } = await User.findAndCountAll();
        req.UKK_BACKEND.getUserList = {
            data : rows,
            count : count
        }
        return next();
    } catch (err) {
        handleServerError(res,err,req)
    }
}


const getAllAdmin = async (req, res, next) => {
    try{
        const {count, rows} = await User.findAndCountAll({
            where: {role: "admin"}
        })
        req.UKK_BACKEND.getUserList = {
            data: rows,
            count : count
        }
        return next()
    }catch(err){
        handleServerError(res,err,req)
    }
}

const getAllResepsionis = async ( req, res, next ) => {
    try{
        const {count, rows} = 
        await User.findAndCountAll({
            where: {role: "resepsionis"}
        })
        req.UKK_BACKEND.getUserList = {
            data: rows,
            count : count
        }
        return next();
    }catch(err){
        handleServerError(res,err,req)
    }
}


const getUser = async ( req, res, next ) => {
    try {
        const result = await User.findOne({
            where: {id: req.params.user_id}
        })
        if (result === null) throw new Error("user tidak ditemukan")
        req.UKK_BACKEND.getUserOne = {data : result}
        return next();
    } catch (err) {
        handleServerError(res,err,req);
    }
}


const getUserByUsername = async ( req, res, next ) => {
    try {
        const result = await User.findOne({
            where: {username : req.params.username}
        })
        if (result === null) throw new Error("user tidak ditemukan")
        req.UKK_BACKEND.getUserOne = {data : result}
        return next()
    } catch (err) {
        handleServerError(res,err,req);
    }
}



const getAllUserFiltered = async (req,res,next) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        //tanggal dibuat user (created at)
        const tglAwal = req.query.tgl_awal || "0";
        const tglAkhir = req.query.tgl_akhir || "0";

        const keyWord = req.query.keyword || ""

        const role = req.query.role || "all";

        let whereOption = {};
        //cek apakah parameter valid
        //paling pertama karena membutuhka where option pertama
        if(keyWord !== "" && keyWord !== undefined && keyWord !== null){
            whereOption = {
                [Op.or] : {
                    email : {
                        [Op.like] : `%${keyWord}%`
                    },
                    username : {
                        [Op.like] : `%${keyWord}%`
                    },
                }
            }
        }
        // if(tglAwal === 0 || tglAkhir === 0) throw new Error("invalid keyword")
        if(tglAwal !== "0" && tglAkhir !== "0"){
            whereOption.createdAt = { 
                [Op.gte] : new Date(tglAwal),
                [Op.lte] : new Date(tglAkhir)
            };
        }
        else if(tglAwal !== "0") {
            whereOption.createdAt = { [Op.gte] : new Date(tglAwal)};
        }
        else if(tglAkhir !== "0") {
            whereOption.createdAt = {[Op.lte] : new Date(tglAkhir)};
        }

        if(role !== "all"){
            whereOption.role = {[Op.like] : role}
        }


        const {rows, count} = await User.findAndCountAll({
            where: {
                ...whereOption
            },
            limit : limit,
            offset: limit * (page - 1)
        })

        const pageCount = Math.ceil(count / limit);

        const adminAmount = await User.count({where : {role : "admin"}})
        const resepsionisAmount = await User.count({where : {role : "resepsionis"}})        

        req.UKK_BACKEND.getUserList = {
            data : rows,
            roleAmount : {adminAmount,resepsionisAmount},
            count : count,
            limit : limit,
            pageCount : pageCount,
            pageCurrent : page,
        }
        return next();
    }catch(error){
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}


const updateUser = async ( req, res, next ) => {
    const data = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
    }

    if(data.password === "") delete data.password;

    if(req.file)data.foto = req.file.filename; // ini foto yag belumd i format
    let oldFoto = getFilePath(req.UKK_BACKEND.getUserOne.data.foto); //ini sudah diformat dan akan di resolve
    try {
        let result = await User.update(data, {
            where: {id : req.UKK_BACKEND.getUserOne.data.id}
        })
        if(req.file && oldFoto) await deleteFileIfExist(oldFoto)
        req.UKK_BACKEND.updateUser = {data : result}
        return next();
    } catch (err) {
        if(err.name === 'SequelizeValidationError') handleSequelizeError(res,err);
        else handleServerError(res,err,req);
    }
}


const deleteUser = async ( req, res, next) =>  {
    try {
        await User.destroy({where : {id : req.params.user_id}});
        const fotoPath = getFilePath(req.UKK_BACKEND.getUserOne.data.foto)
        deleteFileIfExist(fotoPath);
        delete req.UKK_BACKEND.getUser
        req.UKK_BACKEND.deleteUser = {
            data : null
        }
        return next()
    } catch (err) {
        handleServerError(res,err,req)
    }
}








module.exports = {
    deleteUser,
    createUser, 
    getAllUser, 
    getAllUserFiltered,
    getAllAdmin, 
    getAllResepsionis,
    getUser,
    getUserByUsername,
    updateUser,
    findUser
}
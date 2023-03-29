const sequelize = require("./../database");
const { Op } = require("sequelize");
const models = sequelize.models;
const TipeKamar = models.TipeKamar
const Kamar = models.Kamar


// feature
const {
    deleteFileIfExist,
    getFilePath
} = require("./../feature/handleFile");
const {
    handleServerError,
    handleSequelizeError
} = require("./../feature/handleError");


// ---------------- controller ---------------
const createTipeKamar = async ( req, res, next ) =>{
    // return console.log(req.body)
    const data = {
        namaTipeKamar : req.body.namaTipekamar,
        harga : +req.body.harga,
        deskripsi : req.body.deskripsi,
    }

    if(req.file){
        data.foto = req.file.filename
    }

    try {
        let result = await TipeKamar.create(data)
        req.UKK_BACKEND.tipeKamarOne = {data : result}
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req)
    }
}


const getAllTipeKamar = async ( req, res, next ) => {
    try {
        const {count, rows} = await TipeKamar.findAndCountAll();
        req.UKK_BACKEND.getTipeKamarList = {
            count : count,
            data : rows
        }
        return next();
    } catch (error) {
        handleServerError(res,error,req)
    }
}



// jaga2 error
const getTipeKamar = async (req,res,next) => {
    try {
        const result = await TipeKamar.findOne({ 
            where : {id : req.params.tipe_kamar_id}
        })
        if(result === null) throw new Error("tipe kamar tidak ditemukan")
        req.UKK_BACKEND.getTipeKamarOne = {data :result}
        return next();
    } catch (error) {
        handleServerError(res,error,req)
    }
}


const getTipeKamarFull = async (req,res,next) => {
    try {
        const result = await TipeKamar.findOne({
            where : {id : req.params.tipe_kamar_id},
            include : [{ model : Kamar}]
        })
        req.UKK_BACKEND.getTipeKamarOne = {data :result}
        return next();
    } catch (error) {
        handleServerError(res,error,req)
    }
}


const getTipeKamarFiltered = async (req,res,next) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        //tanggal dibuat user (created at)
        const tglAwal = req.query.tgl_awal || "0";
        const tglAkhir = req.query.tgl_akhir || "0";

        const keyWord = req.query.keyword || ""

        let whereOption = {};
        //cek apakah parameter valid
        //paling pertama karena membutuhka where option pertama
        if(keyWord !== "" && keyWord !== undefined && keyWord !== null){
            whereOption = {
                [Op.or] : {
                    namaTipeKamar : {
                        [Op.like] : `%${keyWord}%`
                    },
                    deskripsi : {
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


        const {rows, count} = await TipeKamar.findAndCountAll({
            where: {
                ...whereOption
            },
            //distinct diperlukan supaya hanya record yang benar2 sesuai yg bisa dihitung
            //`COUNT(DISTINCT(col))`
            distinct: true,
            include : Kamar,
            limit : limit,
            offset: limit * (page - 1)
        })

        const pageCount = Math.ceil(count / limit);

        req.UKK_BACKEND.getTipeKamarList = {
            data : rows,
            count : count,
            limit : limit,
            pageCount : pageCount,
            pageCurrent : page
        }
        return next();
    }catch(error){
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error,req)
    }
}


const findTipeKamar = async (req,res,next) => {
    const id = req.body.TipeKamarId
    try {
        const result = await TipeKamar.findOne({
            where : {id : id},
            include : Kamar
        })
        req.UKK_BACKEND.getTipeKamarOne = {data : result}
        return next()
    } catch (error) {
        handleServerError(res,error,req)
    }
}


const updateTipeKamar = async (req,res,next) => {
    const data = {
        namaTipeKamar : req.body.namaTipeKamar,
        harga : req.body.harga,
        deskripsi : req.body.deskripsi,
    }
    if(req.file)data.foto = req.file.filename; // ini foto yag belumd i format
    let oldFoto = getFilePath(req.UKK_BACKEND.getTipeKamarOne.data.foto); //ini sudah diformat dan akan di resolve
    try {
        let result = await TipeKamar.update(data, {
            where : {id : req.params.tipe_kamar_id}
        })
        if(req.file && oldFoto) await deleteFileIfExist(oldFoto)
        req.UKK_BACKEND.updateTipeKamar = {data : result}
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error,req)
    }
}


const deleteTipeKamar = async (req,res,next) => {
    try {
        TipeKamar.destroy({where: {id : req.params.tipe_kamar_id}})
        delete req.UKK_BACKEND.getTipeKamar;
        req.UKK_BACKEND.deleteTipekamar = {
            data : null
        }
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error,req)
    }
}





module.exports = {
    createTipeKamar,
    getAllTipeKamar,
    getTipeKamar,
    getTipeKamarFull,
    getTipeKamarFiltered,
    updateTipeKamar, 
    deleteTipeKamar,
    findTipeKamar,
}
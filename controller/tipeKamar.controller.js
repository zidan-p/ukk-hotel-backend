const sequelize = require("./../database");
const handleSequelizeError = require("./../database/handleError");
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
    const data = {
        namaTipekamar : req.body.namaTipekamar,
        harga : req.body.harga,
        deskripsi : req.body.deskripsi,
    }

    if(req.body.namaTipekamar === "") data.namaTipekamar = "Kamar Hotel";

    if(req.file){
        data.foto = req.file.filename
    }

    try {
        let result = await TipeKamar.create(data)
        req.UKK_BACKEND.createTipeKamar = {data : result}
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error)
    }
}


const getAllTipeKamar = async ( req, res, next ) => {
    try {
        const {count, rows} = await TipeKamar.findAndCountAll();
        req.UKK_BACKEND.getAllTipeKamar = {
            count : count,
            data : rows
        }
        return next();
    } catch (error) {
        handleServerError(res,error)
    }
}

// jaga2 error
const getTipeKamar = async (req,res,next) => {
    try {
        const result = await TipeKamar.findOne({
            where : {id : req.params.id},
            attributes: {
                include : [sequelize.fn("Count", "kamar.id"), "kamarCount"]
            },
            include : [{
                model : Kamar,
            }]
        })
        req.UKK_BACKEND.getTipeKamarSimple = {data :result}
        return next();
    } catch (error) {
        handleServerError(res,error)
    }
}


const getTipeKamarFull = async (req,res,next) => {
    try {
        const result = await TipeKamar.findOne({
            where : {id : req.params.tipe_kamar_id},
            include : [{
                model : Kamar,
            }]
        })
        req.UKK_BACKEND.getTipeKamarSimple = {data :result}
        return next();
    } catch (error) {
        handleServerError(res,error)
    }
}


const updateTipeKamar = async (req,res,next) => {
    try {
        const data = {
            namaTipekamar : req.body.namaTipekamar,
            harga : req.body.harga,
            deskripsi : req.body.deskripsi,
        }
        let result = await TipeKamar.update(data, {
            where : {id : req.params.id}
        })
        req.UKK_BACKEND.updateTipeKamar = {data : result}
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}


const deleteTipeKamar = async (req,res,next) => {
    try {
        TipeKamar.destroy({where: {id : req.params.id}})
        delete req.UKK_BACKEND.getTipeKamar;
        req.UKK_BACKEND.deleteTipekamar = {
            data : null
        }
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}





module.exports = {
    firstHandler,
    endHandler,

    createTipeKamar,
    getAllTipeKamar,
    getTipeKamar,
    getTipeKamarFull,
    updateTipeKamar,
    deleteTipeKamar
}
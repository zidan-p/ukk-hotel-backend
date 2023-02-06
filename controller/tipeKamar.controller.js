const sequelize = require("./../database");
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
    console.log(req.params.tipe_kamar_id);
    try {
        const result = await TipeKamar.findOne({
            // subQuery : false,
            where : {id : req.params.tipe_kamar_id}
            // attributes: {
            //     // include : [await [this.countKamars(), "kamarCount"]]
            //     include : [[sequelize.fn("Count", sequelize.col("kamar.TipeKamarId")), "kamarCount"]]
            // },
            // include : [{
            //     model : Kamar,
            //     attributes: []
            // }],
            // group:["kamar.TipeKamarId"]
        })
        req.UKK_BACKEND.getTipeKamar = {data :result}
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
    const data = {
        namaTipekamar : req.body.namaTipekamar,
        harga : req.body.harga,
        deskripsi : req.body.deskripsi,
    }
    if(req.file)data.foto = req.file.filename; // ini foto yag belumd i format
    let oldFoto = getFilePath(req.UKK_BACKEND.getTipeKamar.data.foto); //ini sudah diformat dan akan di resolve
    try {
        let result = await TipeKamar.update(data, {
            where : {id : req.params.id}
        })
        if(req.file && oldFoto) await deleteFileIfExist(oldFoto)
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
    createTipeKamar,
    getAllTipeKamar,
    getTipeKamar,
    getTipeKamarFull,
    updateTipeKamar,
    deleteTipeKamar
}
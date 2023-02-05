const sequelize = require("./../database");
const models = sequelize.models;
const Pemesanan = models.Pemesanan
const DetailPemesanan = models.DetailPemesanan
const Kamar = models.Kamar

const {
    handleServerError,
    handleSequelizeError
} = require("./../feature/handleError");




// diasumsikan semua sudah ada
const createPemesananDirect = async ( req, res, next ) => {
    const data = {
        namaPemesan : req.body.dataPemesan,
        emailPemesan : req.body.emailPemesan,
        tglPemesanan : req.body.tglPemesanan,
        tglCheckIn : req.body.tglCheckIn,
        tglCheckOut : req.body.tglCheckOut,
        detailPemesanan : {

        }
    }

    try {
        let result = await Pemesanan.create(data,{
            include : DetailPemesanan
        })
        req.UKK_BACKEND.createPemesananDirect = {
            data : result
        }
        return next
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}



const createPemesananOnly = async (req, res, next) => {
    const data = {
        namaPemesan : req.body.dataPemesan,
        emailPemesan : req.body.emailPemesan,
        tglPemesanan : req.body.tglPemesanan,
        tglCheckIn : req.body.tglCheckIn,
        tglCheckOut : req.body.tglCheckOut
    }

    try {
        let result = await Pemesanan.create(data)
        req.UKK_BACKEND.createPemesananOnly = {data : result}
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}


const getPemesananOnly = async (req,res,next) => {
    try {
        const result = await Pemesanan.findByPk(req.params.id);
        if (result === null)throw new Error("tidak dapat menemukan pemesanan");
        req.UKK_BACKEND.getPemesananOnly = {
            data : result 
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}

const getPemesananwithChild = async (req,res,next) => {
    try {
        const result = await Pemesanan.findByPk(req.params.id,{
            include : {
                model : DetailPemesanan,
                include : Kamar
            }
        });
        if (result === null)throw new Error("tidak dapat menemukan pemesanan");
        req.UKK_BACKEND.getPemesananOnly = {
            data : result 
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}


const getAllPemesananOnly = async (req,res,next) => {
    try {
        const {count, rows} = await Pemesanan.findAll();
        req.UKK_BACKEND.getAllPemesananOnly = {
            data : rows,
            count : count
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}


const getAllPemesananWithChild = async (req,res,next) => {
    try {
        const {count, rows} = await Pemesanan.findAll({
            include : {
                model : DetailPemesanan,
                include : Kamar
            }
        });
        req.UKK_BACKEND.getAllKamar = {
            data : rows,
            count : count
        };
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}


const updatePemesanan = async (req,res,next) => {
    const data = {
        namaPemesan : req.body.dataPemesan,
        emailPemesan : req.body.emailPemesan,
        tglPemesanan : req.body.tglPemesanan,
        tglCheckIn : req.body.tglCheckIn,
        tglCheckOut : req.body.tglCheckOut
    }
    try {
        const result = await Pemesanan.update(data, {
            where : {id : req.params.id}
        })
        req.UKK_BACKEND.updatePemesanan = {
            data : result
        }
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}


const deletePemesanan = async (req,res,next) => {
    try {
        const result = await Pemesanan.destroy({where:{id : req.params.id}})
        req.UKK_BACKEND.deletePemesanan = {
            data : result
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}







module.exports = {
    createPemesananDirect,
    createPemesananOnly,
    getAllPemesananOnly,
    getAllPemesananWithChild,
    getPemesananOnly,
    getPemesananwithChild,
    updatePemesanan,
    deletePemesanan
}




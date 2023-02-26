// import library
const fsn = require("date-fns");


const sequelize = require("./../database");
const models = sequelize.models;
const Pemesanan = models.Pemesanan
const DetailPemesanan = models.DetailPemesanan
const Kamar = models.Kamar
const User = models.User

const {
    handleServerError,
    handleSequelizeError
} = require("./../feature/handleError");




// diasumsikan semua sudah ada
const createPemesananDirect = async ( req, res, next ) => {
    const kamarCount = req.UKK_BACKEND.getKamarList.count;
    const harga     = req.UKK_BACKEND.getTipeKamarOne.data.harga;
    const data = {
        namaPemesan : req.body.dataPemesan,
        emailPemesan : req.body.emailPemesan,
        tglPemesanan : req.body.tglPemesanan,
        tglCheckIn : req.body.tglCheckIn,
        tglCheckOut : req.body.tglCheckOut,
        namaTamu : req.body.namaTamu,
        detailPemesanan : {
            hargaTotal : kamarCount * harga
        }
    }

    try {
        let result = await Pemesanan.create(data,{
            include : DetailPemesanan
        })
        req.UKK_BACKEND.pemesananOne = {data : result}
        req.UKK_BACKEND.detailPemesananOne = {data : result.detailPemesanan}
        return next
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}



const createPemesanan = async (req, res, next) => {
    const data = {
        namaPemesan : req.body.namaPemesan,
        emailPemesan : req.body.emailPemesan,
        tglPemesanan : req.body.tglPemesanan,
        tglCheckIn : req.body.tglCheckIn,
        tglCheckOut : req.body.tglCheckOut,
        namaTamu : req.body.namaTamu
    }
    try {
        let result = await Pemesanan.create(data)
        req.UKK_BACKEND.pemesananOne = {data : result}
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const acceptPemesanan = async (req,res,next) => {
    const data = {status : "diterima"}
    try {
        const userInstance = User.findByPk(req.UKK_BACKEND.getUserOne.data.id);
        const pemesananInstance = Pemesanan.findByPk(req.UKK_BACKEND.getPemesananOne.data.id)
        await pemesananInstance.setUser(userInstance);
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const findPemesanan = async (req,res,next) => {
    const data = {
        pemesananId : req.body.PemesananId
    }
    try {
        const result = await Pemesanan.findByPk(data.pemesananId);
        if (result === null)throw new Error("tidak dapat menemukan pemesanan");
        req.UKK_BACKEND.getPemesananOne = {
            data : result 
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}


const getPemesanan = async (req,res,next) => {
    try {
        const result = await Pemesanan.findByPk(req.params.pemesanan_id);
        if (result === null)throw new Error("tidak dapat menemukan pemesanan");
        req.UKK_BACKEND.getPemesananOne = {
            data : result 
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const getPemesananFull = async (req,res,next) => {
    try {
        const result = await Pemesanan.findByPk(req.params.pemesanan_id,{
            include : {
                model : DetailPemesanan,
                include : {model : Kamar, as : "DaftarKamar"}
            }
        });
        if (result === null)throw new Error("tidak dapat menemukan pemesanan");
        req.UKK_BACKEND.getpemesananOne = {data : result}
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}


const getAllPemesanan = async (req,res,next) => {
    try {
        const {count, rows} = await Pemesanan.findAndCountAll();
        req.UKK_BACKEND.getPesananList = {data : rows,count : count}
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}


const getAllPemesananFull = async (req,res,next) => {
    try {
        const {count, rows} = await Pemesanan.findAndCountAll({
            include : {
                model : DetailPemesanan,
                include : {model : Kamar, as : "DaftarKamar"}
            }
        });
        req.UKK_BACKEND.getPesananList = {data : rows,count : count};
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
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
            where : {id : req.params.pemesanan_id}
        })
        req.UKK_BACKEND.updatePemesanan = {
            data : result
        }
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}


const deletePemesanan = async (req,res,next) => {
    try {
        const result = await Pemesanan.destroy({where:{id : req.params.pemesanan_id}})
        req.UKK_BACKEND.deletePemesanan = {
            data : result
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}







module.exports = {
    createPemesananDirect,
    createPemesanan,
    getAllPemesanan,
    getAllPemesananFull,
    getPemesanan,
    getPemesananFull,
    updatePemesanan,
    deletePemesanan,
    acceptPemesanan,
    findPemesanan
}




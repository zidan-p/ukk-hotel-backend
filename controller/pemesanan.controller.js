// import library
const fsn = require("date-fns");
const { Op } = require("sequelize");

const sequelize = require("./../database");
const models = sequelize.models;
const Pemesanan = models.Pemesanan
const DetailPemesanan = models.DetailPemesanan
const Kamar = models.Kamar
const User = models.User
const TipeKamar = models.TipeKamar

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

const getPemesananByNomorPemesanan = async (req,res,next) => {
    const data = {
        nomorPemesanan : req.params.nomor_pemesanan
    }
    try {
        const result = await Pemesanan.findOne({
            where: data,
            include: {
                model: DetailPemesanan,
                include : [{
                    model : Kamar,
                    as : "DaftarKamar"
                }, {
                    model : TipeKamar,
                    as : "TipeKamarPemesanan"
                }]
            }
        });
        if (result === null) throw new Error("tidak dapat menemukan pemesanan");
        req.UKK_BACKEND.getPemesananOne = {
            data : result
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const getAllPemesaananFiltered = async (req,res,next) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        //tanggal dibuat pesanan
        const tglAwal = req.query.tgl_awal || "0";
        const tglAkhir = req.query.tgl_akhir || "0";
        const keyWord = req.query.keyword || "";
        const status = req.query.status || "all";

        let whereOption = {};
        //cek apakah parameter valid
        //paling pertama karena membutuhka where option pertama
        if(keyWord !== "" && keyWord !== undefined && keyWord !== null){
            whereOption = {
                [Op.or] : {
                    emailPemesan : {
                        [Op.like] : `%${keyWord}%`
                    },
                    namaPemesan : {
                        [Op.like] : `%${keyWord}%`
                    },
                    namaTamu : {
                        [Op.like] : `%${keyWord}%`
                    }
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

        if(status !== "all"){
            whereOption.status = {[Op.like] : status}
        }

        


        const {rows, count} = await Pemesanan.findAndCountAll({
            where: {
                ...whereOption
            },
            include:{
                model: DetailPemesanan
            },
            limit : limit,
            offset: limit * (page - 1)
        })

        const pageCount = Math.ceil(count / limit);

        req.UKK_BACKEND.getPemesananList = {
            data : rows,
            count : count,
            pageCount : pageCount,
            pageCurrent : page
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const getAllPemesananOffset = (req,res,next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const {rows, count} = Pemesanan.findAndCountAll({
            limit : limit,
            offset: limit * (page - 1)  ,
        })

        req.UKK_BACKEND.getPemesananList = {
            data : rows,
            count : count
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
                include : [
                    {model : Kamar, as : "DaftarKamar"},
                    {model: TipeKamar, as : "TipeKamarPemesanan"}

                ]
            }
        });
        if (result === null)throw new Error("tidak dapat menemukan pemesanan");
        req.UKK_BACKEND.getPemesananOne = {data : result}
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
        namaPemesan : req.body.namaPemesan,
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

const updateStatus = async (req,res,next) => {
    const status = req.body.status;
    const id = req.params.pemesanan_id;
    try {
        const result = await Pemesanan.update({status : status},{
            where : {id : id}
        })
        req.UKK_BACKEND.updatePemesanan = {
            data : JSON.stringify(result)
        }
        return next();
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
    getPemesananByNomorPemesanan,
    getAllPemesanan,
    getAllPemesananFull,
    getPemesanan,
    getAllPemesananOffset,
    getAllPemesaananFiltered,
    getPemesananFull,
    updatePemesanan,
    updateStatus,
    deletePemesanan,
    acceptPemesanan,
    findPemesanan
}




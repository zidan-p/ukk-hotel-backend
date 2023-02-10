const sequelize = require("./../database");
const models = sequelize.models;
const Pemesanan = models.Pemesanan
const DetailPemesanan = models.DetailPemesanan
const Kamar = models.Kamar
const TipeKamar = models.TipeKamar

const {
    handleServerError,
    handleSequelizeError
} = require("./../feature/handleError");


// ini masih kurang stabil, mengingat data yang dirim melalui middleware hanya 
///bentuk strignify dari data asli
const createDetailPemesanan = async (req,res,next) => {
    let hargaTotal = 
        req.UKK_BACKEND.getKamarList.count * req.UKK_BACKEND.getTipeKamarOne.data.harga;
    let tipeKamarId = req.UKK_BACKEND.getTipeKamarOne.data.id;
    try {
        const result = await DetailPemesanan.create({hargaTotal : hargaTotal, TipeKamarId : tipeKamarId});
        req.UKK_BACKEND.detailPemesananOne = {data : result}
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}

const attachDetailPemesananToPemesanan = async (req,res,next) => {
    const pemesananId = req.UKK_BACKEND.pemesananOne.data.id;
    const detailPemesananId = req.UKK_BACKEND.detailPemesananOne.data.id;
    try {
        const detailPemesanan = await DetailPemesanan.findByPk(detailPemesananId);
        const pemesanan = await Pemesanan.findByPk(pemesananId);
        await pemesanan.setDetailPemesanan(detailPemesanan)
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}


const attachDetailPemesananToKamar = async (req,res,next) => {
    const kamarList = req.UKK_BACKEND.getKamarList.data;
    const detailPemesananId = req.UKK_BACKEND.detailPemesananOne.data.id;
    try {
        const kamarInstance = [];
        for(let i = 0; i < kamarList.length ; i++){
            kamarInstance[i] = await Kamar.findByPk(kamarList[i].id)
        }
        const detailPemesananInstance = await DetailPemesanan.findByPk(detailPemesananId);
        const result = await detailPemesananInstance.setDaftarKamar(kamarInstance);
        req.UKK_BACKEND.detailPemesananToKamarIsAttach = result
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}

const attachDetailPemesananToTipeKamar = async (req,res,next) => {
    const tipeKamarId = req.UKK_BACKEND.getTipeKamarOne.data.id;
    const detailPemesananId = req.UKK_BACKEND.detailPemesananOne.data.id;
    try {
        const tipeKamarInstance = await TipeKamar.findByPk(tipeKamarId);
        const detailPemesananInstance = await DetailPemesanan.findByPk(detailPemesananId);
        await detailPemesananInstance.setTipeKamarPemesanan(tipeKamarInstance);
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error,req)
    }
}


const getDetailPemesananByPemesananId = async (req,res,next) => {
    const pemesananId = req.params.pemesanan_id;
    try {
        const result = await DetailPemesanan.findOne({where : {
            PemesananId : pemesananId 
        }});
        if(result === null)throw new Error("detail Pemesanan tidaak tersedia")
        req.UKK_BACKEND.getDetailPemesananOne = {data : result}
        return next()
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}


const getAllDetailPemesanan = async (req,res,next) => {
    try {
        const {rows,count} = await DetailPemesanan.findAndCountAll();
        req.UKK_BACKEND.getDetailPemesananList = {data : rows, count : count};
        return next()
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}

const getAllDetailPemesananFull = async (req,res,next) => {
    try {
        const {rows,count} = await DetailPemesanan.findAndCountAll({
            include : [
                {model : Kamar, as  : "DaftarKamar"},
                {model : TipeKamar, as : "TipeKamarPemesanan"}
            ]
        });
        req.UKK_BACKEND.getDetailPemesananList = {data : rows, count : count};
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}

const getDetailPemesanan = async (req,res,next) => {
    const detailPemesananId = req.params.detail_pemesanan_id;
    try {
        const result = await DetailPemesanan.findByPk(detailPemesananId);
        if(result === null)throw new Error("detai pemesaan tidak ditemukan")
        req.UKK_BACKEND.getDetailPemesananOne = {data : result};
        return next()
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}

const getDetailPemesananFull = async (req,res,next) => {
    const detailPemesananId = req.params.detail_pemesanan_id;
    try {
        const result = await DetailPemesanan.findByPk(detailPemesananId,{
            include : [
                {model : Kamar, as  : "DaftarKamar"},
                {model : TipeKamar, as : "TipeKamarPemesanan"}
            ]
        });
        if(result === null)throw new Error("detai pemesaan tidak ditemukan")
        req.UKK_BACKEND.getDeatilPemesananOne = {data : result};
        return next()
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}

const updateDetailPemesanan = async (req,res,next) => {
    let hargaTotal = 
        req.UKK_BACKEND.getKamarList.count * req.UKK_BACKEND.getDetailPemesananOne.data.TipeKamar.harga;
    let detailPemesananId = req.getDetailPemesananOne.data.id
    try {
        const result = await DetailPemesanan.update({hargaTotal : hargaTotal},{
            where: {id : detailPemesananId}
        })
        req.UKK_BACKEND.updateDetailPemesanan = {data : result}
        return next()
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}


const updateKamarAssociation = async (req,res,next) => {
    const kamarList = req.UKK_BACKEND.getKamarList.data;
    const detailPemesananId = req.UKK_BACKEND.detailPemesananOne.data.id;
    try {
        const kamarInstance = [];
        for(let i = 0; i < kamarList.length ; i++){
            kamarInstance[i] = await Kamar.findByPk(kamarList[i].id)
        }
        const detailPemesananInstance = DetailPemesanan.findByPk(detailPemesananId);
        const removedAssociateCount = await  detailPemesananId.setDaftarKamar([]);
        const result = await detailPemesananInstance.setDaftarKamar(kamarInstance);
        req.UKK_BACKEND.updateKamar = {data : result, removed : removedAssociateCount}
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}


const deleteDetailPemesanan = async (req,res,next) => {
    let detailPemesananId = req.UKK_BACKEND.getDetailPemesananOne.data.id
    try {
        const result = await DetailPemesanan.destroy({
            where : {id : detailPemesananId}
        })
        req.UKK_BACKEND.deleteDetailPemesana = {data : result};
        return next()
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}


module.exports = {
    createDetailPemesanan,
    getDetailPemesananByPemesananId,
    updateDetailPemesanan,
    deleteDetailPemesanan,
    attachDetailPemesananToPemesanan,
    attachDetailPemesananToKamar,
    getDetailPemesanan,
    getDetailPemesananFull,
    updateKamarAssociation,
    attachDetailPemesananToTipeKamar,
    getAllDetailPemesanan,
    getAllDetailPemesananFull
}
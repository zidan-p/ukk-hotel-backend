const sequelize = require("./../database");
const models = sequelize.models;
const Pemesanan = models.Pemesanan
const DetailPemesanan = models.DetailPemesanan
const Kamar = models.Kamar
const TipeKamar = models.TipeKamar




// ini masih kurang stabil, mengingat data yang dirim melalui middleware hanya 
///bentuk strignify dari data asli
const createDetailPemesanan = async (req,res,next) => {
    let hargaTotal = 
        req.getSomeKamarByIdList.count * req.getTipeKamar.harga;

    try {
        const result = await DetailPemesanan.create({hargaTotal : hargaTotal});
        req.UKK_BACKEND.createDetailPemesanan = {data : result}
        return next();
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}


const getDetailPemesananByPemesananId = async (req,res,next) => {
    const pemesananId = req.getPemesanan.id;
    try {
        const result = await DetailPemesanan.findOne({where : {
            pemesananId : pemesananId 
        }});
        if(result === null)throw new Error("detail Pemesanan tidaak tersedia")
        req.UKK_BACKEND.getDetailPemesananByPemesananId = {data : result}
        return next()
    } catch (error) {
        if(error.name === "SequelizeValidationError") handleSequelizeError(res,eror);
        else handleServerError(res,error)
    }
}



const updateDetailPemesanan = async (req,res,next) => {
    let hargaTotal = 
        req.getSomeKamarByIdList.count * req.getTipeKamar.harga;
    let detailPemesananId = req.getDetailPemesananByPemesananId.data.id
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


const deleteDetailPemesanan = async (req,res,next) => {
    let detailPemesananId = req.getDetailPemesananByPemesananId.data.id
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
    deleteDetailPemesanan
}
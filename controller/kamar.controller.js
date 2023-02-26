const sequelize = require("./../database");
const { Op, Sequelize } = require("sequelize")
const fsn = require("date-fns")


const models = sequelize.models;
const Kamar = models.Kamar
const TipeKamar = models.TipeKamar
const DetailPemesanan = models.DetailPemesanan
const Pemesanan = models.Pemesanan


const {
    handleServerError,
    handleSequelizeError
} = require("./../feature/handleError");




// dapat digunkaan validation untuk mengetahui tipe ada atau tida
const createKamarOne = async (req,res,next) => {
    const data = {
        nama : req.body.nama,
        TipeKamarId : req.params.tipe_kamar_id // ini mungkin harus diubah
    }
    try {
        const result = await Kamar.create(data);
        req.UKK_BACKEND.kamarOne = {data : result};
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req)        
    }
}

const createKamarMany = async (req, res, next) => {
    const nama = req.body.nama
    const TipeKamarId = req.params.tipe_kamar_id
    const count = +req.body.count
    
    const data = [];
    for(let i = 0; i < count; i++){
        data[i] = {
            nama : nama,
            TipeKamarId
        }
    }

    try {
        const result = await Kamar.bulkCreate(data, {validate: true});
        req.UKK_BACKEND.kamarList = {
            data : result,
            count : count
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req)       
    }

}
const createKamarBulk = async (req, res, next) => {
    const namaList = req.body.namaList
    const TipeKamarId = req.params.tipe_kamar_id
    const data = namaList.map(nama => {
        return {nama: nama, TipeKamarId}
    })
    try {
        const result = await Kamar.bulkCreate(data, {validate: true});
        req.UKK_BACKEND.kamarList = {data : result,count : namaList.length}
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req)       
    }
}


const getAllkamar = async (req,res,next) => {
    try {
        const {count, rows} = await Kamar.findAndCountAll();
        req.UKK_BACKEND.getKamarList = {data : rows,count : count};
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}


const getKamar = async (req,res,next)=>{
    try {
        const result = await Kamar.findByPk(req.params.kamar_id);
        if(result === null) throw new Error("kamar tidak ditemukan");
        req.UKK_BACKEND.getKamarOne = {
            data : result 
        }
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const getKamarFull = async (req,res,next)=>{
    try {
        const result = await Kamar.findByPk(req.params.kamar_id,{
            include : TipeKamar
        });
        if(result === null) throw new Error("kamar tidak ditemukan");
        req.UKK_BACKEND.getKamarOne = {
            data : result 
        }
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}



const getKamarByTipeKamarId = async (req,res,next)=> {
    const TipeKamarId = req.params.tipe_kamar_id;
    try {
        const {rows,count} = await Kamar.findAndCountAll({
            where: {TipeKamarId : TipeKamarId}
        })
        req.UKK_BACKEND.getKamarList = {
            data : rows,
            count : count
        };
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}


const findKamarThatAvailableInCertainInterval = async (req,res,next) =>{
    const intervalDate = req.body.intervalDate;
    const start = intervalDate.start;
    const end = intervalDate.end;
    const reqInterval = { start : new Date(start),end : new Date(end)}
    try {
        // -- waht deee heeellllll --
        // saya tidak bisa menggunakan sequelize ataupun raw quueri untuk mendapatkan data yg sama mau
        let {count,rows} = await Kamar.findAndCountAll({
            attributes : ["id", "nama", "TipeKamarId"],
            include : {
                model : DetailPemesanan,
                attributes : ["id"],
                as : "DaftarDetailPemesanan",
                include : {
                    model : Pemesanan,
                    attributes : ["id", "tglCheckIn", "tglCheckOut"]
                }
            }
        })

        // jadi saya membiarkan node js yang menangani
        const result = rows.map(kamar => {
            if(kamar.DaftarDetailPemesanan.length === 0){
                return {id: kamar.id,TipeKamarId : kamar.TipeKamarId ,nama : kamar.nama, isAvailable : true}
            }
            const kamarInterval = {
                start : new Date(kamar.DaftarDetailPemesanan[0].Pemesanan.tglCheckIn),
                end  : new Date(kamar.DaftarDetailPemesanan[0].Pemesanan.tglCheckOut)
            }
            if(fsn.areIntervalsOverlapping(kamarInterval, reqInterval)) {
                return {id: kamar.id,TipeKamarId : kamar.TipeKamarId ,nama : kamar.nama, isAvailable : false}
            }
            return {id: kamar.id,TipeKamarId : kamar.TipeKamarId ,nama : kamar.nama, isAvailable : true}
        })


        req.UKK_BACKEND.kamarList = {
            data : result
        }
        return next();

        // TODO : buat validasi di backend bila kamar yg dipesan itu valid
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const findKamarThatAvailableInCertainIntervalByTipeKamarId = async (req,res,next) =>{
    const TipeKamarId = req.body.TipeKamarId;
    const intervalDate = req.body.intervalDate;
    const start = intervalDate.start;
    const end = intervalDate.end;
    const reqInterval = { start : new Date(start),end : new Date(end)}
    try {
        // -- waht deee heeellllll --
        // saya tidak bisa menggunakan sequelize ataupun raw quueri untuk mendapatkan data yg sama mau
        let {count,rows} = await Kamar.findAndCountAll({
            attributes : ["id", "nama", "TipeKamarId"],
            include : {
                model : DetailPemesanan,
                attributes : ["id"],
                as : "DaftarDetailPemesanan",
                include : {
                    model : Pemesanan,
                    attributes : ["id", "tglCheckIn", "tglCheckOut"]
                }
            }
        })

        // jadi saya membiarkan node js yang menangani
        const result = rows.map(kamar => {
            if(kamar.DaftarDetailPemesanan.length === 0){
                return {id: kamar.id,TipeKamarId : kamar.TipeKamarId ,nama : kamar.nama, isAvailable : true}
            }
            const kamarInterval = {
                start : new Date(kamar.DaftarDetailPemesanan[0].Pemesanan.tglCheckIn),
                end  : new Date(kamar.DaftarDetailPemesanan[0].Pemesanan.tglCheckOut)
            }
            if(fsn.areIntervalsOverlapping(kamarInterval, reqInterval)) {
                return {id: kamar.id,TipeKamarId : kamar.TipeKamarId ,nama : kamar.nama, isAvailable : false}
            }
            return {id: kamar.id,TipeKamarId : kamar.TipeKamarId ,nama : kamar.nama, isAvailable : true}
        })
        .filter(dat => dat.TipeKamarId === TipeKamarId );


        req.UKK_BACKEND.kamarList = {
            data : result
        }
        return next();

        // TODO : buat validasi di backend bila kamar yg dipesan itu valid
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const findSomeKamarByIdList = async (req,res,next) => {
    let idList = req.body.KamarIdList 
    let opt = idList.map((id) => {return {id : id}});
    try{
        const {count, rows} = await Kamar.findAndCountAll({
            where: {[Op.or] : opt}
        })
        req.UKK_BACKEND.getKamarList = {
            data : rows,
            count : count 
        }
        return next();
    }catch(error){
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const checkIfTipeKamarIsCorrespond = async (req,res,next) => {
    try{
        let tipeKamarId = req.UKK_BACKEND.getTipeKamarOne.data.id;
        let kamarList = req.UKK_BACKEND.getKamarList.data
        kamarList.forEach((kamar) => {
            if(kamar.TipeKamarId !== tipeKamarId) throw new Error("Tipe kamar tidak valid dengan daftar kamar");
        });
        req.UKK_BACKEND.isTipekamarCorespond = true
        return next();
    }catch(error){
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const updateKamar = async (req, res, next) => {
    const data = {nama : req.body.nama}
    try {
        const result = await Kamar.update(data, {
            where : { id : req.params.kamar_id }
        })
        req.UKK_BACKEND.updateKamar = {data : result};
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

const deleteKamar = async (req, res, next) => {
    try {
        const result = await Kamar.destroy({
            where : {id : req.params.kamar_id}
        })
        req.UKK_BACKEND.deleteKamar = {data : result}
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req)
    }
}



module.exports = {
    createKamarOne,
    createKamarMany,
    getAllkamar,
    getKamar,
    getKamarByTipeKamarId,
    findSomeKamarByIdList,
    updateKamar,
    deleteKamar,
    createKamarBulk,
    checkIfTipeKamarIsCorrespond,
    getKamarFull,
    findKamarThatAvailableInCertainInterval,
    findKamarThatAvailableInCertainIntervalByTipeKamarId
}
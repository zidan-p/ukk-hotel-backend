const sequelize = require("./../database");
const { Op, Sequelize } = require("sequelize")
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
        else handleServerError(res,error)        
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
        else handleServerError(res,error)       
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
        else handleServerError(res,error)       
    }
}


const getAllkamar = async (req,res,next) => {
    try {
        const {count, rows} = await Kamar.findAndCountAll();
        req.UKK_BACKEND.getKamarList = {data : rows,count : count};
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
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
        else handleServerError(res,error) 
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
        else handleServerError(res,error) 
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
        else handleServerError(res,error) 
    }
}


const findKamarThatAvailableInCertainInterval = async (req,res,next) =>{
    console.log("ini body untuk find kamar that available")
    console.log(req.body)
    const intervalDate = req.body.intervalDate;
    // const start = new Date(intervalDate.start);
    // const end = new Date(intervalDate.end)
    const start = intervalDate.start;
    const end = intervalDate.end
    try {
        // -- waht deee heeellllll --
        // let {count,rows} = await Kamar.findAndCountAll({
        //     where : {
        //         [Op.not] : {[Op.or] : [
        //             {"DaftarDetailPemesanan.Pemesanan.tglCheckIn" : {[Op.gt] : end, [Op.gt] : start}},
        //             {"DaftarDetailPemesanan.Pemesanan.tglCheckOut" : {[Op.lt] : end, [Op.lt] : start}}
        //         ]}
                
        //     },
        //     include : {
        //         model : DetailPemesanan,
        //         as : "DaftarDetailPemesanan",
        //         include : {
        //             model : Pemesanan,
        //             // where : {
        //             //     // "tglCheckOut" : {[Op.lt] : new Date()}
        //             // }
        //             // where : {
        //             //     [Op.not] : {[Op.or] : [
        //             //         {"tglCheckIn" : {[Op.gt] : end, [Op.gt] : start}},
        //             //         {"tglCheckOut" : {[Op.lt] : end, [Op.lt] : start}}
        //             //     ]}
        //             // }
        //         }
        //     }
        // })

        // const result = await sequelize.query(`
        // SELECT kamar.id, kamar.nama
        // FROM Kamar
        // INNER JOIN kamar_pemesanan_junction ON kamar_pemesanan_junction.kamarId = kamar.id
        // INNER JOIN detail_pemesanan ON kamar_pemesanan_junction.DetailPemesananId = detail_pemesanan.id
        // INNER JOIN pemesanan ON pemesanan.id = detail_pemesanan.PemesananId
        // WHERE (pemesanan.tglCheckIn < "${end} AND pemesanan.tglCheckIn < ${start}" ) 
        //     OR (pemesanan.tglCheckOut > "${end} AND pemesanan.tglCheckOut ${start}")
        // `)
        // const result = await sequelize.query(`
        // SELECT *
        // FROM Kamar
        // LEFT OUTER JOIN kamar_pemesanan_junction ON kamar_pemesanan_junction.kamarId = kamar.id
        // LEFT JOIN detail_pemesanan ON kamar_pemesanan_junction.DetailPemesananId = detail_pemesanan.id
        
        // `)
        req.UKK_BACKEND.kamarList = {
            data : result
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
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
        else handleServerError(res,error) 
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
        else handleServerError(res,error) 
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
        else handleServerError(res,error) 
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
        else handleServerError(res,error)
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
    findKamarThatAvailableInCertainInterval
    
}
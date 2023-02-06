const sequelize = require("./../database");
const { Op } = require("sequelize")
const models = sequelize.models;
const Kamar = models.Kamar
const TipeKamar = models.TipeKamar

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
        req.UKK_BACKEND.createKamarOne = {data : result};
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
        req.UKK_BACKEND.createkamarMany = {
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
        req.UKK_BACKEND.createkamarBulk = {
            data : result,
            count : namaList.length
        }
        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error)       
    }
}


const getAllkamar = async (req,res,next) => {
    try {
        const {count, rows} = await Kamar.findAll();
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


const getKamar = async (req,res,next)=>{
    try {
        const result = await Kamar.findByPk(req.params.id,{
            include : TipeKamar
        });
        if(result === null) throw new Error("kamar tidak ditemukan");
        req.UKK_BACKEND.getKamar = {
            data : result 
        }
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}

const getKamarByTipeKamarId = async (req,res,next)=> {
    const tipeKamarId = req.params.tipeKamarId;
    try {
        const {rows,count} = await Kamar.findAll({
            where: {tipeKamarId : tipeKamarId}
        })
        req.UKK_BACKEND.getKamarByTipeKamarId = {
            data : rows,
            count : count
        };
        return next()
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}


const getSomeKamarByIdList = async (req,res,next) => {
    let idList = req.body.kamarIdList
    let opt = idList.map((id) => {return {id : id}});
    try{
        const {count, rows} = await Kamar.findAndCountAll({
            where: {
                [Op.or] : opt
            }
        })
        req.body.getSomeKamarByIdList = {
            data : rows,
            count : count 
        }
        return next();
    }catch(error){
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error) 
    }
}


const updateKamar = async (req, res, next) => {
    const data = {nama : req.body.nama}
    try {
        const result = Kamar.update(data, {
            where : req.params.id 
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
        const result = Kamar.destroy({
            where : {id : req.params.id}
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
    getSomeKamarByIdList,
    updateKamar,
    deleteKamar,
    createKamarBulk
}
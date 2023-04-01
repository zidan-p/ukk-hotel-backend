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

const getKamarFiltered = async (req,res,next) => {

    try {
        const page      = parseInt(req.query.page) || 1;
        const limit     = parseInt(req.query.limit) || 10;
    
        //untuk tipe kamar
        const tipeKamarId = +req.query.tipe_kamar_id || 0;
    
        //tanggal dibuat user (created at)
        const tglAwal   = req.query.tgl_awal || "0";
        const tglAkhir  = req.query.tgl_akhir || "0";
        const keyWord   = req.query.keyword || "";

        let result = await sequelize.query(`
            SELECT 
                kamar.*,
                tipe_kamar.namaTipeKamar,
                COUNT("detail_pemesanan.id") as jumlahPemesanan 
            FROM kamar
            JOIN tipe_kamar on tipe_kamar.id = kamar.TipeKamarId
            LEFT JOIN kamar_pemesanan_junction on kamar_pemesanan_junction.KamarId = kamar.id 
            LEFT JOIN detail_pemesanan on kamar_pemesanan_junction.DetailPemesananId = detail_pemesanan.id
            ${
            (
                (tglAwal !== "0")   || 
                (tglAkhir !== "0")  || 
                (tipeKamarId !== 0) ||  
                (keyWord !== "" )
            ) ? "WHERE" : ""
            }
                ${tglAwal !== "0" ? "createAt <  " + tglAwal : ""}
                ${tglAkhir !== "0" ? "createAt > " + tglAkhir : ""}
                ${tipeKamarId !== 0 ? "TipeKamarId = " + tipeKamarId : ""}
                ${keyWord !== "" ? `((namaTipeKamar LIKE %${keyWord}%) OR (deskripsi LIKE %${keyWord}%) )` : ""}
            GROUP BY kamar.id ORDER BY kamar.id ASC
        `,{type: sequelize.QueryTypes.SELECT});

        req.UKK_BACKEND.test = result;

        return next();
    } catch (error) {
        if(error.name === 'SequelizeValidationError') handleSequelizeError(res,error);
        else handleServerError(res,error,req) 
    }
}

/**
 * NOTE ::
 * 
 * ## 1 ##
 * pada controller diatas, rencananya hasil dari query melalui sequelize akan juga langsung menghasilkan 
 * jumlah pemesanan tiap-tiap kamar. tapi ternyata yang bisa saya dapat setelah berkeliling stackoverflow, saya
 * hanya bisa mendapat cara mendapatkan count dari relasi 1 : m. jarang ada relasi n:m yang ada pada pertanyaan seputar sequelize.
 * jadi untuk saat ini akan saya skip dahulu bagian ini.
 * 
 * untuk mengakalinya saya langusng menggunkana eager loading dalam setiap request. saya tidak terlalu memikirkan performanya 
 * karena setiap query dari sequelize pasti akan di limit.
 */


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
        // -- waht dhheee heeellllll --
        // saya tidak bisa menggunakan sequelize ataupun raw quueri untuk mendapatkan data yg sama mau
        let {count,rows} = await Kamar.findAndCountAll({
            attributes : ["id", "nama", "TipeKamarId"],
            include : {
                model : DetailPemesanan,
                attributes : ["id"],
                as : "DaftarDetailPemesanan",
                include : {
                    model : Pemesanan,
                    attributes : ["id", "tglCheckIn", "tglCheckOut"],
                    order: ["id","DESC"], // saya tidak tahu mengaoa tidak bisa melakuka norder dengan ini
                }
            }
        })

        //cek untuk req interval
        console.log("\x1b[33m","untuk req interval");
        console.log(reqInterval);

        console.log(JSON.parse(JSON.stringify(rows)))
        // console.log(rows.map(row => row.DaftarDetailPemesanan));

        // jadi saya membiarkan node js yang menangani
        const result = rows.map(kamar => {
            //bila kamar belum pernah ada transaksi
            if(kamar.DaftarDetailPemesanan.length === 0){
                return {id: kamar.id,TipeKamarId : kamar.TipeKamarId ,nama : kamar.nama, isAvailable : true}
            }

            // untuk test masing-masing pemesanan
            for(let i = 0; i < kamar.DaftarDetailPemesanan.length; i++){
                let pemesananTemp = kamar.DaftarDetailPemesanan[i];
                const kamarInterval = {
                    start : new Date(pemesananTemp.Pemesanan.tglCheckIn),
                    end  : new Date(pemesananTemp.Pemesanan.tglCheckOut)
                }
                // bila overlaping antara req denngan transaksi
                if(fsn.areIntervalsOverlapping(kamarInterval, reqInterval)) {
                    return {id: kamar.id,TipeKamarId : kamar.TipeKamarId ,nama : kamar.nama, isAvailable : false}
                }else{
                }
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
    console.log(req.body)
    let idList = req.body.kamarIdList ?? []
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
    findKamarThatAvailableInCertainIntervalByTipeKamarId,
    getKamarFiltered
}
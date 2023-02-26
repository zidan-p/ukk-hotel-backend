const {deleteFileIfExist,getFilePath} = require("./../feature/handleFile")

function parseSequelizeError1(err) {
    const errors = err.errors
    const errorList = errors.map(e => {
        let obj = {}
        obj[e] = e.message
        return obj;
    })

    return errorList.map(e => e.message)
}

function parseSequelizeError(err){
    const errors = err.errors
    const errorList = errors.map(e => {
        let obj = {}
        obj[e.path] = e.message
        return obj;
    })

    return errorList
}

function parseJoiError(error){
    return error.details.map(err =>{
        return {[err.path[0]] : err.message}
    })
}

function handleServerError(res,error,req){
    console.error(new Error(`maaf, kami tidak bisa menyimpan ${error.name}`));
    console.error(error);

    //hapus semua file yg di upload
    
    if(req?.file){
        deleteFileIfExist(getFilePath(req.file.filename))
    }else if (req.files){
        res.files.forEach(async fl => {
            await deleteFileIfExist(getFilePath(fl.filename))
        })
    }

    return res.status(500).json({
        success : false,
        error : error.message
    })
}

function handleSequelizeError(res,error){
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
        success: false,
        // error: parseSequelizeError(error)
        error: error
        })
    } 
}

function handleJoiError(res,error){
    return res.status(400).json({
        succes: false,
        error: parseJoiError(error)
    })
}



module.exports = {
    parseSequelizeError, 
    parseJoiError,
    handleServerError,
    handleSequelizeError,
    handleJoiError
}
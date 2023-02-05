

function parseSequelizeError(err) {
    const errors = err.errors
    const errorList = errors.map(e => {
        let obj = {}
        obj[e] = e.message
        return obj;
    })

    return errorList.map(e => e.message)
}


function parseJoiError(error){
    return error.details.map(err =>{
        return {[err.path[0]] : err.message}
    })
}

function handleServerError(res,error){
    console.error(new Error(`maaf, kami tidak bisa menyimpan ${err.name}`));
    console.error(err);
    return res.status(500).json({
        success : false,
        error : err.message
    })
}

function handleSequelizeError(res,error){
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
        success: false,
        error: parseSequelizeError(error)
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
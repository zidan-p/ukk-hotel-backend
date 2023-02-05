const {ValidationError} = require("joi")

//feature
const {handleJoiError, handleServerError} = require("./../feature/handleError");
const {deleteFileIfExist} = require("./../feature/handleFile");

const validation = (schema) => async (req, res, next) => {
    console.log("mencapai middleware validation");
    const body = req.body;
    console.log(body);
    try {
        await schema.validateAsync(body,{ abortEarly: false });
        return next();
    } catch (error) {
        console.error(error);
        
        //hapus semua file yg di upload
        if(req.file){
            deleteFileIfExist(req.file.filename)
        }else if (req.files){
            res.files.forEach(async fl => {
                await deleteFileIfExist(fl.filename)
            })
        }

        if(error instanceof ValidationError){
            handleJoiError(res,error)
        }else{
            handleServerError(res,error)
        }

    }
}

module.exports = {validation};
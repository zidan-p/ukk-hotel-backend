const {ValidationError} = require("joi")
const fs = require("fs/promises")
const path = require("path")

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
            await fs.unlink(path.resolve("storage", "images",req.file.filename))
        }else if (req.files){
            res.files.forEach(async fl => {
                await fs.unlink(path.resolve("storage", "images", fl.filename))
            })
        }

        if(error instanceof ValidationError){
            return res.status(400).json({
                succes: false,
                error: error.details.map(err =>{
                    return {[err.path[0]] : err.message}
                })
            })
        }else{
            return res.status(500).json({
                success: false,
                error: error
            })
        }

    }
}

module.exports = {validation};
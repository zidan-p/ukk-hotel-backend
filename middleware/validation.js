const {ValidationError} = require("joi")

const validation = (schema) => async (req, res, next) => {
    const body = req.body;
    try {
        await schema.validateAsync(body,{ abortEarly: false });
        next();
    } catch (error) {
        console.error(error);
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
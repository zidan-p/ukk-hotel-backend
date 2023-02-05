

const endHandler = async (req, res) => {
    try {
        return res.status(200).json({
            success : true,
            result : req.UKK_BACKEND
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "saya tidak tahu apa yg error"
        })
    }
}

const firstHandler = async ( req, res, next ) => {
    req.UKK_BACKEND = {}
    next();
}


module.exports = {firstHandler,endHandler}
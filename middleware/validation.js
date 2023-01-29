
const validation = (schema) => async (req, res, next) => {
    const body = req.body;
    console.log("mencoba validasi lewat validation");
    console.log(req.body);
    try {
        await schema.validateAsync(body,{ abortEarly: false });
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}

module.exports = {validation};
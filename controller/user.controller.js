const sequelize = require("./../database");

const handleSequelizeError = require("./../database/handleError");

const models = sequelize.models;
const User = models.User

const createUser = async (req,res) => {
    console.log(req.body);
    const data = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role : req.body.role
    }
    if(req.files.foto){
        data.foto = req.files.foto[0].filename
    }
    try{
        let result = await User.create(data);
        return res.status(200).json({
            success : true,
            data    : result
        });
    }catch (err) {
        console.error(err);
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
            success: false,
            error: handleSequelizeError(err)
        })
        } else {
            console.error(new Error(`maaf, kami tidak bisa menyimpan ${err.name}`));
            console.error(err);
            return res.status(500).json({
                success: false,
                error: `maaf, kami tidak bisa menyimpan ${err.name}`
            })
        }
    }
}

module.exports = {createUser}
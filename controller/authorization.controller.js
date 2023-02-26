const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const sequelize = require("../database");
const models = sequelize.models;
const User = models.User


const SECRET_KEY = "ukkbackend";
const SECRET_REFRESH_KEY = "harusrefresh"



const {handleServerError} = require("./../feature/handleError");




const login = async (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body);
    try {
        const user = await User.findOne({
            where : {username : username},
            attributes : {
                exclude: ["createdAt", "updatedAt"]
            }
        })

        console.log(user.toJSON())

        const match = bcrypt.compareSync(password, user.password)
        if(!match) return res.status(404).json({
            success : false,
            error : "Data tidak sesuai"
        })

        const userFiltered = {
            id: user.id,
            username: user.username,
            foto: user.foto,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(userFiltered,SECRET_KEY,{
            expiresIn : "10h"
        })

        req.UKK_BACKEND.login = {
            data: userFiltered,
            token: token
        }

        return next();

    } catch (error) {
        console.log(error);
        handleServerError(res,error,req);
    }
}

// authoriztion ini valid untuk semua role asal ada user.
const authRole_ = (roleList = []) => async(req,res,next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) return res.status(403).json({
            success : false,
            data: {message : "forbidden"}
        });
        console.log(decoded);
        if(roleList.includes(decoded.role)){
            return next();
        }
        if(err) return res.status(403).json({
            success : false,
            data: {message : "forbidden"}
        });
    })
}

const authRole = (roleList = []) => async (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) {
        return res.status(401).json({
            success : false,
            data: {message : "forbidden"}
        });
    }

    try {
        let decoded = await jwt.verify(token, SECRET_KEY)    
        if(!roleList.includes(decoded.role)) return res.status(403).json({
            success : false,
            data: {message : "forbidden"}
        });
        return next();
    } catch (error) {
        return next();
        // return res.status(400).json({
        //     success : false,
        //     data: {message : "forbidden"}
        // })
    }
}




module.exports = {login,authRole};
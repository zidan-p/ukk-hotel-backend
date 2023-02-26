

const Route = require("express").Router()
const path = require("path")
const {getFilePath} = require("./../feature/handleFile");

// TODOOOOO:
/*
ini seharusnya tidak boleh.
anatar folder untuk gamabr tipe kamar dan user tercampur.
tapi karena adanya keterbatasan waktu, maka saya gabungkan saja semuaya supaya mudah.
*/


Route.get(
    "/file/image/:image_name",
    (req,res,next)=>{
        const filePath = getFilePath(req.params.image_name);
        try {
            res.sendFile(filePath);
        } catch (error) {
            res.json({
                "success" : false,
                "message" : "errorrrr"
            })
        }
    }
)

module.exports = Route
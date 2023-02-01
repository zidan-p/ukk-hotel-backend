const multer  = require('multer');
const path = require("path");

const ALLOWED_FILE_TYPE_DEFAULT = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const MAX_SIZE_DEFAULT = 20 * 1024 * 1024; // 20mb

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname,"../","storage","images")) 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.originalname.split(".")[file.originalname.split(".").length - 1])
    }
});

const optionFilesFilter = (allowedFileType) => (req, file, cb) => {
    if (!file) return cb(null,true)
    if(allowedFileType.includes(file.mimetype)){
        cb(null, true);
    }else{
        // cb(new Error({name: "validationError", message : "tipe file tidak sesuai"}), false );
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname), false );
    }
}



function uploadFiles(
    arrFileName = [], 
    fileOption = {
        maxSize : MAX_SIZE_DEFAULT, 
        allowedFileType : ALLOWED_FILE_TYPE_DEFAULT, //mimetype : ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'], default img
    }
){
    const upload = multer({ 
            storage: storage, 
            fileFilter: optionFilesFilter(fileOption.allowedFileType),
            limits:{ fileSize: fileOption.maxSize }
        })
        .fields(arrFileName.map(
            arr => {
                return {name: arr, maxCount: 1}
            }
        ))
    
    return (req,res) => upload( req, res , (err) => {
        console.log(err);
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                error : err
            })
        }else if(err){ 
            console.log(err)
            return res.status(500).json({
                success: false,
                error: [
                    {"server" : "server bermasalah"}
                ]
            })
        }
    })
}


function uploadFile(
    fileName = "",
    fileOption = {
        maxSize : MAX_SIZE_DEFAULT, 
        allowedFileType : ALLOWED_FILE_TYPE_DEFAULT, //mimetype : ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'], default img
    }
){
    
    
    return ( req, res, next) => {
        const upload =  multer({
            storage: storage,
            fileFilter: optionFilesFilter(fileOption.allowedFileType),
            limits:{ fileSize: fileOption.maxSize }
        })
        .single(fileName)

        upload( req, res , (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    error : err
                })
            }else if(err){
                return res.status(500).json({
                    success: false,
                    error: [
                        {"server" : "server bermasalah"}
                    ]
                })
            }
            console.log("akhir upload");
            return next()
        })
        // return next();
    }
}

module.exports = {uploadFile, uploadFiles}



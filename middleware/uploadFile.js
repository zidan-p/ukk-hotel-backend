const multer  = require('multer');
const path = require("path");

const ALLOWED_FILE_TYPE = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const MAX_SIZE = 20 * 1024 * 1024; // 20mb

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname,"../","storage","images")) 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.originalname.split(".")[file.originalname.split(".").length - 1])
    }
});

const fileFilterImage = (req, file, cb) => {
    if(ALLOWED_FILE_TYPE.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(null, false);
    }
}
  



function uploadFile(arrFileName = [],){
    return multer({ storage: storage, fileFilter: fileFilterImage })
        .fields(arrFileName.map(arr => {return {name: arr, maxCount: 1}}))
}

set

module.exports = {uploadFile}



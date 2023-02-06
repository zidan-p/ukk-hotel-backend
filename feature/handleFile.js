const fs = require("fs");
const path = require("path");




async function deleteFileIfExist(filepath){
    // console.log(filepath);
    // try {
    //     // await fs.access(filepath)
    //     fs.unlink(filepath);
    // } catch (err) {
    // }

    if(fs.existsSync(filepath)){
        fs.unlink(filepath, (err) => {
            if(err) throw err
            console.log("file sudah dihapus")
        })
    }else{
        console.log("file tidak tersedia")
    }
}

function getFilePath(pathString){
    return path.resolve("storage", "images", pathString)
}

module.exports = {
    deleteFileIfExist,
    getFilePath
};
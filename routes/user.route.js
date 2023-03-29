

//data handler
const dataHandler = require("./../middleware/dataHandler")

//midleware
const {uploadFile} = require('./../middleware/uploadFile');
const {validation} = require("./../middleware/validation");

//validation
const validationSchema = require("./../validation/userValidation");

//import controller
const userController = require("./../controller/user.controller");
const authController = require("./../controller/authorization.controller");

const multer = require('multer');
const upload = multer();

//Router
const Route = require("express").Router();


// GET

Route.get(
    "/filter",
    authController.authRole(["admin","resepsionis"]),
    userController.getAllUserFiltered,
    dataHandler.endHandler
)

Route.get(
    "/role/admin",
    authController.authRole(["admin","resepsionis"]),
    userController.getAllAdmin,
    dataHandler.endHandler
);

Route.get(
    "/role/resepsionis",
    authController.authRole(["admin","resepsionis"]),
    userController.getAllResepsionis,
    dataHandler.endHandler
);

Route.get(
    "/username/:username",
    authController.authRole(["admin","resepsionis"]),
    userController.getUserByUsername,
    dataHandler.endHandler
);

Route.get(
    "/:user_id",
    authController.authRole(["admin","resepsionis"]),
    userController.getUser,
    dataHandler.endHandler
);

Route.get(
    "/", 
    authController.authRole(["admin","resepsionis"]),
    userController.getAllUser,
    dataHandler.endHandler
);


// Route.get(
//     "/",
//     (req,res) => {
//         return res.json()
//     }
// )



// POST
Route.post(
    "/",
    authController.authRole(["admin","resepsionis"]),                                
    uploadFile("foto"),                             //upload file
    (req,res,next) => {
        console.log(req.body);
        next();
    },
    validation(validationSchema.createUserSchema),  //validate
    userController.createUser,                      //add to database                  
    dataHandler.endHandler     
);

// PUT
Route.put(
    "/:user_id",
    (req,res,next)=>{
        console.log(req.params.user_id)
        return next();
    },
    authController.authRole(["admin","resepsionis"]), 
    uploadFile("foto"),
    validation(validationSchema.updateUserSchema),
    userController.getUser,
    userController.updateUser,
    dataHandler.endHandler
);

// DElETE
Route.delete(
    "/:user_id",
    authController.authRole(["admin","resepsionis"]),
    userController.getUser,
    userController.deleteUser,
    dataHandler.endHandler
)





module.exports = Route;




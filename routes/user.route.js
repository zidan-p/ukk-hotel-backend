
//midleware
const {uploadFile} = require('./../middleware/uploadFile');
const {validation} = require("./../middleware/validation");

//validation
const validationSchema = require("./../validation/userValidation");

//import controller
const userController = require("./../controller/user.controller");
const multer = require('multer');

const upload = multer();

//Router
const Route = require("express").Router();

// GET
Route.get(
    "/role/admin",
    userController.getAllAdmin,
);

Route.get(
    "/role/resepsionis",
    userController.getAllResepsionis,
);

Route.get(
    "/username/:username",
    userController.getUserByUsername,
);

Route.get(
    "/:user_id",
    userController.getUser,
);

Route.get(
    "/", 
    userController.getAllUser,
);



// POST
Route.post(
    "/",                                
    uploadFile("foto"),                             //upload file
    validation(validationSchema.createUserSchema),  //validate
    userController.createUser,                      //add to database                       
);

// PUT
Route.put(
    "/:id", 
    uploadFile("foto"), 
    validation(validationSchema.updateUserSchema),
    userController.getUser,
    userController.updateUser,
);

// DElETE
Route.delete(
    "/:id",
    userController.getUser,
    userController.deleteUser,
)





module.exports = Route;



